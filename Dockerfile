# Use an official Node.js runtime as a parent image
FROM node:22.12.0-alpine3.21 AS build-env

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

FROM nginx:1.27.3-alpine3.20-slim AS runtime

# Copy the build output from the build environment
COPY --from=build-env /app/dist /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port the app runs on
EXPOSE 80