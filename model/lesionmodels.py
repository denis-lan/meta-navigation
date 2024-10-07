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
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.preprocessing import MinMaxScaler

def main():
    modelnums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    for modelnum in modelnums:
        #read 10 models v4/modelX_neuron_clusters.csv
        neuron_clusters = pd.read_csv('10 models v4/model' + str(modelnum) + '_neuron_clusters.csv')


        #1 , 2, 4, 8 each for 1000 trials
        num_landmarks_trials = [2, 4, 8, 16] * 250
        num_trials = len(num_landmarks_trials)
        action_conditions = np.repeat([1, 2], num_trials/2)
        # num_landmarks_trials = [1, 2, 4] *100
        width = 8
        path_length = 4
        avoid_edges = True
        print(width, path_length, avoid_edges)
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
        cluster_deactivated_all = []
        for cluster_no in range(4):

            if cluster_no != 3:
                neurons_to_deactivate = neuron_clusters['cluster'] == cluster_no
            else:
                neurons_to_deactivate = np.zeros(100, dtype = bool)
            # else:
            #     # randomly deactivate half of the neurons
            #     randselect = np.random.choice(100, 10, replace = False)
            #     neurons_to_deactivate = np.zeros(100, dtype = bool)
            #     neurons_to_deactivate[randselect] = True
            neurons_to_deactivate = np.array(neurons_to_deactivate)
            model_path = "10 models v4/model " + str(modelnum) + ".zip"
            env = ObjectMazeSB(width = 8, path_length = 4, num_landmarks = [2, 4, 8, 16], avoid_edges = True, observation_len = 48)
            norm_env = SubprocVecEnv([lambda: env])
            norm_env = VecNormalize.load('10 models v4/model ' + str(modelnum) + ' vecenv', norm_env)
            # model = RecurrentMaskablePPO.load("10042023_005045_ppo_recurrent/backup/ppo_recurrent_4000000_steps", env)
            model = RecurrentMaskablePPO.load(model_path, env)
            for i, deactivate in enumerate(neurons_to_deactivate):
                if deactivate:
                    # state_dict['lstm.weight_ih'][i*4:i*4+4, :] = 0
                    # state_dict['lstm.weight_hh'][i*4:i*4+4, :] = 0
                    # state_dict['lstm.bias_ih'][i*4:i*4+4] = 0
                    # state_dict['lstm.bias_hh'][i*4:i*4+4] = 0
                    # state_dict['out.weight'][:, i] = 0
                    with torch.no_grad():
                        model.policy.lstm_actor.weight_ih_l0[i*4:i*4+4, :] = 0
                        model.policy.lstm_actor.weight_hh_l0[i*4:i*4+4, :] = 0
                        model.policy.lstm_actor.bias_ih_l0[i*4:i*4+4] = 0
                        model.policy.lstm_actor.bias_hh_l0[i*4:i*4+4] = 0
                        model.policy.mlp_extractor.policy_net[0].weight[:, i] = 0
                        # model.policy.lstm_actor.weight[:, i] = 0
                        # model.policy.mlp_extractor.policy_net[2].weight[:, i] = 0
                        # model.policy.mlp_extractor.policy_net[2].bias[i] = 0
                        # model.policy.mlp_extractor.policy_net[2].weight[i, :] = 0
                        # model.policy.mlp_extractor.policy_net[2].bias[i] = 0
                        # model.policy.action_net.weight[:, i] = 0
                        
                        
                    print('deactivated neuron ' + str(i))

            
            for i in range(num_trials):
                num_landmarks = num_landmarks_trials[i]
                
                model.set_env(env)
                obs, info = env.reset(num_landmarks = num_landmarks, obstacles = 0, actioncondition = action_conditions[i])
                obs = norm_env.normalize_obs(obs)
                env = ObjectMazeSB(width = 8, path_length = 4, num_landmarks = [num_landmarks], avoid_edges = True, observation_len = 48)
                model.set_env(env)
                obs, info = env.reset(num_landmarks = num_landmarks, actioncondition = action_conditions[i])
                obs = norm_env.normalize_obs(obs)
                # env.reset()
                
                print('trial: ' + str(i) + 'model: ' + str(modelnum))
                done = False
                landmarkencountered = False
                score = 0
                # env.actioncondition = 0
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
                cluster_deactivated = []
                state = info['state']
                x = info['x']
                y = info['y']
                landmarks = info['landmarks']
                print(num_landmarks)
                print(env.num_landmarks)
                print(env.num_landmarks_poss)
                print(landmarks)
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

                    obs2 = model.policy.obs_to_tensor(obs)[0]
                    lstm_states = (torch.tensor(lstm_states[0], dtype=torch.float32), torch.tensor(lstm_states[1], dtype=torch.float32))
                    prob_dis, _ = model.policy.get_distribution(obs2, lstm_states, torch.tensor(episode_start), action_masks)
                    probs = prob_dis.distribution.probs.detach().numpy()[0]

                    action, lstm_states = model.predict(obs, state=lstm_states, episode_start=episode_start, deterministic=True, action_masks = action_masks)
                    
                    #lesion lstm_states by replacing the deactivated neurons with the mean value
                    # lstm_states = (lstm_states[0].detach().numpy(), lstm_states[1].detach().numpy())
                    # lstm_states = (lstm_states[0] * (1 - neurons_to_deactivate) + mean_lstm_cell_states * neurons_to_deactivate, lstm_states[1] * (1 - neurons_to_deactivate) + mean_lstm_hidden_states * neurons_to_deactivate)
                    lstm_states = (torch.tensor(lstm_states[0], dtype=torch.float32), torch.tensor(lstm_states[1], dtype=torch.float32))
                    
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
                    trialnos.append(i + num_trials * cluster_no)
                    actions.append(action)
                    landmarkencountereds.append(landmarkencountered)
                    num_landmarks_steps.append(num_landmarks)
                    actionconditions.append(env.actioncondition)
                    actor_hiddens.append(lstm_states[0].flatten())
                    critic_hiddens.append(lstm_states[1].flatten())
                    first_landmark_encountereds.append(first_landmark_encountered)
                    cluster_deactivated.append(cluster_no)
                    # observation = next_observation
                    # score += reward
                    
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
                cluster_deactivated_all.extend(cluster_deactivated)
                print(len(stepnos_all))
                print(len(actor_hiddens_all))
        df_ablated = pd.DataFrame({'oldx': oldxs_all, 'oldy': oldys_all, 'newx': xs_all, 'newy': ys_all, 'clusterdeactivated': cluster_deactivated_all, 'resptype': resptypes_all, 'desttype': desttypes_all, 'trialno': trialnos_all, 'goalx': goalxs_all, 'goaly': goalys_all, 'numlandmarks': num_landmarks_all, 'landmarkencountered': landmark_encountered_all, 'correct': correct_all, 'stepno': stepnos_all, 'first_landmark_encountered': first_landmark_encountered_all, 'actioncondition': actionconditions_all, 'action': actions_all, 'actor_hidden': actor_hiddens_all, 'critic_hidden': critic_hiddens_all, 'action1_prob': action1_probs_all, 'action2_prob': action2_probs_all, 'action3_prob': action3_probs_all, 'action4_prob': action4_probs_all, 'action5_prob': action5_probs_all, 'action6_prob': action6_probs_all, 'action7_prob': action7_probs_all, 'action8_prob': action8_probs_all})
        df_ablated['d_prob'] = np.sum(df_ablated[['action1_prob', 'action2_prob', 'action3_prob', 'action4_prob']], axis = 1)
        df_ablated['o_prob'] = np.sum(df_ablated[['action5_prob', 'action6_prob', 'action7_prob', 'action8_prob']], axis = 1)

        #save df_ablated
        df_ablated.to_hdf('10 models v4/df_ablated_model' + str(modelnum) + '.h5', key = 'df_ablated', mode = 'w')
if __name__ == '__main__':
    main()