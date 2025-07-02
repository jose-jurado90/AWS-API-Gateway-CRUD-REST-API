# ☕ Coffee Shop API - Serverless REST API

A production-ready serverless REST API built with AWS API Gateway, Lambda, and DynamoDB using the Serverless Framework. This Coffee Shop API demonstrates complete CRUD functionality with TypeScript, comprehensive testing, and CI/CD pipeline.

![AWS Architecture](https://img.shields.io/badge/AWS-API_Gateway-orange) ![Lambda](https://img.shields.io/badge/AWS-Lambda-orange) ![DynamoDB](https://img.shields.io/badge/AWS-DynamoDB-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Serverless](https://img.shields.io/badge/Serverless-Framework-red)

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   API Gateway   │────│   AWS Lambda    │────│    DynamoDB     │
│                 │    │                 │    │                 │
│ - REST Endpoints│    │ - 5 Functions   │    │ - Products Table│
│ - CORS Enabled  │    │ - TypeScript    │    │ - Pay-per-request│
│ - Request Valid.│    │ - Error Handling│    │ - Auto Scaling  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### AWS Services Used:
- **AWS API Gateway**: REST API endpoints with CORS
- **AWS Lambda**: Serverless compute for business logic (5 functions)
- **Amazon DynamoDB**: NoSQL database for product storage
- **AWS CloudFormation**: Infrastructure as Code via Serverless Framework
- **AWS IAM**: Secure access management

## ✨ Features

- **🔄 Full CRUD Operations**: Create, Read, Update, Delete products
- **🛡️ Input Validation**: Comprehensive request validation with TypeScript
- **🚀 Serverless Architecture**: Auto-scaling and cost-effective
- **🧪 Comprehensive Testing**: Unit tests, integration tests, and smoke tests
- **🔄 CI/CD Pipeline**: GitHub Actions with multi-stage deployments
- **📊 Multi-Environment**: Separate dev and production environments
- **🏷️ Business Domain**: Coffee shop with realistic product categories
- **📝 TypeScript**: Full type safety and modern JavaScript features
- **🔍 Error Handling**: Structured error responses and logging
- **📖 API Documentation**: Complete endpoint documentation

## 📚 API Documentation

### Base URL
- **Development**: `https://api-id.execute-api.us-east-1.amazonaws.com/dev`
- **Production**: `https://api-id.execute-api.us-east-1.amazonaws.com/prod`

### Endpoints

#### 📝 Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Espresso",
  "description": "Rich and bold espresso shot",
  "price": 2.50,
  "category": "espresso",
  "available": true
}
```

#### 📖 Get All Products
```http
GET /products
```

#### 🔍 Get Product by ID
```http
GET /products/{id}
```

#### ✏️ Update Product
```http
PUT /products/{id}
Content-Type: application/json

{
  "name": "Double Espresso",
  "price": 3.00
}
```

#### 🗑️ Delete Product
```http
DELETE /products/{id}
```

### Product Categories
- `espresso` - Espresso-based drinks
- `coffee` - Regular coffee
- `latte` - Latte variations
- `cappuccino` - Cappuccino variations
- `frappuccino` - Blended drinks
- `tea` - Tea beverages
- `pastry` - Pastries and baked goods
- `sandwich` - Sandwiches and food items

### Response Format
```json
{
  "success": true,
  "data": { /* product data */ },
  "message": "Operation completed successfully"
}
```

## 🚀 Prerequisites

- Node.js 18+ and npm
- AWS CLI configured
- Serverless Framework CLI
- Git

## ⚡ Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coffee-shop-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AWS credentials**
   ```bash
   aws configure
   ```

4. **Deploy to development**
   ```bash
   npm run deploy:dev
   ```

5. **Seed with sample data**
   ```bash
   chmod +x scripts/seed-data.sh
   ./scripts/seed-data.sh dev
   ```

6. **Test the API**
   ```bash
   curl -X GET <api-url>/products
   ```

## 📁 Project Structure

```
coffee-shop-api/
├── src/                          # Source code
│   ├── handlers/                 # Lambda function handlers
│   │   ├── createProduct.ts
│   │   ├── getProduct.ts
│   │   ├── getProducts.ts
│   │   ├── updateProduct.ts
│   │   └── deleteProduct.ts
│   ├── models/                   # TypeScript interfaces
│   │   ├── Product.ts
│   │   └── ApiResponse.ts
│   └── utils/                    # Utility functions
│       ├── dynamodb.ts
│       └── validation.ts
├── tests/                        # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   ├── smoke/                    # Smoke tests
│   └── setup.ts                  # Test configuration
├── scripts/                      # Deployment scripts
│   ├── deploy.sh
│   └── seed-data.sh
├── .github/workflows/            # CI/CD pipeline
│   └── deploy.yml
├── docs/                         # Documentation
│   └── API.md
├── serverless.yml                # Serverless configuration
├── package.json                  # Node.js dependencies
├── tsconfig.json                 # TypeScript configuration
├── jest.config.js                # Test configuration
├── docker-compose.yml            # Local DynamoDB setup
└── README.md                     # Documentation
```

## 🛠️ Development

### Running Locally
```bash
# Install dependencies
npm install

# Start local development server
npm run offline

# Run tests
npm test

# Run only unit tests
npm run test -- --testPathPattern="unit"

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Build TypeScript
npm run build
```

### Local DynamoDB Setup
```bash
# Start local DynamoDB with Docker
docker-compose up -d

# Access DynamoDB Admin UI
open http://localhost:8001
```

## 🧪 Testing

### Test Types
- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints end-to-end (requires deployed API)
- **Smoke Tests**: Basic health checks for production

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test type
npm run test:unit
npm run test:integration
npm run test:smoke

# Run specific test file
npm test -- createProduct.test.ts
```

### Test Coverage
The project maintains high test coverage with:
- Unit tests for all Lambda handlers
- Validation logic testing
- Error handling scenarios
- Integration tests for API endpoints

## 🚀 Deployment

### Manual Deployment
```bash
# Deploy to development
npm run deploy:dev

# Deploy to production
npm run deploy:prod

# Remove deployment
npm run remove:dev
```

### Using Deployment Script
```bash
# Make script executable
chmod +x scripts/deploy.sh

# Deploy with script
./scripts/deploy.sh dev us-east-1
./scripts/deploy.sh prod us-east-1
```

### Environment-Specific Configuration
- **Development**: Auto-deployed on `develop` branch
- **Production**: Auto-deployed on `main` branch with manual approval

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The pipeline includes:
1. **Code Quality Checks**
   - Linting with ESLint
   - TypeScript compilation
   - Unit testing

2. **Development Deployment**
   - Triggered on `develop` and `main` branches
   - Runs integration tests
   - Deploys to AWS dev environment

3. **Production Deployment**
   - Triggered only on `main` branch
   - Requires development deployment success
   - Manual approval gate
   - Runs smoke tests

### Required GitHub Secrets
```bash
# Development
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY

# Production
AWS_ACCESS_KEY_ID_PROD
AWS_SECRET_ACCESS_KEY_PROD
```

### Workflow Status
- ✅ **Test**: Automated testing and linting
- ✅ **Deploy Dev**: Development environment deployment
- ✅ **Deploy Prod**: Production environment deployment

## 🔧 Environment Variables

### Runtime Environment Variables
```bash
PRODUCTS_TABLE=coffee-shop-api-products-{stage}
STAGE={dev|prod}
AWS_REGION=us-east-1
```

### Build-time Variables
```bash
NODE_ENV={development|production}
```

## 📊 Monitoring and Logging

### CloudWatch Logs
- Lambda function logs are automatically sent to CloudWatch
- Log groups: `/aws/lambda/coffee-shop-api-{stage}-{function}`

### Metrics
- API Gateway metrics for request/response monitoring
- Lambda execution metrics
- DynamoDB performance metrics

## 🔒 Security Features

- **IAM Roles**: Least privilege access for Lambda functions
- **CORS**: Properly configured for web applications
- **Input Validation**: Server-side validation for all requests
- **Error Handling**: No sensitive data exposure in error messages

## 🚀 Performance Optimization

- **Lambda Cold Start**: Optimized with esbuild bundling
- **DynamoDB**: Pay-per-request billing for cost efficiency
- **Bundle Size**: Minimized with tree shaking and minification

## 📈 Metrics and Monitoring

### Key Performance Indicators
- API response times
- Error rates
- Lambda execution duration
- DynamoDB read/write capacity

### Cost Optimization
- Pay-per-request DynamoDB billing
- Lambda provisioned concurrency for production
- CloudWatch log retention policies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Write tests for new features
- Follow TypeScript best practices
- Update documentation for API changes
- Use conventional commit messages

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- AWS Serverless Application Model (SAM)
- Serverless Framework community
- TypeScript and Node.js communities

---

## 📺 Video Walkthrough

🎥 **[View Video Demonstration](https://www.loom.com/share/your-video-id)**

The video walkthrough covers:
- Project architecture and design decisions
- Code organization and TypeScript implementation
- Infrastructure as Code with Serverless Framework
- CI/CD pipeline configuration
- Live API demonstration
- Testing strategies and implementation
- Deployment process and monitoring

---

## 🎯 Summary

This Coffee Shop API demonstrates a complete serverless application with:

- **5 Lambda Functions**: Complete CRUD operations
- **TypeScript**: Type-safe development
- **Comprehensive Testing**: Unit, integration, and smoke tests
- **CI/CD Pipeline**: GitHub Actions with multi-stage deployments
- **Infrastructure as Code**: Serverless Framework
- **Production Ready**: Error handling, validation, and monitoring

**Ready to deploy and scale! ☕🚀** 