#!/usr/bin/env bash
# Deploy Angular static bundle to host nginx web root (Option B).
# Run on the VPS from the `frontend/` directory.
#
#   chmod +x deploy/deploy.sh
#   sudo ./deploy/deploy.sh

set -euo pipefail

IMAGE="piriven-frontend-build"
CONTAINER="piriven-frontend-tmp"
WEB_ROOT="${WEB_ROOT:-/var/www/piriven-mcq}"
WEB_USER="${WEB_USER:-www-data}"

echo "==> Building image: $IMAGE"
docker build -t "$IMAGE" .

echo "==> Creating temp container"
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker create --name "$CONTAINER" "$IMAGE" >/dev/null

echo "==> Replacing $WEB_ROOT"
rm -rf "$WEB_ROOT"
docker cp "$CONTAINER":/app/dist/piriven-mcq "$WEB_ROOT"

echo "==> Cleanup temp container"
docker rm "$CONTAINER" >/dev/null

echo "==> Fixing ownership"
chown -R "$WEB_USER":"$WEB_USER" "$WEB_ROOT"

echo "==> Reloading nginx"
nginx -t
systemctl reload nginx

echo "==> Done. Deployed to $WEB_ROOT"
