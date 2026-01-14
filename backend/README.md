# EMarket Backend API

A Node.js/Express backend API for the EMarket ecommerce platform, powered by Supabase.

## Features

- ✅ RESTful API endpoints
- ✅ JWT authentication via Supabase
- ✅ Role-based access control (Admin, Seller, Buyer)
- ✅ Product management
- ✅ Shopping cart operations
- ✅ TypeScript support
- ✅ CORS enabled

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase project with database set up

## Installation

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
CORS_ORIGIN=http://localhost:5173
```

## Running the Server

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (seller only)
- `PUT /api/products/:id` - Update product (seller only)
- `DELETE /api/products/:id` - Delete product (seller only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:cartItemId` - Update quantity
- `DELETE /api/cart/:cartItemId` - Remove item
- `DELETE /api/cart` - Clear entire cart

All cart endpoints require authentication.

## Authentication

Include JWT token in request header:
```
Authorization: Bearer <token>
```

Get token from Supabase Auth in frontend and pass to API.

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── lib/
│   │   └── supabase.ts       # Supabase client
│   ├── middleware/
│   │   ├── auth.ts           # Authentication & authorization
│   │   └── errorHandler.ts   # Error handling
│   ├── routes/
│   │   ├── index.ts          # Route aggregator
│   │   ├── products.ts       # Product routes
│   │   └── cart.ts           # Cart routes
│   ├── controllers/
│   │   ├── productController.ts
│   │   └── cartController.ts
│   ├── services/
│   │   ├── productService.ts
│   │   └── cartService.ts
│   └── types/
│       └── (shared types)
├── package.json
├── tsconfig.json
└── .env.example
```

## Next Steps

1. Update frontend to call these API endpoints instead of Supabase directly
2. Add more routes (orders, wishlist, payments, etc.)
3. Add input validation (joi, zod, etc.)
4. Add database migrations
5. Deploy to production (Heroku, Railway, AWS, etc.)

## Frontend Integration

Replace direct Supabase calls with API calls:

### Before (Frontend calling Supabase directly)
```typescript
const products = await supabase.from('products').select()
```

### After (Frontend calling Backend API)
```typescript
const response = await fetch('/api/products')
const products = await response.json()
```

## Development Tips

- Check logs in terminal to see request/response flow
- Use Postman/Insomnia to test endpoints
- Add authentication token from frontend to test protected routes
- Keep sensitive data in `.env` (never commit)

## Troubleshooting

**CORS errors?** - Check `CORS_ORIGIN` in `.env` matches your frontend URL

**Auth not working?** - Ensure token is passed in `Authorization: Bearer <token>` header

**Database errors?** - Verify Supabase credentials and network connection
