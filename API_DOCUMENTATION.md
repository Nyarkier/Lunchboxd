# Lunchboxd Web API Documentation

## Overview

This document outlines all the API endpoints and data structures required for the backend to support the Lunchboxd web application. The frontend is currently configured to work with both mock data and real API endpoints.

**Base URL:** `http://localhost:3000/api`

---

## Table of Contents

1. [Data Models](#data-models)
2. [Admin Features](#admin-features)
3. [Core Endpoints](#core-endpoints)
4. [Filtering & Search](#filtering--search)
5. [Authentication & Authorization](#authentication--authorization)
6. [Environment Configuration](#environment-configuration)
7. [Error Handling](#error-handling)
8. [Example Requests & Responses](#example-requests--responses)

---

## Data Models

### User

User account information for authentication and profile management. Users can have roles: `user` or `admin`.

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
  "role": "enum ('user' or 'admin') - optional, defaults to 'user'",
  "createdAt": "ISO 8601 timestamp (optional)"
}
```

**Note:** The frontend receives `AuthUser` (without password and role included):

```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string",
  "avatar": "string or null (optional)",
  "role": "string ('user' or 'admin')"
}
```

**Example Users:**

```json
{
  "id": "user_1",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "username": "juandc",
  "email": "juan@example.com",
  "mobile": "+639171234567",
  "avatar": null,
  "role": "user",
  "createdAt": "2026-01-10T08:00:00Z"
}
```

```json
{
  "id": "admin_1",
  "firstName": "Admin",
  "lastName": "User",
  "username": "admin",
  "email": "admin@lunchboxd.com",
  "avatar": null,
  "role": "admin",
  "createdAt": "2026-01-01T00:00:00Z"
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
  "budgetRange": "string (one of: '10-50', '50-150', '150-500', '500-1000')",
  "type": "string (one of: 'Food', 'Drink')",
  "paymentMode": "array of strings (e.g., ['Cash', 'GCash'])",
  "sides": "enum (see Side enum below)",
  "profileImage": "string or null (URL or base64 image - restaurant profile picture)",
  "menuImages": "array of strings (URLs or base64 images - variable number of menu pictures)"
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

**Budget Ranges:**

- `10-50`: ₱10 - ₱50
- `50-150`: ₱50 - ₱150
- `150-500`: ₱150 - ₱500
- `500-1000`: ₱500 - ₱1000

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

---

## Admin Features

### RestaurantRequest

Users can submit requests to add new restaurants with optional images. Admins review and approve/reject these requests.

```json
{
  "id": "string (unique identifier, e.g., 'req_1')",
  "restaurantName": "string",
  "cuisine": "string",
  "location": "string",
  "budgetRange": "string (one of: '10-50', '50-150', '150-500', '500-1000')",
  "type": "string (one of: 'Food', 'Drink')",
  "paymentMode": "array of strings (['Cash', 'GCash'])",
  "sides": "enum (see Side enum above)",
  "description": "string (optional - why they recommend this restaurant)",
  "submittedBy": "string (userId of submitter)",
  "submittedAt": "ISO 8601 timestamp",
  "status": "enum ('pending', 'approved', 'rejected')",
  "contact": "string (optional - phone number or email)",
  "profileImage": "string or null (optional, base64 encoded image or URL)",
  "menuImages": "array of strings (optional, base64 encoded images or URLs, max 5 images)"
}
```

**Image Specifications:**

- **Profile Image**: Single restaurant photo (display image, used as primary thumbnail)
- **Menu Images**: Up to 5 additional images (menu photos, dish samples, ambiance, etc.)
- **Format**: Base64 encoded data URIs or image URLs
- **Maximum Size**: 5MB per image
- **Accepted Types**: JPEG, PNG, GIF, WebP
- **Storage**: Images stored with request in mock backend; backend should handle persistent storage

**Status Values:**

- `pending`: Awaiting admin review
- `approved`: Admin has approved the request (restaurant should be added)
- `rejected`: Admin has rejected the request

---

### ContactMessage

Users can submit feedback, bug reports, and inquiries through the "Talk With Us" form.

```json
{
  "id": "string (unique identifier, e.g., 'msg_1')",
  "senderName": "string",
  "senderEmail": "string",
  "subject": "enum (one of: 'General Feedback', 'Bug Report', 'Feature Request', 'Partnership Inquiry', 'Other')",
  "message": "string",
  "submittedAt": "ISO 8601 timestamp",
  "status": "enum ('unread', 'read')"
}
```

**Subject Options:**

- `General Feedback`: General comments about the app
- `Bug Report`: Report of technical issues
- `Feature Request`: Suggestions for new features
- `Partnership Inquiry`: Business partnership inquiries
- `Other`: Other inquiries

---

## Core Endpoints

### 1. Restaurants

#### Get All Restaurants

```
GET /restaurants?search=query&category=cuisine&budgets=10-50,50-150&sides=Main Gate,Gate Six
```

**Query Parameters:**

- `search` (optional): Search by name, cuisine, or location
- `category` (optional): Filter by cuisine type
- `budgets` (optional): Comma-separated budget ranges
- `sides` (optional): Comma-separated gate locations

**Response (200):**

```json
{
  "restaurants": [
    {
      "id": "1",
      "name": "JAP-IT Food Hauz",
      "cuisine": "Rice Meal",
      "rating": 4.5,
      "location": "108 Nori, Mabini Extension",
      "budgetRange": "10-50",
      "type": "Food",
      "paymentMode": ["Cash", "GCash"],
      "sides": "Main Gate",
      "profileImage": "https://...",
      "menuImages": ["https://..."]
    }
  ]
}
```

---

#### Get Single Restaurant

```
GET /restaurants/{restaurantId}
```

**Response (200):**

```json
{
  "restaurant": { ... }
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

**Response (200):**

```json
{
  "user": {
    "id": "user_123",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": null,
    "role": "user"
  },
  "token": "jwt_token_here"
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

**Response (201):**

```json
{
  "user": {
    "id": "user_124",
    "firstName": "Jane",
    "lastName": "Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "avatar": null,
    "role": "user"
  },
  "token": "jwt_token_here"
}
```

---

### 3. Favorites

#### Add Favorite

```
POST /favorites
Authorization: Bearer {token}

{
  "userId": "string",
  "restaurantId": "string"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Restaurant added to favorites"
}
```

---

#### Remove Favorite

```
DELETE /favorites/{userId}/{restaurantId}
Authorization: Bearer {token}
```

---

#### Get User Favorites

```
GET /favorites/{userId}
Authorization: Bearer {token}
```

---

#### Check if Favorite

```
GET /favorites/{userId}/{restaurantId}
Authorization: Bearer {token}
```

---

### 4. Reviews

#### Add Review

```
POST /reviews
Authorization: Bearer {token}

{
  "restaurantId": "string",
  "userId": "string",
  "rating": "number (1-5)",
  "comment": "string"
}
```

---

#### Get Restaurant Reviews

```
GET /reviews/restaurant/{restaurantId}
```

---

#### Get User Reviews

```
GET /reviews/user/{userId}
Authorization: Bearer {token}
```

---

#### Update Review

```
PUT /reviews/{reviewId}
Authorization: Bearer {token}

{
  "rating": "number (1-5)",
  "comment": "string"
}
```

---

#### Delete Review

```
DELETE /reviews/{reviewId}
Authorization: Bearer {token}
```

---

### 5. Filters

#### Get Available Filters

```
GET /filters
```

**Response (200):**

```json
{
  "categories": ["All", "Rice Meal", "Cafe", "Chicken", "Fast Food"],
  "budgets": ["10-50", "50-150", "150-500", "500-1000"],
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

## Admin Features Endpoints

### 1. Restaurant Requests

#### Get All Restaurant Requests (Admin Only)

```
GET /admin/restaurant-requests
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "requests": [
    {
      "id": "req_1",
      "restaurantName": "The Grill House",
      "cuisine": "Grilled Dishes",
      "location": "Avenue Street, Campus Area",
      "budgetRange": "150-500",
      "type": "Food",
      "paymentMode": ["Cash", "GCash"],
      "sides": "Main Gate",
      "description": "A cozy grill restaurant...",
      "submittedBy": "user_1",
      "submittedAt": "2026-01-15T10:30:00Z",
      "status": "pending",
      "contact": "+639171234567"
    }
  ]
}
```

---

#### Create Restaurant Request (User)

```
POST /admin/restaurant-requests
Authorization: Bearer {token}

{
  "restaurantName": "string",
  "cuisine": "string",
  "location": "string",
  "budgetRange": "string",
  "type": "string",
  "paymentMode": ["string"],
  "sides": "string",
  "description": "string (optional)",
  "contact": "string (optional)",
  "submittedBy": "string"
}
```

**Response (201):**

```json
{
  "request": { ... }
}
```

---

#### Approve Restaurant Request (Admin Only)

```
PUT /admin/restaurant-requests/{requestId}/approve
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Restaurant request approved",
  "request": {
    "id": "req_1",
    "status": "approved"
  }
}
```

---

#### Reject Restaurant Request (Admin Only)

```
PUT /admin/restaurant-requests/{requestId}/reject
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Restaurant request rejected",
  "request": {
    "id": "req_1",
    "status": "rejected"
  }
}
```

---

#### Create Restaurant Request with Images (User)

```
POST /admin/restaurant-requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "restaurantName": "string",
  "cuisine": "string",
  "location": "string",
  "budgetRange": "string",
  "type": "string",
  "paymentMode": ["string"],
  "sides": "string",
  "description": "string (optional)",
  "contact": "string (optional)",
  "submittedBy": "string",
  "profileImage": "string (optional, base64 encoded image or image URL)",
  "menuImages": ["string"] (optional, array of base64 encoded images or URLs, max 5)
}
```

**Image Guidelines:**

- Send as base64 data URIs (e.g., `data:image/jpeg;base64,/9j/4AAQSkZ...`)
- Frontend validates: file type (image/\*), size (≤5MB per image), max count (≤5 menu images)
- Backend should validate and store/process images for persistence

**Response (201):**

```json
{
  "request": {
    "id": "req_1",
    "restaurantName": "The Grill House",
    "cuisine": "Grilled Dishes",
    "location": "Avenue Street, Campus Area",
    "budgetRange": "150-500",
    "type": "Food",
    "paymentMode": ["Cash", "GCash"],
    "sides": "Main Gate",
    "description": "A cozy grill restaurant...",
    "submittedBy": "user_1",
    "submittedAt": "2026-01-15T10:30:00Z",
    "status": "pending",
    "contact": "+639171234567",
    "profileImage": "data:image/jpeg;base64/9j/4AAQSkZ...",
    "menuImages": [
      "data:image/jpeg;base64/9j/4AAQSkZ...",
      "data:image/png;base64/iVBORw0KGgo..."
    ]
  }
}
```

---

#### Get Restaurant Request Details (Admin Only)

```
GET /admin/restaurant-requests/{requestId}
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "request": {
    "id": "req_1",
    "restaurantName": "The Grill House",
    "cuisine": "Grilled Dishes",
    "location": "Avenue Street, Campus Area",
    "budgetRange": "150-500",
    "type": "Food",
    "paymentMode": ["Cash", "GCash"],
    "sides": "Main Gate",
    "description": "A cozy grill restaurant...",
    "submittedBy": "user_1",
    "submittedAt": "2026-01-15T10:30:00Z",
    "status": "pending",
    "contact": "+639171234567",
    "profileImage": "data:image/jpeg;base64/9j/4AAQSkZ...",
    "menuImages": [
      "data:image/jpeg;base64/9j/4AAQSkZ...",
      "data:image/png;base64/iVBORw0KGgo..."
    ]
  }
}
```

---

### 2. Contact Messages

#### Get All Contact Messages (Admin Only)

```
GET /admin/messages
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "messages": [
    {
      "id": "msg_1",
      "senderName": "Juan Santos",
      "senderEmail": "juan@email.com",
      "subject": "General Feedback",
      "message": "Great app!...",
      "submittedAt": "2026-01-16T15:45:00Z",
      "status": "unread"
    }
  ]
}
```

---

#### Create Contact Message (Public)

```
POST /admin/messages
Content-Type: application/json

{
  "senderName": "string",
  "senderEmail": "string",
  "subject": "string",
  "message": "string"
}
```

**Valid Subjects:**

- `General Feedback`
- `Bug Report`
- `Feature Request`
- `Partnership Inquiry`
- `Other`

**Response (201):**

```json
{
  "message": { ... }
}
```

---

#### Delete Contact Message (Admin Only)

```
DELETE /admin/messages/{messageId}
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

### 3. Admin Dashboard Statistics

#### Get Dashboard Statistics (Admin Only)

```
GET /admin/dashboard-stats
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "statistics": {
    "totalRestaurantRequests": 15,
    "pendingRequests": 3,
    "approvedRequests": 10,
    "rejectedRequests": 2,
    "totalContactMessages": 25,
    "unreadMessages": 5,
    "readMessages": 20,
    "totalUsers": 42,
    "newUsersThisMonth": 8,
    "totalReviews": 128,
    "averageRating": 4.3,
    "monthlyUserGrowth": [
      { "month": "January", "users": 5 },
      { "month": "February", "users": 8 },
      { "month": "March", "users": 12 },
      { "month": "April", "users": 17 }
    ],
    "requestStatusBreakdown": {
      "pending": 3,
      "approved": 10,
      "rejected": 2
    },
    "messageStatusDistribution": {
      "unread": 5,
      "read": 20
    }
  }
}
```

---

### 4. Admin Inbox Module

The Inbox module displays contact messages from users via the "Talk With Us" form. Admins can view, mark as read, and delete messages.

#### Get All Messages (Admin Only)

```
GET /admin/inbox
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "messages": [
    {
      "id": "msg_1",
      "senderName": "Juan Santos",
      "senderEmail": "juan@email.com",
      "subject": "Feedback about the app",
      "message": "Great app! I really enjoy using it...",
      "submittedAt": "2026-01-16T15:45:00Z",
      "status": "unread"
    },
    {
      "id": "msg_2",
      "senderName": "Maria Rodriguez",
      "senderEmail": "maria.r@email.com",
      "subject": "Bug report",
      "message": "I found a bug where...",
      "submittedAt": "2026-01-16T12:30:00Z",
      "status": "read"
    }
  ]
}
```

---

#### Mark Message as Read/Unread (Admin Only)

```
PUT /admin/inbox/{messageId}
Authorization: Bearer {admin-token}

{
  "status": "read" | "unread"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Message status updated",
  "updatedMessage": {
    "id": "msg_1",
    "status": "read"
  }
}
```

---

#### Delete Message (Admin Only)

```
DELETE /admin/inbox/{messageId}
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Message deleted successfully"
}
```

---

### 5. Requested Restaurants Module

The Requested Restaurants module displays user-submitted restaurant requests pending admin approval. Admins can approve requests (which adds the restaurant to the main directory) or reject them.

#### Get All Requests (Admin Only)

```
GET /admin/requested-restaurants
Authorization: Bearer {admin-token}
```

**Query Parameters:**

- `status` (optional): Filter by status ('pending', 'approved', 'rejected')

**Response (200):**

```json
{
  "requests": [
    {
      "id": "req_1",
      "restaurantName": "The Grill House",
      "cuisine": "Grilled Dishes",
      "location": "Avenue Street, Campus Area",
      "budgetRange": "150-500",
      "type": "Food",
      "paymentMode": ["Cash", "GCash"],
      "sides": "Main Gate",
      "description": "A cozy grill restaurant specializing in grilled steaks and seafood",
      "submittedBy": "user_1",
      "submittedAt": "2026-01-15T10:30:00Z",
      "status": "pending",
      "contact": "+639171234567",
      "profileImage": "string or null (optional)",
      "menuImages": ["string"] (optional, array of up to 5 images)
    }
  ]
}
```

---

#### Get Request Details (Admin Only)

```
GET /admin/requested-restaurants/{requestId}
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "request": {
    "id": "req_1",
    "restaurantName": "The Grill House",
    "cuisine": "Grilled Dishes",
    "location": "Avenue Street, Campus Area",
    "budgetRange": "150-500",
    "type": "Food",
    "paymentMode": ["Cash", "GCash"],
    "sides": "Main Gate",
    "description": "A cozy grill restaurant...",
    "submittedBy": "user_1",
    "submittedAt": "2026-01-15T10:30:00Z",
    "status": "pending",
    "contact": "+639171234567",
    "profileImage": "data:image/jpeg;base64,...",
    "menuImages": ["data:image/jpeg;base64,...", "data:image/png;base64,..."]
  }
}
```

---

#### Approve Restaurant Request (Admin Only)

When a request is approved, the restaurant should be added to the main restaurants collection.

```
POST /admin/requested-restaurants/{requestId}/approve
Authorization: Bearer {admin-token}
```

**Request Body (optional):**

```json
{
  "notes": "string (optional admin notes)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Restaurant approved and added to directory",
  "request": {
    "id": "req_1",
    "status": "approved"
  },
  "restaurant": {
    "id": "rest_1",
    "name": "The Grill House",
    "cuisine": "Grilled Dishes",
    "location": "Avenue Street, Campus Area",
    "budget": "150-500",
    "rating": 0,
    "reviewCount": 0,
    "image": "data:image/jpeg;base64,..."
  }
}
```

---

#### Reject Restaurant Request (Admin Only)

```
POST /admin/requested-restaurants/{requestId}/reject
Authorization: Bearer {admin-token}
```

**Request Body (optional):**

```json
{
  "reason": "string (optional rejection reason to send to user)"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Restaurant request rejected",
  "request": {
    "id": "req_1",
    "status": "rejected"
  }
}
```

---

### 2. Contact Messages

#### Get All Contact Messages (Admin Only)

```
GET /admin/messages
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "messages": [
    {
      "id": "msg_1",
      "senderName": "Juan Santos",
      "senderEmail": "juan@email.com",
      "subject": "General Feedback",
      "message": "Great app!...",
      "submittedAt": "2026-01-16T15:45:00Z",
      "status": "unread"
    }
  ]
}
```

---

#### Create Contact Message (Public)

```
POST /admin/messages
Content-Type: application/json

{
  "senderName": "string",
  "senderEmail": "string",
  "subject": "string",
  "message": "string"
}
```

**Valid Subjects:**

- `General Feedback`
- `Bug Report`
- `Feature Request`
- `Partnership Inquiry`
- `Other`

**Response (201):**

```json
{
  "message": { ... }
}
```

---

#### Mark Message as Read (Admin Only)

```
PUT /admin/messages/{messageId}/read
Authorization: Bearer {admin-token}
```

---

#### Get Dashboard Statistics (Admin Only)

```
GET /admin/dashboard-stats
Authorization: Bearer {admin-token}
```

**Response (200):**

```json
{
  "statistics": {
    "totalRestaurantRequests": 15,
    "pendingRequests": 3,
    "approvedRequests": 10,
    "rejectedRequests": 2,
    "totalContactMessages": 25,
    "unreadMessages": 5,
    "readMessages": 20,
    "totalUsers": 42,
    "newUsersThisMonth": 8,
    "totalReviews": 128,
    "averageRating": 4.3,
    "monthlyUserGrowth": [
      { "month": "January", "users": 5 },
      { "month": "February", "users": 8 },
      { "month": "March", "users": 12 },
      { "month": "April", "users": 17 }
    ],
    "requestStatusBreakdown": {
      "pending": 3,
      "approved": 10,
      "rejected": 2
    },
    "messageStatusDistribution": {
      "unread": 5,
      "read": 20
    }
  }
}
```

**Data for Analytics:**

- **Request Status Distribution**: Pie chart showing pending/approved/rejected counts
- **Message Status**: Bar chart showing unread vs read message counts
- **Monthly User Growth**: Line chart tracking new users per month
- Use this data to populate charts in the Admin Dashboard

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
- Valid values: "10-50", "50-150", "150-500", "500-1000"

### Sides Filter

- Filter by nearest gate location
- Valid values: "Main Gate", "Gate Six", "Inside the School", "North Gate", "Hospital Gate"

### Combined Filtering Example

```
GET /restaurants?search=JAP&category=Rice Meal&budgets=10-50,50-150&sides=Main Gate
```

---

## Authentication & Authorization

### Token-Based Authentication

All endpoints requiring authentication must include the JWT token:

```
Authorization: Bearer {jwt_token}
```

### Role-Based Access Control

**Admin-Only Endpoints:**

- `GET /admin/restaurant-requests` - View all restaurant requests
- `GET /admin/restaurant-requests/{id}` - View request details with images
- `PUT /admin/restaurant-requests/{id}/approve` - Approve restaurant request
- `PUT /admin/restaurant-requests/{id}/reject` - Reject restaurant request
- `GET /admin/messages` - View all contact messages
- `PUT /admin/messages/{id}/read` - Mark message as read
- `GET /admin/dashboard-stats` - View dashboard statistics and analytics data

**User Endpoints (require authentication):**

- `POST /favorites` - Add favorite
- `DELETE /favorites/{userId}/{restaurantId}` - Remove favorite
- `GET /favorites/{userId}` - Get favorites
- `POST /reviews` - Add review
- `PUT /reviews/{reviewId}` - Update review
- `DELETE /reviews/{reviewId}` - Delete review
- `GET /reviews/user/{userId}` - Get user reviews
- `POST /admin/restaurant-requests` - Submit restaurant

**Public Endpoints:**

- `GET /restaurants` - Get restaurants
- `GET /restaurants/{id}` - Get single restaurant
- `GET /filters` - Get filters
- `GET /reviews/restaurant/{restaurantId}` - Get reviews
- `POST /auth/register` - Register
- `POST /auth/login` - Login
- `POST /admin/messages` - Submit message

---

## Environment Configuration

```bash
# .env file (in frontend root)
VITE_USE_MOCK=false  # Set to true for mock data
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
- `201 Created`: Resource created
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: Invalid token
- `403 Forbidden`: No permission (role check)
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Error Examples

**Missing Fields:**

```json
{
  "error": "Missing required field: restaurantName",
  "statusCode": 400
}
```

**Admin Access Required:**

```json
{
  "error": "Forbidden: Admin access required",
  "statusCode": 403
}
```

**Invalid Data:**

```json
{
  "error": "Invalid budget range. Must be one of: 10-50, 50-150, 150-500, 500-1000",
  "statusCode": 400
}
```

---

## Database Schema Reference

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
  role ENUM('user', 'admin') DEFAULT 'user',
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
  budgetRange ENUM('10-50', '50-150', '150-500', '500-1000') NOT NULL,
  type ENUM('Food', 'Drink'),
  paymentMode VARCHAR(255),
  sides ENUM('Main Gate', 'Gate Six', 'Inside the School', 'North Gate', 'Hospital Gate') NOT NULL,
  profileImage LONGTEXT,
  menuImages LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

### restaurant_requests table

```sql
CREATE TABLE restaurant_requests (
  id VARCHAR(36) PRIMARY KEY,
  restaurantName VARCHAR(255) NOT NULL,
  cuisine VARCHAR(100) NOT NULL,
  location VARCHAR(500) NOT NULL,
  budgetRange ENUM('10-50', '50-150', '150-500', '500-1000') NOT NULL,
  type ENUM('Food', 'Drink') NOT NULL,
  paymentMode VARCHAR(255) NOT NULL,
  sides ENUM('Main Gate', 'Gate Six', 'Inside the School', 'North Gate', 'Hospital Gate') NOT NULL,
  description TEXT,
  submittedBy VARCHAR(36) NOT NULL,
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  contact VARCHAR(50),
  FOREIGN KEY (submittedBy) REFERENCES users(id) ON DELETE CASCADE
);
```

### contact_messages table

```sql
CREATE TABLE contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  senderName VARCHAR(255) NOT NULL,
  senderEmail VARCHAR(255) NOT NULL,
  subject ENUM('General Feedback', 'Bug Report', 'Feature Request', 'Partnership Inquiry', 'Other') NOT NULL,
  message TEXT NOT NULL,
  submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('unread', 'read') DEFAULT 'unread'
);
```

---

## Testing Default Credentials

**Admin Account:**

- Username: `admin`
- Password: `admin123`
- Role: `admin`

**Test User Accounts:**

- Username: `user1`, Password: `user123`, Role: `user`
- Username: `user2`, Password: `user123`, Role: `user`
- Username: `user3`, Password: `user123`, Role: `user`

---

## Rate Limiting & Performance

- Implement rate limiting (100 requests/minute per IP)
- Add indexes on: userId, restaurantId, username, email, status
- Cache filters for 1 hour
- Cache restaurants for 30 minutes
- Paginate results (20 items per page)
- Use connection pooling
- Implement gzip compression

---

**Last Updated:** January 20, 2026  
**API Version:** 2.2 (Admin Modules & Real Data Integration Added)  
**Recent Changes:**

- Added Inbox module endpoints for managing contact messages (/admin/inbox)
- Added Requested Restaurants module endpoints for restaurant approval workflow (/admin/requested-restaurants)
- Added useAdminStats hook integration for real-time dashboard statistics
- Enhanced admin dashboard with unread message count tracking
- Implemented message status updates (read/unread) in Inbox module
- Added restaurant approval workflow with database integration
- Frontend Version: React 18+ with TypeScript, Vite build tool
- Backend Requirements: Node.js, Express, JWT auth, SQL Database, Image storage/processing
