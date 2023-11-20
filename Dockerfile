# Use Node.js 18 for ARM64v8
FROM arm64v8/node as devPkg

    # Set the working directory in the container
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json (if available)
    COPY package*.json ./

    # Install all dependencies
    RUN npm install

# Use Node.js 18 for ARM64v8
FROM arm64v8/node as pkg

    # Set the working directory in the container
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json (if available)
    COPY package*.json ./

    # Install production dependencies
    RUN npm install --omit=dev

# Use Node.js 18 for ARM64v8
FROM arm64v8/node as build

    # Set the working directory in the container
    WORKDIR /usr/src/app

    # Copy the source code
    COPY . .

    # Copy development dependencies
    COPY --from=devPkg /usr/src/app/node_modules ./node_modules

    # Your application's build command
    RUN npm run build:ci

# Use Node.js 18 for ARM64v8
FROM arm64v8/node as production

    # Set the working directory in the container
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json (if available) from build container
    COPY package*.json ./

    # Copy production dependencies
    COPY --from=pkg /usr/src/app/node_modules ./node_modules

    # Copy the build directory
    COPY --from=build /usr/src/app/build ./build

    EXPOSE 3000

    # Your application's run command
    CMD [ "node", "build" ]