# Set the base image
FROM node:21-slim

# Set the working directory
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy the shared directory
COPY shared ./shared

# Change to the directory where the slack-bot's package.json and other files are
WORKDIR /usr/src/app/slack-bot

# Copy the package.json and pnpm-lock.yaml for the slack-bot
COPY slack-bot/package*.json ./
COPY slack-bot/pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the current directory contents into the container
COPY slack-bot/ ./

# Build the app using pnpm
RUN pnpm run build

# Set the environment variables
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Run the app using pnpm
CMD ["pnpm", "start"]
