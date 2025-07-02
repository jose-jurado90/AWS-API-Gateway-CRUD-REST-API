#!/bin/bash

# Seed Coffee Shop API with sample data
set -e

STAGE=${1:-dev}
REGION=${2:-us-east-1}

# Get API Gateway URL
API_URL=$(npx serverless info --stage $STAGE --region $REGION 2>/dev/null | grep ServiceEndpoint | cut -d' ' -f2)

if [ -z "$API_URL" ]; then
    echo "❌ Could not get API URL. Make sure the service is deployed."
    exit 1
fi

echo "🌱 Seeding Coffee Shop API with sample data..."
echo "🌐 API URL: $API_URL"

# Sample products
products=(
    '{"name":"Espresso","description":"Rich and bold espresso shot","price":2.50,"category":"espresso"}'
    '{"name":"Americano","description":"Espresso with hot water","price":3.00,"category":"coffee"}'
    '{"name":"Cappuccino","description":"Espresso with steamed milk and foam","price":4.50,"category":"cappuccino"}'
    '{"name":"Latte","description":"Espresso with steamed milk","price":4.75,"category":"latte"}'
    '{"name":"Mocha Frappuccino","description":"Blended coffee with chocolate","price":5.50,"category":"frappuccino"}'
    '{"name":"Green Tea","description":"Fresh brewed green tea","price":2.75,"category":"tea"}'
    '{"name":"Croissant","description":"Buttery and flaky pastry","price":3.25,"category":"pastry"}'
    '{"name":"Turkey Sandwich","description":"Fresh turkey with lettuce and tomato","price":8.50,"category":"sandwich"}'
)

echo "📝 Creating sample products..."

for product in "${products[@]}"; do
    echo "Creating: $(echo $product | jq -r '.name')"
    
    response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d "$product" \
        "$API_URL/products")
    
    if echo "$response" | jq -e '.success' > /dev/null; then
        echo "✅ Created: $(echo $response | jq -r '.data.name')"
    else
        echo "❌ Failed to create product: $product"
        echo "Response: $response"
    fi
    
    sleep 0.5
done

echo ""
echo "🎉 Data seeding completed!"
echo "📊 Fetching all products to verify..."

curl -s "$API_URL/products" | jq '.data[] | {id: .id, name: .name, price: .price, category: .category}' 