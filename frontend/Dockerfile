# Build-only image — produces production Angular static files.
#
# Goal (Option B): VPS එකේ දැනටම තියෙන host nginx එකෙන්ම static files serve කරනවා.
# මේ image එකෙන් container එකක් දිගටම run වෙන්න ඕන නෑ; artifact එක extract කරගන්න විතරයි.
#
# USAGE (VPS එකේ):
#   cd frontend
#   docker build -t piriven-frontend-build .
#   docker create --name piriven-tmp piriven-frontend-build
#   sudo rm -rf /var/www/piriven-mcq
#   sudo docker cp piriven-tmp:/app/dist/piriven-mcq /var/www/piriven-mcq
#   docker rm piriven-tmp
#   sudo chown -R www-data:www-data /var/www/piriven-mcq
#   sudo nginx -t && sudo systemctl reload nginx
#
# Host nginx site config:  deploy/nginx-vps-static.conf.example

# ── Stage 1: build Angular app ───────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: minimal artifact carrier (no runtime server) ────────────────
FROM alpine:3.20
WORKDIR /app
COPY --from=build /app/dist /app/dist
CMD ["sh", "-c", "echo 'Artifacts ready at /app/dist/piriven-mcq. Use: docker cp <container>:/app/dist/piriven-mcq <host-path>'"]
