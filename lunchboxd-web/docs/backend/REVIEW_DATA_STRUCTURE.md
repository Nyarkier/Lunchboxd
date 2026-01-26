# Review Data Structure Documentation

This document defines the data structure and API requirements for the review system implemented in the Lunchboxd frontend application.

## Review Object Structure

The Review object follows this TypeScript interface:

```typescript
interface Review {
  id: string; // Unique identifier (UUID or auto-generated)
  restaurantId: string; // Reference to the restaurant being reviewed
  userId: string; // Reference to the user who wrote the review
  rating: number; // Rating from 1 to 5
  comment: string; // Review text/comment
  createdAt: string; // ISO 8601 timestamp of when the review was created
}
```

## Data Validation Rules

- **id**: Unique identifier, should be UUID or incrementing number
- **restaurantId**: Must reference an existing restaurant in the system
- **userId**: Must reference an existing user in the system
- **rating**: Must be an integer between 1 and 5 (inclusive)
- **comment**: String, minimum length recommended 5 characters
- **createdAt**: ISO 8601 format datetime (e.g., "2025-01-15T10:30:00.000Z")

## Backend API Endpoints Required

The frontend expects the following REST API endpoints:

### 1. Add a Review (Create)

```
POST /api/reviews
Content-Type: application/json

{
  "restaurantId": "123",
  "userId": "user-456",
  "rating": 4,
  "comment": "Great food and service!"
}

Response: 201 Created
{
  "id": "review-789",
  "restaurantId": "123",
  "userId": "user-456",
  "rating": 4,
  "comment": "Great food and service!",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### 2. Get Reviews for a Restaurant

```
GET /api/reviews/restaurant/{restaurantId}

Response: 200 OK
[
  {
    "id": "review-789",
    "restaurantId": "123",
    "userId": "user-456",
    "rating": 4,
    "comment": "Great food and service!",
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  // ... more reviews
]
```

### 3. Get Reviews by a User

```
GET /api/reviews/user/{userId}

Response: 200 OK
[
  {
    "id": "review-789",
    "restaurantId": "123",
    "userId": "user-456",
    "rating": 4,
    "comment": "Great food and service!",
    "createdAt": "2025-01-15T10:30:00.000Z"
  },
  // ... more reviews by this user
]
```

### 4. Update a Review

```
PUT /api/reviews/{reviewId}
Content-Type: application/json

{
  "rating": 5,
  "comment": "Actually, even better than I thought!"
}

Response: 200 OK
{
  "id": "review-789",
  "restaurantId": "123",
  "userId": "user-456",
  "rating": 5,
  "comment": "Actually, even better than I thought!",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

### 5. Delete a Review

```
DELETE /api/reviews/{reviewId}

Response: 204 No Content
```

### 6. Get All Reviews (Optional)

```
GET /api/reviews

Response: 200 OK
[
  { /* review object */ },
  // ... all reviews
]
```

### 7. Get Average Rating for a Restaurant

```
GET /api/reviews/restaurant/{restaurantId}/average-rating

Response: 200 OK
{
  "averageRating": 4.2
}
```

## Mock Data Reference

Current mock data location: `mock-backend/data.json`

Reviews array structure:

```json
{
  "reviews": [
    {
      "id": "review-1",
      "restaurantId": "1",
      "userId": "user-1",
      "rating": 5,
      "comment": "Sulit, masarap, abot kaya! paborito kong kainan.",
      "createdAt": "2025-11-24T00:00:00.000Z"
    }
  ]
}
```

## Frontend Integration Points

### ReviewModal Component

- Creates new reviews or edits existing ones
- Located in: `src/components/ReviewModal.tsx`
- Uses: `addReview()`, `updateReview()`, `deleteReview()`
- Required props: `restaurantId`, `userId`

### PopularReviewsModal Component

- Displays all reviews for a restaurant
- Located in: `src/components/PopularReviewsModal.tsx`
- Uses: `getRestaurantReviews()`
- Required props: `restaurantId`

### Reviews Page

- Shows user's personal review history
- Located in: `src/pages/Reviews.tsx`
- Uses: `getUserReviews()`
- Accessible at: `/reviews`

### StoreDetails Page

- Shows restaurant details with review section
- Located in: `src/pages/StoreDetails.tsx`
- Uses: `getRestaurantReviews()`, `getAverageRating()`
- Shows: Review count, average rating, and popular reviews

## Service Functions

All service functions are located in: `src/services/reviewsService.ts`

- `addReview(restaurantId, userId, rating, comment)` - Creates a new review
- `getRestaurantReviews(restaurantId)` - Fetches all reviews for a restaurant
- `getUserReviews(userId)` - Fetches all reviews by a user
- `updateReview(reviewId, rating, comment)` - Updates an existing review
- `deleteReview(reviewId)` - Deletes a review
- `getAllReviews()` - Fetches all reviews in the system
- `getAverageRating(restaurantId)` - Calculates average rating for a restaurant

## Error Handling

Expected error responses from backend:

### 400 Bad Request

```json
{
  "error": "Invalid rating. Must be between 1 and 5",
  "code": "INVALID_RATING"
}
```

### 401 Unauthorized

```json
{
  "error": "User must be authenticated to create a review",
  "code": "UNAUTHORIZED"
}
```

### 404 Not Found

```json
{
  "error": "Review not found",
  "code": "REVIEW_NOT_FOUND"
}
```

### 409 Conflict

```json
{
  "error": "User cannot create multiple reviews for the same restaurant",
  "code": "DUPLICATE_REVIEW"
}
```

## Implementation Status

- ✅ Frontend data structure defined
- ✅ Review modal components created
- ✅ Service functions implemented
- ✅ Mock data ready
- 🔄 Backend API endpoints needed

## Next Steps for Backend Team

1. Create database schema for reviews table
2. Implement the 7 API endpoints listed above
3. Add validation on all endpoints
4. Implement authentication/authorization checks
5. Add rate limiting for review creation
6. Consider: preventing duplicate reviews per user per restaurant
7. Consider: review moderation/reporting features
