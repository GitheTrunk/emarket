# EMarket Monorepo

Modern e-commerce platform with a TypeScript/Express backend and a Vue 3 + Vite frontend, powered by Supabase for auth and data.

## Overview
- **Backend:** Node.js, Express, TypeScript, Supabase (`@supabase/supabase-js`), JWT, CORS
- **Frontend:** Vue 3, Vite, Tailwind CSS, Pinia, Vue Router, Vitest
- **Monorepo Layout:** Separate `backend` and `frontend` apps under one repository

## Repository Structure
- [backend](backend): TypeScript Express API
  - [src/config](backend/src/config): environment configuration
  - [src/controllers](backend/src/controllers): route handlers
  - [src/services](backend/src/services): business logic
  - [src/routes](backend/src/routes): modular route definitions
  - [src/middleware](backend/src/middleware): auth and error handling
- [frontend](frontend): Vue 3 app (Vite)
  - [src/router](frontend/src/router): route modules for public/admin/buyer/seller
  - [src/services](frontend/src/services): API and storage helpers
  - [src/components](frontend/src/components): UI components and feature modules
  - [src/layouts](frontend/src/layouts) and [src/views](frontend/src/views): page layouts and screens
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md): integration notes (supplementary)

## Getting Started

### Prerequisites
- Node.js: 20.x LTS recommended (frontend declares `^20.19.0 || >=22.12.0`)
- NPM or Yarn (examples use NPM)
- Supabase project with URL and keys

### Backend (API)
1. Install and run locally:
```bash
cd backend
npm install
# Create .env (see Environment Variables)
npm run dev
```
2. Build and start:
```bash
npm run build
npm start
```
3. Lint:
```bash
npm run lint
```

### Frontend (Web App)
1. Install and run locally:
```bash
cd frontend
npm install
# Create .env (see Environment Variables)
npm run dev
```
2. Type-check and build:
```bash
npm run build
# or run type-check separately
npm run type-check
```
3. Preview production build:
```bash
npm run preview
```
4. Format source:
```bash
npm run format
```

## Environment Variables

Create `.env` files in both `backend` and `frontend` directories. Keys below use typical names for Supabase and JWT; adjust to match your deployment.

### Backend `.env`
- `PORT`: API port (e.g., `3000`)
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_ANON_KEY`: Supabase anon key (or service role key if needed server-side)
- `JWT_SECRET`: Secret used for issuing/verifying JWTs
- `CORS_ORIGIN`: Allowed origin for CORS (e.g., `http://localhost:5173`)

### Frontend `.env`
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anon key

Note: Vite exposes only variables prefixed with `VITE_` to the client.

## Running Both Apps Together
Open two terminals:
```bash
# Terminal 1 (API)
cd backend && npm run dev

# Terminal 2 (Web)
cd frontend && npm run dev
```
Frontend will call the backend API. Ensure `CORS_ORIGIN` matches the frontend dev URL (default Vite dev server: `http://localhost:5173`).

## API Overview
Routes are organized under [backend/src/routes](backend/src/routes) and mapped to controllers in [backend/src/controllers](backend/src/controllers):
- `products`: product catalog operations
- `cart`: shopping cart operations
- `wishlist`: user wishlists
- `addresses`: user addresses
- `profile`: user profile management
- `preferences`: user preferences
- `admin`: administrative endpoints

Auth middleware lives in [backend/src/middleware/auth.ts](backend/src/middleware/auth.ts) and error handling in [backend/src/middleware/errorHandler.ts](backend/src/middleware/errorHandler.ts).

## Frontend Features
- Role-based layouts: [AdminLayout](frontend/src/layouts/AdminLayout.vue), [BuyerLayout](frontend/src/layouts/BuyerLayout.vue), [SellerLayout](frontend/src/layouts/SellerLayout.vue)
- Seller UI components: e.g., [CreateProductForm](frontend/src/components/seller/CreateProductForm.vue)
- Buyer account tabs: [ProfileTab](frontend/src/components/buyer/ProfileTab.vue), [AddressTab](frontend/src/components/buyer/AddressTab.vue), [PreferencesTab](frontend/src/components/buyer/PreferencesTab.vue)
- Shared navigation: [Navbar](frontend/src/components/common/Navbar.vue), [Footer](frontend/src/components/common/Footer.vue)
- Routing modules: [router/modules](frontend/src/router/modules) for public/admin/buyer/seller
- Services: API client ([frontend/src/services/api.ts](frontend/src/services/api.ts)), product/cart/wishlist helpers

## Development Notes
- Backend dev runs via `ts-node` ESM loader (`npm run dev`) and compiles with `tsc` (`npm run build`).
- Frontend dev uses Vite (`npm run dev`), type-check via `vue-tsc`, unit tests via Vitest (`npm run test:unit`), and Tailwind/PostCSS for styles.
- Supabase client is used on both sides; see [backend/src/lib/supabase.ts](backend/src/lib/supabase.ts) and [frontend/src/lib/supabase.ts](frontend/src/lib/supabase.ts).

## Testing
- Frontend unit tests: `npm run test:unit` in `frontend` (Vitest + Vue Test Utils).
- Backend tests: not configured by default; add your preferred test runner (e.g., Jest) if needed.

## Deployment
### Backend
- Build with `npm run build` and run `node dist/index.js`.
- Provide production `.env` with secure `JWT_SECRET` and appropriate Supabase keys.

### Frontend
- Build with `npm run build` and serve the `dist` directory via your choice of static host.
- Set `VITE_SUPABASE_*` envs at build time.

## Contributing
- Ensure code is formatted and type-checked before PRs.
- For API changes, update controllers/services and corresponding route modules.
- Consider adding or updating docs in [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for integration details.

## License
This project currently has no explicit license file. Add one if you plan to open-source or distribute externally.
