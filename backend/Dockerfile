FROM node:22.13.0-alpine AS base

WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]