# Stage 1: Build the Angular application
FROM node:20 as build

WORKDIR /app

COPY package.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

COPY . .

# Build for production
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/dist/mertrics-tasks-web/browser /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
