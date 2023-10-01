# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as devPkg

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy node_modules action cache
COPY node_modules ./node_modules

# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as pkg

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

RUN npm config set registry https://registry.npmjs.org/

# Install production dependencies
RUN npm install --omit=dev

# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the source code
COPY . .

# Copy development dependencies
COPY --from=devPkg node_modules ./node_modules

# Your application's build command
CMD [ "node", "run build:ci" ]

# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) from build container
COPY package*.json ./

# Copy production dependencies
COPY --from=pkg node_modules ./node_modules

# Copy the build directory
COPY --from=build build ./build

# Your application's run command
CMD [ "node", "run start" ]
