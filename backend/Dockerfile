FROM node:22.13.0-alpine AS base

RUN apk add --no-cache curl

WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]