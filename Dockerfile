# Use the latest Node.js LTS with Alpine for production efficiency
FROM node:20-alpine AS base

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency manifests for optimal layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies with production optimizations
RUN npm ci --only=production && npm cache clean --force

# Development stage with hot reloading capabilities
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev:http"]

# Build stage using multi-stage patterns for optimization
FROM base AS build
COPY . .
RUN npm ci && npm run build

# Production stage with minimal footprint
FROM node:20-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001

WORKDIR /app

# Copy built application and dependencies
COPY --from=build --chown=mcp:nodejs /app/dist ./dist
COPY --from=build --chown=mcp:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=mcp:nodejs /app/package.json ./

# Create logs directory with proper permissions
RUN mkdir -p logs && chown -R mcp:nodejs logs

# Switch to non-root user
USER mcp

# Expose port
EXPOSE 3000

# Health check using modern Docker patterns
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start server with production configuration
CMD ["node", "dist/server/http-server.js"]