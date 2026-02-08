# Stage 1: Build Angular app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm i --legacy-peer-deps

# Copy source code
COPY . .

# Build Angular app for production
ARG BASE_HREF=/mertrics-tasks/
RUN npm run build -- --base-href=${BASE_HREF}

# Stage 2: Serve with Nginx
FROM nginx:1.25-alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/*/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
