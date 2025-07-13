# Troubleshooting Guide

Common issues and solutions for the Zuasoko platform.

## 🚨 Quick Diagnosis

### Platform Status Check

Before troubleshooting, verify basic system status:

```bash
# Check if services are running
curl -f https://your-domain.com/api/health || echo "API Down"

# Database connectivity
npm run db:ping

# Development server
netstat -tulpn | grep :3000
```

### Common Symptoms

| Symptom              | Likely Cause         | Quick Fix                        |
| -------------------- | -------------------- | -------------------------------- |
| White screen on load | JavaScript error     | Check browser console            |
| Login fails          | Authentication issue | Clear cookies, check credentials |
| Payment fails        | M-Pesa configuration | Verify STK push settings         |
| Slow loading         | Performance issue    | Check network, cache             |
| Mobile install fails | PWA configuration    | Verify manifest.json             |

## 🔐 Authentication Issues

### Login Problems

#### Symptom: Cannot login with correct credentials

**Possible Causes:**

- Session expired
- Database connection issues
- Password hash mismatch
- Account status problems

**Solutions:**

```bash
# Check user status in database
npx prisma studio
# Look for user with status "SUSPENDED" or "PENDING_PAYMENT"

# Reset user password
npx prisma db:seed --reset-user email@example.com

# Clear all sessions
redis-cli FLUSHDB  # If using Redis sessions
```

#### Symptom: Infinite login redirect loop

**Possible Causes:**

- NextAuth configuration error
- Missing environment variables
- Callback URL mismatch

**Solutions:**

```env
# Verify environment variables
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# Check callback URLs match exactly
```

### Registration Issues

#### Symptom: Farmer registration fails at payment step

**Possible Causes:**

- M-Pesa configuration incorrect
- Network connectivity issues
- Invalid phone number format

**Solutions:**

```javascript
// Verify phone number format
const phoneRegex = /^(\+254|254|0)?[17]\d{8}$/;
console.log(phoneRegex.test(phoneNumber));

// Test M-Pesa endpoint directly
curl -X POST http://localhost:3000/api/payments/stk-push \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+254712345678","amount":300}'
```

#### Symptom: "User already exists" error

**Solution:**

```sql
-- Check for existing users
SELECT * FROM "User" WHERE phone = '+254712345678' OR email = 'user@example.com';

-- Delete duplicate if needed (be careful!)
DELETE FROM "User" WHERE id = 'duplicate_user_id';
```

## 💰 Payment Issues

### M-Pesa STK Push Problems

#### Symptom: STK push not received on phone

**Possible Causes:**

- Phone number format incorrect
- M-Pesa service down
- Invalid shortcode/passkey
- Network issues

**Debugging Steps:**

```bash
# Check M-Pesa credentials
echo "Shortcode: $MPESA_SHORTCODE"
echo "Passkey: $MPESA_PASSKEY"

# Test phone number format
node -e "
const phone = '+254712345678';
const formatted = phone.replace(/^(\+254|254|0)/, '254');
console.log('Formatted:', formatted);
"

# Check M-Pesa sandbox status
curl -X GET https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query
```

**Solutions:**

```javascript
// Fix phone number formatting
function formatPhoneNumber(phone) {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "254" + cleaned.substring(1);
  }
  if (cleaned.startsWith("254")) {
    return cleaned;
  }
  return "254" + cleaned;
}

// Implement retry logic
async function stkPushWithRetry(data, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await sendStkPush(data);
      return result;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}
```

#### Symptom: Payment status never updates

**Possible Causes:**

- Callback URL not accessible
- Webhook not configured
- Database not updating

**Solutions:**

```bash
# Test callback URL accessibility
curl -X POST https://your-domain.com/api/payments/callback \
  -H "Content-Type: application/json" \
  -d '{"test": "callback"}'

# Check callback logs
tail -f /var/log/nginx/access.log | grep callback

# Manually update payment status for testing
npx prisma studio
```

### Payment Timeouts

#### Symptom: Payment stuck in "PENDING" status

**Solution:**

```javascript
// Implement payment timeout cleanup
async function cleanupStalePayments() {
  const staleThreshold = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes

  await prisma.payment.updateMany({
    where: {
      status: "PENDING",
      createdAt: { lt: staleThreshold },
    },
    data: { status: "FAILED" },
  });
}

// Run as cron job
setInterval(cleanupStalePayments, 5 * 60 * 1000); // Every 5 minutes
```

## 🗄️ Database Issues

### Connection Problems

#### Symptom: "Can't reach database server"

**Possible Causes:**

- Database service down
- Network connectivity issues
- Incorrect connection string
- Connection pool exhausted

**Solutions:**

```bash
# Test database connectivity
pg_isready -h localhost -p 5432

# Check connection string format
echo $DATABASE_URL
# Should be: postgresql://username:password@host:port/database

# Test connection with psql
psql $DATABASE_URL -c "SELECT NOW();"

# Check active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

#### Symptom: "Connection pool timeout"

**Solution:**

```javascript
// Adjust Prisma connection pool settings
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  connectionLimit = 10
}

// Monitor connection usage
async function checkConnections() {
  const result = await prisma.$queryRaw`
    SELECT count(*) as active_connections
    FROM pg_stat_activity
    WHERE state = 'active';
  `;
  console.log('Active connections:', result);
}
```

### Migration Issues

#### Symptom: Migration fails with schema conflicts

**Solutions:**

```bash
# Reset database (CAUTION: This deletes all data)
npx prisma migrate reset

# Or manually resolve conflicts
npx prisma db pull  # Pull current schema
npx prisma migrate diff --from-migrations --to-schema-datamodel

# Force migration (use carefully)
npx prisma migrate resolve --applied "migration_name"
```

#### Symptom: "Table already exists" error

**Solution:**

```sql
-- Check existing tables
\dt

-- Drop conflicting table if safe
DROP TABLE IF EXISTS "conflicting_table";

-- Or mark migration as applied
INSERT INTO "_prisma_migrations" (id, checksum, migration_name, logs, applied_at)
VALUES ('migration_id', 'checksum', 'migration_name', '', NOW());
```

## 🚀 Performance Issues

### Slow Page Loading

#### Symptom: Pages take >5 seconds to load

**Debugging:**

```bash
# Check server response times
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com/

# Monitor database queries
# Add to your API routes:
console.time('database-query');
const result = await prisma.user.findMany();
console.timeEnd('database-query');

# Check bundle size
npm run build
npm run analyze  # If webpack-bundle-analyzer is configured
```

**Solutions:**

```javascript
// Implement query optimization
const optimizedQuery = await prisma.produce.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    // Only select needed fields
  },
  where: { isAvailable: true },
  take: 20, // Limit results
});

// Add database indexing
// In Prisma schema:
model Produce {
  id       String @id @default(cuid())
  name     String
  category String

  @@index([category])
  @@index([name])
}

// Implement caching
import { LRUCache } from 'lru-cache';

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

function getCachedData(key, fetchFn) {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = fetchFn();
  cache.set(key, data);
  return data;
}
```

### Memory Issues

#### Symptom: Server running out of memory

**Solutions:**

```bash
# Monitor memory usage
htop
free -h
node --max-old-space-size=4096 server.js  # Increase Node.js memory

# Check for memory leaks
node --inspect server.js
# Use Chrome DevTools Memory tab
```

```javascript
// Implement pagination to reduce memory usage
async function getPaginatedProducts(page = 1, limit = 20) {
  const skip = (page - 1) * limit;

  return prisma.produce.findMany({
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

// Use streaming for large datasets
const stream = prisma.order
  .findMany({
    where: {
      /* conditions */
    },
  })
  .stream();

for await (const order of stream) {
  // Process one order at a time
  processOrder(order);
}
```

## 📱 Mobile/PWA Issues

### Installation Problems

#### Symptom: "Add to Home Screen" not appearing

**Possible Causes:**

- PWA criteria not met
- Manifest.json errors
- Service worker issues
- HTTPS not enabled

**Solutions:**

```bash
# Check PWA criteria with Lighthouse
npx lighthouse https://your-domain.com --view

# Validate manifest.json
curl https://your-domain.com/manifest.json | jq .

# Test service worker
# In browser DevTools:
navigator.serviceWorker.ready.then(reg => console.log('SW ready:', reg));
```

```json
// Fix common manifest issues
{
  "name": "Zuasoko - Empowering Farmers",
  "short_name": "Zuasoko",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#16a34a",
  "background_color": "#ffffff",
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

#### Symptom: Offline functionality not working

**Solutions:**

```javascript
// Debug service worker
// Check registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((reg) => console.log("SW registered:", reg))
    .catch((err) => console.log("SW registration failed:", err));
}

// Check cache status
caches.keys().then((names) => {
  console.log("Cache names:", names);
  names.forEach((name) => {
    caches.open(name).then((cache) => {
      cache.keys().then((keys) => {
        console.log(
          `Cache ${name}:`,
          keys.map((k) => k.url),
        );
      });
    });
  });
});

// Fix service worker caching
// sw.js
const CACHE_NAME = "zuasoko-v1";
const urlsToCache = ["/", "/marketplace", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching resources");
        return cache.addAll(urlsToCache);
      })
      .catch((err) => console.error("Cache failed:", err)),
  );
});
```

## 🔧 Development Issues

### Build Errors

#### Symptom: TypeScript compilation errors

**Solutions:**

```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix common type issues
# Add type declarations for missing modules
declare module 'some-module';

# Use type assertion when necessary
const element = document.getElementById('id') as HTMLElement;

# Update dependencies
npm update
npm audit fix
```

#### Symptom: Next.js build fails

**Solutions:**

```bash
# Clear Next.js cache
rm -rf .next

# Check for conflicting dependencies
npm ls

# Update Next.js
npm install next@latest

# Check for memory issues during build
node --max-old-space-size=4096 ./node_modules/.bin/next build
```

### Environment Variables

#### Symptom: Environment variables not loading

**Solutions:**

```bash
# Check file naming
ls -la .env*
# Should be .env.local for local development

# Verify variable names
grep "NEXT_PUBLIC" .env.local
# Only NEXT_PUBLIC_ variables are available in browser

# Check loading order
echo "NEXT_PUBLIC_TEST=test" >> .env.local
# Restart development server
```

```javascript
// Debug environment variables
console.log("Environment variables:", {
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL ? "SET" : "NOT SET",
  MPESA_SHORTCODE: process.env.MPESA_SHORTCODE ? "SET" : "NOT SET",
});
```

## 🌐 Network Issues

### API Errors

#### Symptom: 500 Internal Server Error

**Debugging:**

```bash
# Check server logs
tail -f /var/log/nginx/error.log
tail -f /var/log/application.log

# Test API endpoint directly
curl -X POST https://your-domain.com/api/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

**Solutions:**

```javascript
// Add proper error handling
export async function POST(request) {
  try {
    const body = await request.json();
    // Your logic here
    return Response.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        success: false,
        error: "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}

// Add request validation
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request) {
  try {
    const body = await request.json();
    const validatedData = schema.parse(body);
    // Process validatedData
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        {
          success: false,
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 },
      );
    }
    throw error;
  }
}
```

#### Symptom: CORS errors

**Solutions:**

```javascript
// Add CORS headers to API routes
export async function GET(request) {
  const response = new Response(JSON.stringify({ success: true }));

  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  return response;
}

// Or configure in next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};
```

## 📊 Monitoring & Logging

### Error Tracking Setup

```javascript
// Implement error tracking
class ErrorTracker {
  static log(error, context = {}) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context,
      url: typeof window !== "undefined" ? window.location.href : "server",
      userAgent: typeof window !== "undefined" ? navigator.userAgent : "server",
    };

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error tracked:", errorData);
    }

    // Send to error tracking service in production
    if (process.env.NODE_ENV === "production") {
      fetch("/api/errors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(errorData),
      }).catch(console.error);
    }
  }
}

// Use throughout application
try {
  // Your code here
} catch (error) {
  ErrorTracker.log(error, {
    component: "PaymentForm",
    action: "submitPayment",
  });
}
```

### Health Check Endpoint

```javascript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    database: false,
    mpesa: false,
    cache: false,
  };

  try {
    // Test database
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch (error) {
    console.error("Database health check failed:", error);
  }

  try {
    // Test M-Pesa (simple connectivity check)
    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    );
    checks.mpesa = response.ok;
  } catch (error) {
    console.error("M-Pesa health check failed:", error);
  }

  const allHealthy = Object.values(checks).every(Boolean);

  return Response.json(
    {
      status: allHealthy ? "healthy" : "unhealthy",
      checks,
      timestamp: new Date().toISOString(),
    },
    {
      status: allHealthy ? 200 : 503,
    },
  );
}
```

## 🆘 Getting Additional Help

### Before Asking for Help

1. **Check this troubleshooting guide**
2. **Search existing GitHub issues**
3. **Review application logs**
4. **Test with minimal reproduction case**
5. **Gather relevant error messages and context**

### Information to Include

When reporting issues, include:

```bash
# System information
node --version
npm --version
cat package.json | grep '"version"'

# Error logs
tail -n 50 /var/log/application.log

# Environment (sanitized)
env | grep -E '^(NODE_ENV|DATABASE_URL|MPESA)' | sed 's/=.*/=***/'

# Reproduction steps
1. Go to page X
2. Click button Y
3. Expected: Z happens
4. Actual: Error occurs
```

### Support Channels

- **📧 Email**: support@zuasoko.com
- **🐛 GitHub Issues**: [Repository Issues Page]
- **💬 Community**: [Discord/Slack Channel]
- **📚 Documentation**: [Project Documentation]

### Emergency Contacts

For production issues:

- **🚨 Critical Issues**: emergency@zuasoko.com
- **📱 On-call**: +254-XXX-XXXX (for paying customers)

---

🔧 **Problem Solved?** Great! If you discovered a new issue or solution, please consider contributing to this troubleshooting guide.
