import numpy as np
import math
import torch
from torch import nn
from torch.distributions import Categorical
from collections import deque
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import pickle
import numpy as np
from stable_baselines3 import PPO
from sb3_contrib import RecurrentPPO
from stable_baselines3.common.evaluation import evaluate_policy
# from objectmaze_forced import ObjectMaze
# from objectmaze_sb_intcode_exposures import ObjectMaze as ObjectMazeSB
from objectmaze_sb_intcode_exposures import ObjectMaze as ObjectMazeSB
from ppo_mask_recurrent import RecurrentMaskablePPO
from sb3_contrib.common.wrappers import ActionMasker
import gymnasium as gym
from stable_baselines3.common.policies import obs_as_tensor
from stable_baselines3.common.vec_env import SubprocVecEnv, VecNormalize
plt.rcParams["font.family"] = "Arial"
plt.rcParams["font.size"] = 40
plt.rcParams["figure.figsize"]  = (20, 25)
from gridfunctions import *

def main():
    def one_hot(x,n):
        return np.eye(n)[x]
        print('hi')

    def mask_fn(env: gym.Env) -> np.ndarray:
        # Do whatever you'd like in this function to return the action mask
        # for the current env. In this example, we assume the env has a
        # helpful method we can rely on.
        return env.valid_action_mask()
    one_hot(1, 3)

    def hook(module, input, output):
        global activations
        activations = output


    model_nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    for model_num in model_nums:
        model_path = "10 models v4/model " + str(model_num) + ".zip"
        env = ObjectMazeSB(width = 8, path_length = 4, num_landmarks = [2, 4, 8, 16], avoid_edges = True, observation_len = 48)
        norm_env = SubprocVecEnv([lambda: env])
        norm_env = VecNormalize.load('10 models v4/model ' + str(model_num) + ' vecenv', norm_env)
        # num_trials = 300
        #1 , 2, 4, 8 each for 1000 trials
        num_landmarks_trials = [2, 4, 8, 16] * 500
        action_conditions = np.repeat([0, 0, 0, 0], len(num_landmarks_trials)/4)
        obstacles_trials = np.repeat([0, 1], len(num_landmarks_trials))
        num_landmarks_trials = num_landmarks_trials * 2
        action_conditions = list(action_conditions) * 2
        
        # obstacles_trials = np.repeat([0], len(num_landmarks_trials))
        # num_landmarks_trials = [1, 2, 4] *100
        num_trials = len(num_landmarks_trials)
        width = 8
        path_length = 4
        avoid_edges = True
        # print(width, path_length, avoid_edges)
        num_steps = []
        oldxs_all = []
        oldys_all = []
        xs_all = []
        ys_all = []
        goalxs_all = []
        goalys_all = []
        resptypes_all = []
        desttypes_all = []
        trialnos_all = []
        num_landmarks_all = []
        landmark_encountered_all = []
        actor_hiddens_all = []
        critic_hiddens_all = []
        correct_all = []
        actionconditions_all = []
        actions_all = []
        stepnos_all = []
        first_landmark_encountered_all = []
        action1_probs_all = []
        action2_probs_all = []
        action3_probs_all = []
        action4_probs_all = []
        action5_probs_all = []
        action6_probs_all = []
        action7_probs_all = []
        action8_probs_all = []
        policy_net_activations_all = []
        euclidean_distances_all = []
        geodesic_distances_all = [] 
        obstacles_steps_all = []
        landmarkxs_all = []
        landmarkys_all = []
        obstaclexs_all = []
        obstacleys_all = []
        adj_state_0_all = []
        adj_state_1_all = []
        adj_state_2_all = []
        adj_state_3_all = []
        current_state_all = []
        goal_state_all = []

        for i in range(num_trials):
            num_landmarks = num_landmarks_trials[i]
            obstacles = obstacles_trials[i]
            action_condition = action_conditions[i]
            
            env = ObjectMazeSB(width = 8, path_length = 4, num_landmarks = [num_landmarks], avoid_edges = True, observation_len = 48, seed = None)
            
            model = RecurrentMaskablePPO.load(model_path, env)
            model.set_env(env)
            obs, info = env.reset(num_landmarks = num_landmarks, obstacles = obstacles, actioncondition = action_condition, seed = None)
            print(env.landmarkactualxs)
            print(env.landmarkactualys)
            print(env.goalx)
            print(env.goaly)
            obs = norm_env.normalize_obs(obs)
            # obs,info = env.reset()
            # env.reset()
            
            print('trial: ' + str(i) + 'of model ' + str(model_num))
            done = False
            landmarkencountered = False
            score = 0
            # print(observation.shape)
            states = []
            resptypes = []
            stepnos = []
            
            desttypes = []
            trialnos = []
            landmarkencountereds = []
            actionconditions = []
            actions = []
            action1_probs = []
            action2_probs = []
            action3_probs = []
            action4_probs = []
            action5_probs = []
            action6_probs = []
            action7_probs = []
            action8_probs = []
            obstacles_steps = []
            adj_state_0 = []
            adj_state_1 = []
            adj_state_2 = []
            adj_state_3 = []
            current_state = []
            goal_state = []
            state = info['state']
            x = info['x']
            y = info['y']
            landmarks = info['landmarks']
            # print(num_landmarks)
            # print(env.num_landmarks)
            # print(env.num_landmarks_poss)
            # print(landmarks)
            goal = info['goalstate']
            goalx = info['goalx']
            goaly = info['goaly']
            oldxs = [x]
            oldys = [y]
            xs = []
            ys = []
            goalxs = []
            goalys = []
            corrects = []
            num_landmarks_steps = []
            actor_hiddens = []
            critic_hiddens = []
            first_landmark_encountereds = []
            policy_net_activations = []
            euclidean_distances = []
            geodesic_distances = []
            landmarkxs = []
            landmarkys = []
            obstaclexs = []
            obstacleys = []
            states.append(state)
            num_clicks = 4

            
            
            stepcount = 0
            lstm_states = (np.zeros(model.policy.lstm_hidden_state_shape), np.zeros(model.policy.lstm_hidden_state_shape))
            lstm_states = (torch.tensor(lstm_states[0], dtype=torch.float32), torch.tensor(lstm_states[1], dtype=torch.float32))
            truncated = False
            episode_start = 1
            while not done and not truncated:
                first_landmark_encountered = False
                if state in landmarks:
                    if landmarkencountered == False:
                        first_landmark_encountered = True
                    landmarkencountered = True
                # valid_actions = vec_env.check_valid_actions(state)
                correct_actions = env.check_correct_actions(state)
                action_masks = env.valid_action_mask()
                action_mask_all_valid = np.ones(8)
                obs2 = model.policy.obs_to_tensor(obs)[0]
                lstm_states = (torch.tensor(lstm_states[0], dtype=torch.float32), torch.tensor(lstm_states[1], dtype=torch.float32))
                prob_dis, _ = model.policy.get_distribution(obs2, lstm_states, torch.tensor(episode_start), action_mask_all_valid)
                probs = prob_dis.distribution.probs.detach().numpy()[0]

                handle = model.policy.mlp_extractor.policy_net[3].register_forward_hook(hook)
                action, lstm_states = model.predict(obs, state=lstm_states, episode_start=episode_start, deterministic=True, action_masks = action_masks)
                handle.remove()
                
                # print(probs)
                action1_probs.append(probs[0])
                action2_probs.append(probs[1])
                action3_probs.append(probs[2])
                action4_probs.append(probs[3])
                action5_probs.append(probs[4])
                action6_probs.append(probs[5])
                action7_probs.append(probs[6])
                action8_probs.append(probs[7])
                episode_start = 0
                # print(action)
                if action < 4:
                    resptypes.append('d')
                else:
                    resptypes.append('o')
                oldx = x
                oldy = y
                obs, reward, done, truncated, info = env.step(action)
                obs = norm_env.normalize_obs(obs)
                state = info['state']
                states.append(state)

                if state == goal:
                    desttypes.append('g')
                elif state in landmarks:
                    desttypes.append('l')
                else:
                    desttypes.append('n')
                x = info['x']
                y = info['y']
                xs.append(x)
                ys.append(y)
                stepnos.append(stepcount)
                # print(stepcount)
                stepcount += 1
                if stepcount > 200:
                    done = True
                    print('timed out')
                    
                if not done:
                    oldxs.append(x)
                    oldys.append(y)
                goalxs.append(goalx)
                goalys.append(goaly)
                corrects.append(correct_actions[action])
                trialnos.append(i)
                actions.append(action)
                landmarkencountereds.append(landmarkencountered)
                num_landmarks_steps.append(num_landmarks)
                actionconditions.append(env.actioncondition)
                actor_hiddens.append(lstm_states[0].flatten())
                critic_hiddens.append(lstm_states[1].flatten())
                first_landmark_encountereds.append(first_landmark_encountered)
                policy_net_activations.append(activations.flatten())
                euclidean_distances.append(np.sqrt((oldx - goalx)**2 + (oldy - goaly)**2))
                if env.obstaclexs[0] == -1:
                    geodesic_distances.append(np.abs(oldx - goalx) + np.abs(oldy - goaly))
                else:
                    obsxs = [x + 1 for x in env.obstaclexs]
                    obsys = [x + 1 for x in env.obstacleys]
                    geodesic_distances.append(checkpathdist(oldx+1, oldy+1, goalx+1, goaly+1, obsxs, obsys))
                # observation = next_observation
                # score += reward
                obstacles_steps.append(env.obstacles)
                obstaclexs.append(env.obstaclexs)
                obstacleys.append(env.obstacleys)
                landmarkxs.append(env.landmarkactualxs)
                landmarkys.append(env.landmarkactualys)
                adj_state_0.append(env.object_action_states[0])
                adj_state_1.append(env.object_action_states[1])
                adj_state_2.append(env.object_action_states[2])
                adj_state_3.append(env.object_action_states[3])
                current_state.append(env.state)
                goal_state.append(env.goal)
                
            xs_all.extend(xs)
            ys_all.extend(ys)
            resptypes_all.extend(resptypes)
            desttypes_all.extend(desttypes)
            trialnos_all.extend(trialnos)
            goalxs_all.extend(goalxs)
            goalys_all.extend(goalys)
            oldxs_all.extend(oldxs)
            oldys_all.extend(oldys)
            num_landmarks_all.extend(num_landmarks_steps)
            landmark_encountered_all.extend(landmarkencountereds)
            correct_all.extend(corrects)
            num_steps.append(len(xs) - 1)
            actionconditions_all.extend(actionconditions)
            actions_all.extend(actions)
            stepnos_all.extend(stepnos)
            actor_hiddens_all.extend(actor_hiddens)
            critic_hiddens_all.extend(critic_hiddens)
            first_landmark_encountered_all.extend(first_landmark_encountereds)
            action1_probs_all.extend(action1_probs)
            action2_probs_all.extend(action2_probs)
            action3_probs_all.extend(action3_probs)
            action4_probs_all.extend(action4_probs)
            action5_probs_all.extend(action5_probs)
            action6_probs_all.extend(action6_probs)
            action7_probs_all.extend(action7_probs)
            action8_probs_all.extend(action8_probs)
            policy_net_activations_all.extend(policy_net_activations)
            euclidean_distances_all.extend(euclidean_distances)
            geodesic_distances_all.extend(geodesic_distances)
            obstacles_steps_all.extend(obstacles_steps)
            landmarkxs_all.extend(landmarkxs)
            landmarkys_all.extend(landmarkys)
            obstaclexs_all.extend(obstaclexs)
            obstacleys_all.extend(obstacleys)
            adj_state_0_all.extend(adj_state_0)
            adj_state_1_all.extend(adj_state_1)
            adj_state_2_all.extend(adj_state_2)
            adj_state_3_all.extend(adj_state_3)
            current_state_all.extend(current_state)
            goal_state_all.extend(goal_state)
            
            # print(len(stepnos_all))
            # print(len(actor_hiddens_all))
        # df = pd.DataFrame({'oldx': oldxs_all, 'oldy': oldys_all, 'newx': xs_all, 'newy': ys_all, 'resptype': resptypes_all, 'desttype': desttypes_all, 'trialno': trialnos_all, 'goalx': goalxs_all, 'goaly': goalys_all, 'numlandmarks': num_landmarks_all, 'landmarkencountered': landmark_encountered_all, 'correct': correct_all, 'stepno': stepnos_all, 'first_landmark_encountered': first_landmark_encountered_all, 'actioncondition': actionconditions_all, 'action': actions_all, 'actor_hidden': actor_hiddens_all, 'critic_hidden': critic_hiddens_all, 'action1_prob': action1_probs_all, 'action2_prob': action2_probs_all, 'action3_prob': action3_probs_all, 'action4_prob': action4_probs_all, 'action5_prob': action5_probs_all, 'action6_prob': action6_probs_all, 'action7_prob': action7_probs_all, 'action8_prob': action8_probs_all, 'geodesic_distance': geodesic_distances_all, 'euclidean_distance': euclidean_distances_all, 'policy_net_activations': policy_net_activations_all})
        dict = {'oldx': oldxs_all, 'oldy': oldys_all, 'newx': xs_all, 'newy': ys_all, 'resptype': resptypes_all, 'desttype': desttypes_all, 'trialno': trialnos_all, 'goalx': goalxs_all, 'goaly': goalys_all, 'numlandmarks': num_landmarks_all, 'landmarkencountered': landmark_encountered_all, 'correct': correct_all, 'stepno': stepnos_all, 'first_landmark_encountered': first_landmark_encountered_all, 'actioncondition': actionconditions_all, 'action': actions_all, 'actor_hidden': actor_hiddens_all, 'critic_hidden': critic_hiddens_all, 'action1_prob': action1_probs_all, 'action2_prob': action2_probs_all, 'action3_prob': action3_probs_all, 'action4_prob': action4_probs_all, 'action5_prob': action5_probs_all, 'action6_prob': action6_probs_all, 'action7_prob': action7_probs_all, 'action8_prob': action8_probs_all, 'geodesic_distance': geodesic_distances_all, 'euclidean_distance': euclidean_distances_all, 'policy_net_activations': policy_net_activations_all, 'obstacles': obstacles_steps_all, 'landmarkxs': landmarkxs_all, 'landmarkys': landmarkys_all, 'obstaclexs': obstaclexs_all, 'obstacleys': obstacleys_all, 'current_state': current_state_all, 'goal_state': goal_state_all, 'adj_state_0': adj_state_0_all, 'adj_state_1': adj_state_1_all, 'adj_state_2': adj_state_2_all, 'adj_state_3': adj_state_3_all}
        for key in dict:
            print(key)
            print(len(dict[key]))

        df = pd.DataFrame(dict)
        df['d_prob'] = np.sum(df[['action1_prob', 'action2_prob', 'action3_prob', 'action4_prob']], axis = 1)
        df['o_prob'] = np.sum(df[['action5_prob', 'action6_prob', 'action7_prob', 'action8_prob']], axis = 1)
        df['model'] = model_num
        
        df.to_hdf('10 models v4/model' + str(model_num) + '_data.hdf', key = 'df', mode = 'w')
    # #save half data first
    # df1 = df.iloc[:int(len(df)/2)]
    # df2 = df.iloc[int(len(df)/2):]
    # df1.to_hdf('10 models v3/super many trials v2_new model' + str(model_num) + '_data3.hdf', key = 'df', mode = 'w')
    # df2.to_hdf('10 models v3/super many trials v2_new model' + str(model_num) + '_data4.hdf', key = 'df', mode = 'w')

if __name__ == '__main__':
    main()