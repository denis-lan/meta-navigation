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
from sklearn.preprocessing import MinMaxScaler
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Ridge
from sklearn.linear_model import LogisticRegression

def main():
    modelnums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    
    for modelnum in modelnums:
        cluster_errors = []
        value_to_decode = []
        actual_vals = []
        decoded_vals = []
        cluster_nums = []
        model_nums = []
        print(modelnum)
        #read 10 models v4/modelX_bothdata.hdf
        df = pd.read_hdf(f'10 models v4/actionconditions/model{modelnum}_data.hdf')

        #read 10 models v4/modelX_neuron_clusters.csv
        neuron_clusters = pd.read_csv(f'10 models v4/model{modelnum}_neuron_clusters.csv')

        #linear decoding
        cols_to_decode = ['oldx', 'oldy', 'goalx', 'goaly']
        for item in cols_to_decode:
            actor_cell_states = np.asarray([df['actor_hidden'][x] for x in range(len(df['actor_hidden']))])
            print('decoding: ' + item)
            for cluster in range(3):
                print('cluster: ' + str(cluster))
                acts = actor_cell_states[:, neuron_clusters[neuron_clusters['cluster'] == cluster]['neuron']]

                var = df[item].values
                var = np.asarray([int(x) for x in var])
                scaler = StandardScaler()
                acts = scaler.fit_transform(acts)

                y = var
                X = acts

                X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
                #fit ridge reg
                reg = Ridge(alpha = 0.5).fit(X_train, y_train)

                # get r value between predicted and actual
                y_pred = reg.predict(X_test)
                
                r = np.corrcoef(y_test, y_pred)[0, 1]
                
                errors = np.abs(y_test - y_pred)

                cluster_errors.extend(errors)
                
                actual_vals.extend(y_test)
                decoded_vals.extend(y_pred)
                value_to_decode.extend([item]*len(y_test))
                cluster_nums.extend([cluster]*len(y_test))
                model_nums.extend([modelnum]*len(y_test))

        #clear df
        df = None
        neuron_clusters = None
        df_lineardecoding = pd.DataFrame({'actual': actual_vals, 'decoded': decoded_vals, 'error': cluster_errors, 'value': value_to_decode, 'cluster': cluster_nums, 'model': model_nums})
        print(df_lineardecoding.head())

    
        #save
        savepath = '10 models v4/lineardecoding_model' + str(modelnum) + '.hdf'
        df_lineardecoding.to_hdf(savepath, key='df', mode='w')  
    


        
if __name__ == '__main__':
    main()