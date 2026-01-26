# LunchboxD - Restaurant Discovery App

A modern React + TypeScript + Vite application for discovering and reviewing restaurants on campus.

## 📋 Documentation Index

### Core Features

- **[DATA_STRUCTURE_UPDATE.md](./DATA_STRUCTURE_UPDATE.md)** - Complete overview of the new data structure with real user reviews, payment modes, and budget ranges
- **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)** - Step-by-step guide for integrating with backend API
- **[DATA_TESTING_GUIDE.md](./DATA_TESTING_GUIDE.md)** - Comprehensive testing procedures and validation

### Quick Links

- **Reviews:** 34 high-quality reviews from 8 real users
- **Restaurants:** 18 restaurants with payment modes and budget classifications
- **Users:** 8 realistic user profiles with avatars
- **Features:** Favorites persistence, smart filtering, real-time updates

## 🚀 Quick Start

### Installation

```bash
npm install
npm run dev
```

### Test Data

The app includes 34 pre-loaded reviews from real users. No additional setup needed!

### Key Features

✅ Real user reviews with authentic ratings  
✅ Payment mode selection (Cash/GCash)  
✅ Budget range filtering (₱10-50, ₱50-150, ₱150-500, ₱500-1000)  
✅ Favorites saved locally (persists across sessions)  
✅ User authentication with role support  
✅ Restaurant discovery and search  
✅ Reviews modal with all user details

## 📊 Data Structure

### Reviews

- **Total:** 34 reviews
- **Users:** 8 unique reviewers
- **Ratings:** 1-5 stars, distributed across restaurants
- **Storage:** localStorage + mock-backend/data.json

### Restaurants

- **Total:** 18 restaurants
- **Categories:** 6+ cuisine types
- **Payment Modes:** Cash, GCash (mixed support)
- **Budget Ranges:** 4 categories (₱10-50 to ₱500-1000)

### Users

- **Total:** 8 users
- **Avatars:** Generated via Pravatar (user-specific seeds)
- **Profiles:** Realistic Filipino names and contact info

## 🔄 Data Persistence

**Current Implementation:** localStorage

- `lunchboxd_reviews` - Persists new reviews
- `lunchboxd_favorites` - Persists user favorites

**Ready for Backend:** See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)

## 🧪 Testing

Run the complete testing suite:

```javascript
// In browser console
// See DATA_TESTING_GUIDE.md for full suite

// Quick validation
const reviews = JSON.parse(localStorage.getItem("lunchboxd_reviews"));
console.log("Reviews loaded:", reviews.length > 0 ? "✅" : "❌");
```

## 🛠 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **State:** React Context + localStorage
- **Icons:** Lucide React
- **Data:** JSON mock backend

## 📁 Project Structure

```
src/
├── components/
│   ├── PopularReviewsModal.tsx    (Shows all reviews)
│   └── ...
├── pages/
│   ├── StoreDetails.tsx            (Real reviews display)
│   └── ...
├── services/
│   ├── reviewsService.ts           (Review management + localStorage)
│   ├── favoritesService.ts         (Favorites + localStorage)
│   └── apiClient.ts                (Restaurant data)
├── types/
│   └── types.ts                    (Enhanced with paymentMode, budgetRange)
└── ...

mock-backend/
├── data.json                       (34 reviews + 18 restaurants)
└── users.json                      (8 user profiles)
```

## 🔧 Configuration

### Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=true  # Set to false when backend is ready
```

## 🚢 Deployment

### Checklist

- [ ] Reviews loading correctly on all pages
- [ ] Favorites persisting across sessions
- [ ] Filters working with all data
- [ ] Payment modes displaying
- [ ] User names and avatars showing
- [ ] No console errors
- [ ] Mobile responsive tested

## 📝 Recent Updates (v2.0)

✨ **New Features:**

- Added `paymentMode` field to restaurants
- Added `budgetRange` classification system
- Added `type` field (Food/Drink)
- 34 real user reviews loaded
- 8 realistic user profiles created
- localStorage persistence for reviews and favorites
- Enhanced PopularReviewsModal with real user data
- ReviewerName component for async user loading

🔧 **Improvements:**

- Consistent data structure across all services
- Offline-first architecture with localStorage
- Ready for backend integration
- Comprehensive testing documentation
- Migration guides for backend teams

## 🤝 Contributing

When making changes:

1. Update [DATA_STRUCTURE_UPDATE.md](./DATA_STRUCTURE_UPDATE.md) if schema changes
2. Add test cases to [DATA_TESTING_GUIDE.md](./DATA_TESTING_GUIDE.md)
3. Verify localStorage persistence
4. Test with multiple users

## 📞 Support

### Common Issues

- **Reviews not showing?** Clear localStorage: `localStorage.clear()`
- **Favorites not saving?** Check browser allows localStorage (not private mode)
- **User names missing?** Verify auth service can fetch user data

See [DATA_TESTING_GUIDE.md](./DATA_TESTING_GUIDE.md) for detailed troubleshooting.

## 📚 API Ready

Services are designed for easy backend migration:

```typescript
// Current: Uses localStorage
getRestaurantReviews(id);

// Ready for: API call with fallback
async function getRestaurantReviews(id) {
  try {
    return await fetch(`/api/reviews?restaurantId=${id}`);
  } catch {
    // Fallback to localStorage
  }
}
```

See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) for complete integration steps.

## 📄 License

MIT
...reactDom.configs.recommended.rules,
},
})

```

```
