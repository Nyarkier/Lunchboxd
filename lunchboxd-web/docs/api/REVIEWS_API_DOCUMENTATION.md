# Reviews API Documentation

This document describes the Reviews API service for the Lunchboxd application.

## Overview

The Reviews API provides functionality for users to create, read, update, and delete restaurant reviews. **Each user is limited to one review per restaurant** - they can edit or delete their existing review but cannot create multiple reviews for the same restaurant.

---

## API Functions

### `addReview`

Creates a new review for a restaurant. Throws an error if the user has already reviewed the restaurant.

**Function Signature:**

```typescript
addReview(
  restaurantId: string,
  userId: string,
  rating: number,
  comment: string
): Promise<Review>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `restaurantId` | `string` | The unique identifier of the restaurant |
| `userId` | `string` | The unique identifier of the user |
| `rating` | `number` | Rating from 1 to 5 |
| `comment` | `string` | The review text content |

**Returns:** `Promise<Review>` - The newly created review object

**Throws:**

- `Error` - "You have already reviewed this restaurant. Please edit or delete your existing review." when user already has a review for the restaurant

**Example:**

```typescript
try {
  const review = await addReview("rest-123", "user-456", 4, "Great food!");
  console.log("Review created:", review);
} catch (error) {
  if (error.message.includes("already reviewed")) {
    console.log("User already reviewed this restaurant");
  }
}
```

---

### `updateReview`

Updates an existing review's rating and comment.

**Function Signature:**

```typescript
updateReview(
  reviewId: string,
  rating: number,
  comment: string
): Promise<Review | null>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `reviewId` | `string` | The unique identifier of the review to update |
| `rating` | `number` | New rating from 1 to 5 |
| `comment` | `string` | New review text content |

**Returns:** `Promise<Review | null>` - The updated review object, or `null` if not found

**Example:**

```typescript
const updatedReview = await updateReview(
  "review-789",
  5,
  "Updated: Even better than before!",
);
if (updatedReview) {
  console.log("Review updated successfully");
}
```

---

### `deleteReview`

Deletes an existing review.

**Function Signature:**

```typescript
deleteReview(reviewId: string): Promise<boolean>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `reviewId` | `string` | The unique identifier of the review to delete |

**Returns:** `Promise<boolean>` - `true` if deleted successfully, `false` if not found

**Example:**

```typescript
const deleted = await deleteReview("review-789");
if (deleted) {
  console.log("Review deleted successfully");
}
```

---

### `getUserReviewForRestaurant`

Checks if a user has already reviewed a specific restaurant. Used to determine whether to show "Write a review" or "Edit your review" in the UI.

**Function Signature:**

```typescript
getUserReviewForRestaurant(
  userId: string,
  restaurantId: string
): Promise<Review | null>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The unique identifier of the user |
| `restaurantId` | `string` | The unique identifier of the restaurant |

**Returns:** `Promise<Review | null>` - The user's review if it exists, or `null`

**Example:**

```typescript
const existingReview = await getUserReviewForRestaurant("user-456", "rest-123");
if (existingReview) {
  // Show "Edit your review" button
  console.log("User has already reviewed this restaurant");
} else {
  // Show "Write a review" button
  console.log("User can create a new review");
}
```

---

### `getRestaurantReviews`

Retrieves all reviews for a specific restaurant.

**Function Signature:**

```typescript
getRestaurantReviews(restaurantId: string): Promise<Review[]>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `restaurantId` | `string` | The unique identifier of the restaurant |

**Returns:** `Promise<Review[]>` - Array of reviews for the restaurant

---

### `getUserReviews` / `getReviewsByUserId`

Retrieves all reviews created by a specific user.

**Function Signature:**

```typescript
getUserReviews(userId: string): Promise<Review[]>
getReviewsByUserId(userId: string): Promise<Review[]>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `userId` | `string` | The unique identifier of the user |

**Returns:** `Promise<Review[]>` - Array of reviews by the user

---

### `getAllReviews`

Retrieves all reviews in the system.

**Function Signature:**

```typescript
getAllReviews(): Promise<Review[]>
```

**Returns:** `Promise<Review[]>` - Array of all reviews

---

### `getAverageRating`

Calculates the average rating for a restaurant.

**Function Signature:**

```typescript
getAverageRating(restaurantId: string): Promise<number>
```

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `restaurantId` | `string` | The unique identifier of the restaurant |

**Returns:** `Promise<number>` - Average rating (0 if no reviews)

---

## Data Types

### Review

```typescript
interface Review {
  id: string; // Unique identifier
  restaurantId: string; // Reference to restaurant
  userId: string; // Reference to user who created the review
  rating: number; // Rating from 1-5
  comment: string; // Review text content
  createdAt: string; // ISO timestamp of creation
}
```

---

## Business Rules

1. **One Review Per Restaurant Per User**
   - Users can only create one review per restaurant
   - Attempting to create a second review will throw an error
   - Users can edit or delete their existing review at any time

2. **Review Ownership**
   - Only the user who created a review can edit or delete it
   - Admin users may have additional permissions (see Admin API)

3. **Rating Scale**
   - Ratings must be between 1 and 5 (inclusive)
   - Ratings are used to calculate restaurant average ratings

---

## UI Integration

### StoreDetails Page

The StoreDetails page automatically:

1. Checks if the logged-in user has an existing review for the restaurant
2. Shows "Edit your review" button if a review exists
3. Shows "Write a review" button if no review exists
4. Pre-fills the ReviewModal with existing review data when editing

### Reviews Page (Your Reviews)

The Reviews page displays all of the user's reviews with edit/delete functionality:

1. Each review card shows edit (pencil) and delete (trash) icons
2. Clicking edit opens the ReviewModal pre-filled with the review data
3. Clicking delete prompts for confirmation then removes the review
4. The review list automatically refreshes after any edit or delete operation
5. Clicking the restaurant name or image navigates to the restaurant details page

### ReviewModal Component

The ReviewModal component:

1. Displays "Save Review" button for new reviews
2. Displays "Update Review" button when editing
3. Shows "Delete" button only when editing an existing review
4. Handles duplicate review errors with user-friendly messages

---

## Error Handling

| Error             | Description                        | User Message                                                                             |
| ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------- |
| Duplicate Review  | User tries to create second review | "You have already reviewed this restaurant. Please edit or delete your existing review." |
| Not Authenticated | User not logged in                 | "You must be logged in to submit a review"                                               |
| Empty Comment     | Review text is empty               | "Please write a review"                                                                  |

---

## Storage

Reviews are persisted using localStorage with the key `lunchboxd_reviews`. Data is also kept in sync with the mock backend data structure for development purposes.

---

## Version History

| Version | Date     | Changes                                                                                                 |
| ------- | -------- | ------------------------------------------------------------------------------------------------------- |
| 1.0.0   | Feb 2026 | Initial API implementation                                                                              |
| 1.1.0   | Feb 2026 | Added one-review-per-restaurant limit, `getUserReviewForRestaurant` function, improved UI for edit mode |
| 1.2.0   | Feb 2026 | Added edit/delete functionality to Reviews page with ReviewModal integration                            |
