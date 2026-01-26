# Authentication System Documentation

## Overview

This authentication system provides a complete solution for managing user login, signup, and protected routes in your Lunchboxd web application.

## Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

The heart of the authentication system. Manages:

- User login state
- User data (email, name, token)
- Authentication functions (login, signup, logout)
- Error handling
- localStorage persistence

#### Types

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}
```

#### Usage

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, login, logout, error } = useAuth();

  // Use auth state and functions
}
```

### 2. ProtectedRoute (`src/components/ProtectedRoute/ProtectedRoute.tsx`)

A route wrapper that protects pages requiring authentication.

#### Features

- Checks if user is authenticated
- Shows loading state while checking auth
- Redirects to `/login` if not authenticated
- Saves intended location for redirect after login

#### Usage

```typescript
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
```

### 3. Updated Components

#### Login (`src/pages/Login.tsx`)

- Email and password form
- Error handling
- Redirect to intended page after login
- Link to signup page

#### SignUp (`src/pages/SignUp.tsx`)

- Full name, email, and password form
- Password confirmation validation
- Password strength validation (min 6 chars)
- Error handling
- Link to login page

#### Profile (`src/pages/Profile.tsx`)

- Protected route - requires authentication
- Displays user information
- Logout functionality
- Shows welcome message

#### Favorites (`src/pages/Favorites.tsx`)

- Protected route - requires authentication
- Uses user data from auth context
- Example of protected content

## Flow Diagrams

### Login Flow

```
User visits /login
  ↓
Enters credentials
  ↓
Login component calls auth.login()
  ↓
AuthContext makes API call
  ↓
Response received, user stored in state & localStorage
  ↓
Redirect to intended page or /profile
```

### Protected Route Access

```
User navigates to /profile (protected)
  ↓
ProtectedRoute checks isAuthenticated
  ↓
If authenticated → render Profile component
If not → redirect to /login (saves intended location)
  ↓
After login, user redirected to saved location
```

## API Integration

Update the `login` and `signup` functions in `AuthContext.tsx` to match your backend API:

### Login Endpoint

```typescript
// Replace the fetch URL and response handling
const response = await fetch("https://your-api.com/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const data = await response.json();
// Expected response:
// {
//   user: { id, email, name },
//   token: "jwt-token-here"
// }
```

### Signup Endpoint

```typescript
// Replace the fetch URL and response handling
const response = await fetch("https://your-api.com/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password, name }),
});

const data = await response.json();
// Expected response same as login
```

## Authentication State Persistence

The system automatically persists authentication state using localStorage:

- `user` - Stores user object (JSON stringified)
- `token` - Stores authentication token for API calls

On app load, AuthContext checks localStorage and restores user session if valid.

## Using Auth Token in API Calls

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user } = useAuth();

  const fetchData = async () => {
    const response = await fetch("/api/data", {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    });
    return response.json();
  };

  return <button onClick={fetchData}>Fetch Data</button>;
}
```

## Routing Structure

### Public Routes

- `/` - Home page
- `/login` - Login page
- `/signup` - Sign up page
- `/directory` - Directory page (guest mode)
- `/store/:id` - Store details (guest mode)
- `/cant-decide` - Random selector (guest mode)
- `/randomizer` - Randomizer page
- `/spin` - Spin page

### Protected Routes

- `/profile` - User profile (requires auth)
- `/favorites` - User favorites (requires auth)

## Common Patterns

### Display Username in Header

```typescript
import { useAuth } from "@/contexts/AuthContext";

function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header>{isAuthenticated && <span>Hello, {user?.name}!</span>}</header>
  );
}
```

### Conditional Navigation

```typescript
import { useAuth } from "@/contexts/AuthContext";

function NavLinks() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <a href="/profile">Profile</a>
          <a href="/favorites">Favorites</a>
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

### Show Error Messages

```typescript
function LoginForm() {
  const { error, clearError } = useAuth();

  return (
    <form>
      {error && (
        <div className="error-alert">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}
      {/* form fields */}
    </form>
  );
}
```

## Error Handling

The AuthContext provides an `error` property that contains error messages from login/signup failures. Clear errors with `clearError()` function.

Common errors:

- Invalid credentials
- Email already exists (signup)
- Network errors
- Validation errors

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For production, consider using httpOnly cookies.
2. **HTTPS**: Always use HTTPS in production.
3. **Password Validation**: Implement stronger password validation on the backend.
4. **Token Expiration**: Implement token refresh logic for expired tokens.
5. **CORS**: Configure CORS properly on your backend.

## Testing

### Test Protected Route

1. Visit `/profile` without logging in → Should redirect to `/login`
2. Log in → Should redirect to `/profile`
3. Refresh page → Should stay logged in (localStorage)

### Test Logout

1. Log in and view profile
2. Click logout → Redirect to home page
3. localStorage cleared

### Test Login Redirect

1. Try to access `/favorites` without login
2. Get redirected to `/login`
3. Log in → Redirect back to `/favorites`

## Troubleshooting

### "useAuth must be used within an AuthProvider"

Make sure your app is wrapped with `<AuthProvider>` in `App.tsx`.

### Auth state lost on refresh

Check that localStorage is enabled in your browser. The AuthContext loads from localStorage on mount.

### Can't reach protected pages

1. Check if user is authenticated with `useAuth()`
2. Verify ProtectedRoute is properly wrapping the component
3. Check browser console for error messages

## Future Enhancements

- Add "Remember Me" functionality
- Implement token refresh logic
- Add 2FA support
- Social login (Google, GitHub, etc.)
- Session timeout warning
- User profile settings
- Change password functionality
