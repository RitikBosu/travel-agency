# Travel Agency Frontend - Dockerfile
# Simple setup for React Router v7 app

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build the app
RUN npm run build

# Expose port 3000
EXPOSE 5173

# Start the app
CMD ["npm", "run", "start"]