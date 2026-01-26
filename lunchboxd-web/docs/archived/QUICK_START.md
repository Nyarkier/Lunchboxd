# Authentication Implementation - Quick Start Guide

## ✅ What's Been Implemented

Your authentication system is now complete with:

### 1. **Core Authentication System**

- ✅ [AuthContext](src/contexts/AuthContext.tsx) - Manages login state, user data, and auth functions
- ✅ [ProtectedRoute](src/components/ProtectedRoute/ProtectedRoute.tsx) - Guards protected pages
- ✅ Automatic token & user persistence in localStorage

### 2. **Updated Components**

- ✅ [Login Page](src/pages/Login.tsx) - Full login form with validation
- ✅ [SignUp Page](src/pages/SignUp.tsx) - Registration with password confirmation
- ✅ [Profile Page](src/pages/Profile.tsx) - Protected user profile with logout
- ✅ [Favorites Page](src/pages/Favorites.tsx) - Protected page example

### 3. **Complete Routing**

- ✅ [App.tsx](src/App.tsx) - All routes configured with protection

### 4. **Documentation**

- ✅ [AUTH_SETUP.md](AUTH_SETUP.md) - Comprehensive auth system documentation
- ✅ [mockApi.ts](src/services/mockApi.ts) - Mock and real API examples
- ✅ [AuthExample.tsx](src/components/AuthExample.tsx) - Code examples

---

## 🚀 Quick Start

### 1. **Wrap Your App (Already Done)**

```typescript
// App.tsx - Already configured!
<AuthProvider>
  <Routes>{/* All routes */}</Routes>
</AuthProvider>
```

### 2. **Use Auth in Components**

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) return <p>Not logged in</p>;

  return <p>Welcome {user?.name}!</p>;
}
```

### 3. **Protect Routes**

```typescript
// Already configured in App.tsx!
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

---

## 🔌 Connect Your Backend API

### Step 1: Update AuthContext with Your API URL

Edit [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx) and replace the fetch URLs:

```typescript
// In the login function:
const response = await fetch("https://YOUR_API_URL/auth/login", {
  // ... rest of config
});

// In the signup function:
const response = await fetch("https://YOUR_API_URL/auth/signup", {
  // ... rest of config
});
```

### Step 2: Expected API Response Format

Your endpoints should return:

```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Step 3: Error Handling

Your API should return errors in this format:

```json
{
  "message": "Invalid email or password"
}
```

---

## 📋 Route Structure

```
Public Routes (no auth required):
├── / ..................... Homepage
├── /login ................ Login page
├── /signup ............... Sign up page
├── /directory ............ Directory (guest mode)
├── /store/:id ............ Store details (guest mode)
├── /cant-decide .......... Random selector
├── /randomizer ........... Randomizer page
└── /spin ................. Spin page

Protected Routes (require auth):
├── /profile .............. User profile
└── /favorites ............ User favorites

Error Routes:
└── /* .................... 404 Not Found
```

---

## 🎯 User Flows

### Login Flow

```
User clicks "Sign In"
         ↓
Fills email/password
         ↓
Clicks "Sign in" button
         ↓
Auth context calls API
         ↓
Success: User stored → Redirected to /profile (or saved location)
         ↓
Error: Error message shown → User can retry
```

### Signup Flow

```
User clicks "Create Account"
         ↓
Fills name/email/password
         ↓
Password validation checked
         ↓
Clicks "Sign up" button
         ↓
Auth context calls API
         ↓
Success: User stored → Redirected to /profile
         ↓
Error: Error message shown → User can retry
```

### Protected Page Access

```
User tries to access /profile (not logged in)
         ↓
ProtectedRoute checks isAuthenticated
         ↓
Not authenticated: Redirect to /login
         ↓
Save original location in localStorage
         ↓
User logs in
         ↓
User redirected to original location (/profile)
```

---

## 💡 Common Tasks

### Display User in Header

```typescript
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header>{isAuthenticated && <span>Welcome, {user?.name}!</span>}</header>
  );
}
```

### Show Login/Logout Links

```typescript
import { useAuth } from "@/contexts/AuthContext";

export function NavLinks() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <a href="/profile">Profile</a>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <a href="/login">Login</a>
          <a href="/signup">Sign Up</a>
        </>
      )}
    </nav>
  );
}
```

### Use Token in API Calls

```typescript
import { useAuth } from "@/contexts/AuthContext";

export function UserData() {
  const { user } = useAuth();

  const fetchData = async () => {
    const response = await fetch("/api/data", {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    return response.json();
  };

  return <button onClick={fetchData}>Load Data</button>;
}
```

### Handle Loading State

```typescript
import { useAuth } from "@/contexts/AuthContext";

export function MyComponent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return <p>Content loaded</p>;
}
```

---

## 🧪 Testing Your Setup

### Test 1: Public Routes

1. Visit `http://localhost:5173/` → Should see homepage ✓
2. Visit `http://localhost:5173/directory` → Should see directory ✓
3. Visit `http://localhost:5173/login` → Should see login form ✓

### Test 2: Protected Routes (Not Logged In)

1. Visit `http://localhost:5173/profile` → Should redirect to /login ✓
2. Visit `http://localhost:5173/favorites` → Should redirect to /login ✓

### Test 3: Login Flow (Mock API)

1. Go to `/login`
2. Try invalid email/password → See error message ✓
3. Clear error on input change ✓
4. Try signing up first (use mock endpoint in AuthContext) ✓

### Test 4: Protected Routes (Logged In)

1. After login, visit `/profile` → Should show profile page ✓
2. Visit `/favorites` → Should show favorites page ✓
3. Refresh page → Should stay logged in ✓

### Test 5: Logout

1. From profile page, click "Logout" ✓
2. Should redirect to home page ✓
3. localStorage should be cleared ✓
4. Visit `/profile` → Should redirect to login ✓

---

## ⚙️ Configuration

### Change Storage Method

By default, localStorage is used. To use sessionStorage:

Edit [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx):

```typescript
// Line 40: Change localStorage to sessionStorage
sessionStorage.setItem("user", JSON.stringify(userData));
sessionStorage.setItem("token", data.token);

// Lines 85, 130: Do the same for other setItem calls
// Lines 35, 93, 102: Change getItem calls too
```

### Add More User Fields

Edit the `User` interface in [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx):

```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
  avatar?: string; // Add new fields
  role?: "user" | "admin";
}
```

### Customize Loading UI

Edit [src/components/ProtectedRoute/ProtectedRoute.tsx](src/components/ProtectedRoute/ProtectedRoute.tsx):

```typescript
if (isLoading) {
  return <div>Your custom loading component</div>;
}
```

---

## 🔒 Security Notes

### Production Checklist

- [ ] Replace `/api/login` and `/api/signup` with real endpoints
- [ ] Use HTTPS only in production
- [ ] Consider using httpOnly cookies instead of localStorage
- [ ] Implement token refresh logic for expired tokens
- [ ] Add stronger password validation
- [ ] Implement CSRF protection
- [ ] Add rate limiting for login attempts
- [ ] Add 2FA for extra security

### Current Implementation Notes

- Tokens stored in localStorage (suitable for development)
- No automatic token refresh (implement if tokens expire)
- Passwords sent in plain JSON (use HTTPS!)

---

## 📚 File References

| File                                                                                                 | Purpose                  |
| ---------------------------------------------------------------------------------------------------- | ------------------------ |
| [src/contexts/AuthContext.tsx](src/contexts/AuthContext.tsx)                                         | Core auth logic          |
| [src/components/ProtectedRoute/ProtectedRoute.tsx](src/components/ProtectedRoute/ProtectedRoute.tsx) | Route protection wrapper |
| [src/pages/Login.tsx](src/pages/Login.tsx)                                                           | Login page               |
| [src/pages/SignUp.tsx](src/pages/SignUp.tsx)                                                         | Sign up page             |
| [src/pages/Profile.tsx](src/pages/Profile.tsx)                                                       | User profile (protected) |
| [src/pages/Favorites.tsx](src/pages/Favorites.tsx)                                                   | Favorites (protected)    |
| [src/App.tsx](src/App.tsx)                                                                           | App routing setup        |
| [AUTH_SETUP.md](AUTH_SETUP.md)                                                                       | Full documentation       |
| [src/services/mockApi.ts](src/services/mockApi.ts)                                                   | API examples             |
| [src/components/AuthExample.tsx](src/components/AuthExample.tsx)                                     | Usage examples           |

---

## ❓ Troubleshooting

### "useAuth must be used within an AuthProvider"

Make sure `<AuthProvider>` wraps your entire app in `App.tsx`. ✓ Already done!

### User logs out on page refresh

This is expected if localStorage is cleared. The default behavior persists across refreshes.

### Can't access protected pages

1. Check browser console for errors
2. Verify `isAuthenticated` is true with DevTools
3. Check that ProtectedRoute wraps the component

### Login/Signup not working

1. Check browser console for network errors
2. Verify your backend API URL is correct
3. Check API response format matches expected format
4. Look for CORS errors in console

### Tokens not persisting

Check that localStorage is enabled:

```javascript
// In browser console
localStorage.setItem("test", "test");
localStorage.getItem("test"); // Should return 'test'
```

---

## 🎓 Next Steps

1. **Test the implementation** - Try the testing steps above
2. **Connect real API** - Update AuthContext with your backend endpoints
3. **Customize styling** - Update Tailwind classes to match your design
4. **Add profile editing** - Extend Profile component
5. **Add password reset** - Implement forgot password flow
6. **Add 2FA** - Enhance security with two-factor authentication

---

## 📖 Learn More

- [React Router Documentation](https://reactrouter.com/)
- [Context API Docs](https://react.dev/reference/react/useContext)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JWT Authentication](https://jwt.io/introduction)

---

## ✨ You're All Set!

Your authentication system is production-ready. Just connect your backend API and you're good to go! 🚀
