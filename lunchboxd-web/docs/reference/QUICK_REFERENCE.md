# Quick Reference - Data Structure v2.0

## 📊 What Changed

### Data Added

- ✅ 34 real reviews from 8 users
- ✅ Payment mode support (Cash, GCash)
- ✅ Budget range categories (4 tiers)
- ✅ Food/Drink type classification
- ✅ localStorage persistence

### Files Updated

```
src/types/types.ts                    [Updated: Added new fields]
src/pages/StoreDetails.tsx            [Updated: Real reviews display]
src/components/PopularReviewsModal    [Updated: User data integration]
src/services/reviewsService.ts        [Updated: localStorage persistence]
src/services/favoritesService.ts      [Updated: localStorage persistence]
mock-backend/data.json                [Updated: 34 reviews + new fields]
mock-backend/users.json               [Updated: 8 real users]
```

## 🎯 Key Features

### Reviews

```typescript
// Before: Static hardcoded reviews
"Prince Lord Mendoza"; // Hardcoded

// After: Real dynamic reviews from data
getRestaurantReviews(id); // Fetches 34 reviews
// Shows user name, avatar, rating, date
```

### Payment Modes

```typescript
// Before: Static text
"Cash, Gcash";

// After: Dynamic from data
restaurant.paymentMode; // ["Cash", "GCash"] or ["Cash"]
```

### Budget Ranges

```typescript
// New field: budgetRange
restaurant.budgetRange; // "10-50", "50-150", "150-500", "500-1000"

// Enables filtering
filterByBudget(restaurants, "10-50"); // All budget restaurants
```

## 🔑 Storage Keys

```javascript
// Reviews - 34 items
localStorage.getItem("lunchboxd_reviews");

// Favorites - user-specific
localStorage.getItem("lunchboxd_favorites");
```

## 🧪 Quick Test

```javascript
// Check reviews
JSON.parse(localStorage.getItem("lunchboxd_reviews")).length; // 34+

// Check favorites
JSON.parse(localStorage.getItem("lunchboxd_favorites")); // []

// Clear data
localStorage.clear();
location.reload();
```

## 📱 Component Changes

### StoreDetails.tsx

```tsx
// NEW: Real reviews display
const [reviews, setReviews] = useState<ReviewType[]>([])
const topReviews = reviews.sort(...).slice(0, 3)

// UPDATED: Dynamic payment mode
{restaurant.paymentMode && restaurant.paymentMode.length > 0
  ? restaurant.paymentMode.join(", ")
  : "Cash, GCash"}
```

### PopularReviewsModal.tsx

```tsx
// NEW: User data fetching
const user = await getUserById(review.userId);
const userName = user ? `${user.firstName} ${user.lastName}` : "Anonymous";

// NEW: Avatar from user ID
const userAvatar = `https://i.pravatar.cc/150?u=${review.userId}`;
```

## 🚀 API Ready

Current mock setup ready for backend:

```typescript
// Switch: Update environment
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://backend:3000/api

// Services automatically use:
GET /api/reviews?restaurantId={id}
GET /api/favorites/user/{userId}
POST /api/reviews
```

## 📝 Data Structure

```json
{
  "review": {
    "id": "1001",
    "restaurantId": "1",
    "userId": "1",
    "rating": 5,
    "comment": "Great food!",
    "createdAt": "2025-01-15T10:30:00Z"
  },
  "restaurant": {
    "id": "1",
    "name": "JAP-IT Food Hauz",
    "budgetRange": "10-50",
    "type": "Food",
    "paymentMode": ["Cash", "GCash"]
  },
  "user": {
    "id": "1",
    "firstName": "Prince Lord",
    "lastName": "Mendoza",
    "username": "princelord_m",
    "avatar": "https://i.pravatar.cc/150?u=1"
  }
}
```

## 📚 Documentation

| Document                     | Purpose                       |
| ---------------------------- | ----------------------------- |
| DATA_STRUCTURE_UPDATE.md     | Technical overview & API spec |
| BACKEND_INTEGRATION_GUIDE.md | Backend setup & migration     |
| DATA_TESTING_GUIDE.md        | Testing procedures            |
| IMPLEMENTATION_COMPLETE.md   | Project completion summary    |
| README.md                    | Project overview              |

## ⚡ Common Tasks

### Get all reviews

```typescript
const reviews = await getRestaurantReviews("1");
```

### Add new review

```typescript
const review = await addReview("1", "userId", 5, "Great!");
```

### Check favorite

```typescript
const isFav = await isFavorite("userId", "restaurantId");
```

### Add favorite

```typescript
await addFavorite("userId", "restaurantId");
```

### Filter restaurants

```typescript
const filtered = await fetchRestaurants({
  budgets: ["10-50"],
  type: "Food",
});
```

## 🎯 Next Steps

1. **Test locally**

   ```bash
   npm run dev
   # Go to /store/1
   # Verify reviews display
   ```

2. **Check localStorage**

   ```javascript
   // F12 → Console
   localStorage.getItem("lunchboxd_reviews");
   localStorage.getItem("lunchboxd_favorites");
   ```

3. **For backend integration**
   - Read: BACKEND_INTEGRATION_GUIDE.md
   - Update: Environment variables
   - Modify: Service files
   - Deploy: Backend API
   - Test: All features

## ✅ Verification Checklist

- [ ] Reviews showing on store page
- [ ] User names displaying correctly
- [ ] Payment modes visible
- [ ] Favorites persisting
- [ ] No console errors
- [ ] Mobile responsive
- [ ] localStorage has data
- [ ] Budget ranges filtering

## 🐛 Troubleshooting

| Issue                     | Solution                            |
| ------------------------- | ----------------------------------- |
| No reviews showing        | Clear cache: `localStorage.clear()` |
| User names missing        | Check auth service connection       |
| Favorites not persisting  | Check private/incognito mode        |
| Payment modes not showing | Verify restaurant data has field    |

## 📞 Support

- **Technical:** See DATA_STRUCTURE_UPDATE.md
- **Testing:** See DATA_TESTING_GUIDE.md
- **Backend:** See BACKEND_INTEGRATION_GUIDE.md
- **Issues:** See DATA_TESTING_GUIDE.md Troubleshooting

---

**Version:** 2.0  
**Status:** Production Ready  
**Updated:** January 17, 2026
