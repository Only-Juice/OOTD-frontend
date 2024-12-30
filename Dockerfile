# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port that the app runs on
EXPOSE 4173

# Command to run the Vite development server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]