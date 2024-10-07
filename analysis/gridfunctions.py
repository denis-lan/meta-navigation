#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Jun 10 22:12:28 2022

@author: denislan
"""
def checkdist(x1, y1, x2, y2):
    
    """
    Parameters
    ----------
    x1 : int
        x-coordinate of first location.
    y1 : int
        y-coordinate of first location.
    x2 : int
        x-coordinate of second location.
    y2 : int
        y-coordinate of second location.
    Returns
    -------
    Distance between two locations
    """
    
    return abs(x1-x2) + abs(y1-y2)

def checkpathdist(x1, y1, x2, y2, obstaclexs, obstacleys):
    #convert obstacles to list if string
    if type(obstaclexs) == str:
        if obstaclexs == ',':
            obstaclexs = []
            obstacleys = []
        else:
            print(obstaclexs)
            obstaclexs = list(map(int, obstaclexs.split(",")))
            obstacleys = list(map(int, obstacleys.split(",")))
    distMatrix = getDistanceMatrix(x2, y2, obstaclexs, obstacleys)

    return distMatrix[x1-1, y1-1]

def getDistanceMatrix(targetx, targety, obstaclexs, obstacleys):
        
        """
        Parameters
        ----------
        targetx : int
            x-coordinate of target location.
        targety : int
            y-coordinate of target location.
        obstaclexs : list
            list of x-coordinates of obstacle locations.
        obstacleys : list
            list of y-coordinates of obstacle locations.
        Returns
        -------
        Distance matrix
        """
        
        import numpy as np
        if type(obstaclexs) == str:
            obstaclexs = list(map(int, obstaclexs.split(",")))
            obstacleys = list(map(int, obstacleys.split(",")))
        distancematrix = np.zeros((8,8)) + 998
        distancematrix[targetx-1, targety-1] = 0
        for (obsx, obsy) in zip(obstaclexs, obstacleys):
            distancematrix[obsx-1, obsy-1] = 999
        trycount = 0
        #djikstra's algorithm
        for dist in range(1, 20):
            for row in range(8):
                for col in range(8):
                    if distancematrix[row, col] == dist-1:
                        if row > 0:
                            if distancematrix[row-1, col] == 998:
                                distancematrix[row-1, col] = dist
                        if row < 7:
                            if distancematrix[row+1, col] == 998:
                                distancematrix[row+1, col] = dist
                        if col > 0:
                            if distancematrix[row, col-1] == 998:
                                distancematrix[row, col-1] = dist
                        if col < 7:
                            if distancematrix[row, col+1] == 998:
                                distancematrix[row, col+1] = dist
            trycount += 1
            if trycount > 100:
                break
        distancematrix[distancematrix == 998] = 999
        return distancematrix

def isTowards(x1, y1, x2, y2, refx, refy):

    return int(checkdist(x1, y1, refx, refy) > checkdist(x2, y2, refx, refy))

def isTowards_path(x1, y1, x2, y2, refx, refy, obstaclexs, obstacleys):
    return int(checkpathdist(x1, y1, refx, refy, obstaclexs, obstacleys) > checkpathdist(x2, y2, refx, refy, obstaclexs, obstacleys))

def check_chance_level(x, y, goalx, goaly, obstaclexlocs, obstacleylocs):
    
    import numpy as np
    numcorrectsteps = np.sum(correct_steps(x,y,goalx,goaly,obstaclexlocs,obstacleylocs))
    numvalidsteps = np.sum(valid_steps(x,y, obstaclexlocs, obstacleylocs))
    
    return numcorrectsteps/numvalidsteps
    
    

def correct_steps(xloc, yloc, goalxloc, goalyloc, obstaclexlocs, obstacleylocs):
    xloc = xloc + 1
    yloc = yloc + 1
    return [isTowards_path(xloc, yloc, xloc+1, yloc, goalxloc, goalyloc, obstaclexlocs, obstacleylocs), isTowards_path(xloc, yloc, xloc-1, yloc, goalxloc, goalyloc, obstaclexlocs, obstacleylocs), isTowards_path(xloc, yloc, xloc, yloc+1, goalxloc, goalyloc, obstaclexlocs, obstacleylocs), isTowards_path(xloc, yloc, xloc, yloc-1, goalxloc, goalyloc, obstaclexlocs, obstacleylocs)]
    # return [goalxloc<xloc, goalxloc>xloc, goalyloc<yloc, goalyloc>yloc]

def valid_steps(xloc, yloc, obstaclexs, obstacleys):
    if obstaclexs == []:
        return [xloc<8, xloc>1, yloc<8, yloc>1]
    else:
        if type(obstaclexs) == str:
            if obstaclexs == ',':
                obstaclexs = []
                obstacleys = []
            else:
                print(obstaclexs)
                obstaclexs = list(map(int, obstaclexs.split(",")))
                obstacleys = list(map(int, obstacleys.split(",")))

        obstaclexys = [(int(obstaclexs[i]), int(obstacleys[i])) for i in range(len(obstaclexs))]
        return [(xloc>1) and (xloc, yloc) not in obstaclexys, (xloc<8) and (xloc+1, yloc) not in obstaclexys, (yloc>1) and (xloc, yloc-1) not in obstaclexys, (yloc<8) and (xloc, yloc+1) not in obstaclexys]

def hue_regplot(data, x, y, hue, palette=None, **kwargs):
    from matplotlib.cm import get_cmap
    import seaborn as sns
    
    regplots = []
    
    levels = data[hue].unique()
    
    if palette is None:
        default_colors = get_cmap('tab10')
        palette = {k: default_colors(i) for i, k in enumerate(levels)}
    
    for key in levels:
        regplots.append(
            sns.regplot(
                x=x,
                y=y,
                data=data[data[hue] == key],
                color=palette[key],
                **kwargs
            )
        )
    
    return regplots


def plot_trajectories(df, partnos, blockgoalxlocs, blockgoalylocs, blockno):
    import matplotlib.pyplot as plt
    import numpy as np
    
    trialnos = list(range(1 + (blockno - 1)*6, (blockno)*6 + 1))
    print(trialnos)
    fig, axs = plt.subplots(np.size(partnos), np.size(trialnos), figsize = (5 * np.size(trialnos) + 2, 2 + 5 * np.size(partnos)), dpi = 300)
    for x, partno in enumerate(partnos):
        for y, trialno in enumerate(trialnos):
            grid = np.zeros((8, 8));
            index = df.index[(df['partno'] == partno) & (df['trialno'] == trialno)]
            xlocs = df['resp_xlocs'][index[0]]
            ylocs = df['resp_ylocs'][index[0]]
            resptype = df['resp_resptype'][index[0]]
            for i, (xloc, yloc) in enumerate(zip(xlocs, ylocs)):
                xloc = int(xloc)
                yloc = int(yloc)
                grid[xloc, yloc] = 0.3 + (0.7/len(xlocs)) * i
                
            
            
            axs[x, y].imshow(grid, cmap = 'gray')
            
            landmarkx = blockgoalxlocs[blockno][partno]
            landmarky = blockgoalylocs[blockno][partno]
            for (lx,ly) in zip(landmarkx.split(','), landmarky.split(',')):
                axs[x, y].scatter(int(ly), int(lx), s = 500, c='red', marker = 'o')
                
            for i, (xloc, yloc, resp) in enumerate(zip(xlocs[1:], ylocs[1:], resptype)):
                if resp == 'o':
                    axs[x, y].scatter(int(yloc), int(xloc), s = 700, c='blue', marker = 'x')
                    print(xloc)
                    
            axs[x, y].set_xticks([])
            axs[x, y].set_yticks([])
            
            if x == 0:
                axs[x, y].text(2.5, -1, str(y+1), ha = 'center', va = 'center')
                
            if y == 0:
                axs[x, y].text(-1.3, 2.5, str(partno), ha = 'center', va = 'center')
    fig.set_tight_layout(tight = True)            
    fig.text(0.5, 0.99, 'Trial Number', ha = 'center', va = 'center')
    fig.text(0.01, 0.5, 'Participant Number', ha = 'center', va = 'center', rotation = 'vertical')
    
def plot_simtrajectories(df, partnos, numlandmarks):
    import matplotlib.pyplot as plt
    import numpy as np
    
    # trialnos = list(range(1 + (blockno - 1)*6, (blockno)*6 + 1))
    
    # print(trialnos)
    fig, axs = plt.subplots(np.size(partnos), 6, figsize = (5 * 6 + 2, 2 + 5 * np.size(partnos)), dpi = 300)
    for x, partno in enumerate(partnos):
        trialnos = list(df['trialno'][(df['cond_numlandmarks'] == numlandmarks) & (df['partno'] == partno)])
        for y, trialno in enumerate(trialnos):
            grid = np.zeros((8, 8));
            index = df.index[(df['partno'] == partno) & (df['trialno'] == trialno)]
            xlocs = df['simxlocs'][index[0]]
            ylocs = df['simylocs'][index[0]]
            resptype = df['simresptypes'][index[0]]
            for i, (xloc, yloc) in enumerate(zip(xlocs, ylocs)):
                xloc = int(xloc) - 1
                yloc = int(yloc) - 1
                grid[xloc, yloc] = 0.3 + (0.7/len(xlocs)) * i
                
            
            
            axs[x, y].imshow(grid, cmap = 'gray')
            
            landmarkx = list(map(int, df['cond_exploreforcedxlocs'][index[0]].split(',')))
            landmarky = list(map(int, df['cond_exploreforcedylocs'][index[0]].split(',')))
            for i, (lx,ly) in enumerate(zip(landmarkx, landmarky)):
                lx = lx-1
                ly = ly-1
                if i < len(landmarkx)-1:
                    axs[x, y].scatter(int(ly), int(lx), s = 500, c='red', marker = 'o')
                else:
                    axs[x, y].scatter(int(ly), int(lx), s = 500, c='blue', marker = 'o')
                
            for i, (xloc, yloc, resp) in enumerate(zip(xlocs[1:], ylocs[1:], resptype)):
                if resp == 'o':
                    axs[x, y].scatter(int(yloc)-1, int(xloc)-1, s = 700, c='blue', marker = 'x')
                    print(xloc)
                    
            axs[x, y].set_xticks([])
            axs[x, y].set_yticks([])
            
            if x == 0:
                axs[x, y].text(2.5, -1, str(y+1), ha = 'center', va = 'center')
                
            if y == 0:
                axs[x, y].text(-1.3, 2.5, str(partno), ha = 'center', va = 'center')
    fig.set_tight_layout(tight = True)            
    fig.text(0.5, 0.99, 'Trial Number', ha = 'center', va = 'center')
    fig.text(0.01, 0.5, 'Participant Number', ha = 'center', va = 'center', rotation = 'vertical')
    

def plot_exploreclicks(df, partnos, blockno):
    import matplotlib.pyplot as plt
    import numpy as np
    
    
    
    # print(trialnos)
    fig, axs = plt.subplots(np.size(partnos), 3, figsize = (5 * 6 + 2, 2 + 5 * np.size(partnos)), dpi = 300)
    for x, partno in enumerate(partnos):
        trialnos = df['trialno'][(df['cond_freeorforced'] == 0) & (df['partno'] == partno) & (df['cond_blockno'] == blockno)]
        for y, trialno in enumerate(trialnos):
            grid = np.zeros((8, 8));
            index = df.index[(df['partno'] == partno) & (df['trialno'] == trialno)]
            xlocs = df['resp_explorexclicks'][index[0]]
            ylocs = df['resp_exploreyclicks'][index[0]]
            
            for i, (xloc, yloc) in enumerate(zip(xlocs, ylocs)):
                xloc = int(xloc) - 1
                yloc = int(yloc) - 1
                grid[xloc, yloc] += 1
                
            
            
            axs[x, y].imshow(grid, cmap = 'gray')
            
            # landmarkx = list(map(int, df['cond_exploreforcedxlocs'][index[0]].split(',')))
            # landmarky = list(map(int, df['cond_exploreforcedylocs'][index[0]].split(',')))
            # for i, (lx,ly) in enumerate(zip(landmarkx, landmarky)):
            #     lx = lx-1
            #     ly = ly-1
            #     if i < len(landmarkx)-1:
            #         axs[x, y].scatter(int(ly), int(lx), s = 500, c='red', marker = 'o')
            #     else:
            #         axs[x, y].scatter(int(ly), int(lx), s = 500, c='blue', marker = 'o')
                
            # for i, (xloc, yloc, resp) in enumerate(zip(xlocs[1:], ylocs[1:], resptype)):
            #     if resp == 'o':
            #         axs[x, y].scatter(int(yloc)-1, int(xloc)-1, s = 700, c='blue', marker = 'x')
            #         print(xloc)
                    
            # axs[x, y].set_xticks([])
            # axs[x, y].set_yticks([])
            
            if x == 0:
                axs[x, y].text(2.5, -1, str(y+1), ha = 'center', va = 'center')
                
            if y == 0:
                axs[x, y].text(-1.3, 2.5, str(partno), ha = 'center', va = 'center')
    fig.set_tight_layout(tight = True)            
    fig.text(0.5, 0.99, 'Trial Number', ha = 'center', va = 'center')
    fig.text(0.01, 0.5, 'Participant Number', ha = 'center', va = 'center', rotation = 'vertical')
    
def plot_trajectoriesv2(df, partnos, numlandmarks):
    import matplotlib.pyplot as plt
    import numpy as np
    
    # trialnos = list(range(1 + (blockno - 1)*6, (blockno)*6 + 1))
    
    # print(trialnos)
    fig, axs = plt.subplots(np.size(partnos), 6, figsize = (5 * 6 + 2, 2 + 5 * np.size(partnos)), dpi = 300)
    for x, partno in enumerate(partnos):
        trialnos = list(df['trialno'][(df['cond_numlandmarks'] == numlandmarks) & (df['partno'] == partno)])
        for y, trialno in enumerate(trialnos):
            grid = np.zeros((8, 8));
            index = df.index[(df['partno'] == partno) & (df['trialno'] == trialno)]
            xlocs = df['resp_xlocs'][index[0]]
            ylocs = df['resp_locs'][index[0]]
            resptype = df['resp_resptype'][index[0]]
            for i, (xloc, yloc) in enumerate(zip(xlocs, ylocs)):
                xloc = int(xloc) - 1
                yloc = int(yloc) - 1
                grid[xloc, yloc] = 0.3 + (0.7/len(xlocs)) * i
                
            
            
            axs[x, y].imshow(grid, cmap = 'gray')
            
            landmarkx = list(map(int, df['cond_exploreforcedxlocs'][index[0]].split(',')))
            landmarky = list(map(int, df['cond_exploreforcedylocs'][index[0]].split(',')))
            for i, (lx,ly) in enumerate(zip(landmarkx, landmarky)):
                lx = lx-1
                ly = ly-1
                if i < len(landmarkx)-1:
                    axs[x, y].scatter(int(ly), int(lx), s = 500, c='red', marker = 'o')
                else:
                    axs[x, y].scatter(int(ly), int(lx), s = 500, c='blue', marker = 'o')
                
            for i, (xloc, yloc, resp) in enumerate(zip(xlocs[1:], ylocs[1:], resptype)):
                if resp == 'o':
                    axs[x, y].scatter(int(yloc)-1, int(xloc)-1, s = 700, c='blue', marker = 'x')
                    print(xloc)
                    
            axs[x, y].set_xticks([])
            axs[x, y].set_yticks([])
            
            if x == 0:
                axs[x, y].text(2.5, -1, str(y+1), ha = 'center', va = 'center')
                
            if y == 0:
                axs[x, y].text(-1.3, 2.5, str(partno), ha = 'center', va = 'center')
    fig.set_tight_layout(tight = True)            
    fig.text(0.5, 0.99, 'Trial Number', ha = 'center', va = 'center')
    fig.text(0.01, 0.5, 'Participant Number', ha = 'center', va = 'center', rotation = 'vertical')

    
def add_trial_lines(g):
    x_bounds = g.get_xlim()
    g.axvline(1, color = 'black', ls = '--')
    g.annotate(text='Block 1', xy =(((1-x_bounds[0])/(x_bounds[1]-x_bounds[0]))+0.01,0.75), xycoords='axes fraction', rotation = 90)
    g.axvline(16, color = 'black', ls = '--')
    g.annotate(text='Block 2', xy =(((16-x_bounds[0])/(x_bounds[1]-x_bounds[0]))+0.01,0.75), xycoords='axes fraction', rotation = 90)
    g.axvline(31, color = 'black', ls = '--')
    g.annotate(text='Block 3', xy =(((31-x_bounds[0])/(x_bounds[1]-x_bounds[0]))+0.01,0.75), xycoords='axes fraction', rotation = 90)
    g.axvline(46, color = 'black', ls = '--')
    g.annotate(text='Block 4', xy =(((46-x_bounds[0])/(x_bounds[1]-x_bounds[0]))+0.01,0.75), xycoords='axes fraction', rotation = 90)
    g.axvline(61, color = 'black', ls = '--')
    g.annotate(text='Block 5', xy =(((61-x_bounds[0])/(x_bounds[1]-x_bounds[0]))+0.01,0.75), xycoords='axes fraction', rotation = 90)


def check_adjacencies(xlocs, ylocs):
    
    count = 0
    for (x1,y1) in zip(xlocs,ylocs):
        for (x2,y2) in zip(xlocs,ylocs):
            if abs(x1-x2) + abs(y1-y2) == 1:
                count += 1
                 
    return count/2
        
def get_integration_matrix(obstaclexs, obstacleys):
    import numpy as np
    integration = np.zeros([8,8])
    if type(obstaclexs) == str:
        obstaclexs = list(map(int, obstaclexs.split(",")))
        obstacleys = list(map(int, obstacleys.split(",")))
    for (obsx, obsy) in zip(obstaclexs, obstacleys):
        integration[obsx-1, obsy-1] = 999

    for row in range(8):
        for col in range(8):
            if integration[row,col] != 999:
                pathdists = getDistanceMatrix(row+1, col+1, obstaclexs, obstacleys)
                distancelist = [];
                for row2 in range(8):
                    for col2 in range(8):
                        if pathdists[row2,col2] != 999:
                            distancelist.append(pathdists[row2,col2])
                integration[row,col] = np.mean(distancelist)
            
            
    integrationvalue = 1 - (integration - np.min(integration[integration!= 999])) / (np.max(integration[integration!= 999])- np.min(integration[integration!= 999]))
    return integrationvalue

def get_integration_value(xloc, yloc, obstaclexs, obstacleys):
    import numpy as np
    integration = np.zeros([8,8])
    for row in range(8):
        for col in range(8):
            distancelist = [];
            for row2 in range(8):
                for col2 in range(8):
                    distancelist.append(checkpathdist(row, col, row2, col2, obstaclexs, obstacleys))
            integration[row,col] = np.mean(distancelist)
            
            
    integrationvalue = 1 - (integration - np.min(integration)) / (np.max(integration)- np.min(integration))
    return integrationvalue[xloc, yloc]

