FROM node:18-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code.
COPY . .

#This command builds the frontend application for production.
RUN pnpm run build 

FROM nginx:stable-alpine

# Copy the static files that were generated in the "build" stage
# from its /app/dist folder into the Nginx web root directory.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration file to replace the default one.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80, which is what Nginx listens on by default.
EXPOSE 80
