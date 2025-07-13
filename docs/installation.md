# Installation Guide

This guide will help you set up the Zuasoko platform for development or production use.

## 📋 Prerequisites

### System Requirements

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **PostgreSQL**: Version 13 or higher
- **Git**: Latest version

### Optional Requirements

- **Docker**: For containerized deployment
- **M-Pesa Developer Account**: For payment integration testing

## 🚀 Quick Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/zuasoko.git
cd zuasoko
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/zuasoko"

# Application Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"

# M-Pesa Configuration (Optional for demo)
MPESA_SHORTCODE="174379"
MPESA_PASSKEY="your_mpesa_passkey"
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"

# Environment
NODE_ENV="development"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Create database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## 🗄️ Database Setup

### PostgreSQL Installation

#### macOS (using Homebrew)

```bash
brew install postgresql
brew services start postgresql
createdb zuasoko
```

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb zuasoko
```

#### Windows

1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Follow the installation wizard
3. Create a database named `zuasoko`

### Database Configuration

1. Create a PostgreSQL user and database:

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create user and database
CREATE USER zuasoko_user WITH PASSWORD 'your_password';
CREATE DATABASE zuasoko OWNER zuasoko_user;
GRANT ALL PRIVILEGES ON DATABASE zuasoko TO zuasoko_user;
```

2. Update your `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL="postgresql://zuasoko_user:your_password@localhost:5432/zuasoko"
```

## 🔧 Advanced Configuration

### M-Pesa Integration Setup

1. **Create Safaricom Developer Account**
   - Visit [developer.safaricom.co.ke](https://developer.safaricom.co.ke)
   - Create an account and verify your details

2. **Create M-Pesa App**
   - Navigate to "My Apps" and create a new app
   - Select "Lipa Na M-Pesa Online" API
   - Note your Consumer Key and Consumer Secret

3. **Configure Shortcode and Passkey**
   - For testing, use the sandbox shortcode: `174379`
   - Get your passkey from the M-Pesa portal
   - For production, apply for your own shortcode

4. **Update Environment Variables**
   ```env
   MPESA_SHORTCODE="174379"  # Sandbox shortcode
   MPESA_PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
   MPESA_CONSUMER_KEY="your_consumer_key"
   MPESA_CONSUMER_SECRET="your_consumer_secret"
   ```

### NextAuth Configuration

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

Add it to your `.env.local`:

```env
NEXTAUTH_SECRET="generated_secret_here"
```

## 🐳 Docker Installation

### Using Docker Compose

1. **Create docker-compose.yml**

```yaml
version: "3.8"
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/zuasoko
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: zuasoko
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

2. **Start with Docker Compose**

```bash
docker-compose up -d
```

### Using Docker Only

```bash
# Build the image
docker build -t zuasoko-app .

# Run PostgreSQL container
docker run --name zuasoko-db \
  -e POSTGRES_DB=zuasoko \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Run the application
docker run --name zuasoko-app \
  -p 3000:3000 \
  --link zuasoko-db:db \
  -e DATABASE_URL="postgresql://postgres:password@db:5432/zuasoko" \
  -d zuasoko-app
```

## 🧪 Testing the Installation

### 1. Check Database Connection

```bash
npm run db:studio
```

This opens Prisma Studio at `http://localhost:5555` to view your database.

### 2. Run Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build test
npm run build
```

### 3. Test Core Features

1. **Homepage**: Visit `http://localhost:3000`
2. **Registration**: Try creating a farmer account
3. **Marketplace**: Browse products at `/marketplace`
4. **Admin Panel**: Access admin features at `/admin/dashboard`

## 🛠️ Development Tools

### Recommended VS Code Extensions

- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Prisma
- ES7+ React/Redux/React-Native snippets
- GitLens

### Useful npm Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Database Connection Error

```
Error: P1001: Can't reach database server
```

**Solution**:

- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env.local`
- Verify database credentials

#### 2. Prisma Client Not Generated

```
Error: @prisma/client did not initialize properly
```

**Solution**:

```bash
npm run db:generate
```

#### 3. Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

**Solution**:

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

#### 4. M-Pesa Integration Issues

- Verify your credentials are correct
- Check if you're using sandbox vs production endpoints
- Ensure your callback URL is accessible

### Getting Help

If you encounter issues not covered here:

1. Check the [Troubleshooting Guide](./troubleshooting.md)
2. Search [GitHub Issues](https://github.com/your-org/zuasoko/issues)
3. Create a new issue with detailed error information

## ✅ Next Steps

After successful installation:

1. Read the [User Guide](./user-guide.md) to understand platform features
2. Check the [Development Guide](./development.md) if you plan to contribute
3. Review the [API Documentation](./api.md) for backend integration
4. Set up [Deployment](./deployment.md) for production use

---

🎉 **Congratulations!** Your Zuasoko installation is complete.
