#!/bin/bash

# Coffee Shop API Deployment Script
set -e

STAGE=${1:-dev}
REGION=${2:-us-east-1}

echo "🚀 Deploying Coffee Shop API to stage: $STAGE in region: $REGION"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Deploy using Serverless Framework
echo "☁️  Deploying to AWS..."
npx serverless deploy --stage $STAGE --region $REGION --verbose

# Get API Gateway URL
API_URL=$(npx serverless info --stage $STAGE --region $REGION | grep ServiceEndpoint | cut -d' ' -f2)

echo "✅ Deployment completed successfully!"
echo "🌐 API URL: $API_URL"
echo "📖 API Documentation:"
echo "  GET    $API_URL/products      - List all products"
echo "  GET    $API_URL/products/{id} - Get a specific product"
echo "  POST   $API_URL/products      - Create a new product"
echo "  PUT    $API_URL/products/{id} - Update a product"
echo "  DELETE $API_URL/products/{id} - Delete a product"

# Test basic endpoint
echo "🔍 Testing API health..."
if curl -f -s "$API_URL/products" > /dev/null; then
    echo "✅ API is responding correctly"
else
    echo "❌ API health check failed"
    exit 1
fi 