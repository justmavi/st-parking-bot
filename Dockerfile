# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the rest of the application code
COPY . .

# Build a project
RUN npm run build

# Command to run the application
CMD npm run start:${NODE_ENV}
