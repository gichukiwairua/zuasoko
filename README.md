# Zuasoko - Empowering Farmers with AI 🌱

> AI-powered agri-tech platform connecting farmers directly to consumers

![Zuasoko Logo](https://cdn.builder.io/api/v1/image/assets%2F36ce27fc004b41f8b60187584af31eda%2Fb55ec5e832e54191b9a5618c290a66ad?format=webp&width=200)

## 🚀 Overview

Zuasoko is a comprehensive agricultural technology platform that bridges the gap between farmers and consumers through direct trade, AI-powered insights, and mobile-first design. The platform empowers smallholder farmers with modern tools while providing consumers access to fresh, traceable produce.

### ✨ Key Features

- **🌾 Farmer Portal**: Consignment management, GPS location tracking, price negotiations
- **🛒 Marketplace**: Direct farmer-to-consumer produce trading
- **📱 Mobile PWA**: Native app experience on iOS and Android
- **💰 M-Pesa Integration**: KES 300 farmer activation fee with STK push
- **👨‍💼 Admin Dashboard**: Complete user, order, and subscription management
- **🚛 Driver Management**: Delivery coordination and tracking
- **🤖 AI Recommendations**: Smart farming insights and market predictions
- **📊 Analytics**: Comprehensive reporting and business intelligence

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Payment**: M-Pesa Daraja API
- **PWA**: Service Workers, Web App Manifest
- **Deployment**: Vercel/Docker ready

## 📱 Mobile App Installation

Zuasoko works as a Progressive Web App (PWA) that can be installed on mobile devices:

### Android Installation

1. Open Zuasoko in **Chrome**
2. Look for "Install app" popup
3. Tap "Install" or "Add to Home Screen"
4. Enjoy the native app experience!

### iOS Installation

1. Open Zuasoko in **Safari**
2. Tap the Share button
3. Select "Add to Home Screen"
4. Tap "Add" to install!

## 🚦 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- M-Pesa Daraja API credentials (optional for demo)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd zuasoko-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up the database
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 👥 User Roles & Access

### 🌾 Farmers

- **Registration**: KES 300 activation fee via M-Pesa
- **Features**: Submit consignments, manage pricing, track orders
- **Access**: `/farmer/dashboard`

### 🛒 Customers

- **Registration**: Free account creation
- **Features**: Browse marketplace, place orders, track deliveries
- **Access**: `/marketplace`

### 🚛 Drivers

- **Registration**: Admin approval required
- **Features**: View delivery assignments, update status
- **Access**: `/driver/dashboard`

### 👨‍💼 Admins

- **Access**: `/admin/dashboard`
- **Features**:
  - User management and subscription control
  - Consignment approval workflow
  - Payment initiation (STK push)
  - Analytics and reporting

## 🔐 Authentication & Payment

### Farmer Activation Process

1. Farmer registers with basic information
2. System redirects to payment page
3. KES 300 M-Pesa STK push initiated
4. Real-time payment status tracking
5. Account activated upon successful payment

### Admin Payment Management

- View all farmer subscriptions
- Initiate STK push for pending accounts
- Track payment status and revenue
- Generate payment reports

## 📖 Documentation

Detailed documentation is available in the `/docs` folder:

- [**Installation Guide**](./docs/installation.md) - Complete setup instructions
- [**User Manual**](./docs/user-guide.md) - How to use each feature
- [**Admin Guide**](./docs/admin-guide.md) - Administrative functions
- [**API Documentation**](./docs/api.md) - Backend API reference
- [**Deployment Guide**](./docs/deployment.md) - Production deployment
- [**Development Guide**](./docs/development.md) - Contributing guidelines

## 🌟 Core Features

### Farmer Consignments

- GPS location capture for farm verification
- Price suggestion and negotiation system
- Photo uploads and product descriptions
- Status tracking from submission to approval

### Marketplace

- Real-time product search and filtering
- Shopping cart with persistent state
- County-based farmer filtering
- Mobile-optimized product cards

### Admin Dashboard

- Comprehensive user management
- Subscription and payment tracking
- Order analytics and reporting
- Driver performance monitoring

### Mobile PWA

- Offline functionality
- Push notifications
- Native app installation
- Cross-platform compatibility

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zuasoko"

# M-Pesa Configuration
MPESA_SHORTCODE="174379"
MPESA_PASSKEY="your_passkey_here"
MPESA_CONSUMER_KEY="your_consumer_key"
MPESA_CONSUMER_SECRET="your_consumer_secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_secret"
```

### Database Schema

The application uses Prisma ORM with PostgreSQL. Key models include:

- **User**: Core user authentication and profiles
- **Farmer**: Farm-specific data and location
- **Produce**: Product listings and consignments
- **Order**: Customer orders and transactions
- **Payment**: M-Pesa payment tracking

## 📊 Analytics & Reporting

### Admin Analytics Dashboard

- Total orders and revenue tracking
- Daily/monthly sales trends
- Top-performing farmers and products
- Geographic distribution of sales
- Customer acquisition metrics

### Farmer Insights

- Individual sales performance
- Price optimization suggestions
- Market demand trends
- Seasonal planning recommendations

## 🚀 Deployment

### Production Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

### Docker Deployment

```dockerfile
# Use the provided Dockerfile
docker build -t zuasoko-app .
docker run -p 3000:3000 zuasoko-app
```

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Email**: support@zuasoko.com
- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/zuasoko/issues)

## 🏆 Acknowledgments

- Built with Next.js and TypeScript
- UI components styled with Tailwind CSS
- Icons by Lucide React
- M-Pesa integration via Daraja API
- Progressive Web App capabilities

---

**Zuasoko** - _Empowering smallholder farmers through technology_ 🌱
