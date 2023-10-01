# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the build directory
COPY build/ ./build/

# Your application's run command
CMD [ "node", "run start" ]
