# Multi-stage build: produce Angular bundle, then serve via nginx inside container.
# Used via docker compose; host VPS nginx reverse-proxies to this container.

# ── Stage 1: build Angular app ───────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: serve with nginx ────────────────────────────────────────────
FROM nginx:1.27-alpine AS runtime

# SPA-friendly site config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular assets (outputPath = dist/piriven-mcq per angular.json)
COPY --from=build /app/dist/piriven-mcq /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
