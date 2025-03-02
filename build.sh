#!/bin/bash

APP_NAME="adishy"
CONTAINER_MOUNT_PATH="/usr/src/app"
ENV_FILE=".env.secrets"

# Function to check for env file and create if it doesn't exist
check_env() {
  if [ ! -f "$ENV_FILE" ]; then
    echo "⚠️ $ENV_FILE not found. Creating empty file..."
    touch "$ENV_FILE"
  fi
}

# Function to initialize a new Nuxt application
init() {
  docker build -t $APP_NAME .
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 $APP_NAME npx nuxi init -t github:atinux/content-wind .
  docker run -it --rm -v $(pwd):$CONTAINER_MOUNT_PATH -p 3000:3000 $APP_NAME npm install
}

# Function to build and run the application in development mode
dev() {
  check_env
  if [ "$1" = "--build" ]; then
    docker build -t $APP_NAME .
  fi
  docker run -it --rm \
    -v $(pwd):$CONTAINER_MOUNT_PATH \
    -e NUXT_CONTENT_DEBUG=true \
    -p 3000:3000 -p 4000:4000 \
    --env-file $ENV_FILE \
    -e CHOKIDAR_USEPOLLING=true \
    $APP_NAME
}

# Function to build and run the application in production mode
prod() {
  check_env
  docker build -t $APP_NAME .
  docker run -it --rm \
    -v $(pwd):$CONTAINER_MOUNT_PATH \
    -p 3000:3000 \
    --env-file $ENV_FILE \
    $APP_NAME npm run build
}

# Function to generate the website from markdown files
generate() {
  check_env
  docker build -t $APP_NAME .
  docker run -it --rm \
    -v $(pwd):$CONTAINER_MOUNT_PATH \
    -p 3000:3000 \
    --env-file $ENV_FILE \
    $APP_NAME npm run generate
}

# Function to run a shell in the container
shell() {
  check_env
  docker run -it --rm \
    -v $(pwd):$CONTAINER_MOUNT_PATH \
    -p 3000:3000 \
    --env-file $ENV_FILE \
    $APP_NAME /bin/bash
}

# Function to test Notion integration
test-notion() {
  check_env
  echo "🧪 Testing Notion integration..."
  docker run -it --rm \
    -v $(pwd):$CONTAINER_MOUNT_PATH \
    --env-file $ENV_FILE \
    $APP_NAME node scripts/test-notion.js
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
  test-notion)
    test-notion
    ;;
  test-content)
    test-content
    ;;
  *)
    echo "Usage: $0 {init|dev|prod|generate|shell|test-notion|test-content}"
    exit 1
esac 