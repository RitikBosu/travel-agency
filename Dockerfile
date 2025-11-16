# Multi-stage Dockerfile for React Router v7 SSR Application
# This builds both client and server bundles for the travel agency app

# Stage 1: Install all dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Stage 2: Build the application with environment variables
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for VITE_ prefixed env vars (available at build time)
ARG VITE_APPWRITE_API_ENDPOINT
ARG VITE_APPWRITE_PROJECT_ID
ARG VITE_APPWRITE_DATABASE_ID
ARG VITE_APPWRITE_USERS_COLLECTION_ID
ARG VITE_APPWRITE_TRIPS_COLLECTION_ID
ARG VITE_SYNCFUSION_LICENSE_KEY
ARG VITE_BASE_URL

# Set environment variables for build
ENV VITE_APPWRITE_API_ENDPOINT=$VITE_APPWRITE_API_ENDPOINT \
    VITE_APPWRITE_PROJECT_ID=$VITE_APPWRITE_PROJECT_ID \
    VITE_APPWRITE_DATABASE_ID=$VITE_APPWRITE_DATABASE_ID \
    VITE_APPWRITE_USERS_COLLECTION_ID=$VITE_APPWRITE_USERS_COLLECTION_ID \
    VITE_APPWRITE_TRIPS_COLLECTION_ID=$VITE_APPWRITE_TRIPS_COLLECTION_ID \
    VITE_SYNCFUSION_LICENSE_KEY=$VITE_SYNCFUSION_LICENSE_KEY \
    VITE_BASE_URL=$VITE_BASE_URL

# Build the React Router application (creates client + server bundles)
RUN npm run build

# Stage 3: Production runtime with minimal dependencies
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/build ./build

# Copy necessary runtime files
COPY env-loader.js ./
COPY instrument.server.mjs ./

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S reactrouter -u 1001 && \
    chown -R reactrouter:nodejs /app

USER reactrouter

# Expose the application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the React Router SSR server
CMD ["npm", "run", "start"]