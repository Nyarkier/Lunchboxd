# Admin & User Contribution Module - Implementation Guide

## Overview

This document outlines the comprehensive **Admin & User Contribution** module implemented for the Lunchboxd restaurant discovery system. The module enables users to contribute to the platform by submitting new restaurants and providing feedback, while admins can review and manage these contributions through a professional dashboard.

## Table of Contents

1. [Features Overview](#features-overview)
2. [Architecture](#architecture)
3. [User-Facing Features](#user-facing-features)
4. [Admin Features](#admin-features)
5. [Authentication & Roles](#authentication--roles)
6. [API & Backend](#api--backend)
7. [Testing Credentials](#testing-credentials)
8. [Developer Setup](#developer-setup)

---

## Features Overview

### User-Facing Features

#### 1. **Add a Restaurant Page** (`/add-restaurant`)

- Responsive form for users to submit new restaurant information
- Fields include:
  - Restaurant Name
  - Cuisine Type
  - Location
  - Budget Range (₱10-50, ₱50-150, ₱150-500, ₱500-1000)
  - Type (Food or Drink)
  - Payment Methods (Cash, GCash)
  - Side/Location (Main Gate, Gate Six, Inside the School, North Gate, Hospital Gate)
  - Description (optional)
  - Contact Number (optional)
- Success confirmation page upon submission
- Data saved to mock backend for admin review

#### 2. **Talk With Us Page** (`/talk-with-us`)

- Simple contact form for user feedback
- Fields include:
  - Name
  - Email
  - Subject (dropdown with predefined options)
  - Message (textarea)
- Subject options:
  - General Feedback
  - Bug Report
  - Feature Request
  - Partnership Inquiry
  - Other
- Success confirmation upon submission
- All messages sent to admin dashboard

#### 3. **Updated Hero Section**

- **"Add a Restaurant"** button (Orange) - navigates to `/add-restaurant`
- **"Talk With Us"** button (Orange with white border) - navigates to `/talk-with-us`
- Positioned below existing "Directory" and "Can't Decide?" buttons
- Fully responsive across all device sizes

### Admin Features

#### 1. **Admin Dashboard** (`/admin/dashboard`)

Professional dashboard with:

**Key Metrics Display:**

- Total Restaurant Requests
- Pending Requests (yellow indicator)
- Approved Requests (green indicator)
- Total Contact Messages
- Unread Messages (orange indicator)

**Restaurant Requests Management:**

- View all submitted restaurant requests
- Filter by status (pending, approved, rejected)
- Individual request details with full information
- Action buttons:
  - **Approve**: Mark restaurant request as approved
  - **Reject**: Mark restaurant request as rejected
- Status tracking (Pending, Approved, Rejected)

**Contact Messages Management:**

- View all user contact messages
- Status indicators (unread, read)
- Full message display with sender information
- Action buttons:
  - **Mark as Read**: Toggle message read status
  - **Mark as Unread**: Revert to unread status

#### 2. **Dashboard Navigation**

- Tab-based interface for switching between views
- Real-time statistics updates
- Responsive design for all screen sizes

---

## Architecture

### Directory Structure

```
src/
├── pages/
│   ├── AdminDashboard.tsx      (New)
│   ├── AddRestaurant.tsx       (New)
│   ├── TalkWithUs.tsx          (New)
│   └── ...existing pages
├── services/
│   ├── adminService.ts         (New)
│   ├── authService.ts          (Updated)
│   └── ...existing services
├── types/
│   └── types.ts                (Updated with new types)
├── contexts/
│   └── AuthContext.tsx         (Updated with role support)
├── components/
│   └── ProtectedRoute/
│       └── ProtectedRoute.tsx  (Updated for role-based access)
└── App.tsx                     (Updated with new routes)

mock-backend/
├── admin-data.json             (New)
├── users.json                  (Updated with roles)
└── data.json
```

### Data Models

#### User Model (Updated)

```typescript
interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  mobile?: string;
  avatar?: string | null;
  createdAt?: string;
  role?: "user" | "admin"; // NEW: Role field
}
```

#### RestaurantRequest (New)

```typescript
interface RestaurantRequest {
  id: string;
  restaurantName: string;
  cuisine: string;
  location: string;
  budgetRange: "10-50" | "50-150" | "150-500" | "500-1000";
  type: "Food" | "Drink";
  paymentMode: ("Cash" | "GCash")[];
  sides: Side;
  description?: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  contact?: string;
}
```

#### ContactMessage (New)

```typescript
interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: "unread" | "read";
}
```

---

## User-Facing Features

### 1. Add a Restaurant Form

**URL:** `/add-restaurant`

**Validation:**

- Restaurant name is required
- Cuisine is required
- Location is required
- At least one payment method must be selected
- All form fields are properly validated before submission

**Success Flow:**

1. User fills out the form
2. Form validates all required fields
3. Request is submitted to admin service
4. Success page is displayed with confirmation
5. Form is reset for the next submission

**Features:**

- Fully responsive design
- Real-time field validation
- Accessible form inputs with clear labels
- Submit button with loading state
- Success confirmation with redirect options

### 2. Talk With Us Form

**URL:** `/talk-with-us`

**Validation:**

- Name is required
- Email is required and must be valid
- Subject is required
- Message is required (cannot be empty)

**Success Flow:**

1. User fills out the contact form
2. Email format is validated
3. Message is submitted to admin service
4. Confirmation page is displayed
5. Message appears in admin dashboard

**Features:**

- Subject dropdown with predefined categories
- Rich validation with specific error messages
- Responsive textarea for detailed messages
- Professional form styling consistent with system theme
- Helpful note about response time

### 3. Hero Section Updates

**Changes:**

- New section added below existing buttons
- Two new buttons with orange accent color (#E67E22)
- "ADD A RESTAURANT" button (solid orange)
- "TALK WITH US" button (orange outline)
- Hover effects and scale animations
- Fully responsive for mobile, tablet, and desktop

---

## Admin Features

### 1. Role-Based Authentication

**Admin Login:**

- Username: `admin`
- Email: `admin@lunchboxd.com`
- Password: `admin123`

**Regular User Login:**

- Test credentials available in `mock-backend/users.json`
- Example: `princelord_m` / `password123`

**Role Assignment:**

- Users created via signup default to `"user"` role
- Admin accounts have `"admin"` role
- Role is stored in user data and localStorage

### 2. Admin Dashboard

**Access:** `/admin/dashboard` (Protected - Admin only)

**Dashboard Features:**

**Statistics Panel:**

- Real-time metrics calculation
- Color-coded status indicators
- Visual representation of pending vs. approved requests

**Restaurant Requests Tab:**

- Lists all submitted restaurant requests
- Displays request details:
  - Restaurant name and cuisine type
  - Location and budget range
  - Payment methods accepted
  - Submission details and timestamp
- Status badges with color coding
- Action buttons for approved/rejected requests
- Pending requests show both Approve and Reject buttons

**Contact Messages Tab:**

- Lists all received contact messages
- Shows sender information and subject
- Message preview with full text display
- Read/Unread status tracking
- Toggle buttons to change message status

**Interactive Features:**

- Tab switching between requests and messages
- Real-time updates after actions
- Professional UI with consistent theming
- Mobile-responsive design

---

## Authentication & Roles

### Role Management

#### User Roles

- **user**: Regular user account
- **admin**: Administrator account with dashboard access

#### Role-Based Routing

```
User (role: "user")
├── Can access: /, /login, /signup, /directory, /profile, /favorites, /reviews, /add-restaurant, /talk-with-us
└── Cannot access: /admin/dashboard

Admin (role: "admin")
├── Can access: All user routes + /admin/dashboard
└── Redirect to /profile if trying to access protected routes without admin role
```

### Login Flow

**User Login:**

1. Enter credentials (email/username + password)
2. System validates credentials
3. User object with role is retrieved
4. User is redirected to `/profile`

**Admin Login:**

1. Enter admin credentials
2. System validates admin credentials
3. Admin object with "admin" role is retrieved
4. Admin is redirected to `/admin/dashboard`

### ProtectedRoute Component (Updated)

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "user" | "admin";
}
```

**Usage:**

```tsx
// User-only route
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

// Admin-only route
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

---

## API & Backend

### Admin Service Methods

#### Restaurant Requests

```typescript
// Get all restaurant requests
getRestaurantRequests(): Promise<RestaurantRequest[]>

// Get specific request by ID
getRestaurantRequestById(id: string): Promise<RestaurantRequest | null>

// Create new restaurant request
createRestaurantRequest(request: Omit<RestaurantRequest, 'id' | 'submittedAt' | 'status'>): Promise<RestaurantRequest>

// Update request status
updateRestaurantRequestStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<RestaurantRequest | null>

// Delete request
deleteRestaurantRequest(id: string): Promise<boolean>
```

#### Contact Messages

```typescript
// Get all contact messages
getContactMessages(): Promise<ContactMessage[]>

// Get specific message by ID
getContactMessageById(id: string): Promise<ContactMessage | null>

// Create new contact message
createContactMessage(message: Omit<ContactMessage, 'id' | 'submittedAt' | 'status'>): Promise<ContactMessage>

// Update message status
updateContactMessageStatus(id: string, status: 'unread' | 'read'): Promise<ContactMessage | null>

// Delete message
deleteContactMessage(id: string): Promise<boolean>
```

#### Dashboard Statistics

```typescript
// Get dashboard statistics
getDashboardStats(): Promise<{
  totalRestaurantRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  totalContactMessages: number;
  unreadMessages: number;
}>
```

### Mock Backend Data

**Admin Data File:** `mock-backend/admin-data.json`

Contains:

- Initial restaurant requests
- Initial contact messages
- Pre-populated data for testing

**Users File:** `mock-backend/users.json`

Updated with:

- `role` field for all users
- Default role: `"user"`
- One admin account with role: `"admin"`

---

## Testing Credentials

### Admin Account

```
Username: admin
Email: admin@lunchboxd.com
Password: admin123
```

### Regular Users

```
1. Username: princelord_m
   Email: princelord@example.com
   Password: password123

2. Username: kurtvalera
   Email: kurt.valera@example.com
   Password: password456

3. Username: raisen_y
   Email: raisen.yamul@example.com
   Password: password789
```

---

## Developer Setup

### Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

### Key Files Modified/Created

**New Files:**

- `src/pages/AdminDashboard.tsx`
- `src/pages/AddRestaurant.tsx`
- `src/pages/TalkWithUs.tsx`
- `src/services/adminService.ts`
- `mock-backend/admin-data.json`
- `ADMIN_MODULE_DOCUMENTATION.md` (this file)

**Updated Files:**

- `src/types/types.ts` (Added role field and new types)
- `src/contexts/AuthContext.tsx` (Added isAdmin property)
- `src/services/authService.ts` (Updated to handle roles)
- `src/components/ProtectedRoute/ProtectedRoute.tsx` (Added role-based access)
- `src/components/Home/Hero.tsx` (Added new buttons)
- `src/pages/Login.tsx` (Updated role-based redirect)
- `src/App.tsx` (Added new routes)
- `mock-backend/users.json` (Added role field and admin account)

### Theme & Color Palette

**Primary Colors:**

- Forest Dark: `#2d5a27`
- Forest Mid: `#628141`
- Sand: `#e5c287`
- Off-White: `#fbfff1`

**Accent Colors:**

- Orange: `#E67E22`
- Green (Approved): `#10b981`
- Yellow (Pending): `#f59e0b`
- Red (Rejected): `#ef4444`

### Responsive Design

All new components are fully responsive:

- **Mobile:** Single column, stacked layouts
- **Tablet:** Multi-column where appropriate
- **Desktop:** Full multi-column layouts with optimal spacing

---

## Next Steps & Future Enhancements

### Possible Improvements

1. **Email Notifications**
   - Send confirmation emails to users
   - Notify admins of new submissions

2. **Advanced Filtering**
   - Filter restaurant requests by date, status, etc.
   - Search functionality in admin dashboard

3. **Approved Restaurants**
   - Auto-add approved restaurants to main directory
   - Create restaurant from approved request

4. **Admin Analytics**
   - Charts and graphs for submissions over time
   - User contribution statistics

5. **Real Backend Integration**
   - Connect to actual REST API
   - Database persistence
   - Real email service

---

## Support & Troubleshooting

### Common Issues

**Admin Dashboard Not Loading:**

- Ensure you're logged in as admin (role: "admin")
- Check browser console for errors
- Verify localStorage has correct user data

**Forms Not Submitting:**

- Verify all required fields are filled
- Check console for validation errors
- Ensure email format is valid

**Role-Based Redirect Not Working:**

- Clear browser cache and localStorage
- Re-login with correct credentials
- Verify user role in mock-backend/users.json

---

## Contact & Questions

For questions about this implementation, refer to the existing documentation or create an issue in the project repository.

---

**Last Updated:** January 19, 2026
**Version:** 1.0
**Status:** Complete Implementation
