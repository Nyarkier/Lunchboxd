# Quick Reference - Backend Team Ready Checklist

## What You Need to Know

### Current Review Data Structure

```typescript
{
  id: string; // Auto-generated or UUID
  restaurantId: string; // FK to restaurants
  userId: string; // FK to users
  rating: number; // 1-5 (required)
  comment: string; // Review text (required)
  createdAt: string; // ISO 8601 timestamp (auto)
}
```

### 7 API Endpoints Required

| Method | Endpoint                                                | Purpose                        |
| ------ | ------------------------------------------------------- | ------------------------------ |
| POST   | `/api/reviews`                                          | Create review                  |
| GET    | `/api/reviews/restaurant/{restaurantId}`                | Get all reviews for restaurant |
| GET    | `/api/reviews/user/{userId}`                            | Get all reviews by user        |
| PUT    | `/api/reviews/{reviewId}`                               | Update review                  |
| DELETE | `/api/reviews/{reviewId}`                               | Delete review                  |
| GET    | `/api/reviews`                                          | Get all reviews (optional)     |
| GET    | `/api/reviews/restaurant/{restaurantId}/average-rating` | Get avg rating                 |

### Current Mock Data Location

- **File**: `mock-backend/data.json`
- **Array**: `reviews: []`
- **Ready to receive**: Review objects with above structure

### Frontend Service Layer

- **File**: `src/services/reviewsService.ts`
- **Currently**: Uses mock data in memory
- **Will switch to**: API calls when backend is ready
- **No frontend code changes needed** - service layer handles it

### Key Components Using Reviews

1. **ReviewModal** (`src/components/ReviewModal.tsx`)

   - Create/edit/delete reviews
   - Uses: addReview, updateReview, deleteReview

2. **PopularReviewsModal** (`src/components/PopularReviewsModal.tsx`)

   - View all restaurant reviews
   - Uses: getRestaurantReviews

3. **Reviews Page** (`src/pages/Reviews.tsx`)

   - User's personal reviews
   - Uses: getUserReviews

4. **StoreDetails** (`src/pages/StoreDetails.tsx`)
   - Shows review count and average rating
   - Uses: getRestaurantReviews, getAverageRating

### Data Validation Needed

- **rating**: Integer 1-5 only
- **comment**: String (recommend min 5 chars)
- **restaurantId**: Must exist in restaurants
- **userId**: Must exist in users
- **createdAt**: Auto-generate as ISO 8601

### Error Responses Expected

```json
// 400 Bad Request
{ "error": "Invalid rating. Must be between 1 and 5" }

// 401 Unauthorized
{ "error": "User must be authenticated" }

// 404 Not Found
{ "error": "Review not found" }

// 409 Conflict
{ "error": "User already has a review for this restaurant" }
```

### Implementation Priority

1. ✅ POST `/api/reviews` - Most used for adding reviews
2. ✅ GET `/api/reviews/restaurant/{id}` - Needed for popular reviews modal
3. ✅ GET `/api/reviews/user/{id}` - Needed for reviews page
4. ✅ PUT `/api/reviews/{id}` - For editing reviews
5. ✅ DELETE `/api/reviews/{id}` - For removing reviews
6. ⚠️ GET `/api/reviews` - Optional, not currently used
7. ⚠️ GET `/api/reviews/restaurant/{id}/average-rating` - Optional

### Documentation for Reference

- **Full Specification**: `REVIEW_DATA_STRUCTURE.md`
- **Implementation Guide**: `REVIEWS_BACKEND_INTEGRATION_GUIDE.md`
- **Implementation Summary**: `REVIEW_IMPLEMENTATION_COMPLETE.md`

### Testing Plan

When your endpoints are ready:

1. POST a review → verify it appears in GET restaurant reviews
2. PUT to update → verify changes saved
3. DELETE a review → verify it's removed
4. GET user reviews → verify only user's reviews returned
5. GET all restaurant reviews → verify all returned correctly
6. Average rating → verify calculation correct

### How to Switch from Mock to Real Backend

1. Update `reviewsService.ts` to call your API endpoints instead of mock data
2. No other frontend code changes needed
3. Service layer abstracts the backend implementation
4. Frontend components remain unchanged

### Current Status

- ✅ Frontend implementation: 100% complete
- ✅ Type definitions: Complete
- ✅ Service layer: Ready to integrate
- ✅ Components: Fully integrated
- ⏳ Backend API: Waiting for implementation
- ⏳ Database: Waiting for setup

### Questions?

Refer to the documentation files:

- Data structure? → See `src/types/types.ts`
- API examples? → See `REVIEW_DATA_STRUCTURE.md`
- Implementation details? → See `REVIEWS_BACKEND_INTEGRATION_GUIDE.md`
- Service functions? → See `src/services/reviewsService.ts`

---

**Summary**: Frontend reviews system is complete and ready. Backend team needs to implement the 7 API endpoints to complete the integration. No frontend changes will be needed - service layer will handle the switch from mock to real API.
