#!/bin/bash
set -e

# Pull the Docker image from Docker Hub
docker pull shriram333/python-webapp

# Run the Docker image as a container
docker run -d -p 5000:5000 shriram333/python-webapp