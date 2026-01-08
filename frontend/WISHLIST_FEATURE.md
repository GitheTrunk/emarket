# Buyer Wishlist Feature

## Overview
The wishlist feature allows buyers to save products they're interested in for later viewing and purchasing. This feature provides a personalized shopping experience where users can curate their favorite items.

## Files Created/Modified

### New Files Created:
1. **`src/views/buyer/BuyerWishlist.vue`** - Main wishlist page component
2. **`src/services/wishlistService.ts`** - Service layer for wishlist operations
3. **`WISHLIST_FEATURE.md`** - This documentation file

### Modified Files:
1. **`src/types/database.ts`** - Added `WishlistItem` type definition
2. **`src/router/modules/buyer.ts`** - Added wishlist route
3. **`src/views/buyer/BuyerDashboard.vue`** - Added wishlist toggle buttons
4. **`src/components/layout/BuyerNavbar.vue`** - Added dynamic wishlist count badge

## Features

### 1. Wishlist Page (`/buyer/wishlist`)
- **Grid Layout**: Displays wishlist items in a responsive grid (1-4 columns based on screen size)
- **Empty State**: Shows friendly message and "Browse Products" button when wishlist is empty
- **Loading State**: Displays spinner while fetching wishlist data
- **Product Cards**: Each card shows:
  - Product image with hover zoom effect
  - Category badge
  - Product title and description (truncated)
  - Price
  - Stock status badge
  - Date added to wishlist
  - Remove button (X icon in top-right corner)
  - Add to Cart button (disabled if out of stock)
  - View button to see product details

### 2. Wishlist Actions
- **Add to Cart**: Quick add items from wishlist to shopping cart
- **Remove Individual Items**: Click X button to remove single item
- **Clear All**: Button to remove all items from wishlist (with confirmation)
- **Toast Notifications**: Success/error messages for all actions

### 3. Dashboard Integration
Products in the buyer dashboard now have:
- **Heart Icon Button**: Toggle wishlist status (filled red when in wishlist, outline gray when not)
- **Product Modal**: Wishlist toggle button in product detail modal
- **Real-time Status**: Wishlist status loads on page mount and updates immediately

### 4. Navbar Integration
The buyer navbar displays:
- **Dynamic Counter**: Shows number of items in wishlist
- **Auto-refresh**: Updates count every 30 seconds
- **Badge Visibility**: Only shows badge when count > 0

## API Functions (wishlistService.ts)

### `getWishlist()`
Fetches all wishlist items for the current user with product details.

**Returns**: `Promise<WishlistItem[]>`

### `addToWishlist(productId: number)`
Adds a product to the wishlist. Prevents duplicates.

**Parameters**:
- `productId`: ID of the product to add

**Throws**: Error if product already in wishlist or user not authenticated

### `removeFromWishlist(wishlistItemId: number)`
Removes a specific wishlist item by its ID.

**Parameters**:
- `wishlistItemId`: ID of the wishlist item (not product ID)

### `removeProductFromWishlist(productId: number)`
Removes a product from wishlist using the product ID.

**Parameters**:
- `productId`: ID of the product to remove

### `isInWishlist(productId: number)`
Checks if a product is currently in the user's wishlist.

**Returns**: `Promise<boolean>`

### `clearWishlist()`
Removes all items from the user's wishlist.

### `getWishlistCount()`
Gets the total number of items in the wishlist.

**Returns**: `Promise<number>`

## Database Schema

The wishlist feature expects a `wishlist` table with the following structure:

```sql
CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(buyer_id, product_id)
);

-- Index for faster queries
CREATE INDEX idx_wishlist_buyer ON wishlist(buyer_id);
CREATE INDEX idx_wishlist_product ON wishlist(product_id);
```

## Type Definitions

### WishlistItem
```typescript
export type WishlistItem = {
  id: number
  buyer_id: string
  product_id: number
  created_at: string
  product: Product  // Joined product data
}
```

## Routes

### New Route Added:
```typescript
{
  path: "wishlist",
  name: "BuyerWishlist",
  component: () => import('@/views/buyer/BuyerWishlist.vue'),
}
```

**Full Path**: `/buyer/wishlist`
**Layout**: Uses `BuyerLayout` (includes BuyerNavbar and Footer)
**Auth**: Protected by `buyer` role meta

## UI/UX Features

### Design Elements:
- **Responsive Grid**: Adapts from 1 column (mobile) to 4 columns (desktop)
- **Hover Effects**: Image zoom, shadow elevation on cards
- **Loading States**: Spinners with descriptive text
- **Toast Notifications**: Bottom-right positioned, auto-dismiss after 3 seconds
- **Color Scheme**: 
  - Primary: Orange (#F97316)
  - Success: Green
  - Error: Red
  - Neutral: Gray scale

### Accessibility:
- Button title attributes for screen readers
- Disabled states with visual feedback
- Keyboard navigation support
- Semantic HTML structure

## Future Enhancements

Potential improvements to consider:
1. **Wishlist Sharing**: Allow users to share wishlists with friends
2. **Price Alerts**: Notify when wishlist items go on sale
3. **Collections**: Organize wishlist items into custom categories
4. **Wishlist Analytics**: Track most wishlisted products
5. **Move to Cart**: Bulk action to move all items to cart
6. **Sort/Filter**: Sort wishlist by date added, price, etc.
7. **Notes**: Allow users to add personal notes to wishlist items
8. **Stock Notifications**: Email alerts when out-of-stock items are restocked

## Testing Checklist

- [ ] Add products to wishlist from dashboard
- [ ] Remove products from wishlist page
- [ ] Clear entire wishlist
- [ ] Verify wishlist persists across sessions
- [ ] Test wishlist counter updates in navbar
- [ ] Test with out-of-stock products
- [ ] Verify duplicate prevention
- [ ] Test responsive layout on mobile/tablet/desktop
- [ ] Test toast notifications
- [ ] Verify authentication checks

## Notes

- All wishlist operations require user authentication
- Wishlist is user-specific (isolated by buyer_id)
- Products are removed from wishlist if deleted from database (CASCADE)
- Wishlist count updates every 30 seconds automatically in navbar
- Maximum wishlist size is unlimited (no artificial constraints)
