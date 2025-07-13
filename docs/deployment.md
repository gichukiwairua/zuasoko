# Deployment Guide

Complete guide for deploying the Zuasoko platform to production environments.

## 🚀 Deployment Overview

Zuasoko can be deployed using various methods depending on your infrastructure preferences and requirements.

### Supported Platforms

- **Vercel** (Recommended for Next.js)
- **Docker** (Self-hosted)
- **VPS/Cloud** (Manual deployment)
- **AWS/GCP/Azure** (Cloud providers)

## 🌐 Vercel Deployment (Recommended)

Vercel provides the best experience for Next.js applications with automatic deployments, edge functions, and CDN.

### Prerequisites

- Vercel account
- GitHub repository
- PostgreSQL database (Neon, Supabase, or PlanetScale)

### Step 1: Prepare Repository

```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Environment Configuration

Create production environment variables in Vercel dashboard:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/zuasoko_prod"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.vercel.app"

# M-Pesa Production Configuration
MPESA_SHORTCODE="your_production_shortcode"
MPESA_PASSKEY="your_production_passkey"
MPESA_CONSUMER_KEY="your_production_consumer_key"
MPESA_CONSUMER_SECRET="your_production_consumer_secret"

# Environment
NODE_ENV="production"
```

### Step 3: Deploy to Vercel

#### Option A: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: GitHub Integration

1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy automatically

### Step 4: Database Setup

```bash
# Run database migrations on production
npx prisma migrate deploy

# Generate Prisma client for production
npx prisma generate
```

### Step 5: Custom Domain (Optional)

1. Add custom domain in Vercel dashboard
2. Configure DNS records
3. SSL certificate automatically provided

## 🐳 Docker Deployment

Deploy using Docker containers for more control over the environment.

### Prerequisites

- Docker and Docker Compose
- PostgreSQL database
- Domain name and SSL certificate

### Step 1: Build Docker Image

Create `Dockerfile`:

```dockerfile
# Use official Node.js runtime
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
USER nextjs

# Expose port
EXPOSE 3000

# Set environment
ENV PORT 3000
ENV NODE_ENV production

# Start application
CMD ["node", "server.js"]
```

### Step 2: Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: "3.8"

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/zuasoko
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - MPESA_SHORTCODE=${MPESA_SHORTCODE}
      - MPESA_PASSKEY=${MPESA_PASSKEY}
      - MPESA_CONSUMER_KEY=${MPESA_CONSUMER_KEY}
      - MPESA_CONSUMER_SECRET=${MPESA_CONSUMER_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: zuasoko
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Step 3: Nginx Configuration

Create `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### Step 4: Deploy with Docker

```bash
# Create environment file
cp .env.example .env.production

# Build and start services
docker-compose up -d

# Run database migrations
docker-compose exec app npx prisma migrate deploy

# Seed database
docker-compose exec app npm run db:seed
```

## ☁️ Cloud Provider Deployment

### AWS Deployment

#### Using AWS ECS with Fargate

1. **Create ECR Repository**:

```bash
aws ecr create-repository --repository-name zuasoko-app
```

2. **Push Docker Image**:

```bash
# Build and tag image
docker build -t zuasoko-app .
docker tag zuasoko-app:latest <account-id>.dkr.ecr.<region>.amazonaws.com/zuasoko-app:latest

# Push to ECR
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/zuasoko-app:latest
```

3. **Create ECS Cluster and Service**:

```bash
# Create cluster
aws ecs create-cluster --cluster-name zuasoko-cluster

# Create task definition (JSON file)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service --cluster zuasoko-cluster --service-name zuasoko-service --task-definition zuasoko-app:1 --desired-count 2
```

#### Using AWS Lambda (Serverless)

1. **Install Serverless Framework**:

```bash
npm install -g serverless
npm install serverless-nextjs-plugin
```

2. **Configure `serverless.yml`**:

```yaml
service: zuasoko-app

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

plugins:
  - serverless-nextjs-plugin

custom:
  serverlessNextjs:
    routes:
      - src: /api/**
        dest: api/index.js
```

3. **Deploy**:

```bash
serverless deploy
```

### Google Cloud Platform

#### Using Cloud Run

1. **Build and Push to Container Registry**:

```bash
# Build image
docker build -t gcr.io/your-project/zuasoko-app .

# Push to GCR
docker push gcr.io/your-project/zuasoko-app
```

2. **Deploy to Cloud Run**:

```bash
gcloud run deploy zuasoko-app \
  --image gcr.io/your-project/zuasoko-app \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Microsoft Azure

#### Using Container Instances

```bash
# Create resource group
az group create --name zuasoko-rg --location eastus

# Create container instance
az container create \
  --resource-group zuasoko-rg \
  --name zuasoko-app \
  --image your-registry/zuasoko-app:latest \
  --dns-name-label zuasoko-app \
  --ports 3000
```

## 🗄️ Database Deployment

### Managed Database Services

#### Neon (Recommended)

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Update `DATABASE_URL` environment variable

#### Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Get PostgreSQL connection string
3. Update environment variables

#### PlanetScale

1. Create database at [planetscale.com](https://planetscale.com)
2. Generate connection string
3. Configure prisma for PlanetScale

#### Railway

1. Create PostgreSQL service at [railway.app](https://railway.app)
2. Copy connection string
3. Update environment variables

### Self-Hosted Database

#### PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE zuasoko_prod;
CREATE USER zuasoko_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE zuasoko_prod TO zuasoko_user;
```

#### Database Security

```sql
-- Enable SSL
ALTER SYSTEM SET ssl = on;

-- Set password encryption
ALTER SYSTEM SET password_encryption = 'scram-sha-256';

-- Configure connection limits
ALTER SYSTEM SET max_connections = 100;

-- Restart PostgreSQL to apply changes
```

## 🔐 SSL/TLS Configuration

### Using Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Using Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL/TLS encryption
4. Configure security settings

## 📊 Monitoring & Logging

### Application Monitoring

#### Vercel Analytics

- Built-in analytics for Vercel deployments
- Performance monitoring
- Error tracking

#### Sentry Error Tracking

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

#### Uptime Monitoring

- **UptimeRobot**: Free uptime monitoring
- **Pingdom**: Advanced monitoring features
- **StatusCake**: Multiple monitoring locations

### Log Management

#### Using Winston (Node.js)

```javascript
// lib/logger.js
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  );
}

export default logger;
```

#### Log Aggregation

- **LogRocket**: Session replay and logging
- **Datadog**: Comprehensive monitoring
- **New Relic**: Application performance monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

### Environment Variables in CI/CD

Store sensitive variables in:

- **GitHub Secrets** (for GitHub Actions)
- **Vercel Environment Variables**
- **Docker Secrets** (for Docker deployments)

## 💰 M-Pesa Production Setup

### Safaricom Production Requirements

1. **Business Registration**:
   - Valid business license
   - KRA PIN certificate
   - Bank account details

2. **M-Pesa Go-Live Process**:
   - Complete integration testing
   - Submit go-live application
   - Provide test results
   - Wait for approval (2-4 weeks)

3. **Production Configuration**:

```env
MPESA_SHORTCODE="your_production_shortcode"
MPESA_PASSKEY="your_production_passkey"
MPESA_CONSUMER_KEY="production_consumer_key"
MPESA_CONSUMER_SECRET="production_consumer_secret"
MPESA_ENVIRONMENT="production"
```

### Testing Production Setup

```bash
# Test M-Pesa integration
curl -X POST https://your-domain.com/api/payments/stk-push \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+254700000000",
    "amount": 1,
    "description": "Test payment"
  }'
```

## 🔧 Performance Optimization

### Next.js Optimizations

1. **Enable Static Generation**:

```javascript
// next.config.js
module.exports = {
  output: "standalone",
  experimental: {
    outputStandalone: true,
  },
  images: {
    domains: ["cdn.builder.io"],
  },
};
```

2. **Optimize Images**:

```javascript
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={300}
  priority={true}
/>;
```

3. **Code Splitting**:

```javascript
import dynamic from "next/dynamic";

const DynamicComponent = dynamic(() => import("../components/Heavy"), {
  loading: () => <p>Loading...</p>,
});
```

### Database Optimizations

1. **Connection Pooling**:

```javascript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["dataProxy"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

2. **Query Optimization**:

```javascript
// Efficient queries with Prisma
const products = await prisma.produce.findMany({
  where: { isAvailable: true },
  include: {
    farmer: {
      select: {
        county: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    },
  },
  take: 20,
  skip: page * 20,
});
```

### CDN Configuration

#### Vercel CDN (Automatic)

- Automatic edge caching
- Global distribution
- Image optimization

#### Cloudflare CDN

1. Add domain to Cloudflare
2. Enable caching rules
3. Configure page rules
4. Optimize images

## 🚨 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Build locally first
npm run build
```

#### Database Connection Issues

```bash
# Test database connection
npx prisma db pull

# Reset database
npx prisma migrate reset

# Generate client
npx prisma generate
```

#### Environment Variable Issues

- Verify all required variables are set
- Check for typos in variable names
- Ensure production values are different from development

### Performance Issues

1. **Monitor Core Web Vitals**
2. **Optimize database queries**
3. **Use CDN for static assets**
4. **Enable compression**
5. **Implement caching strategies**

## ✅ Post-Deployment Checklist

### Functional Testing

- [ ] User registration works
- [ ] Login/logout functionality
- [ ] M-Pesa payments process correctly
- [ ] Marketplace displays products
- [ ] Admin dashboard loads
- [ ] Mobile PWA installation works

### Performance Testing

- [ ] Page load times < 3 seconds
- [ ] API response times < 500ms
- [ ] Database queries optimized
- [ ] CDN serving static assets

### Security Testing

- [ ] SSL certificate valid
- [ ] No sensitive data in client-side code
- [ ] API endpoints properly secured
- [ ] Rate limiting configured

### Monitoring Setup

- [ ] Error tracking enabled
- [ ] Uptime monitoring configured
- [ ] Performance monitoring active
- [ ] Log aggregation working

---

🚀 **Deployment Complete**: Your Zuasoko platform is now live and ready to serve users!
