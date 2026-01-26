# Backend Integration Guide

## Overview

This guide explains how to integrate the frontend data structure with your backend API. The current implementation uses localStorage for persistence, but is designed to seamlessly transition to backend calls.

## Current Architecture

### Frontend Services

All data services are located in `src/services/`:

- `reviewsService.ts` - Review CRUD operations
- `favoritesService.ts` - Favorite management
- `apiClient.ts` - Restaurant data & filtering

### LocalStorage Strategy

- **Key:** `lunchboxd_reviews` - Stores all reviews
- **Key:** `lunchboxd_favorites` - Stores all favorites
- **Purpose:** Offline functionality and persistence during development

## Backend API Specification

### 1. Reviews API

#### Get Restaurant Reviews

```http
GET /api/reviews?restaurantId={id}

Response:
[
  {
    "id": "1001",
    "restaurantId": "1",
    "userId": "1",
    "rating": 5,
    "comment": "Great food!",
    "createdAt": "2025-01-15T10:30:00Z"
  }
]
```

#### Get User Reviews

```http
GET /api/reviews?userId={id}

Response: Review[]
```

#### Create Review

```http
POST /api/reviews
Content-Type: application/json

{
  "restaurantId": "1",
  "userId": "1",
  "rating": 5,
  "comment": "Great food!",
  "createdAt": "2025-01-15T10:30:00Z"
}

Response:
{
  "id": "1001",
  "restaurantId": "1",
  "userId": "1",
  "rating": 5,
  "comment": "Great food!",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

#### Update Review

```http
PUT /api/reviews/{id}
Content-Type: application/json

{
  "rating": 4,
  "comment": "Updated comment"
}

Response: Review
```

#### Delete Review

```http
DELETE /api/reviews/{id}

Response: { success: true }
```

#### Get Average Rating

```http
GET /api/reviews/rating/{restaurantId}

Response: { averageRating: 4.5, reviewCount: 34 }
```

### 2. Favorites API

#### Get User Favorites

```http
GET /api/favorites/user/{userId}

Response:
[
  {
    "userId": "1",
    "restaurantId": "1"
  }
]
```

#### Add Favorite

```http
POST /api/favorites
Content-Type: application/json

{
  "userId": "1",
  "restaurantId": "1"
}

Response: { success: true }
```

#### Remove Favorite

```http
DELETE /api/favorites?userId={userId}&restaurantId={restaurantId}

Response: { success: true }
```

#### Check if Favorite

```http
GET /api/favorites/check?userId={userId}&restaurantId={restaurantId}

Response: { isFavorite: true }
```

### 3. Restaurants API

#### Get All Restaurants

```http
GET /api/restaurants

Query Parameters:
- search: string (optional)
- category: string (optional)
- budgetRange: "10-50" | "50-150" | "150-500" | "500-1000" (optional)
- type: "Food" | "Drink" (optional)
- paymentMode: "Cash" | "GCash" (optional)
- side: string (optional)

Response: Restaurant[]
```

#### Get Single Restaurant

```http
GET /api/restaurants/{id}

Response: Restaurant
```

#### Get Filter Options

```http
GET /api/filter-options

Response:
{
  "categories": ["Rice Meal", "Cafe", "Chicken", ...],
  "budgets": ["10-50", "50-150", "150-500", "500-1000"],
  "types": ["Food", "Drink"],
  "paymentModes": ["Cash", "GCash"],
  "sides": ["Main Gate", "Gate Six", ...]
}
```

## Migration Steps

### Step 1: Update Environment Variables

Add to `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_USE_MOCK=false
```

### Step 2: Modify reviewsService.ts

**Current (Mock):**

```typescript
const getReviewsFromBackend = (): Review[] => {
  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  return mockBackendData.reviews || [];
};
```

**Updated (Backend):**

```typescript
const getReviewsFromBackend = async (
  restaurantId?: string
): Promise<Review[]> => {
  const url = restaurantId
    ? `${API_BASE_URL}/reviews?restaurantId=${restaurantId}`
    : `${API_BASE_URL}/reviews`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch reviews");
  return response.json();
};

export const getRestaurantReviews = async (
  restaurantId: string
): Promise<Review[]> => {
  try {
    return await getReviewsFromBackend(restaurantId);
  } catch (error) {
    // Fallback to localStorage
    const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
};
```

### Step 3: Modify favoritesService.ts

**Updated (Backend):**

```typescript
import type { Favorite } from "../types/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const addFavorite = async (
  userId: string,
  restaurantId: string
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, restaurantId }),
    });
    return response.ok;
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return false;
  }
};

export const isFavorite = async (
  userId: string,
  restaurantId: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/favorites/check?userId=${userId}&restaurantId=${restaurantId}`
    );
    const data = await response.json();
    return data.isFavorite;
  } catch (error) {
    // Fallback to localStorage
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const favorites = stored ? JSON.parse(stored) : [];
    return !!favorites.find(
      (f) => f.userId === userId && f.restaurantId === restaurantId
    );
  }
};
```

### Step 4: Update apiClient.ts

Replace mock implementations with API calls:

```typescript
async function fetchRestaurantsAPI(
  criteria?: FilterCriteria
): Promise<Restaurant[]> {
  const params = new URLSearchParams();

  if (criteria?.searchQuery) params.append("search", criteria.searchQuery);
  if (criteria?.category) params.append("category", criteria.category);
  if (criteria?.budgets) params.append("budgetRange", criteria.budgets[0]);
  if (criteria?.sides) params.append("side", criteria.sides[0]);

  const url = `${API_BASE_URL}/restaurants${
    params.toString() ? "?" + params.toString() : ""
  }`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch restaurants");
    return response.json();
  } catch (error) {
    // Fallback to mock data
    console.error("API error, using mock data:", error);
    return fetchRestaurantsMock(criteria);
  }
}
```

## Database Schema (Recommended)

### Reviews Table

```sql
CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  restaurantId VARCHAR(50) NOT NULL,
  userId VARCHAR(50) NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE INDEX idx_reviews_restaurantId ON reviews(restaurantId);
CREATE INDEX idx_reviews_userId ON reviews(userId);
```

### Favorites Table

```sql
CREATE TABLE favorites (
  id VARCHAR(50) PRIMARY KEY,
  userId VARCHAR(50) NOT NULL,
  restaurantId VARCHAR(50) NOT NULL,
  createdAt TIMESTAMP,
  UNIQUE(userId, restaurantId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id)
);

CREATE INDEX idx_favorites_userId ON favorites(userId);
CREATE INDEX idx_favorites_restaurantId ON favorites(restaurantId);
```

### Restaurants Table (Update existing)

```sql
ALTER TABLE restaurants ADD COLUMN budgetRange VARCHAR(20);
ALTER TABLE restaurants ADD COLUMN type VARCHAR(20);
ALTER TABLE restaurants ADD COLUMN paymentMode JSON;

-- Sample data
UPDATE restaurants SET
  budgetRange = '10-50',
  type = 'Food',
  paymentMode = '["Cash", "GCash"]'
WHERE id = '1';
```

## Error Handling Strategy

```typescript
// Implement retry logic
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429) {
        // Rate limited, wait and retry
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, i)));
        continue;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, i)));
    }
  }
}
```

## Caching Strategy

```typescript
// Implement cache with TTL
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

function getCached(key: string) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCached(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}
```

## Authentication Integration

Add auth token to all requests:

```typescript
async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("auth_token");
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  return fetch(url, { ...options, headers });
}
```

## Deployment Checklist

- [ ] Backend API deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Database migrations run
- [ ] API endpoints tested with Postman/Thunder Client
- [ ] Error handling tested
- [ ] Rate limiting configured
- [ ] Logging implemented
- [ ] Cache strategy tested
- [ ] Load testing performed

## Rollback Strategy

Keep localStorage as fallback:

```typescript
async function robustFetch(key: string, fetcher: () => Promise<any>) {
  try {
    const data = await fetcher();
    localStorage.setItem(`cache_${key}`, JSON.stringify(data));
    return data;
  } catch (error) {
    // Use localStorage backup if API fails
    const backup = localStorage.getItem(`cache_${key}`);
    if (backup) return JSON.parse(backup);
    throw error;
  }
}
```

## Monitoring

Add error tracking:

```typescript
// Example with Sentry
import * as Sentry from "@sentry/react";

export const getRestaurantReviews = async (id: string) => {
  try {
    return await fetch(`${API_BASE_URL}/reviews?restaurantId=${id}`);
  } catch (error) {
    Sentry.captureException(error, {
      tags: { service: "reviewsService", operation: "getRestaurantReviews" },
    });
    throw error;
  }
};
```

---

**Ready for Backend Implementation!**

Once these steps are completed, your frontend will seamlessly work with your backend API while maintaining offline functionality as a fallback.
