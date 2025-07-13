# Vercel + Neon Deployment Guide

Complete step-by-step guide to deploy Zuasoko to production using Vercel for hosting and Neon for PostgreSQL database.

## 🎯 Deployment Overview

**Stack:**

- ☁️ **Frontend/Backend**: Vercel (Next.js optimized)
- 🗄️ **Database**: Neon PostgreSQL (serverless)
- 💰 **Cost**: $0-20/month
- ⏱️ **Setup Time**: ~30 minutes
- 🔧 **Maintenance**: Minimal

**Benefits:**

- ✅ Zero-config deployment
- ✅ Automatic SSL certificates
- ✅ Global CDN
- ✅ Serverless scaling
- ✅ Built-in analytics
- ✅ Git-based deployments

## 📋 Prerequisites

Before starting, ensure you have:

- [x] GitHub account
- [x] Zuasoko project ready locally
- [x] Git installed and configured
- [x] Valid email for account creation

## 🔶 Step 1: Set Up Neon Database (5 minutes)

### 1.1 Create Neon Account

1. **Visit Neon**: Go to [console.neon.tech](https://console.neon.tech)
2. **Sign Up**: Use GitHub login (recommended) or email
3. **Verify Account**: Check email for verification if needed

### 1.2 Create Database Project

1. **Click "Create Project"**
2. **Configure Project**:
   ```
   Project Name: zuasoko-production
   Database Name: zuasoko
   Region: Choose closest to your users
   PostgreSQL Version: 15 (default)
   ```
3. **Click "Create Project"**

### 1.3 Get Connection Details

After project creation, you'll see:

```bash
# Connection String (copy this!)
postgresql://username:password@ep-cool-bonus-123456.us-east-1.aws.neon.tech/zuasoko?sslmode=require

# Direct URL (for Prisma)
postgresql://username:password@ep-cool-bonus-123456.us-east-1.aws.neon.tech/zuasoko?sslmode=require&pgbouncer=true&connect_timeout=15
```

**Important**: Save both URLs - you'll need them for environment variables.

### 1.4 Database Security Setup

1. **Connection Security**: Already configured with SSL
2. **IP Allowlist**: Default allows all IPs (modify if needed)
3. **Password**: Auto-generated (secure by default)

## 🐙 Step 2: Prepare GitHub Repository (3 minutes)

### 2.1 Initialize Git (if not done)

```bash
# Check if git is initialized
git status

# If not initialized:
git init
git add .
git commit -m "Initial commit: Zuasoko platform ready for deployment"
```

### 2.2 Create GitHub Repository

1. **Go to GitHub**: [github.com/new](https://github.com/new)
2. **Repository Settings**:
   ```
   Repository Name: zuasoko
   Description: AI-powered agricultural platform
   Visibility: Private (recommended) or Public
   Initialize: NO (you have existing code)
   ```
3. **Click "Create repository"**

### 2.3 Push to GitHub

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/zuasoko.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Verify**: Check that your code appears on GitHub.

## 🔷 Step 3: Deploy to Vercel (8 minutes)

### 3.1 Create Vercel Account

1. **Visit Vercel**: Go to [vercel.com](https://vercel.com)
2. **Sign Up**: Use GitHub account (recommended)
3. **Authorize**: Allow Vercel to access your repositories

### 3.2 Import Project

1. **Dashboard**: Click "New Project"
2. **Import Repository**:
   - Find your `zuasoko` repository
   - Click "Import"
3. **Configure Project**:
   ```
   Project Name: zuasoko-production
   Framework Preset: Next.js (auto-detected)
   Root Directory: ./ (default)
   ```

### 3.3 Environment Variables Setup

**Before deploying**, click "Environment Variables" and add:

#### Database Configuration

```env
DATABASE_URL=postgresql://username:password@ep-cool-bonus-123456.us-east-1.aws.neon.tech/zuasoko?sslmode=require
```

#### App Configuration

```env
NEXT_PUBLIC_APP_URL=https://your-project-name.vercel.app
NEXTAUTH_URL=https://your-project-name.vercel.app
NEXTAUTH_SECRET=your-generated-secret-here
NODE_ENV=production
```

#### M-Pesa Configuration (Sandbox for testing)

```env
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_CONSUMER_KEY=your_sandbox_consumer_key
MPESA_CONSUMER_SECRET=your_sandbox_consumer_secret
```

### 3.4 Generate NEXTAUTH_SECRET

```bash
# Run locally to generate secure secret
openssl rand -base64 32

# Example output:
# K8yZkGjz4bvP2wX9rQ5tE1mN6sL3dF8xC7vB0nM4pQ=

# Copy this to NEXTAUTH_SECRET environment variable
```

### 3.5 Deploy

1. **Click "Deploy"**
2. **Wait for Build**: Usually takes 2-3 minutes
3. **View Deployment**: You'll get a URL like `https://zuasoko-production.vercel.app`

### 3.6 Verify Build Success

**Check build logs**:

- ✅ Dependencies installed
- ✅ TypeScript compiled
- ✅ Next.js build completed
- ✅ Functions deployed

## 🗄️ Step 4: Database Setup (5 minutes)

### 4.1 Install Vercel CLI

```bash
# Install globally
npm install -g vercel

# Verify installation
vercel --version
```

### 4.2 Link Local Project

```bash
# In your project directory
vercel link

# Follow prompts:
# ? Set up "~/zuasoko"? [Y/n] y
# ? Which scope? Your Username
# ? Link to existing project? [Y/n] y
# ? What's the name of your existing project? zuasoko-production
```

### 4.3 Pull Environment Variables

```bash
# Download production environment variables
vercel env pull .env.production

# This creates .env.production with your production variables
```

### 4.4 Run Database Migrations

```bash
# Use production database URL
cp .env.production .env.local

# Generate Prisma client
npm run db:generate

# Push schema to production database
npm run db:push

# Seed database with initial data
npm run db:seed
```

### 4.5 Verify Database

```bash
# Test database connection
npm run db:studio

# This opens Prisma Studio pointing to your production database
# Verify tables were created and seeded correctly
```

## ✅ Step 5: Test Deployment (5 minutes)

### 5.1 Functional Testing

Visit your deployed URL and test:

#### Homepage

- [ ] **URL**: `https://your-app.vercel.app`
- [ ] **Logo**: Zuasoko logo displays correctly
- [ ] **Navigation**: All links work
- [ ] **Mobile**: Responsive design

#### Authentication

- [ ] **Registration**: Try creating accounts
- [ ] **Login**: Test login functionality
- [ ] **Roles**: Test different user roles

#### Core Features

- [ ] **Marketplace**: `/marketplace` loads products
- [ ] **Farmer Portal**: `/farmer/dashboard` accessible
- [ ] **Admin Portal**: `/admin/dashboard` loads
- [ ] **Mobile PWA**: Install option appears

#### API Endpoints

- [ ] **Health Check**: Visit `/api/health`
- [ ] **Database**: User registration creates database records
- [ ] **Payments**: M-Pesa test flow (sandbox)

### 5.2 Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse https://your-app.vercel.app --view

# Check Core Web Vitals:
# - First Contentful Paint < 1.8s
# - Largest Contentful Paint < 2.5s
# - First Input Delay < 100ms
```

### 5.3 PWA Testing

1. **Mobile Browser**: Open on phone
2. **Install Prompt**: Should appear automatically
3. **Installation**: Test "Add to Home Screen"
4. **Offline**: Test offline functionality

## 🔧 Step 6: Post-Deployment Configuration (5 minutes)

### 6.1 Custom Domain (Optional)

1. **In Vercel Dashboard**:
   - Go to Project Settings
   - Click "Domains"
   - Add your domain: `www.zuasoko.com`

2. **DNS Configuration**:

   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **SSL**: Automatically provided by Vercel

### 6.2 Production M-Pesa Setup

For production use, replace sandbox credentials:

```env
# Production M-Pesa (requires Safaricom approval)
MPESA_SHORTCODE=your_production_shortcode
MPESA_PASSKEY=your_production_passkey
MPESA_CONSUMER_KEY=your_production_consumer_key
MPESA_CONSUMER_SECRET=your_production_consumer_secret
```

### 6.3 Monitoring Setup

1. **Vercel Analytics**: Automatically enabled
2. **Error Tracking**: Consider adding Sentry
3. **Uptime Monitoring**: Set up with UptimeRobot

### 6.4 Backup Strategy

1. **Database Backups**: Neon provides automatic backups
2. **Code Backups**: GitHub serves as backup
3. **Environment Variables**: Document securely

## 📊 Monitoring & Maintenance

### Vercel Analytics

Access via Vercel Dashboard:

- Real-time performance metrics
- Geographic usage data
- Core Web Vitals tracking
- Function execution stats

### Database Monitoring

Neon Console provides:

- Connection metrics
- Query performance
- Storage usage
- Backup status

### Ongoing Maintenance

#### Weekly Tasks

- [ ] Check application performance
- [ ] Review error logs
- [ ] Monitor database usage

#### Monthly Tasks

- [ ] Update dependencies
- [ ] Review analytics
- [ ] Check security updates

#### Quarterly Tasks

- [ ] Database optimization
- [ ] Performance audit
- [ ] Security review

## 💰 Cost Management

### Free Tier Limits

**Vercel (Hobby)**:

- 100GB bandwidth/month
- 100GB-hrs execution time
- 12 functions per deployment
- 5MB function size

**Neon (Free)**:

- 3GB storage
- 1 database
- 10 hours compute/month

### Scaling Costs

**When you exceed free tier**:

**Vercel Pro ($20/month)**:

- 1TB bandwidth
- 1000GB-hrs execution
- Advanced analytics
- Team features

**Neon Pro ($19/month)**:

- 20GB storage
- Unlimited compute time
- Multiple databases
- Advanced features

### Cost Optimization Tips

1. **Image Optimization**: Use Next.js Image component
2. **Code Splitting**: Implement dynamic imports
3. **Database Queries**: Optimize with Prisma
4. **Caching**: Use Vercel Edge Network

## 🚨 Troubleshooting

### Common Build Errors

#### Error: "Module not found"

```bash
# Solution: Check dependencies
npm install
npm run build
```

#### Error: "Environment variable missing"

```bash
# Solution: Verify all required env vars are set in Vercel
# Check: DATABASE_URL, NEXTAUTH_SECRET, etc.
```

#### Error: "Database connection failed"

```bash
# Solution: Verify Neon connection string
# Test locally first:
DATABASE_URL="your_neon_url" npm run db:studio
```

### Database Issues

#### Error: "Table doesn't exist"

```bash
# Solution: Run migrations
npm run db:push
npm run db:seed
```

#### Error: "Connection timeout"

```bash
# Solution: Check Neon dashboard for issues
# Verify connection string format
```

### Performance Issues

#### Slow page loads

1. Check Vercel Function logs
2. Optimize database queries
3. Enable caching
4. Compress images

#### High database usage

1. Review query patterns
2. Add database indexes
3. Implement connection pooling

## 🔐 Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files
- ✅ Use strong secrets
- ✅ Rotate keys regularly
- ✅ Limit access permissions

### Database Security

- ✅ SSL connections (Neon default)
- ✅ Strong passwords (auto-generated)
- ✅ Regular backups
- ✅ Monitor access logs

### Application Security

- ✅ Input validation
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Error handling

## 📚 Additional Resources

### Documentation

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)

### Support

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Neon Support**: [neon.tech/docs/introduction/support](https://neon.tech/docs/introduction/support)
- **Community**: [GitHub Discussions](https://github.com/your-username/zuasoko/discussions)

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Code tested locally
- [ ] Git repository created
- [ ] Environment variables documented
- [ ] Database schema finalized

### Deployment

- [ ] Neon database created
- [ ] GitHub repository pushed
- [ ] Vercel project imported
- [ ] Environment variables configured
- [ ] Initial deployment successful

### Post-Deployment

- [ ] Database migrations run
- [ ] Functional testing completed
- [ ] Performance audit passed
- [ ] Monitoring configured
- [ ] Documentation updated

### Production Ready

- [ ] Custom domain configured (optional)
- [ ] M-Pesa production setup
- [ ] Backup strategy implemented
- [ ] Team access configured

---

🎉 **Congratulations!** Your Zuasoko platform is now live and serving users globally with enterprise-grade infrastructure.

**Next Steps**: Monitor usage, gather user feedback, and iterate based on real-world usage patterns.
