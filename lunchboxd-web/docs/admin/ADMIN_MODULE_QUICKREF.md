# Admin & User Contribution Module - Quick Reference

## Quick Start

### For Users

#### 1. Add a Restaurant

- Click **"ADD A RESTAURANT"** button on homepage
- Fill out the form with restaurant details
- Submit and confirmation appears

#### 2. Send Feedback

- Click **"TALK WITH US"** button on homepage
- Fill out the contact form
- Submit and message goes to admin dashboard

### For Admins

#### 1. Login as Admin

```
Username: admin
Password: admin123
```

#### 2. Access Dashboard

- After login, you'll be redirected to `/admin/dashboard`
- Or navigate directly to: `http://localhost:5173/admin/dashboard`

#### 3. Manage Submissions

- **Requests Tab:** Review and approve/reject restaurant requests
- **Messages Tab:** Read and respond to user messages

---

## File Locations

### New Pages

- `src/pages/AdminDashboard.tsx` - Admin dashboard
- `src/pages/AddRestaurant.tsx` - Restaurant submission form
- `src/pages/TalkWithUs.tsx` - Contact form

### New Services

- `src/services/adminService.ts` - Admin-related API calls

### New Mock Data

- `mock-backend/admin-data.json` - Sample requests and messages

### Updated Files

- `src/types/types.ts` - New types (RestaurantRequest, ContactMessage)
- `src/App.tsx` - New routes
- `src/pages/Login.tsx` - Role-based redirect
- `src/components/Home/Hero.tsx` - New buttons
- `mock-backend/users.json` - Admin user added

---

## Routes

### Public Routes (No Login Required)

- `/` - Homepage
- `/add-restaurant` - Add restaurant form
- `/talk-with-us` - Contact form
- `/directory` - Restaurant directory
- `/login` - Login page
- `/signup` - Signup page

### Protected User Routes (Login Required)

- `/profile` - User profile
- `/favorites` - User favorites
- `/reviews` - User reviews

### Protected Admin Routes (Admin Login Required)

- `/admin/dashboard` - Admin dashboard

---

## Test Credentials

### Admin

```
Username: admin
Email: admin@lunchboxd.com
Password: admin123
```

### Sample Users

```
Username: princelord_m / Password: password123
Username: kurtvalera / Password: password456
Username: raisen_y / Password: password789
```

---

## Database Schema Updates

### User Model

```typescript
{
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  mobile?: string;
  avatar?: string;
  createdAt: string;
  role: "user" | "admin";  // NEW
}
```

### Restaurant Request

```typescript
{
  id: string;
  restaurantName: string;
  cuisine: string;
  location: string;
  budgetRange: "10-50" | "50-150" | "150-500" | "500-1000";
  type: "Food" | "Drink";
  paymentMode: ("Cash" | "GCash")[];
  sides: "Main Gate" | "Gate Six" | "Inside the School" | "North Gate" | "Hospital Gate";
  description?: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  contact?: string;
}
```

### Contact Message

```typescript
{
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

## Key Features

✅ User can submit restaurants for review
✅ User can send feedback/contact admin
✅ Admin can view all submissions in dashboard
✅ Admin can approve/reject restaurant requests
✅ Admin can mark messages as read/unread
✅ Role-based authentication and routing
✅ Fully responsive design
✅ Professional UI matching system theme
✅ Form validation on all inputs
✅ Mock backend data persistence
✅ Real-time statistics on dashboard

---

## Component Usage Examples

### Using ProtectedRoute with Roles

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

### Using Admin Service

```tsx
import {
  getRestaurantRequests,
  getContactMessages,
  getDashboardStats,
  updateRestaurantRequestStatus,
} from "../services/adminService";

// Get all requests
const requests = await getRestaurantRequests();

// Get dashboard stats
const stats = await getDashboardStats();

// Approve a request
await updateRestaurantRequestStatus("req_123", "approved");

// Get contact messages
const messages = await getContactMessages();
```

### Using Auth Context with Role

```tsx
import { useAuth } from "../contexts/AuthContext";

function MyComponent() {
  const { user, isAdmin } = useAuth();

  return (
    <>
      {isAdmin && <AdminLink href="/admin/dashboard">Dashboard</AdminLink>}
      {user && <span>Welcome, {user.firstName}</span>}
    </>
  );
}
```

---

## Color Reference

| Name        | Hex     | Usage                    |
| ----------- | ------- | ------------------------ |
| Forest Dark | #2d5a27 | Primary buttons, headers |
| Forest Mid  | #628141 | Text, secondary elements |
| Sand        | #e5c287 | Accents, backgrounds     |
| Off-White   | #fbfff1 | Page background          |
| Orange      | #E67E22 | New feature buttons      |
| Green       | #10b981 | Approved status          |
| Yellow      | #f59e0b | Pending status           |
| Red         | #ef4444 | Rejected status          |

---

## Troubleshooting

### Can't login as admin

- Verify credentials: `admin` / `admin123`
- Check mock-backend/users.json has admin user
- Clear localStorage and try again

### Dashboard not showing data

- Ensure logged in as admin (check user.role === "admin")
- Check browser console for errors
- Verify adminService.ts is importing admin-data.json correctly

### Forms not submitting

- Check all required fields are filled
- Verify email format if email field exists
- Check console for validation error messages

### Role-based redirect not working

- Clear browser cache
- Remove localStorage data: `localStorage.clear()`
- Re-login to refresh user data

---

## Next Steps

1. **Test the module** by submitting a restaurant request and message
2. **Login as admin** to review submissions
3. **Approve/Reject** requests in the dashboard
4. **Customize** form fields and validation as needed
5. **Integrate** with real backend API when ready

---

## Additional Resources

- Full documentation: `ADMIN_MODULE_DOCUMENTATION.md`
- System architecture: `ARCHITECTURE.md`
- API reference: `QUICK_REFERENCE_API.md`

---

**Last Updated:** January 19, 2026
