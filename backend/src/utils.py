import os
import pandas as pd
import yaml
import logging

def setup_project_directories():
    """Initializes the standard project folder structure."""
    directories = [
        'data/raw', 'data/processed', 'data/final',
        'models', 'notebooks', 'src', 'config', 'app'
    ]
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
    print("Project directories initialized.")

def load_config(config_path='config/config.yaml'):
    """Loads project configuration from a YAML file."""
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

def get_logger(module_name):
    """Standardized logger for the backend."""
    logging.basicConfig(level=logging.INFO, 
                        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
    return logging.getLogger(module_name)