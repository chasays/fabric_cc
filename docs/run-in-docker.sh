#!/bin/bash

# 1. build images
docker pull docker.io/ievjai/parabank-tests:latest

# 2. run test
docker run --rm \
  -v $(pwd)/reports:/app/reports \
  -v $(pwd)/allure-results:/app/allure-results \
  ievjai/parabank-tests:latest pnpm run test:ui

# 3. show report
docker run --rm \
  -v $(pwd)/allure-results:/app/allure-results \
  -p 5050:5050 \
  parabank-tests:latest pnpm run report

exit 0
# push image to hub
# docker build -f docker/Dockerfile -t parabank-tests:latest .
# docker tag parabank-tests:latest ievjai/parabank-tests:latest
# docker login
# docker push xxx
