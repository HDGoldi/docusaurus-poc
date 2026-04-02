#!/usr/bin/env bash
# Pre-launch smoke test: verify key URLs return 200 on target domain
# Usage: smoke-test.sh <base-url>
# Example: smoke-test.sh https://d1234567890.cloudfront.net
set -euo pipefail

BASE_URL="${1:?Usage: smoke-test.sh <base-url>}"

# Key URLs matching the 5 docs plugin instances + homepage
URLS=(
  "/"
  "/docs/"
  "/api/"
  "/platform/1nce-os/1nce-os-admin-logs/"
  "/blueprints/blueprints-examples/1nce-vpn-linux-client/"
  "/terms/terms-abbreviations/"
)

FAILED=0
for path in "${URLS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "${BASE_URL}${path}")
  if [ "$STATUS" -ne 200 ]; then
    echo "FAIL: ${BASE_URL}${path} returned $STATUS"
    FAILED=1
  else
    echo "OK: ${BASE_URL}${path}"
  fi
done

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo "SMOKE TEST FAILED: One or more URLs did not return 200"
  exit 1
fi

echo ""
echo "SMOKE TEST PASSED: All URLs returned 200"
exit 0
