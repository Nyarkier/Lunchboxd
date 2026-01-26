# Use Node.js 22 LTS (matches your system version v22.14.0)
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Build the project
RUN npm run build

# Expose port for Vite preview (optional, for development)
# For production, you would use a separate image with a web server
EXPOSE 4173

# Preview the built project
CMD ["npm", "run", "preview"]
