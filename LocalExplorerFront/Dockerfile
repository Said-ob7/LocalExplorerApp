# Use Node.js image to build the frontend
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project and build it
COPY . .
RUN npm run build

# Use Nginx to serve the React app
FROM nginx:alpine

# Copy built files from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 5173

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
