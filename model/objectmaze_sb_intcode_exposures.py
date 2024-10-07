
import numpy as np
import math
import torch
from torch import nn
from torch.distributions import Categorical
from collections import deque
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
from numba import njit, types
from numba.experimental import jitclass
from numba import int64, float64, boolean
import gymnasium as gym
# import gym
# from functions import one_hot



# def binary_encoding(x,n):
#     return np.binary_repr(x, width=n)

spec = [
    ('width', int64),
    ('path_length', float64),
    ('num_landmarks', int64),
    ('avoid_edges', boolean),
    ('maze', int64[:, :]),
    ('reward', float64),
    ('landmarks', int64[:]),
    ('landmarkxs', float64[:]),
    ('landmarkys', float64[:]),
    ('confidence', float64[:]),
    ('landmarkscurr', int64[:, :]),
    ('landmarkxscurr', int64[:]),
    ('landmarkyscurr', int64[:]),
    ('state', int64),
    ('goal',int64),
    ('done', boolean),
    ('object_actions', int64[:]),
    ('object_action_states', int64[:]),
    ('lastdirection', float64),
    ('lastxdisplacement', float64),
    ('lastydisplacement', float64),
    ('lastaction', int64),
    ('observations', float64[:]),
    ('stepno', float64),
    ('actioncondition', int64),
    ('object_valid', int64),
    ('arrow_valid', int64),
    ('valid_actions', boolean[:]),
    ('goalx', float64),
    ('goaly', float64),
    ('visitcounts', float64[:]),
    ('landmarkencountered', boolean),
    ('num_obstacles', int64),
    ('landmarkxs', float64[:]),
    ('landmarkys', float64[:]),
    ('obstaclexs', float64[:]),
    ('obstacleys', float64[:]),
    ('confidence', float64[:]),
    ('num_landmarks_poss', int64[:]),
    ('render_mode', types.string),
    ('action_space', gym.spaces.Discrete),
]

@njit(nogil=True, fastmath=True)
def one_hots(x,n):
    return np.eye(n)[x-1]

@njit(nogil=True, fastmath=True)
def int_code(x, n):
    #return integer coding instead
    return np.array([x])
    # return np.eye(n)[x-1]


@njit(nogil=True, fastmath=True)
def binary_encoding(x,n):
    length =  int(np.ceil(np.log2(n + 1)))
    result = np.zeros(length, dtype=np.int64)
    for i in range(length):
        result[i] = x % 2
        x //= 2
    return result[::-1]

# @jitclass(spec)
class ObjectMaze(gym.Env):
    
    def __init__(self, width, path_length, num_landmarks, avoid_edges = True, observation_len = 4, seed = 0, transition_cost = 0):
        self.width = width
        self.path_length = path_length
        self.avoid_edges = avoid_edges
        self.num_landmarks_poss = num_landmarks
        self.lastaction = 0
        self.lastxdisplacement = 0
        self.lastydisplacement = 0
        self.lastdirection = 0
        self.landmarkxs = np.zeros(self.width**2 + 1)
        self.landmarkys = np.zeros(self.width**2 + 1)
        self.object_valid = 0
        self.arrow_valid = 0
        self.render_mode = 'human'
        # print('set tranition_cost to ' + str(transition_cost))
        self.transition_cost = transition_cost
        self.action_space = gym.spaces.Discrete(8)
        self.observation_space = gym.spaces.Box(low=-50, high=100, shape=(observation_len,), dtype=np.float64)
        np.random.seed(seed)

    def valid_action_mask(self):
        self.check_valid_actions(self.state)
        return self.valid_actions    

    # @njit(nogil=True, fastmath=True)
    def generate_maze(self):
        arr = np.arange(self.width**2) + 1
        arr = np.random.permutation(arr)
        self.maze = np.reshape(arr, (self.width, self.width))
        self.maze = self.maze
        self.reward = 0
    
        return self.maze

    # @njit(nogil=True, fastmath=True)
    def generate_landmarks(self):
        #select random states for landmarks but not on the edge

        error_intercept = np.random.normal(1.9, 0.6)
        error_slope = np.random.normal(-0.63, 0.6)
        
        if self.avoid_edges:
            arr = self.maze[1:self.width-1, 1:self.width-1].flatten()
            arr = arr[arr != self.width**2 + 1]
        else:
            arr = self.maze.flatten()
            arr = arr[arr != self.width**2 + 1]
        
        # arr = self.maze.flatten()
        # arr = arr[arr != self.width**2 + 1]
        arr = np.random.permutation(arr)
        # print(arr)
        # print(self.num_landmarks)
        self.landmarks = arr[:self.num_landmarks]
        
        # numexposures = np.zeros(self.num_landmarks)
        # # distribute 16 exposures over the landmarks
        # for i in range(16):
        #     numexposures[i % self.num_landmarks] += 1

        # this is for an equal number of exposures (when num_landmarks = 2, 4, 8, 16)
        numexposures = 16/self.num_landmarks * np.ones(self.num_landmarks)

        # # this is for a random, unequal number of exposures
        # numexposures = np.ones(self.num_landmarks)
        # #distribute remaining exposures
        # for i in range(16 - self.num_landmarks):
        #     numexposures[np.random.randint(0, self.num_landmarks)] += 1
        

        landmarkxs = np.zeros(self.width**2 + 1)
        landmarkys = np.zeros(self.width**2 + 1)
        confidence = np.zeros(self.width**2 + 1)
        

        self.landmarkactualxs = np.zeros(self.num_landmarks)
        self.landmarkactualys = np.zeros(self.num_landmarks)

        for i in range(self.num_landmarks):
            x, y = self.get_coordinates(self.landmarks[i])
            noise = (error_intercept + error_slope * np.log(numexposures[i]))
            noise = max(noise, 0)
            landmarkxs[self.landmarks[i]] = x + np.random.normal(0, noise)
            landmarkys[self.landmarks[i]] = y + np.random.normal(0, noise)
            confidence[self.landmarks[i]] = noise
            self.landmarkactualxs[i] = x
            self.landmarkactualys[i] = y

        landmarkxs = np.concatenate((landmarkxs, np.asarray([0])))
        landmarkys = np.concatenate((landmarkys, np.asarray([0])))
        confidence = np.concatenate((confidence, np.asarray([0])))

        self.landmarkxs = landmarkxs
        self.landmarkys = landmarkys
        self.confidence = confidence
       
        return self.landmarks

    def generate_obstacles(self):

        # self.obstaclexs = np.zeros(num_obstacles)
        # self.obstacleys = np.zeros(num_obstacles)
        # for i in range(num_obstacles):
        #     x = np.random.randint(0, self.width)
        #     y = np.random.randint(0, self.width)
        #     while self.maze[x, y].item() in self.landmarks:
        #         x = np.random.randint(0, self.width)
        #         y = np.random.randint(0, self.width)
        #     self.maze[x, y] = self.width**2 + 1
        #     self.obstaclexs[i] = x
        #     self.obstacleys[i] = y

        # generate obstacles so there is at least one in each row and column
        if self.obstacles:
            self.obstaclexs = np.arange(self.width)
            self.obstacleys = np.arange(self.width)
            np.random.shuffle(self.obstaclexs)
            np.random.shuffle(self.obstacleys)

            for i in range(self.width):
                self.maze[self.obstaclexs[i], self.obstacleys[i]] = self.width**2 + 1
        else:
            self.obstaclexs = np.zeros(self.width) - 1
            self.obstacleys = np.zeros(self.width) - 1


        
    
    # @njit(nogil=True, fastmath=True)
    def generate_landmark_curriculum(self, numclicks):
        #randomly order landmarks and their coordinates
        orders = []
        for i in range(int(numclicks/self.num_landmarks)):
            order = np.random.permutation(self.num_landmarks)
            for j in range(self.num_landmarks):
                orders.append(order[j])
        self.landmarkscurr = np.zeros((len(orders) + 1, int(np.ceil(np.log2(self.width**2 + 2)))), dtype=np.int64)
        self.landmarkxscurr = np.zeros(len(orders) + 1, dtype=np.int64)
        self.landmarkyscurr = np.zeros(len(orders) + 1, dtype=np.int64)
        # print(orders)
        for i in range(len(orders)):
            # print(x)
            x = orders[i]
            self.landmarkscurr[i, :] = one_hots(int(self.landmarks[int(x)]), self.width**2+1)
            self.landmarkxscurr[i] = self.landmarkxs[int(x)]
            self.landmarkyscurr[i] = self.landmarkys[int(x)]

        self.landmarkscurr[len(orders), :] = one_hots(self.goal, self.width**2+1)
        self.landmarkxscurr[len(orders)] = self.landmarkxs[self.goal]
        self.landmarkyscurr[len(orders)] = self.landmarkys[self.goal]
        
        return self.landmarkscurr, self.landmarkxscurr, self.landmarkyscurr

    def randomise_goal(self):
        
        trycount = 0
        np.random.seed()
        # np.random.seed()
        #choose new state, but not on the edge

        if self.avoid_edges:
            goalx = np.random.randint(1, self.width-1)
            goaly = np.random.randint(1, self.width-1)
            goalstate = self.maze[goalx, goaly].item()
            while(goalstate in self.landmarks) or (goalstate == self.width**2 + 1):
                goalx = np.random.randint(1, self.width-1)
                goaly = np.random.randint(1, self.width-1)
                goalstate = self.maze[goalx, goaly].item()
                trycount += 1
                if trycount > 1000:
                    # print('failed to find goal')
                    goalx = 9999
                    goaly = 9999
                    break
        else:
            goalx = np.random.randint(0, self.width)
            goaly = np.random.randint(0, self.width)
            goalstate = self.maze[goalx, goaly].item()
            while(goalstate in self.landmarks):
                goalx = np.random.randint(0, self.width)
                goaly = np.random.randint(0, self.width)
                goalstate = self.maze[goalx, goaly].item()
                trycount += 1
                if trycount > 100:
                    # print('failed to find goal')
                    goalx = 9999
                    goaly = 9999
                    break

        path_lengths = self.calculate_path_length_matrix(goalx, goaly)
        self.path_lengths = path_lengths
        # print(self.maze)
        # print(path_lengths)
        np.random.seed()
        possible_states = np.where(path_lengths == self.path_length)
        # possible_states = np.where(path_lengths < 20)
        if possible_states is None:
            # print('failed to find start')
            return 9999, 9999, 9999, 9999
        shuffleind = np.arange(possible_states[0].shape[0])
        np.random.shuffle(shuffleind)
        possible_states = np.asarray([possible_states[0][shuffleind], possible_states[1][shuffleind]])
        x = 9999
        y = 9999
        # print(possible_states)
        for i in range(possible_states[0].shape[0]):
            if possible_states[0][i] < self.width - 1 and possible_states[0][i] > 0 and possible_states[1][i] < self.width - 1 and possible_states[1][i] > 0:
                if self.maze[possible_states[0][i], possible_states[1][i]].item() not in self.landmarks:
                    x = possible_states[0][i]
                    y = possible_states[1][i]
                    break
        # print(x, y)

        
        return x, y, goalx, goaly
    
    def calculate_path_length_matrix(self, goalx, goaly):
        path_lengths = np.ones((self.width, self.width)) * -1
        if self.obstacles:
            for i in range(len(self.obstaclexs)):
                path_lengths[self.obstaclexs[i], self.obstacleys[i]] = 9999 

        path_lengths[goalx, goaly] = 0
        for i in range(self.width):
            for x in range(self.width):
                for y in range(self.width):
                    if path_lengths[x, y] == i:
                        if x < self.width-1:
                            if path_lengths[x+1, y] == -1:
                                path_lengths[x+1, y] = path_lengths[x, y] + 1
                        if x > 0:
                            if path_lengths[x-1, y] == -1:
                                path_lengths[x-1, y] = path_lengths[x, y] + 1
                        if y < self.width-1:
                            if path_lengths[x, y+1] == -1:
                                path_lengths[x, y+1] = path_lengths[x, y] + 1
                        if y > 0:
                            if path_lengths[x, y-1] == -1:
                                path_lengths[x, y-1] = path_lengths[x, y] + 1  

        return path_lengths

            


        

    # @njit(nogil=True, fastmath=True)  
    def reset(self, seed = None, options = None, num_landmarks = None, obstacles = None, actioncondition = None):
        np.random.seed(seed)
        self.seed = seed
        if obstacles is not None:
            self.obstacles = obstacles
        else:
            self.obstacles = np.random.randint(0, 2)
        # self.obstacles = 0
        self.stepno = 0

        if actioncondition is not None:
            self.actioncondition = actioncondition
        else:
            self.actioncondition = np.random.randint(0, 4)

        # self.actioncondition = 0
        self.visitcounts = np.ones(self.width**2 + 1)
        self.landmarkencountered = 0
        self.num_landmarks = np.random.choice(self.num_landmarks_poss)
        # print(self.num_landmarks)
        # 0 means all actions allowed, 1 means only vector actions allowed, 2 means only object actions allowed, 3 means randomly choose between vector and object actions
        self.generate_maze()
        # print('maze generated')
        self.generate_obstacles()
        self.generate_landmarks()
        # print('landmarks generated')
        
        
        #choose goal state, path_lengths steps away from start state and not a landmark
        x, y, goalx, goaly = self.randomise_goal()
        while goalx == 9999 or x == 9999:
            self.generate_maze()
            self.generate_obstacles()
            self.generate_landmarks()
            x, y, goalx, goaly = self.randomise_goal()
        # print(self.state)
        self.state = self.maze[x, y].item()
        # print(self.state)
        self.goal = self.maze[goalx, goaly].item()
        goalx, goaly = self.get_coordinates(self.goal)
        self.goalx = goalx
        self.goaly = goaly
        goal_noise = np.random.normal(0.91, 0.44)
        goal_noise = max(goal_noise, 0)
        self.landmarkxs[self.goal] = goalx + np.random.normal(0, goal_noise)
        self.landmarkys[self.goal] = goaly + np.random.normal(0, goal_noise)
        #make self.landmarkxs and ys bounded between 0 and 1
        # self.landmarkxs = self.landmarkxs/(self.width+1)
        # self.landmarkys = self.landmarkys/(self.width+1)
        self.confidence[self.goal] = goal_noise
        #scale confidence between 0 and 1
        # self.confidence = self.confidence/np.max(self.confidence)
        self.lastdirection = 0
        self.lastxdisplacement = 0
        self.lastydisplacement = 0
        self.done = False
        self.reward = 0
        self.define_object_actions()
        self.check_valid_actions(self.state)
        

        states = np.asarray([self.state, self.goal, self.object_action_states[0], self.object_action_states[1], self.object_action_states[2], self.object_action_states[3]], dtype=np.float64)
        states = states/(self.width**2+1)

        walls = np.asarray([0 if x == self.width**2 + 1 else 1 for x in self.object_action_states], dtype = np.float64)
        # print(self.object_action_states)
        #observations: one-hot encoding of current state and goal state and adjacent states
        observations = np.concatenate((
            one_hots(self.actioncondition, 4),
            # np.asarray([self.num_landmarks]).astype(np.float64),
            np.asarray([self.object_valid, self.arrow_valid]).astype(np.float64),
            # one_hots(self.lastaction, 8),
            np.asarray([self.lastxdisplacement, self.lastydisplacement], dtype=np.float64),
            int_code(self.state, self.width**2+1),
            int_code(self.goal, self.width**2+1),
            int_code(self.object_action_states[0], self.width**2+1),
            int_code(self.object_action_states[1], self.width**2+1),
            int_code(self.object_action_states[2], self.width**2+1),
            int_code(self.object_action_states[3], self.width**2+1),
            self.obstaclexs,
            self.obstacleys,
            # states,
            np.asarray([self.landmarkxs[self.state], self.landmarkys[self.state]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.goal], self.landmarkys[self.goal]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[0]], self.landmarkys[self.object_action_states[0]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[1]], self.landmarkys[self.object_action_states[1]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[2]], self.landmarkys[self.object_action_states[2]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[3]], self.landmarkys[self.object_action_states[3]]], dtype=np.float64),
            np.asarray([self.confidence[self.state], self.confidence[self.goal], self.confidence[self.object_action_states[0]], self.confidence[self.object_action_states[1]], self.confidence[self.object_action_states[2]], self.confidence[self.object_action_states[3]]], dtype=np.float64),
            # np.asarray([self.stepno], dtype=np.float64)
            # one_hots(0, self.width**2+1),
        ))

        
        # observations = np.concatenate((np.asarray([self.lastxdisplacement, self.lastydisplacement]), one_hots(self.state, self.width**2+1), one_hots(self.goal, self.width**2+1), one_hots(self.object_action_states[0], self.width**2+1), one_hots(self.object_action_states[1], self.width**2+1), one_hots(self.object_action_states[2], self.width**2+1), one_hots(self.object_action_states[3], self.width**2+1), [self.landmarkxs[self.state], self.landmarkys[self.state], self.confidence[self.state], self.landmarkxs[self.goal], self.landmarkys[self.goal], self.confidence[self.goal], self.landmarkxs[self.object_action_states[0]], self.landmarkys[self.object_action_states[0]], self.confidence[self.object_action_states[0]], self.landmarkxs[self.object_action_states[1]], self.landmarkys[self.object_action_states[1]], self.confidence[self.object_action_states[1]], self.landmarkxs[self.object_action_states[2]], self.landmarkys[self.object_action_states[2]], self.confidence[self.object_action_states[2]], self.landmarkxs[self.object_action_states[3]], self.landmarkys[self.object_action_states[3]], self.confidence[self.object_action_states[3]]]))
        x, y = self.get_coordinates(self.state)
        goalx, goaly = self.get_coordinates(self.goal)

        return observations, {'state': self.state, 'x': x, 'y': y, 'goalstate': self.goal, 'goalx': goalx, 'goaly': goaly, 'landmarks': self.landmarks}
    
    def set_landmarks(self, explorexclicks, exploreyclicks, error_intercept, error_slope):
        self.landmarks = []
        # print(self.landmarks)

        landmarkxs = np.zeros(self.width**2 + 1)
        landmarkys = np.zeros(self.width**2 + 1)
        confidence = np.zeros(self.width**2 + 1)

        explorexs = [int(x) for x in explorexclicks]   
        exploreys = [int(x) for x in exploreyclicks]
        explorexys = [(explorexs[i], exploreys[i]) for i in range(len(explorexs))]
        explorexys = np.array(explorexys, dtype=[('x', int), ('y', int)])
        self.num_landmarks = len(np.unique(explorexys))

        self.landmarkactualxs = np.zeros(self.num_landmarks)
        self.landmarkactualys = np.zeros(self.num_landmarks)
        print('explorexs:' + str(explorexs))
        print('exploreys:' + str(exploreys))
        print('explorexys:' + str(explorexys))
        print(np.unique(explorexys))
        for i, (x,y) in enumerate(np.unique(explorexys)):
            state = self.maze[x-1, y-1].item()
            self.landmarks = np.append(self.landmarks, state)

            numexposures = np.sum(np.logical_and(explorexys['x'] == x, explorexys['y'] == y))
            print('numexposures:' + str(numexposures))
            noise = 1.25 * (error_intercept + error_slope * numexposures)
            # min 0.001
            noise = max(noise, 0.001)
            landmarkxs[state] = x + np.random.normal(0, noise) - 1
            landmarkys[state] = y + np.random.normal(0, noise) - 1
            confidence[state] = noise 
            self.landmarkactualxs[i] = x - 1
            self.landmarkactualys[i] = y - 1

        landmarkxs = np.concatenate((landmarkxs, np.asarray([0])))
        landmarkys = np.concatenate((landmarkys, np.asarray([0])))
        confidence = np.concatenate((confidence, np.asarray([0])))

        self.landmarkxs = landmarkxs
        self.landmarkys = landmarkys
        self.confidence = confidence

    def reset_with_maze(self, seed = None, obstaclexs = None, obstacleys = None, explorexclicks = None, exploreyclicks = None, actioncondition = None, startx = 0, starty = 1, goalx = 1, goaly = 0, error_slope = 0, error_intercept = 0, goal_mean_error = 0):
        np.random.seed(seed)
        if obstaclexs is not None:
            if len(obstaclexs) != 0:
                self.obstacles = True
            else:
                self.obstacles = False
                self.obstaclexs = np.zeros(self.width) - 1
            self.obstacleys = np.zeros(self.width) - 1
            self.obstaclexs = obstaclexs
            self.obstacleys = obstacleys
        else:
            self.obstacles = False
            self.obstaclexs = np.zeros(self.width) - 1
            self.obstacleys = np.zeros(self.width) - 1

        self.stepno = 0

        if actioncondition is not None:
            self.actioncondition = actioncondition
        else:
            self.actioncondition = np.random.randint(0, 4)

        self.visitcounts = np.ones(self.width**2 + 1)
        self.landmarkencountered = 0

        
    
        # print(self.num_landmarks)
        # 0 means all actions allowed, 1 means only vector actions allowed, 2 means only object actions allowed, 3 means randomly choose between vector and object actions
        self.generate_maze()
        
        
        if self.obstacles:
            for i in range(len(self.obstaclexs)):
                self.maze[self.obstaclexs[i], self.obstacleys[i]] = self.width**2 + 1
        

        self.set_landmarks(explorexclicks, exploreyclicks, error_intercept, error_slope)
        # print('landmarks generated')
        
    
        self.state = self.maze[startx, starty].item()
        # print(self.state)
        self.goal = self.maze[goalx, goaly].item()
        goalx, goaly = self.get_coordinates(self.goal)
        self.goalx = goalx
        self.goaly = goaly
        goalnoise = goal_mean_error
        self.landmarkxs[self.goal] = goalx + np.random.normal(0, goalnoise)
        self.landmarkys[self.goal] = goaly + np.random.normal(0, goalnoise)
        #make self.landmarkxs and ys bounded between 0 and 1
        # self.landmarkxs = self.landmarkxs/(self.width+1)
        # self.landmarkys = self.landmarkys/(self.width+1)
        self.confidence[self.goal] = goalnoise
        #scale confidence between 0 and 1
        # self.confidence = self.confidence/np.max(self.confidence)
        self.lastdirection = 0
        self.lastxdisplacement = 0
        self.lastydisplacement = 0
        self.done = False
        self.reward = 0
        self.define_object_actions()
        self.check_valid_actions(self.state)
        

        states = np.asarray([self.state, self.goal, self.object_action_states[0], self.object_action_states[1], self.object_action_states[2], self.object_action_states[3]], dtype=np.float64)
        states = states/(self.width**2+1)

        walls = np.asarray([0 if x == self.width**2 + 1 else 1 for x in self.object_action_states], dtype = np.float64)
        # print(self.object_action_states)
        #observations: one-hot encoding of current state and goal state and adjacent states
        observations = np.concatenate((
            one_hots(self.actioncondition, 4),
            # np.asarray([self.num_landmarks]).astype(np.float64),
            np.asarray([self.object_valid, self.arrow_valid]).astype(np.float64),
            # one_hots(self.lastaction, 8),
            np.asarray([self.lastxdisplacement, self.lastydisplacement], dtype=np.float64),
            int_code(self.state, self.width**2+1),
            int_code(self.goal, self.width**2+1),
            int_code(self.object_action_states[0], self.width**2+1),
            int_code(self.object_action_states[1], self.width**2+1),
            int_code(self.object_action_states[2], self.width**2+1),
            int_code(self.object_action_states[3], self.width**2+1),
            self.obstaclexs,
            self.obstacleys,
            # states,
            np.asarray([self.landmarkxs[self.state], self.landmarkys[self.state]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.goal], self.landmarkys[self.goal]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[0]], self.landmarkys[self.object_action_states[0]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[1]], self.landmarkys[self.object_action_states[1]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[2]], self.landmarkys[self.object_action_states[2]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[3]], self.landmarkys[self.object_action_states[3]]], dtype=np.float64),
            np.asarray([self.confidence[self.state], self.confidence[self.goal], self.confidence[self.object_action_states[0]], self.confidence[self.object_action_states[1]], self.confidence[self.object_action_states[2]], self.confidence[self.object_action_states[3]]], dtype=np.float64),
            # np.asarray([self.stepno], dtype=np.float64)
            # one_hots(0, self.width**2+1),
        ))

        
        # observations = np.concatenate((np.asarray([self.lastxdisplacement, self.lastydisplacement]), one_hots(self.state, self.width**2+1), one_hots(self.goal, self.width**2+1), one_hots(self.object_action_states[0], self.width**2+1), one_hots(self.object_action_states[1], self.width**2+1), one_hots(self.object_action_states[2], self.width**2+1), one_hots(self.object_action_states[3], self.width**2+1), [self.landmarkxs[self.state], self.landmarkys[self.state], self.confidence[self.state], self.landmarkxs[self.goal], self.landmarkys[self.goal], self.confidence[self.goal], self.landmarkxs[self.object_action_states[0]], self.landmarkys[self.object_action_states[0]], self.confidence[self.object_action_states[0]], self.landmarkxs[self.object_action_states[1]], self.landmarkys[self.object_action_states[1]], self.confidence[self.object_action_states[1]], self.landmarkxs[self.object_action_states[2]], self.landmarkys[self.object_action_states[2]], self.confidence[self.object_action_states[2]], self.landmarkxs[self.object_action_states[3]], self.landmarkys[self.object_action_states[3]], self.confidence[self.object_action_states[3]]]))
        x, y = self.get_coordinates(self.state)
        goalx, goaly = self.get_coordinates(self.goal)

        return observations, {'state': self.state, 'x': x, 'y': y, 'goalstate': self.goal, 'goalx': goalx, 'goaly': goaly, 'landmarks': self.landmarks}

    def reset_observations(self):
       walls = np.asarray([0 if x == self.width**2 + 1 else 1 for x in self.object_action_states], dtype = np.float64)
       states = np.asarray([self.state, self.goal, self.object_action_states[0], self.object_action_states[1], self.object_action_states[2], self.object_action_states[3]], dtype=np.float64)
       states = states/(self.width**2+1)
       observations = np.concatenate((
            one_hots(self.actioncondition, 4),
            # np.asarray([self.num_landmarks]).astype(np.float64),
            np.asarray([self.object_valid, self.arrow_valid]).astype(np.float64),
            # one_hots(self.lastaction, 8),
            np.asarray([self.lastxdisplacement, self.lastydisplacement], dtype=np.float64),
            int_code(self.state, self.width**2+1),
            int_code(self.goal, self.width**2+1),
            int_code(self.object_action_states[0], self.width**2+1),
            int_code(self.object_action_states[1], self.width**2+1),
            int_code(self.object_action_states[2], self.width**2+1),
            int_code(self.object_action_states[3], self.width**2+1),
            self.obstaclexs,
            self.obstacleys,
            # states,
            np.asarray([self.landmarkxs[self.state], self.landmarkys[self.state]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.goal], self.landmarkys[self.goal]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[0]], self.landmarkys[self.object_action_states[0]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[1]], self.landmarkys[self.object_action_states[1]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[2]], self.landmarkys[self.object_action_states[2]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[3]], self.landmarkys[self.object_action_states[3]]], dtype=np.float64),
            np.asarray([self.confidence[self.state], self.confidence[self.goal], self.confidence[self.object_action_states[0]], self.confidence[self.object_action_states[1]], self.confidence[self.object_action_states[2]], self.confidence[self.object_action_states[3]]], dtype=np.float64),
            # np.asarray([self.stepno], dtype=np.float64)
            # one_hots(0, self.width**2+1),
        ))
       return observations, self.state, self.goal, self.done

    # @njit(nogil=True, fastmath=True)
    def get_coordinates(self, state):
        # state = int(state)
        x, y = np.where(self.maze == state)

        return x.item(), y.item()

    # @njit(nogil=True, fastmath=True)
    def get_adjacent_states(self, state):
        # returns array with adjacent states, self.width**2 for walls
        #action = 1: right, 2: left, 3: down, 4: up
        x, y = self.get_coordinates(state)
        adjacent_states = np.array([self.width**2+1, self.width**2+1, self.width**2+1, self.width**2+1])
        if x < self.width-1:
            adjacent_states[0] = self.maze[x+1, y].item()
        if x > 0:
            adjacent_states[1] = self.maze[x-1, y].item()
        if y < self.width-1:
            adjacent_states[2] = self.maze[x, y+1].item()
        if y > 0:
            adjacent_states[3] = self.maze[x, y-1].item()

        return adjacent_states

    # @njit(nogil=True, fastmath=True)
    def define_object_actions(self):
        adjacent_states = self.get_adjacent_states(self.state)
        self.object_actions = np.random.permutation(4)
        self.object_action_states = adjacent_states[self.object_actions]

        return self.object_actions, self.object_action_states

    # @njit(nogil=True, fastmath=True)
    def check_valid_actions(self, state):
        # returns an array with TRUE for valid actions, FALSE for invalid actions
        #action = 1: right, 2: left, 3: down, 4: up
        x, y = self.get_coordinates(state)
        arrow_valid = np.asarray([x < self.width-1, x > 0, y < self.width-1, y > 0])
        if arrow_valid[0]:
            if self.maze[x+1, y].item() == self.width**2 + 1:
                arrow_valid[0] = False
        if arrow_valid[1]:
            if self.maze[x-1, y].item() == self.width**2 + 1:
                arrow_valid[1] = False
        if arrow_valid[2]:
            if self.maze[x, y+1].item() == self.width**2 + 1:
                arrow_valid[2] = False
        if arrow_valid[3]:
            if self.maze[x, y-1].item() == self.width**2 + 1:
                arrow_valid[3] = False
        
        object_valid = arrow_valid[self.object_actions]

        if self.actioncondition == 1:
            object_valid = np.asarray([False, False, False, False])
            self.object_valid = 0
            self.arrow_valid = 1
        elif self.actioncondition == 2:
            arrow_valid = np.asarray([False, False, False, False])
            self.object_valid = 1
            self.arrow_valid = 0
        elif self.actioncondition == 3:
            if self.obstacles:
                object_prop = 0.5
            else:
                object_prop = 0.25
            if np.random.rand() < object_prop:
                arrow_valid = np.asarray([False, False, False, False])
                self.object_valid = 1
                self.arrow_valid = 0
            else:
                object_valid = np.asarray([False, False, False, False])
                self.object_valid = 0
                self.arrow_valid = 1
        self.valid_actions = np.concatenate((arrow_valid, object_valid))
        return self.valid_actions
    
    # def check_valid_actions_with_mask(self, state, logits):
    #     # returns an array with TRUE for valid actions, FALSE for invalid actions
    #     #action = 1: right, 2: left, 3: down, 4: up
    #     x, y = self.get_coordinates(state)
    #     arrow_valid = np.asarray([x < self.width-1, x > 0, y < self.width-1, y > 0])
    #     object_valid = arrow_valid[self.object_actions]

    #     if self.actioncondition == 1:
    #         object_valid = np.asarray([False, False, False, False])
    #         self.object_valid = 0
    #         self.arrow_valid = 1
    #     elif self.actioncondition == 2:
    #         arrow_valid = np.asarray([False, False, False, False])
    #         self.object_valid = 1
    #         self.arrow_valid = 0
    #     elif self.actioncondition == 3:
    #         if np.random.rand() < 0.25:
    #             arrow_valid = np.asarray([False, False, False, False])
    #             self.object_valid = 1
    #             self.arrow_valid = 0
    #         else:
    #             object_valid = np.asarray([False, False, False, False])
    #             self.object_valid = 0
    #             self.arrow_valid = 1
    #     elif self.actioncondition == 0:
    #         if np.mean(logits[0:4]) > np.mean(logits[4:8]):
    #             object_valid = np.asarray([False, False, False, False])
    #         else:
    #             arrow_valid = np.asarray([False, False, False, False])
    #     self.valid_actions = np.concatenate((arrow_valid, object_valid))
        
        # return self.valid_actions
        
    # @njit(nogil=True, fastmath=True)
    def check_correct_actions(self, state):
        # returns an array with TRUE for correct actions, FALSE for incorrect actions
        #action = 1: right, 2: left, 3: down, 4: up
        x, y = self.get_coordinates(state)
        goalx, goaly = self.get_coordinates(self.goal)

        arrow_correct = np.asarray([x < goalx, x > goalx, y < goaly, y > goaly])
        object_correct = arrow_correct[self.object_actions]

        return np.concatenate((arrow_correct, object_correct))

    # @njit(nogil=True, fastmath=True)   
    def step(self, action):
        # print(action)
        #action = 1: right, 2: left, 3: down, 4: up
        self.lastaction = action
        x, y = self.get_coordinates(self.state)

        if action < 4:
            vector_action = action
        else:
            vector_action = self.object_actions[action-4]

        currentx, currenty = x, y
        if self.valid_actions[action]:
            if vector_action == 0:
                x = np.minimum(x+1, self.width-1)
            elif vector_action == 1:
                x = np.maximum(x-1, 0)
            elif vector_action == 2:
                y = np.minimum(y+1, self.width-1)
            elif vector_action == 3:
                y = np.maximum(y-1, 0)

        if self.maze[x,y].item() == self.width**2 + 1:  
            x, y = currentx, currenty
    


        self.state = self.maze[x, y].item()
        expbonus = 0
        if x == currentx and y == currenty:
            self.reward = 0
            expbonus = -20
            print('hit wall')
        else:
            self.reward = -50
            # expbonus -= 90
            self.define_object_actions()
            if self.state == self.goal:
                self.reward += 1000
                self.done = True
            else: 
                # count based exploration bonus
                # expbonus = 45 / np.sqrt(self.visitcounts[self.state])
                expbonus = 0
        #give bonus for moving towards goal
        # expbonus = 16 - self.path_lengths[x, y]
        self.visitcounts[self.state] += 1
        self.lastdirection = vector_action
        if self.lastdirection == 0:
            self.lastxdisplacement = 1
            self.lastydisplacement = 0
        elif self.lastdirection == 1:
            self.lastxdisplacement = -1
            self.lastydisplacement = 0
        elif self.lastdirection == 2:
            self.lastxdisplacement = 0
            self.lastydisplacement = 1
        elif self.lastdirection == 3:
            self.lastxdisplacement = 0
            self.lastydisplacement = -1

        self.stepno += 1
        walls = np.asarray([0 if x == self.width**2 + 1 else 1 for x in self.object_action_states], dtype = np.float64)
        
        states = np.asarray([self.state, self.goal, self.object_action_states[0], self.object_action_states[1], self.object_action_states[2], self.object_action_states[3]], dtype=np.float64)
        states = states/(self.width**2+1)
        
        #observations: one-hot encoding of current state and goal state, AND adjacent states
        observations = np.concatenate((
            one_hots(self.actioncondition, 4),
            # np.asarray([self.num_landmarks]).astype(np.float64),
            np.asarray([self.object_valid, self.arrow_valid]).astype(np.float64),
            # one_hots(self.lastaction, 8),
            np.asarray([self.lastxdisplacement, self.lastydisplacement], dtype=np.float64),
            int_code(self.state, self.width**2+1),
            int_code(self.goal, self.width**2+1),
            int_code(self.object_action_states[0], self.width**2+1),
            int_code(self.object_action_states[1], self.width**2+1),
            int_code(self.object_action_states[2], self.width**2+1),
            int_code(self.object_action_states[3], self.width**2+1),
            self.obstaclexs,
            self.obstacleys,
            # states,
            np.asarray([self.landmarkxs[self.state], self.landmarkys[self.state]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.goal], self.landmarkys[self.goal]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[0]], self.landmarkys[self.object_action_states[0]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[1]], self.landmarkys[self.object_action_states[1]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[2]], self.landmarkys[self.object_action_states[2]]], dtype=np.float64),
            np.asarray([self.landmarkxs[self.object_action_states[3]], self.landmarkys[self.object_action_states[3]]], dtype=np.float64),
            np.asarray([self.confidence[self.state], self.confidence[self.goal], self.confidence[self.object_action_states[0]], self.confidence[self.object_action_states[1]], self.confidence[self.object_action_states[2]], self.confidence[self.object_action_states[3]]], dtype=np.float64),
            # np.asarray([self.stepno], dtype=np.float64)
            # one_hots(0, self.width**2+1),
        ))

        if self.stepno > 200:
            truncated = True
        else:
            truncated = False

        goalx, goaly = self.get_coordinates(self.goal)
        # print(self.reward + expbonus)
        # print(self.state)
        # print(self.goal)

        # # time_cost = 10
        # if action < 4:
        #     expbonus -= 0
        # else:
        #     # print('used transitions')
        #     # print(self.transition_cost)
        #     expbonus -= self.transition_cost
        # print(expbonus)
        return observations, self.reward + expbonus, self.done, truncated, {'state': self.state, 'x': x, 'y': y, 'goalstate': self.goal, 'goalx': goalx, 'goaly': goaly, 'landmarks': self.landmarks}

    def render(self, mode='human'):

        self.render_mode = mode

        return None


class randomAgent:
        def __init__(self, env):
            self.env = env
    
        def act(self, state):
            action = np.random.randint(0, 8)
            return action
