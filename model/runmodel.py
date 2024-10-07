import numpy as np
# from stable_baselines3 import PPO
from sb3_contrib import RecurrentPPO, MaskablePPO
from ppo_mask_recurrent import RecurrentMaskablePPO, RecurrentMaskableActorCriticPolicy
from stable_baselines3.common.evaluation import evaluate_policy
from stable_baselines3.common.vec_env import SubprocVecEnv, VecNormalize
from objectmaze_forced import ObjectMaze
from objectmaze_sb_intcode_exposures import ObjectMaze as ObjectMazeSB
from datetime import datetime
from stable_baselines3.common.callbacks import CheckpointCallback, ProgressBarCallback, StopTrainingOnNoModelImprovement, EvalCallback, CallbackList
from sb3_contrib.common.wrappers import ActionMasker
import gymnasium as gym
from stable_baselines3.common.monitor import Monitor
from stable_baselines3.common.env_checker import check_env
from typing import Callable

#set seeds
import random
import torch

seeds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
for seed in seeds:
  torch.manual_seed(seed)
  torch.cuda.manual_seed(seed)
  np.random.seed(seed)
  random.seed(seed)

  # env = ObjectMaze(width = 8, path_length = 4, num_landmarks = 2, num_obstacles = 0, avoid_edges = True)
  # observation, state, _, _ = env.reset()
  # lenobs = len(observation) - 7
  # lenobs = 612
  lenobs = 48
  # lenobs = 432
  env = ObjectMazeSB(width = 8, path_length = 4, num_landmarks = [2, 4, 8, 16], avoid_edges = True, observation_len = lenobs, seed=seed)
  check_env(env)
  date_time = datetime.now().strftime("%m%d%Y_%H%M%S")
  path = "./" + str(date_time) + "_ppo_recurrent_seed_" + str(seed)
  checkpoint_callback = CheckpointCallback(
    save_freq=640,
    # save_path="./" + str(date_time) + "_ppo_recurrent/backup/",
    save_path=path + "/backup/",
    name_prefix="ppo_recurrent",
    save_vecnormalize=True,
  )

  eval_callback = EvalCallback(env, best_model_save_path='./' + str(date_time) + '_ppo_recurrent/best', log_path='./' + str(date_time) + '_ppo_recurrent', eval_freq=10000, deterministic=True, render=False)
  # progress_callback = ProgressBarCallback()
  callback_list = CallbackList([checkpoint_callback])

  def mask_fn(env: gym.Env) -> np.ndarray:
      # Do whatever you'd like in this function to return the action mask
      # for the current env. In this example, we assume the env has a
      # helpful method we can rely on.
      return env.valid_action_mask()
    
  def make_env(seed):
    def _init():
      env = ObjectMazeSB(width = 8, path_length = 4, num_landmarks = [2, 4, 8, 16],  avoid_edges = True, observation_len = lenobs, seed = seed)
      masker = ActionMasker(env, mask_fn)  
      monitor = Monitor(masker, filename=None, allow_early_resets=True) 
      return monitor
    
    return _init


  def linear_schedule(initial_value: float) -> Callable[[float], float]:
      """
      Linear learning rate schedule.

      :param initial_value: Initial learning rate.
      :return: schedule that computes
        current learning rate depending on remaining progress
      """
      def func(progress_remaining: float) -> float:
          """
          Progress will decrease from 1 (beginning) to 0.

          :param progress_remaining:
          :return: current learning rate
          """
          return progress_remaining * initial_value

      return func

  #check if cuda is available
  print(torch.cuda.is_available())
  env = ActionMasker(env, mask_fn)
  #find out number of cpu
  import multiprocessing
  num_cpu = multiprocessing.cpu_count()
  print(num_cpu)
  num_processes = 128
  vec_env = SubprocVecEnv([make_env(i+seed) for i in range(num_processes)], start_method='fork')
  vec_env = VecNormalize(vec_env, norm_obs=True, norm_reward=True)

  # dummymodel = RecurrentMaskablePPO('MlpLstmPolicy', vec_env, verbose=1, tensorboard_log="./" + str(date_time) + "_ppo_recurrent/tensorboard/", ent_coef = 0.01, device = 'cuda', batch_size = 64)
  # action_space = dummymodel.policy.action_space
  # observation_space = dummymodel.policy.observation_space
  # lr_schedule = dummymodel.lr_schedule
  # policy = RecurrentMaskableActorCriticPolicy(lstm_hidden_size = 100, shared_lstm = False, observation_space = observation_space, action_space = action_space, lr_schedule = lr_schedule)
  # batch_size = 
  batch_size = 4096 * 2
  model = RecurrentMaskablePPO('MlpLstmPolicy', vec_env, verbose=1, tensorboard_log= path + "/tensorboard/", ent_coef = 0.01, device = 'cpu', batch_size = batch_size, n_steps = batch_size//num_processes)
  model.learn(total_timesteps=batch_size * 8000, callback=callback_list)

  vec_env = model.get_env()
  # mean_reward, std_reward = evaluate_policy(model, env, n_eval_episodes=20, warn=False)
  # print(mean_reward)

  model.save(path + "/ppo_recurrent")
  vec_env.save(path + "/vec_env")

  #close all files
  env.close()
  vec_env.close()

# del model # remove to demonstrate saving and loading

# model = RecurrentPPO.load("ppo_recurrent")

# obs = vec_env.reset()
# # cell and hidden state of the LSTM
# lstm_states = None
# num_envs = 1
# # Episode start signals are used to reset the lstm states
# episode_starts = np.ones((num_envs,), dtype=bool)
# while True:
#     action, lstm_states = model.predict(obs, state=lstm_states, episode_start=episode_starts, deterministic=True)
#     obs, rewards, dones, info = vec_env.step(action)
#     episode_starts = dones
#     vec_env.render("human")