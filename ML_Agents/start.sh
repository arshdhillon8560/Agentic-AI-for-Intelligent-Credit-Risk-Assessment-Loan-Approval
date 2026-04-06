#!/bin/bash

cd ML_Agents

pip install -r requirements.txt

gunicorn -w 2 -k uvicorn.workers.UvicornWorker api.ml_api:app