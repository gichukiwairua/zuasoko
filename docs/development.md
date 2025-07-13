# Development Guide

Complete guide for developers contributing to the Zuasoko platform.

## 🛠️ Development Environment

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher
- **PostgreSQL**: Version 13 or higher
- **Git**: Latest version
- **Code Editor**: VS Code recommended

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "ms-vsliveshare.vsliveshare",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Development Setup

```bash
# Clone repository
git clone https://github.com/your-org/zuasoko.git
cd zuasoko

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Database setup
npm run db:generate
npm run db:push
npm run db:seed

# Start development server
npm run dev
```

## 🏗️ Project Structure

```
zuasoko/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Auth route group
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── farmer/            # Farmer portal
│   ├── customer/          # Customer interface
│   ├── marketplace/       # Public marketplace
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── admin/             # Admin-specific components
│   ├── ai/                # AI-related components
│   ├── cart/              # Shopping cart
│   └── ui/                # Generic UI components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── prisma/                # Database schema and migrations
├── public/                # Static assets
├── docs/                  # Documentation
└── types/                 # TypeScript type definitions
```

## 📋 Development Workflow

### Branch Strategy

```bash
main            # Production-ready code
├── develop     # Integration branch
├── feature/*   # Feature branches
├── hotfix/*    # Production hotfixes
└── release/*   # Release preparation
```

### Feature Development Workflow

1. **Create Feature Branch**:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/farmer-location-tracking
```

2. **Development**:

```bash
# Make changes
# Run tests
npm run lint
npm run type-check
npm run build

# Commit changes
git add .
git commit -m "feat: add GPS location tracking for farmers"
```

3. **Push and Create PR**:

```bash
git push origin feature/farmer-location-tracking
# Create Pull Request on GitHub
```

### Commit Message Convention

Follow Conventional Commits specification:

```
type(scope): description

feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

Examples:

```
feat(farmer): add GPS location capture for consignments
fix(payment): resolve STK push timeout issues
docs(api): update payment endpoint documentation
refactor(auth): simplify user registration flow
```

## 🧪 Testing Strategy

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **MSW**: API mocking

### Unit Testing

Create test files alongside components:

```typescript
// components/cart/CartButton.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider } from '@/contexts/CartContext';
import CartButton from './CartButton';

describe('CartButton', () => {
  it('displays cart item count', () => {
    render(
      <CartProvider>
        <CartButton />
      </CartProvider>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('opens cart sidebar when clicked', () => {
    render(
      <CartProvider>
        <CartButton />
      </CartProvider>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
  });
});
```

### API Testing

```typescript
// pages/api/consignments.test.ts
import { createMocks } from "node-mocks-http";
import handler from "./consignments";

describe("/api/consignments", () => {
  it("creates a new consignment", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        productName: "Test Product",
        category: "Vegetables",
        quantity: 10,
        pricePerUnit: 100,
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toMatchObject({
      success: true,
      message: "Consignment created successfully",
    });
  });
});
```

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🎨 UI/UX Development

### Design System

#### Color Palette

```css
/* Primary Colors */
--primary-50: #f0fdf4;
--primary-100: #dcfce7;
--primary-500: #22c55e;
--primary-600: #16a34a;
--primary-700: #15803d;

/* Semantic Colors */
--success: #059669;
--warning: #d97706;
--error: #dc2626;
--info: #2563eb;
```

#### Typography

```css
/* Font Families */
--font-sans: "Inter", system-ui, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
```

#### Component Classes

```css
/* Button Styles */
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
}

.btn-secondary {
  @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200;
}

/* Form Styles */
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

/* Card Styles */
.card {
  @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
}
```

### Responsive Design

#### Breakpoints

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};
```

#### Mobile-First Approach

```jsx
// Example responsive component
<div
  className="
  w-full 
  px-4 sm:px-6 lg:px-8 
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 
  gap-4 lg:gap-6
"
>
  {products.map((product) => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## 🔌 API Development

### API Route Structure

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request validation schema
const CreateItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = CreateItemSchema.parse(body);

    // Business logic
    const item = await createItem(validatedData);

    return NextResponse.json(
      {
        success: true,
        data: item,
        message: "Item created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests
}
```

### Database Operations

#### Prisma Best Practices

```typescript
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

#### Efficient Queries

```typescript
// Good: Selective field inclusion
const users = await prisma.user.findMany({
  select: {
    id: true,
    firstName: true,
    lastName: true,
    farmer: {
      select: {
        county: true,
      },
    },
  },
  where: {
    status: "ACTIVE",
  },
  take: 20,
});

// Good: Batch operations
const updateResults = await prisma.$transaction([
  prisma.user.update({ where: { id: "1" }, data: { status: "ACTIVE" } }),
  prisma.farmer.update({ where: { userId: "1" }, data: { verified: true } }),
]);
```

### Error Handling

```typescript
// lib/errors.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

// utils/errorHandler.ts
export function handleApiError(error: unknown) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation error",
        message: error.message,
        field: error.field,
      },
      { status: 400 },
    );
  }

  if (error instanceof AuthenticationError) {
    return NextResponse.json(
      {
        success: false,
        error: "Authentication error",
        message: error.message,
      },
      { status: 401 },
    );
  }

  // Log unexpected errors
  console.error("Unexpected error:", error);

  return NextResponse.json(
    {
      success: false,
      error: "Internal server error",
    },
    { status: 500 },
  );
}
```

## 🔐 Security Best Practices

### Input Validation

```typescript
import { z } from "zod";

// Phone number validation
const PhoneSchema = z.string().regex(/^(\+254|254|0)?[17]\d{8}$/, {
  message: "Invalid Kenyan phone number format",
});

// Price validation
const PriceSchema = z.number().min(0.01).max(1000000);

// File upload validation
const ImageSchema = z.object({
  type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size: z.number().max(5 * 1024 * 1024), // 5MB max
});
```

### Authentication Middleware

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    try {
      const payload = await verifyJWT(token);
      if (payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

### Data Sanitization

```typescript
// lib/sanitize.ts
import DOMPurify from "dompurify";

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9.-]/g, "_");
}

export function formatPhoneNumber(phone: string): string {
  // Convert to international format
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "254" + cleaned.substring(1);
  }
  if (cleaned.startsWith("254")) {
    return cleaned;
  }
  return "254" + cleaned;
}
```

## 📱 PWA Development

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = "zuasoko-v1";
const urlsToCache = [
  "/",
  "/marketplace",
  "/manifest.json",
  "/icons/icon-192x192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    }),
  );
});
```

### Web App Manifest

```json
{
  "name": "Zuasoko - Empowering Farmers",
  "short_name": "Zuasoko",
  "description": "AI-powered agri-tech platform",
  "start_url": "/?utm_source=pwa",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## 📊 Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('./AdminDashboard'), {
  loading: () => <div>Loading dashboard...</div>,
  ssr: false,
});

// Conditional loading
const ChatWidget = dynamic(() => import('./ChatWidget'), {
  ssr: false,
});
```

### Image Optimization

```jsx
import Image from "next/image";

// Optimized images
<Image
  src="/farmer-photo.jpg"
  alt="Farmer"
  width={500}
  height={300}
  priority={true} // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
/>;
```

### Database Optimization

```typescript
// Pagination with cursor
async function getProducts(cursor?: string, limit = 20) {
  return prisma.produce.findMany({
    take: limit,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: "desc" },
  });
}

// Aggregation queries
async function getOrderStats() {
  return prisma.order.aggregate({
    _sum: { total: true },
    _count: { id: true },
    _avg: { total: true },
    where: {
      createdAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
  });
}
```

## 🔧 Code Quality

### ESLint Configuration

```json
{
  "extends": ["next/core-web-vitals", "@typescript-eslint/recommended"],
  "rules": {
    "prefer-const": "error",
    "no-var": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## 🚀 Deployment Preparation

### Pre-deployment Checklist

```bash
# Code quality checks
npm run lint
npm run type-check
npm run test

# Build verification
npm run build

# Security audit
npm audit

# Bundle analysis
npm run analyze
```

### Environment Configuration

```typescript
// lib/config.ts
const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  mpesa: {
    shortcode: process.env.MPESA_SHORTCODE!,
    passkey: process.env.MPESA_PASSKEY!,
    consumerKey: process.env.MPESA_CONSUMER_KEY!,
    consumerSecret: process.env.MPESA_CONSUMER_SECRET!,
  },
  app: {
    url: process.env.NEXT_PUBLIC_APP_URL!,
    environment: process.env.NODE_ENV!,
  },
};

// Validate required environment variables
function validateConfig() {
  const required = ["DATABASE_URL", "MPESA_SHORTCODE", "NEXTAUTH_SECRET"];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

validateConfig();

export default config;
```

## 📚 Learning Resources

### Next.js Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js Examples](https://github.com/vercel/next.js/tree/canary/examples)

### TypeScript Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript React Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Prisma Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### Tailwind CSS Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

## 🤝 Contributing Guidelines

### Pull Request Process

1. **Fork the repository**
2. **Create feature branch** from `develop`
3. **Write tests** for new functionality
4. **Ensure all tests pass**
5. **Update documentation** if needed
6. **Submit pull request** with clear description

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No sensitive data exposed
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met
- [ ] Mobile responsiveness verified

---

🛠️ **Happy Coding!** Follow these guidelines to maintain code quality and consistency across the Zuasoko platform.
