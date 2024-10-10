This repository contains the code used for the paper 'Goal-directed navigation strategies in humans and deep meta-learning agents' (Denis Lan, Laurence Hunt, & Chris Summerfield). Data for this project is available at https://osf.io/w39d5/

The '**analysis**' folder contains the Python notebooks for plotting the data and running the statistical models. Figures are generated from the 'figX_code.ipynb' notebooks-- these can be run in the conda environment specified in environment.yml. Mixed effects models are run in the 'julia_models_XXX.ipynb' notebooks-- these can be run in the conda environment specified in environment_julia.yml. Running the mixed effects models will require an installation of R with the package JuliaCall installed.

The '**model**' folder contains the Python scripts for training and testing the model. These can be run in the conda environment specified in environment.yml. The code for training the model is in 'runmodel.py'. Trained models can be found in the 'trained models' folder.

The '**task**' folder contains the web tasks used to collect the data.
