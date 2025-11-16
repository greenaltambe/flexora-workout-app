FROM node:18-alpine

WORKDIR /usr/src/app

# Copy the package definition files first for caching.
COPY package.json pnpm-lock.yaml ./

# --frozen-lockfile ensures the exact versions from your lockfile are installed.
RUN npm install -g pnpm 
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code.
COPY . .

EXPOSE 8080

CMD ["node", "index.js"]