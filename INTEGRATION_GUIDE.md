# Frontend-Backend Integration Guide

## How to Connect Your Frontend to the New Backend

### 1. Create an API Service Layer

Create a new file: `src/services/api.ts`

```typescript
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Get JWT token from Supabase
import { supabase } from '../lib/supabase'

export const getAuthToken = async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession()
  return session?.access_token
}

const apiCall = async (method: string, endpoint: string, body?: any) => {
  const token = await getAuthToken()

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: response.statusText }))
    throw new Error(errorData.error || `Failed to ${method} ${endpoint}`)
  }

  return response.json()
}

export const api = {
  get: (endpoint: string) => apiCall('GET', endpoint),
  post: (endpoint: string, body: any) => apiCall('POST', endpoint, body),
  put: (endpoint: string, body: any) => apiCall('PUT', endpoint, body),
  delete: (endpoint: string) => apiCall('DELETE', endpoint)
}
```

### 2. Update Your Services

Replace direct Supabase calls with API calls:

**Before:**
```typescript
// src/services/productService.ts
import { supabase } from '../lib/supabase'

export const getProducts = async () => {
  const { data } = await supabase.from('products').select()
  return data
}
```

**After:**
```typescript
// src/services/productService.ts
import { api } from './api'

export const getProducts = async () => {
  return await api.get('/products')
}

export const createProduct = async (input) => {
  return await api.post('/products', input)
}

export const updateProduct = async (id, updates) => {
  return await api.put(`/products/${id}`, updates)
}

export const deleteProduct = async (id) => {
  return await api.delete(`/products/${id}`)
}
```

### 3. Update Cart Service

```typescript
// src/services/cartService.ts
import { api } from './api'

export const getCart = async () => {
  return await api.get('/cart')
}

export const addToCart = async (productId: string, quantity: number = 1) => {
  return await api.post('/cart', { productId, quantity })
}

export const updateCartItem = async (cartItemId: string, quantity: number) => {
  return await api.put(`/cart/${cartItemId}`, { quantity })
}

export const removeFromCart = async (cartItemId: string) => {
  return await api.delete(`/cart/${cartItemId}`)
}

export const clearCart = async () => {
  return await api.delete('/cart')
}

export const getCartCount = async (): Promise<number> => {
  const cart = await getCart()
  return cart.reduce((total: number, item: any) => total + item.quantity, 0)
}
```

### 4. Update Wishlist Service

```typescript
// src/services/wishlistService.ts
import { api } from './api'

export const getWishlist = async () => {
  return await api.get('/wishlist')
}

export const addToWishlist = async (productId: string) => {
  return await api.post('/wishlist', { productId })
}

export const removeFromWishlist = async (wishlistItemId: string) => {
  return await api.delete(`/wishlist/${wishlistItemId}`)
}

export const clearWishlist = async () => {
  return await api.delete('/wishlist')
}

export const isInWishlist = async (productId: string): Promise<boolean> => {
  const result = await api.get(`/wishlist/check/${productId}`)
  return result.inWishlist
}

export const getWishlistCount = async (): Promise<number> => {
  const wishlist = await getWishlist()
  return wishlist.length
}

// Helper function for removing by product_id
export const removeProductFromWishlist = async (productId: string): Promise<void> => {
  const wishlist = await getWishlist()
  const item = wishlist.find((w: any) => w.product_id === productId)
  if (item) {
    await removeFromWishlist(item.id)
  }
}
```

### 5. Backend Environment Setup

**IMPORTANT:** Make sure your backend `.env` has the correct **service_role key** (not anon key):

```env
PORT=3000
NODE_ENV=development

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_KEY=your_service_role_key_here  
SUPABASE_JWT_SECRET=your_jwt_secret_here

# CORS
CORS_ORIGIN=http://localhost:5173
```

**To get your service_role key:**
1. Go to Supabase Dashboard → Settings → API
2. Under "Project API keys", copy the **service_role** key
3. This key bypasses Row-Level Security (RLS) policies

### 6. Update Frontend Environment Variables

Add to `frontend/.env`:
```
VITE_API_URL=http://localhost:3000/api
```

For production:
```
VITE_API_URL=https://your-backend-domain.com/api
```

### 7. Update Import Paths

Replace:
```typescript
import { supabase } from '../lib/supabase'
```

With:
```typescript
import { api } from '../services/api'
```

## Testing the Integration

1. **Start backend:**
```bash
cd backend
npm install
npm run dev
```

2. **Start frontend:**
```bash
cd frontend
npm run dev
```

3. **Test in browser:**
   - Open DevTools Network tab
   - Perform actions (view products, add to cart, add to wishlist)
   - Check API calls to `http://localhost:3000/api/*`
   - Verify JWT token in Authorization header

## Key Implementation Details

### Authentication Flow
1. User logs in via Supabase Auth (frontend)
2. Frontend stores JWT token in session
3. `getAuthToken()` extracts token from Supabase session
4. Token sent in `Authorization: Bearer <token>` header
5. Backend validates token using `supabase.auth.getUser(token)`
6. Backend extracts user info and attaches to `req.user`

### Service Role vs Anon Key
- **Anon Key**: Limited by RLS policies, used in frontend
- **Service Role Key**: Bypasses RLS, used in backend
- Backend uses `supabaseAdmin` client with service_role key
- This allows backend to perform operations on behalf of users

### Why This Architecture?
- **Frontend**: Uses anon key for read operations
- **Backend**: Uses service_role key for write operations
- **Security**: Sensitive operations verified server-side
- **Flexibility**: Can add business logic, validation, rate limiting

## Benefits of This Architecture

✅ **Security** - Sensitive operations on server
✅ **Validation** - Server-side input validation
✅ **Business Logic** - Centralized logic
✅ **Scalability** - Easy to add features
✅ **Flexibility** - Easy to change backend
✅ **Rate Limiting** - Protect from abuse
✅ **Monitoring** - Track API usage

## Troubleshooting

**CORS Error?**
- Check backend `.env` has correct `CORS_ORIGIN=http://localhost:5173`
- Restart backend after changing env variables
- Verify backend is running on port 3000

**401 Unauthorized?**
- Token might be expired - log out and log back in
- Check if `getAuthToken()` returns a valid token
- Verify user is logged in via Supabase Auth
- Check browser console for auth errors

**500 Internal Server Error with RLS violation?**
- Check backend logs for "row-level security policy" error
- Verify `SUPABASE_SERVICE_KEY` is the **service_role** key, not anon key
- Both keys look similar but have different `role` in JWT payload
- Restart backend after updating the service_role key

**404 Not Found?**
- Check API endpoint matches backend route
- Verify backend is running on port 3000 (not 5000)
- Check `VITE_API_URL` in frontend `.env`

**Backend not starting?**
- Check port 3000 isn't already in use: `lsof -ti:3000`
- Kill process: `kill $(lsof -ti:3000)`
- Check all environment variables are set in backend `.env`

**API calls slow?**
- Add loading states in components
- Use React Query or SWR for caching
- Consider adding request/response interceptors for logging

**Changes not reflecting?**
- Restart backend after code changes (no hot reload for Node)
- Clear browser cache or hard refresh (Cmd+Shift+R)
- Check browser console for errors
