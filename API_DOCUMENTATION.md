# Lunchboxd Web API Documentation

## Overview

This document outlines all the API endpoints and data structures required for the backend to support the Lunchboxd web application. The frontend is currently configured to work with both mock data and real API endpoints.

**Base URL:** `http://localhost:3000/api`

---

## Table of Contents

1. [Data Models](#data-models)
2. [Endpoints](#endpoints)
3. [Filtering & Search](#filtering--search)
4. [Environment Configuration](#environment-configuration)
5. [Error Handling](#error-handling)
6. [Example Requests & Responses](#example-requests--responses)

---

## Data Models

### User

User account information for authentication and profile management.

```json
{
  "id": "string (unique identifier)",
  "firstName": "string",
  "lastName": "string",
  "username": "string (unique)",
  "email": "string (unique)",
  "password": "string (hashed on backend)",
  "mobile": "string (optional)",
  "avatar": "string or null (optional, URL or base64)",
  "createdAt": "ISO 8601 timestamp (optional)"
}
```

**Note:** The frontend receives `AuthUser` (without password):

```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string"
}
```

---

### Restaurant

Restaurant information displayed throughout the application.

```json
{
  "id": "string (unique identifier)",
  "name": "string",
  "cuisine": "string (e.g., 'Rice Meal', 'Cafe', 'Chicken', 'Fast Food')",
  "rating": "number (0-5 scale, e.g., 4.5)",
  "location": "string (street address)",
  "priceRange": "string (e.g., '₱10-50', '₱50-150', '₱150-300')",
  "sides": "enum (see Side enum below)",
  "image": "string or null (URL or base64 image)"
}
```

**Side Enum (Nearest Gate from School):**

```
- "Main Gate"
- "Gate Six"
- "Inside the School"
- "North Gate"
- "Hospital Gate"
```

**Example Restaurant Object:**

```json
{
  "id": "1",
  "name": "JAP-IT Food Hauz",
  "cuisine": "Rice Meal",
  "rating": 4.5,
  "location": "108 Nori, Mabini Extension",
  "priceRange": "₱10-50",
  "sides": "Main Gate",
  "image": null
}
```

---

### Favorite

Tracks which restaurants users have favorited.

```json
{
  "userId": "string",
  "restaurantId": "string"
}
```

---

### Review

User reviews and ratings for restaurants.

```json
{
  "id": "string (unique identifier)",
  "restaurantId": "string",
  "userId": "string",
  "rating": "number (1-5 scale)",
  "comment": "string",
  "createdAt": "ISO 8601 timestamp"
}
```

**Example Review:**

```json
{
  "id": "rev_001",
  "restaurantId": "1",
  "userId": "user_123",
  "rating": 5,
  "comment": "Great food and affordable!",
  "createdAt": "2026-01-13T10:30:00Z"
}
```

---

### FilterOptions

Available filtering categories provided to the frontend.

```json
{
  "categories": ["string"],
  "budgets": ["string"],
  "sides": ["string"]
}
```

**Example:**

```json
{
  "categories": ["All", "Rice Meal", "Cafe", "Chicken", "Fast Food"],
  "budgets": ["₱", "₱₱", "₱₱₱"]
}
```

---

## Endpoints

### 1. Restaurants

#### Get All Restaurants (with optional filtering)

```
GET /restaurants?search=query&category=cuisine&budgets=₱,₱₱&sides=Main Gate,Gate Six
```

**Query Parameters:**

- `search` (optional): Search by restaurant name, cuisine, or location
- `category` (optional): Filter by cuisine type
- `budgets` (optional): Comma-separated price ranges (₱10-50, ₱50-150, etc.)
- `sides` (optional): Comma-separated gate locations

**Response:**

```json
{
  "restaurants": [
    {
      "id": "1",
      "name": "JAP-IT Food Hauz",
      "cuisine": "Rice Meal",
      "rating": 4.5,
      "location": "108 Nori, Mabini Extension",
      "priceRange": "₱10-50",
      "sides": "Main Gate",
      "image": null
    },
    ...
  ]
}
```

**Status Codes:**

- `200 OK`: Success
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Server error

---

#### Get Single Restaurant by ID

```
GET /restaurants/{restaurantId}
```

**Response (Success - 200):**

```json
{
  "restaurant": {
    "id": "1",
    "name": "JAP-IT Food Hauz",
    "cuisine": "Rice Meal",
    "rating": 4.5,
    "location": "108 Nori, Mabini Extension",
    "priceRange": "₱10-50",
    "sides": "Main Gate",
    "image": null
  }
}
```

**Response (Not Found - 404):**

```json
{
  "error": "Restaurant not found"
}
```

---

### 2. Authentication

#### Login

```
POST /auth/login
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}
```

**Note:** Username can be either the username or email field.

**Response (Success - 200):**

```json
{
  "user": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "jwt_token_here"
}
```

**Response (Failure - 401):**

```json
{
  "error": "Invalid credentials"
}
```

---

#### Register

```
POST /auth/register
Content-Type: application/json

{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response (Success - 201):**

```json
{
  "user": {
    "id": "user_124",
    "firstName": "Jane",
    "lastName": "Smith",
    "username": "janesmith",
    "email": "jane@example.com"
  },
  "token": "jwt_token_here"
}
```

**Response (Failure - 400):**

```json
{
  "error": "Username or email already exists"
}
```

---

### 3. Favorites

#### Add Favorite

```
POST /favorites
Content-Type: application/json
Authorization: Bearer {token}

{
  "userId": "string",
  "restaurantId": "string"
}
```

**Response (Success - 200/201):**

```json
{
  "success": true,
  "message": "Restaurant added to favorites"
}
```

**Response (Duplicate - 400):**

```json
{
  "success": false,
  "message": "Restaurant already in favorites"
}
```

---

#### Remove Favorite

```
DELETE /favorites/{userId}/{restaurantId}
Authorization: Bearer {token}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Restaurant removed from favorites"
}
```

---

#### Get User Favorites

```
GET /favorites/{userId}
Authorization: Bearer {token}
```

**Response (Success - 200):**

```json
{
  "favorites": [
    {
      "id": "1",
      "name": "JAP-IT Food Hauz",
      "cuisine": "Rice Meal",
      "rating": 4.5,
      "location": "108 Nori, Mabini Extension",
      "priceRange": "₱10-50",
      "sides": "Main Gate",
      "image": null
    },
    ...
  ]
}
```

---

#### Check if Restaurant is Favorite

```
GET /favorites/{userId}/{restaurantId}
Authorization: Bearer {token}
```

**Response:**

```json
{
  "isFavorite": true
}
```

---

### 4. Reviews

#### Add Review

```
POST /reviews
Content-Type: application/json
Authorization: Bearer {token}

{
  "restaurantId": "string",
  "userId": "string",
  "rating": "number (1-5)",
  "comment": "string"
}
```

**Response (Success - 201):**

```json
{
  "review": {
    "id": "rev_001",
    "restaurantId": "1",
    "userId": "user_123",
    "rating": 5,
    "comment": "Great food and affordable!",
    "createdAt": "2026-01-13T10:30:00Z"
  }
}
```

---

#### Get Restaurant Reviews

```
GET /reviews/restaurant/{restaurantId}
```

**Response (Success - 200):**

```json
{
  "reviews": [
    {
      "id": "rev_001",
      "restaurantId": "1",
      "userId": "user_123",
      "rating": 5,
      "comment": "Great food and affordable!",
      "createdAt": "2026-01-13T10:30:00Z"
    },
    ...
  ]
}
```

---

#### Get User Reviews

```
GET /reviews/user/{userId}
Authorization: Bearer {token}
```

**Response (Success - 200):**

```json
{
  "reviews": [
    {
      "id": "rev_001",
      "restaurantId": "1",
      "userId": "user_123",
      "rating": 5,
      "comment": "Great food and affordable!",
      "createdAt": "2026-01-13T10:30:00Z"
    },
    ...
  ]
}
```

---

#### Update Review

```
PUT /reviews/{reviewId}
Content-Type: application/json
Authorization: Bearer {token}

{
  "rating": "number (1-5)",
  "comment": "string"
}
```

**Response (Success - 200):**

```json
{
  "review": {
    "id": "rev_001",
    "restaurantId": "1",
    "userId": "user_123",
    "rating": 4,
    "comment": "Still great, but a bit pricey",
    "createdAt": "2026-01-13T10:30:00Z"
  }
}
```

---

#### Delete Review

```
DELETE /reviews/{reviewId}
Authorization: Bearer {token}
```

**Response (Success - 200):**

```json
{
  "success": true,
  "message": "Review deleted"
}
```

---

### 5. Filters

#### Get Available Filters

```
GET /filters
```

**Response (Success - 200):**

```json
{
  "categories": ["All", "Rice Meal", "Cafe", "Chicken", "Fast Food"],
  "budgets": ["₱10-50", "₱50-150", "₱150-300"],
  "sides": [
    "Main Gate",
    "Gate Six",
    "Inside the School",
    "North Gate",
    "Hospital Gate"
  ]
}
```

---

## Filtering & Search

The frontend sends filter criteria in query parameters. The backend should support:

### Search Query

- Searches across: restaurant name, cuisine type, and location
- Case-insensitive
- Partial matching

### Category Filter

- Filter by cuisine type (e.g., "Rice Meal", "Cafe")
- "All" should return all restaurants

### Budget Filter

- Multiple budget ranges can be selected
- Format: "₱10-50", "₱50-150", "₱150-300"

### Sides Filter

- Filter by nearest gate location
- Valid values: "Main Gate", "Gate Six", "Inside the School", "North Gate", "Hospital Gate"

### Combined Filtering

Backend should support combining all filters:

```
GET /restaurants?search=JAP&category=Rice Meal&budgets=₱10-50&sides=Main Gate
```

---

## Environment Configuration

The frontend uses environment variables to determine whether to use the real API or mock data:

```bash
# .env file (in frontend root)
VITE_USE_MOCK=false  # Set to true to use mock data, false for real API
VITE_API_BASE_URL=http://localhost:3000/api
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "error": "string (error message)",
  "statusCode": "number",
  "timestamp": "ISO 8601 timestamp (optional)"
}
```

### HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request parameters or data
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User lacks permission for this resource
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service temporarily unavailable

### Common Error Scenarios

**Missing Required Fields:**

```json
{
  "error": "Missing required field: username",
  "statusCode": 400
}
```

**Invalid Authentication:**

```json
{
  "error": "Unauthorized: Invalid token",
  "statusCode": 401
}
```

**Resource Not Found:**

```json
{
  "error": "Restaurant with id '999' not found",
  "statusCode": 404
}
```

---

## Example Requests & Responses

### Example 1: Search for Restaurants

**Request:**

```
GET /restaurants?search=JAP&category=Rice Meal
```

**Response:**

```json
{
  "restaurants": [
    {
      "id": "1",
      "name": "JAP-IT Food Hauz",
      "cuisine": "Rice Meal",
      "rating": 4.5,
      "location": "108 Nori, Mabini Extension",
      "priceRange": "₱10-50",
      "sides": "Main Gate",
      "image": null
    },
    {
      "id": "3",
      "name": "Taba Eatery",
      "cuisine": "Rice Meal",
      "rating": 4.7,
      "location": "38 Mabini Street Extension",
      "priceRange": "₱10-50",
      "sides": "Main Gate",
      "image": null
    }
  ]
}
```

---

### Example 2: Filter by Budget and Location

**Request:**

```
GET /restaurants?budgets=₱50-150&sides=Main Gate
```

**Response:**

```json
{
  "restaurants": [
    {
      "id": "2",
      "name": "Haven Cafe",
      "cuisine": "Cafe",
      "rating": 4.2,
      "location": "Inday Street, Mabini Extension",
      "priceRange": "₱50-150",
      "sides": "Main Gate",
      "image": null
    },
    {
      "id": "4",
      "name": "Crispy Chicken House",
      "cuisine": "Chicken",
      "rating": 4.4,
      "location": "Main Gate Avenue",
      "priceRange": "₱50-150",
      "sides": "Main Gate",
      "image": null
    }
  ]
}
```

---

### Example 3: User Registration and Login

**Register Request:**

```json
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Register Response:**

```json
{
  "user": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Login Request:**

```json
POST /auth/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePassword123"
}
```

**Login Response:**

```json
{
  "user": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Example 4: Add and Retrieve Favorites

**Add Favorite Request:**

```json
POST /favorites
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "userId": "user_123",
  "restaurantId": "1"
}
```

**Add Favorite Response:**

```json
{
  "success": true,
  "message": "Restaurant added to favorites"
}
```

**Get Favorites Request:**

```
GET /favorites/user_123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get Favorites Response:**

```json
{
  "favorites": [
    {
      "id": "1",
      "name": "JAP-IT Food Hauz",
      "cuisine": "Rice Meal",
      "rating": 4.5,
      "location": "108 Nori, Mabini Extension",
      "priceRange": "₱10-50",
      "sides": "Main Gate",
      "image": null
    }
  ]
}
```

---

### Example 5: Add and Retrieve Reviews

**Add Review Request:**

```json
POST /reviews
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "restaurantId": "1",
  "userId": "user_123",
  "rating": 5,
  "comment": "Great food and very affordable! Highly recommended."
}
```

**Add Review Response:**

```json
{
  "review": {
    "id": "rev_001",
    "restaurantId": "1",
    "userId": "user_123",
    "rating": 5,
    "comment": "Great food and very affordable! Highly recommended.",
    "createdAt": "2026-01-13T10:30:00Z"
  }
}
```

**Get Restaurant Reviews Request:**

```
GET /reviews/restaurant/1
```

**Get Restaurant Reviews Response:**

```json
{
  "reviews": [
    {
      "id": "rev_001",
      "restaurantId": "1",
      "userId": "user_123",
      "rating": 5,
      "comment": "Great food and very affordable! Highly recommended.",
      "createdAt": "2026-01-13T10:30:00Z"
    },
    {
      "id": "rev_002",
      "restaurantId": "1",
      "userId": "user_124",
      "rating": 4,
      "comment": "Good food, but a bit crowded during lunch hours.",
      "createdAt": "2026-01-13T11:15:00Z"
    }
  ]
}
```

---

## Authentication

All endpoints requiring authentication must include the JWT token in the Authorization header:

```
Authorization: Bearer {jwt_token}
```

**Protected Endpoints:**

- POST /favorites
- DELETE /favorites/{userId}/{restaurantId}
- GET /favorites/{userId}
- GET /favorites/{userId}/{restaurantId}
- POST /reviews
- GET /reviews/user/{userId}
- PUT /reviews/{reviewId}
- DELETE /reviews/{reviewId}

---

## Database Schema Reference

For backend developers, the minimal database schema should include:

### users table

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  mobile VARCHAR(20),
  avatar LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### restaurants table

```sql
CREATE TABLE restaurants (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cuisine VARCHAR(100) NOT NULL,
  rating DECIMAL(3,1) NOT NULL,
  location VARCHAR(500) NOT NULL,
  priceRange VARCHAR(50) NOT NULL,
  sides ENUM('Main Gate', 'Gate Six', 'Inside the School', 'North Gate', 'Hospital Gate') NOT NULL,
  image LONGTEXT
);
```

### favorites table

```sql
CREATE TABLE favorites (
  userId VARCHAR(36) NOT NULL,
  restaurantId VARCHAR(36) NOT NULL,
  PRIMARY KEY (userId, restaurantId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

### reviews table

```sql
CREATE TABLE reviews (
  id VARCHAR(36) PRIMARY KEY,
  restaurantId VARCHAR(36) NOT NULL,
  userId VARCHAR(36) NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (restaurantId) REFERENCES restaurants(id) ON DELETE CASCADE
);
```

---

## API Response Consistency

All successful responses should follow a consistent structure:

**Data Endpoints (returning data):**

```json
{
  "key": value or array
}
```

**Action Endpoints (creating/updating/deleting):**

```json
{
  "success": boolean,
  "message": "string (optional)",
  "data": object (optional)
}
```

---

## Rate Limiting & Performance Recommendations

- Implement rate limiting (e.g., 100 requests per minute per IP)
- Add database indexes on frequently queried fields (userId, restaurantId, username, email)
- Cache filter options (categories, budgets, sides) for 1 hour
- Paginate restaurant results if dataset grows large
- Use connection pooling for database connections

---

## Future Enhancements

Potential endpoints to add in future versions:

- `POST /restaurants` - Admin endpoint to add restaurants
- `PUT /restaurants/{id}` - Admin endpoint to update restaurants
- `DELETE /restaurants/{id}` - Admin endpoint to delete restaurants
- `GET /users/{id}` - Get user profile information
- `PUT /users/{id}` - Update user profile
- `GET /restaurants/{id}/stats` - Get restaurant statistics (average rating, review count, etc.)
- `POST /images/upload` - Upload and store restaurant images

---

**Last Updated:** January 13, 2026  
**API Version:** 1.0  
**Frontend Version:** React + Vite + TypeScript
