#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
# Deploy Chat Lambda Handler
#
# Builds the Lambda handler with esbuild and deploys via AWS CLI.
#
# Environment variables:
#   FUNCTION_NAME - Lambda function name (default: 1nce-devhub-chat)
#   AWS_REGION    - AWS region (default: eu-central-1)
#
# Prerequisites:
#   - AWS CLI configured with appropriate credentials
#   - Node.js and npm installed
#
# Usage:
#   ./scripts/deploy-chat-lambda.sh
#   FUNCTION_NAME=my-chat-fn AWS_REGION=us-east-1 ./scripts/deploy-chat-lambda.sh
# =============================================================================

FUNCTION_NAME="${FUNCTION_NAME:-1nce-devhub-chat}"
REGION="${AWS_REGION:-eu-central-1}"
HANDLER_DIR="lambda/chat-handler"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "=== Deploy Chat Lambda Handler ==="
echo "Function: $FUNCTION_NAME"
echo "Region:   $REGION"
echo ""

# Build the handler
echo "Building Lambda handler..."
cd "$PROJECT_ROOT/$HANDLER_DIR"
npm ci --production=false
npm run build

# Create deployment package
echo "Creating deployment package..."
cd dist
zip -r ../deployment.zip index.mjs
cd ..

DEPLOY_ZIP="$PROJECT_ROOT/$HANDLER_DIR/deployment.zip"
echo "Package: $DEPLOY_ZIP ($(du -h "$DEPLOY_ZIP" | cut -f1))"

# Deploy to AWS Lambda
echo ""
echo "Updating Lambda function code..."
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file "fileb://$DEPLOY_ZIP" \
  --region "$REGION"

echo "Waiting for update to complete..."
aws lambda wait function-updated \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION"

echo ""
echo "Lambda function updated successfully."
FUNCTION_URL=$(aws lambda get-function-url-config \
  --function-name "$FUNCTION_NAME" \
  --region "$REGION" \
  --query 'FunctionUrl' \
  --output text 2>/dev/null || echo "N/A")
echo "Function URL: $FUNCTION_URL"

# Cleanup
rm -f "$DEPLOY_ZIP"
echo ""
echo "Done."
