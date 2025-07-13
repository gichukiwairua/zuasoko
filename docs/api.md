# API Documentation

Complete reference for the Zuasoko platform's backend API endpoints.

## 🚀 API Overview

The Zuasoko API is built with Next.js API routes and provides RESTful endpoints for all platform functionality.

### Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

### Authentication

Most endpoints require authentication using session-based auth or API tokens.

### Response Format

All API responses follow a consistent JSON format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Success message",
  "error": null
}
```

## 🔐 Authentication API

### Register User

Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+254712345678",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "FARMER",
  "county": "Kiambu",
  "farmName": "Green Valley Farm",
  "farmSize": 5.5,
  "kraPin": "A123456789K"
}
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "requiresPayment": true,
    "requiresApproval": false
  }
}
```

**Role-Specific Fields:**

**Farmer:**

- `county` (required)
- `farmName` (optional)
- `farmSize` (optional)
- `kraPin` (optional)

**Driver:**

- `licenseNumber` (required)
- `vehicleType` (required)
- `vehicleRegNo` (required)
- `idNumber` (required)

**Customer:**

- `county` (optional)

### Login

Authenticate user credentials.

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "phone": "+254712345678",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "role": "FARMER",
      "status": "ACTIVE"
    },
    "token": "jwt_token_here"
  }
}
```

## 💰 Payment API

### Initiate STK Push

Start M-Pesa STK push payment process.

```http
POST /api/payments/stk-push
```

**Request Body:**

```json
{
  "phoneNumber": "+254712345678",
  "amount": 300,
  "description": "Farmer Account Activation Fee",
  "type": "ACTIVATION_FEE"
}
```

**Response:**

```json
{
  "success": true,
  "message": "STK push sent successfully",
  "data": {
    "transactionId": "MP1234567890",
    "mpesaRequestId": "REQ_MP1234567890"
  }
}
```

### Check Payment Status

Get payment transaction status.

```http
GET /api/payments/status/{transactionId}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "transactionId": "MP1234567890",
    "status": "COMPLETED",
    "message": "Payment completed successfully",
    "mpesaReceiptNumber": "P12345678",
    "amount": 300,
    "completedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Payment Status Types:**

- `PENDING`: Payment in progress
- `COMPLETED`: Payment successful
- `FAILED`: Payment failed
- `CANCELLED`: Payment cancelled by user

### Payment Callback

M-Pesa callback endpoint (webhook).

```http
POST /api/payments/callback
```

This endpoint receives callbacks from M-Pesa and should not be called directly.

## 📦 Consignments API

### Create Consignment

Submit a new product consignment.

```http
POST /api/consignments
```

**Request Body:**

```json
{
  "productName": "Organic Tomatoes",
  "category": "Vegetables",
  "description": "Fresh organic tomatoes grown without pesticides",
  "quantity": 50,
  "unit": "kg",
  "pricePerUnit": 120,
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219,
    "address": "Kiambu County, Kenya",
    "accuracy": 10
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Consignment submitted successfully",
  "data": {
    "consignment": {
      "id": "consignment_id",
      "productName": "Organic Tomatoes",
      "status": "PENDING",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

### Get Consignments

Retrieve consignments for a farmer.

```http
GET /api/consignments?farmerId={farmerId}&status={status}
```

**Query Parameters:**

- `farmerId` (optional): Filter by farmer ID
- `status` (optional): Filter by status
- `page` (optional): Page number for pagination
- `limit` (optional): Items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "consignments": [
      {
        "id": "consignment_id",
        "productName": "Organic Tomatoes",
        "category": "Vegetables",
        "status": "PENDING",
        "quantity": 50,
        "pricePerUnit": 120,
        "location": { ... },
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

### Update Consignment Status

Admin endpoint to approve/reject consignments.

```http
PATCH /api/consignments/{id}/status
```

**Request Body:**

```json
{
  "status": "APPROVED",
  "reason": "Product meets quality standards",
  "adminNotes": "Excellent quality produce"
}
```

**Status Types:**

- `PENDING`: Awaiting review
- `APPROVED`: Approved for marketplace
- `REJECTED`: Rejected with reason
- `PRICE_SUGGESTION_SENT`: Price suggestion sent to farmer

### Suggest Price

Admin endpoint to suggest new pricing.

```http
POST /api/consignments/{id}/price-suggestion
```

**Request Body:**

```json
{
  "suggestedPrice": 100,
  "reason": "Market price analysis suggests lower pricing for better sales",
  "marketData": {
    "averagePrice": 95,
    "competitors": [90, 100, 105]
  }
}
```

## 🛒 Marketplace API

### Get Products

Retrieve marketplace products.

```http
GET /api/marketplace/products
```

**Query Parameters:**

- `category` (optional): Filter by category
- `county` (optional): Filter by farmer county
- `search` (optional): Search by name/description
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `featured` (optional): Show only featured products
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "product_id",
        "name": "Organic Tomatoes",
        "category": "Vegetables",
        "price": 120,
        "unit": "kg",
        "stockQuantity": 50,
        "images": ["image_url"],
        "description": "Fresh organic tomatoes",
        "farmer": {
          "id": "farmer_id",
          "county": "Kiambu",
          "user": {
            "firstName": "John",
            "lastName": "Doe"
          }
        },
        "isFeatured": false,
        "isAvailable": true
      }
    ],
    "pagination": { ... }
  }
}
```

### Get Product Details

Get detailed information about a specific product.

```http
GET /api/marketplace/products/{id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": "product_id",
      "name": "Organic Tomatoes",
      "description": "Detailed description...",
      "images": ["image1_url", "image2_url"],
      "tags": ["organic", "fresh", "pesticide-free"],
      "location": {
        "latitude": -1.2921,
        "longitude": 36.8219,
        "address": "Kiambu County, Kenya"
      },
      "farmer": { ... },
      "reviews": [ ... ],
      "relatedProducts": [ ... ]
    }
  }
}
```

## 🛍️ Orders API

### Create Order

Place a new order.

```http
POST /api/orders
```

**Request Body:**

```json
{
  "items": [
    {
      "productId": "product_id",
      "quantity": 5,
      "price": 120
    }
  ],
  "customerInfo": {
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+254712345679",
    "email": "jane@example.com",
    "address": "123 Main St, Nairobi",
    "county": "Nairobi"
  },
  "paymentMethod": "MPESA",
  "deliveryNotes": "Please call upon arrival"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Order placed successfully",
  "data": {
    "order": {
      "id": "order_id",
      "orderNumber": "ORD-2024-001",
      "status": "PENDING",
      "total": 600,
      "items": [ ... ],
      "estimatedDelivery": "2024-01-16T10:00:00Z"
    }
  }
}
```

### Get Order Status

Track order progress.

```http
GET /api/orders/{id}/status
```

**Response:**

```json
{
  "success": true,
  "data": {
    "order": {
      "id": "order_id",
      "status": "IN_TRANSIT",
      "statusHistory": [
        {
          "status": "PENDING",
          "timestamp": "2024-01-15T10:00:00Z",
          "notes": "Order confirmed"
        },
        {
          "status": "PROCESSING",
          "timestamp": "2024-01-15T11:00:00Z",
          "notes": "Preparing items"
        }
      ],
      "driver": {
        "name": "Mike Johnson",
        "phone": "+254712345680",
        "vehicle": "Toyota Hiace - KCA 123A"
      },
      "estimatedDelivery": "2024-01-16T10:00:00Z"
    }
  }
}
```

## 👥 Users API

### Get User Profile

Retrieve user profile information.

```http
GET /api/users/profile
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+254712345678",
      "role": "FARMER",
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z",
      "farmer": {
        "county": "Kiambu",
        "farmName": "Green Valley Farm",
        "farmSize": 5.5
      }
    }
  }
}
```

### Update User Profile

Update user information.

```http
PATCH /api/users/profile
```

**Request Body:**

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "newemail@example.com",
  "farmName": "Updated Farm Name"
}
```

### Get Users (Admin Only)

Retrieve all users with filtering.

```http
GET /api/admin/users
```

**Query Parameters:**

- `role` (optional): Filter by user role
- `status` (optional): Filter by account status
- `search` (optional): Search by name/email/phone

## 📊 Analytics API

### Dashboard Statistics

Get dashboard metrics.

```http
GET /api/analytics/dashboard
```

**Response:**

```json
{
  "success": true,
  "data": {
    "users": {
      "total": 1250,
      "farmers": 456,
      "customers": 678,
      "drivers": 89,
      "admins": 27
    },
    "orders": {
      "today": 45,
      "thisWeek": 312,
      "thisMonth": 1456
    },
    "revenue": {
      "today": 45000,
      "thisWeek": 312000,
      "thisMonth": 1456000
    },
    "products": {
      "total": 2341,
      "approved": 2198,
      "pending": 143
    }
  }
}
```

### Sales Analytics

Get detailed sales data.

```http
GET /api/analytics/sales
```

**Query Parameters:**

- `period` (optional): `7d`, `30d`, `90d`, `1y`
- `groupBy` (optional): `day`, `week`, `month`

**Response:**

```json
{
  "success": true,
  "data": {
    "salesData": [
      {
        "date": "2024-01-15",
        "orders": 45,
        "revenue": 67500,
        "averageOrderValue": 1500
      }
    ],
    "summary": {
      "totalRevenue": 1456000,
      "totalOrders": 2341,
      "averageOrderValue": 622,
      "growthRate": 12.5
    }
  }
}
```

## 🚛 Driver API

### Get Available Deliveries

Retrieve deliveries available for assignment.

```http
GET /api/driver/deliveries/available
```

**Response:**

```json
{
  "success": true,
  "data": {
    "deliveries": [
      {
        "id": "delivery_id",
        "order": {
          "id": "order_id",
          "total": 1500,
          "items": [ ... ]
        },
        "pickup": {
          "farmer": "John Doe",
          "address": "Farm location",
          "coordinates": [-1.2921, 36.8219]
        },
        "delivery": {
          "customer": "Jane Smith",
          "address": "123 Main St, Nairobi",
          "coordinates": [-1.2864, 36.8172]
        },
        "distance": 15.2,
        "estimatedDuration": 45,
        "payment": 500
      }
    ]
  }
}
```

### Accept Delivery

Accept a delivery assignment.

```http
POST /api/driver/deliveries/{id}/accept
```

### Update Delivery Status

Update delivery progress.

```http
PATCH /api/driver/deliveries/{id}/status
```

**Request Body:**

```json
{
  "status": "PICKED_UP",
  "notes": "Items collected from farmer",
  "location": {
    "latitude": -1.2921,
    "longitude": 36.8219
  }
}
```

## 🔧 Utility APIs

### Upload Images

Upload product or profile images.

```http
POST /api/upload/images
```

**Request:** Multipart form data with image files

**Response:**

```json
{
  "success": true,
  "data": {
    "urls": [
      "https://cdn.example.com/image1.jpg",
      "https://cdn.example.com/image2.jpg"
    ]
  }
}
```

### Get Counties

Retrieve list of supported counties.

```http
GET /api/counties
```

**Response:**

```json
{
  "success": true,
  "data": {
    "counties": ["Nairobi", "Kiambu", "Nakuru", "Mombasa", "Kisumu"]
  }
}
```

### Get Categories

Retrieve product categories.

```http
GET /api/categories
```

**Response:**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "vegetables",
        "name": "Vegetables",
        "subcategories": ["Leafy Greens", "Root Vegetables", "Fruits"]
      }
    ]
  }
}
```

## 🚨 Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "phone",
      "reason": "Invalid phone number format"
    }
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_REQUIRED`: User not authenticated
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `DUPLICATE_ENTRY`: Duplicate data
- `PAYMENT_FAILED`: Payment processing error
- `INTERNAL_ERROR`: Server error

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `500`: Internal Server Error

## 📝 Rate Limiting

### Limits

- **General API**: 100 requests per minute
- **Authentication**: 10 requests per minute
- **Payments**: 5 requests per minute
- **File Uploads**: 10 requests per minute

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 75
X-RateLimit-Reset: 1640995200
```

## 🔐 Security

### API Security Features

- **Authentication**: Session-based with JWT tokens
- **Authorization**: Role-based access control
- **Input Validation**: Comprehensive data validation
- **Rate Limiting**: Protection against abuse
- **CORS**: Configured for security
- **HTTPS**: Required for production

### Best Practices

- Always use HTTPS in production
- Validate all input data
- Implement proper error handling
- Use authentication for sensitive endpoints
- Monitor API usage and performance

---

📚 **API Reference Complete**: This documentation covers all available endpoints and their usage patterns.
