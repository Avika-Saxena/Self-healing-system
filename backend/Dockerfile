FROM node:22.13.0-alpine AS base

RUN apk add --no-cache curl tar ca-certificates \
    && K6_VERSION=$(curl -fsSL https://api.github.com/repos/grafana/k6/releases/latest | grep -o '"tag_name": *"[^"]*"' | sed 's/.*"tag_name": *"\(.*\)"/\1/') \
    && curl -fL "https://github.com/grafana/k6/releases/download/${K6_VERSION}/k6-${K6_VERSION}-linux-amd64.tar.gz" -o /tmp/k6.tar.gz \
    && tar -xzf /tmp/k6.tar.gz -C /tmp \
    && mv /tmp/k6-${K6_VERSION}-linux-amd64/k6 /usr/local/bin/k6 \
    && rm -rf /tmp/k6*

WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]