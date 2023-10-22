# Set the base image
FROM node:20-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the current directory contents into the container
COPY . .

# Build the app
RUN npm run build

# Set the environment variables
ENV PORT=8080
EXPOSE 8080

# Run the app
CMD [ "npm", "start" ]
