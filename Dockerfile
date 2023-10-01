FROM arm64v8/node:18 as build

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD [ "node", "run build" ]

# Use Node.js 18 for ARM64v8
FROM arm64v8/node:18 as production

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) from build container
COPY --from=build /usr/src/app/package*.json ./

# Install the dependencies
RUN npm install --omit=dev

# Copy the build directory
COPY --from=build /usr/src/app/build ./build

# Your application's run command
CMD [ "node", "run start" ]
