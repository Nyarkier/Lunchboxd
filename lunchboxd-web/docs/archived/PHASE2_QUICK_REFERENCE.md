# Phase 2 Quick Reference Guide

## 🚀 Quick Start

The admin dashboard now has two new modules plus enhanced real-time data:

### 1. Access Admin Inbox

**URL:** `http://localhost:5173/admin/inbox`
**What You Can Do:**

- View all contact messages from users
- Mark messages as read/unread
- Delete unwanted messages
- View message details in side panel

**Key Stats:**

- Shows count of unread messages
- Shows count of read messages
- Total message breakdown

---

### 2. Access Requested Restaurants

**URL:** `http://localhost:5173/admin/requested-restaurants`
**What You Can Do:**

- Review pending restaurant submissions
- Approve restaurants (adds to main directory)
- Reject restaurants
- View all restaurant details with images

**Key Stats:**

- Pending requests count
- Approved restaurants count
- Rejected restaurants count

---

### 3. Dashboard Statistics (Updated)

**URL:** `http://localhost:5173/admin/dashboard`
**Now Shows:**

- 👥 Total Users (real count)
- 🍽️ Total Restaurants (real count)
- ⏳ Pending Requests (real count from requests list)
- ⭐ Total Reviews (real count)
- 📧 Unread Messages (real count from messages)

---

## 📱 Responsive Design

### Mobile Devices (< 640px)

- Sidebar collapses to burger menu
- Single column layout
- Touch-friendly buttons
- Horizontal scroll for tables

### Tablets (640px - 1024px)

- Sidebar visible
- 2-column layouts
- Optimized spacing
- Readable text

### Desktop (> 1024px)

- Full sidebar
- Multi-column layouts
- All features visible
- Optimal spacing

---

## 🔑 Key Features

### Inbox Features

✅ View all contact messages  
✅ See unread message count  
✅ Mark messages as read  
✅ Delete messages  
✅ View full message details  
✅ Sort by sender name  
✅ Filter by read/unread status

### Requested Restaurants Features

✅ View pending requests  
✅ See restaurant details  
✅ View contact information  
✅ Approve restaurants  
✅ Reject restaurants  
✅ Track request status  
✅ See pending/approved/rejected counts

### Dashboard Features

✅ Real-time statistics  
✅ Loading states  
✅ Error handling  
✅ Responsive design  
✅ Mobile-friendly

---

## 💾 Data Storage

### Inbox Data

- Stored in: `mock-backend/admin-data.json`
- Field: `contactMessages`
- Updates: In-memory during session

### Requested Restaurants Data

- Stored in: `mock-backend/admin-data.json`
- Field: `restaurantRequests`
- Updates: In-memory during session
- Approved restaurants saved to: `localStorage` → `restaurants`

### Dashboard Data

- Users: `localStorage` → `users`
- Restaurants: `localStorage` → `restaurants`
- Reviews: `localStorage` → `reviews`
- Pending requests: Calculated from admin requests
- Unread messages: Calculated from admin messages

---

## 🎨 UI Components Used

### Inbox

- Message list cards with status badges
- Detail panel for viewing full messages
- Statistics boxes
- Mark as read button
- Delete button with confirm
- Responsive grid layout

### Requested Restaurants

- Request cards with status badges
- Detail panel with all information
- Approve/Reject buttons
- Statistics boxes
- Status indicator icons
- Responsive grid layout

### Dashboard

- Stats cards with icons
- Loading spinner
- Error alert
- Responsive grid (5 columns)
- Recent activity section
- Platform health section

---

## 🔗 Navigation

### Sidebar Menu

1. 📊 Dashboard
2. 👥 Users
3. 🍽️ Restaurants
4. ⭐ Reviews
5. 📧 Inbox (NEW)
6. 🏪 Requested Restaurants (NEW)

Click any item to navigate. Current page is highlighted in orange.

---

## 📊 Real Data Integration

### How Data Flows

1. User opens page
2. Component mounts and calls custom hook or service function
3. Data fetched from localStorage/adminService
4. State updated with real data
5. UI renders with actual numbers
6. User can modify data (approve, reject, delete)
7. Changes persisted to localStorage

### Example: Dashboard

```
1. AdminDashboard mounts
2. useAdminStats hook called
3. Fetches: users, restaurants, reviews counts
4. Calculates: pending requests, unread messages
5. Sets state with real numbers
6. Stats cards update with actual data
```

---

## 🚨 Error Handling

All pages include:

- Try-catch error handling
- User-friendly error messages
- Fallback to empty state
- Loading indicators
- Retry capability (manual page refresh)

---

## 📝 Workflow Examples

### Approving a Restaurant Request

1. Open "Requested Restaurants"
2. Click on pending request to view details
3. Click "✅ Approve" button
4. Confirmation shows status changed to "approved"
5. Restaurant automatically added to main directory
6. Sidebar shows updated pending count

### Reading a Message

1. Open "Inbox"
2. Click on unread message (blue dot indicator)
3. Message marked as read automatically
4. Status badge changes to "read"
5. Unread count decreases by 1

### Rejecting a Request

1. Open "Requested Restaurants"
2. Click on pending request
3. Click "❌ Reject" button
4. Request status changes to "rejected"
5. Restaurant is NOT added to directory
6. Pending count decreases by 1

---

## 🔐 Admin-Only Access

All pages are protected:

- ✅ Requires login
- ✅ Requires admin role
- ✅ Cannot access without auth
- ✅ Non-admins redirected to home

**Test Admin Credentials:**

- Username: `admin`
- Password: `admin123`

---

## 📱 Mobile Optimization

### Inbox on Mobile

- Single column layout
- Full-width message cards
- Side panel becomes overlay
- Touch-friendly buttons
- Swipe to close detail panel

### Requested Restaurants on Mobile

- Single column layout
- Full-width request cards
- Approve/Reject buttons stacked
- Side panel becomes modal
- Scrollable on long content

### Dashboard on Mobile

- Stats cards stack vertically
- 1-2 columns depending on screen size
- Horizontal scroll on tables
- Touch-friendly interactions

---

## 🔄 Real-time Updates

### What Updates Automatically

- Message read/unread status
- Request approval/rejection status
- Restaurant directory (on approval)
- Dashboard statistics
- Statistics badges

### What Requires Refresh

- New messages (refresh page to see)
- New requests (refresh page to see)
- New restaurants (refresh page to see)

---

## 🎓 Code Examples

### Accessing Dashboard Stats

```tsx
import { useAdminStats } from "../hooks/useAdminStats";

function MyComponent() {
  const { stats, loading, error } = useAdminStats();

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {stats && <p>Total Users: {stats.totalUsers}</p>}
    </div>
  );
}
```

### Marking Message as Read

```tsx
import { updateContactMessageStatus } from "../services/adminService";

async function markRead(messageId) {
  await updateContactMessageStatus(messageId, "read");
}
```

### Approving a Restaurant

```tsx
import { updateRestaurantRequestStatus } from "../services/adminService";

async function approveRestaurant(requestId) {
  await updateRestaurantRequestStatus(requestId, "approved");
}
```

---

## 📞 Support

If something doesn't work:

1. Check browser console for errors
2. Verify you're logged in as admin
3. Try refreshing the page
4. Clear localStorage and retry
5. Check that mock data exists in admin-data.json

---

**Last Updated:** January 2025  
**Version:** 2.2  
**Status:** Production Ready
