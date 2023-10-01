# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as devPkg

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install development dependencies
RUN npm install

# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as pkg

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the source code
COPY . .

# Copy development dependencies
COPY --from=devPkg /usr/src/app/node_modules ./node_modules

# Your application's build command
CMD [ "node", "run build" ]

# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) from build container
COPY package*.json ./

# Copy production dependencies
COPY --from=pkg /usr/src/app/node_modules ./node_modules

# Copy the build directory
COPY --from=build /usr/src/app/build ./build

# Your application's run command
CMD [ "node", "run start" ]
