#!/bin/bash

APP_NAME="adishy"
CONTAINER_MOUNT_PATH="/usr/src/app"

# Function to initialize a new Nuxt application
init() {
  docker build -t $APP_NAME .
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 $APP_NAME npx nuxi init -t github:atinux/content-wind .
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 $APP_NAME npm install
}

# Function to build and run the application in development mode
dev() {
  if [ "$1" = "--build" ]; then
    docker build -t $APP_NAME .
  fi
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 -p 4000:4000 -e CHOKIDAR_USEPOLLING=true $APP_NAME
}

# Function to build and run the application in production mode
prod() {
  docker build -t $APP_NAME .
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 $APP_NAME npm run build
}

# Function to generate the website from markdown files
generate() {
  docker build -t $APP_NAME .
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 $APP_NAME npm run generate
}

# Function to run a shell in the container
shell() {
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 $APP_NAME /bin/bash
}

# Check the command line argument
case "$1" in
  init)
    init
    ;;
  dev)
    dev "$2"
    ;;
  prod)
    prod
    ;;
  generate)
    generate
    ;;
  shell)
    shell
    ;;
  *)
    echo "Usage: $0 {init|dev|prod|generate|shell}"
    exit 1
esac 