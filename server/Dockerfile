# server/Dockerfile

FROM node:20-alpine

# Set the working directory
WORKDIR /app

RUN corepack enable

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN pnpm run build

# Expose the server port
EXPOSE 5000

# Start the server
CMD ["npm", "run", "start"]
