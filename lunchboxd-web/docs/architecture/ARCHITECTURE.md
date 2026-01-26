# Authentication Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          React App                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    AuthProvider                          │   │
│  │  (Wraps entire app, provides AuthContext)              │   │
│  │                                                         │   │
│  │  ┌─ State ────────────────────────────────────────┐   │   │
│  │  │ • user: User | null                           │   │   │
│  │  │ • isAuthenticated: boolean                    │   │   │
│  │  │ • isLoading: boolean                          │   │   │
│  │  │ • error: string | null                        │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─ Functions ────────────────────────────────────┐   │   │
│  │  │ • login(email, password)                       │   │   │
│  │  │ • signup(email, password, name)                │   │   │
│  │  │ • logout()                                     │   │   │
│  │  │ • clearError()                                 │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─ Storage ─────────────────────────────────────┐    │   │
│  │  │ • localStorage (user, token)                  │    │   │
│  │  └────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                        App.tsx                            │   │
│  │                                                           │   │
│  │  Routes (Public)           Routes (Protected)            │   │
│  │  ├─ /                       ├─ /profile ──────────┐      │   │
│  │  ├─ /login                  │  ProtectedRoute      │      │   │
│  │  ├─ /signup                 │    └─ Profile      │      │   │
│  │  ├─ /directory              │                     │      │   │
│  │  ├─ /store/:id              ├─ /favorites ────────┤      │   │
│  │  ├─ /cant-decide            │  ProtectedRoute      │      │   │
│  │  ├─ /randomizer             │    └─ Favorites     │      │   │
│  │  ├─ /spin                   └────────────────────┘      │   │
│  │  └─ /* (404)                                            │   │
│  └───────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Component Flow

```
                    ┌─────────────────┐
                    │   useAuth()     │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           ▼                 ▼                 ▼
      ┌────────┐        ┌────────┐       ┌────────┐
      │ Login  │        │Signup  │       │Profile │
      │ Page   │        │ Page   │       │ Page   │
      └───┬────┘        └───┬────┘       └────┬───┘
          │                 │                 │
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
                    ┌───────▼────────┐
                    │  AuthContext   │
                    │  - login()     │
                    │  - signup()    │
                    │  - logout()    │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │  API Backend   │
                    │ /auth/login    │
                    │ /auth/signup   │
                    └────────────────┘
```

## Authentication State Lifecycle

```
User Opens App
    │
    ▼
AuthContext Initializes
    │
    ├─ Check localStorage
    │
    ├─ If user exists:
    │  └─ Set user & isAuthenticated = true
    │
    └─ If no user:
       └─ Set isAuthenticated = false

    │
    ├─ User clicks "Sign In"
    │  │
    │  ├─ Show Login Form
    │  │
    │  └─ User submits credentials
    │     │
    │     ▼
    │  Call API /auth/login
    │     │
    │     ├─ Success:
    │     │  ├─ Store user in state
    │     │  ├─ Save user to localStorage
    │     │  ├─ Set isAuthenticated = true
    │     │  └─ Redirect to /profile
    │     │
    │     └─ Error:
    │        └─ Display error message
    │
    ├─ User accesses protected route
    │  │
    │  ├─ ProtectedRoute checks isAuthenticated
    │  │
    │  ├─ If true:
    │  │  └─ Render protected component
    │  │
    │  └─ If false:
    │     └─ Redirect to /login (save location)
    │
    └─ User clicks Logout
       │
       ├─ Clear user state
       ├─ Clear localStorage
       ├─ Set isAuthenticated = false
       └─ Redirect to /
```

## ProtectedRoute Logic Flow

```
┌─────────────────────────────────────────┐
│  User navigates to /profile             │
└────────────────┬────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────┐
    │ ProtectedRoute Component   │
    │ checks:                    │
    │ - isAuthenticated?         │
    │ - isLoading?               │
    └────────┬───────┬───────┬───┘
             │       │       │
    ┌────────▼─┐  ┌──▼────┐  └──────────────┐
    │ Loading? │  │Auth?   │               Not Auth
    └────┬─────┘  └──┬─────┘               &
         │ YES       │ YES                 Not Loading
    ┌────▼──────┐ ┌──▼──────────┐       ┌────────────┐
    │ Show      │ │ Render      │       │ Redirect  │
    │ Spinner   │ │ Component   │       │ to Login  │
    │ & "      │ │             │       │ (save     │
    │ Loading" │ │ ▼           │       │  location)│
    └──────────┘ │ Profile     │       └────────────┘
                 │ Favorites   │
                 └─────────────┘
```

## Login Form Data Flow

```
┌──────────────────────────────────┐
│ User enters email & password     │
└─────────────┬────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ Local Form State:   │
    │ - email             │
    │ - password          │
    │ - localError        │
    │ - isLoading         │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────────────────┐
    │ User clicks "Sign In"           │
    └─────────────┬───────────────────┘
                  │
                  ▼
        ┌──────────────────────┐
        │ handleSubmit():      │
        │ 1. Prevent default   │
        │ 2. Clear errors      │
        │ 3. Set isLoading     │
        │ 4. Call auth.login() │
        └──────────┬───────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │ AuthContext.login():             │
    │ 1. Make API call                 │
    │ 2. Parse response                │
    │ 3. Store user in state           │
    │ 4. Save to localStorage          │
    │ 5. Set isAuthenticated = true    │
    └──────────┬───────────────────────┘
               │
        ┌──────┴──────┐
        ▼             ▼
   Success        Error
        │             │
    ┌───▼────┐   ┌────▼────┐
    │Redirect│   │Set error│
    │to      │   │message  │
    │/profile│   └─────────┘
    └────────┘
```

## Data Flow: useAuth Hook Usage

```
┌─ Component ────────────────┐
│  const auth = useAuth()    │
└────────────────┬───────────┘
                 │
    ┌────────────▼────────────┐
    │ AuthContext provides:   │
    ├─ user                   │
    ├─ isAuthenticated        │
    ├─ isLoading              │
    ├─ error                  │
    ├─ login()                │
    ├─ signup()               │
    ├─ logout()               │
    └─ clearError()           │
    └────────────┬────────────┘
                 │
    ┌────────────▼──────────────────┐
    │ Component uses returned       │
    │ values for:                   │
    │                              │
    │ - Conditional rendering      │
    │ - Form handling              │
    │ - Displaying user info       │
    │ - Handling logout            │
    └──────────────────────────────┘
```

## Error Handling Flow

```
┌──────────────────────────────────────┐
│ Error occurs during login/signup     │
└─────────────┬────────────────────────┘
              │
              ▼
    ┌──────────────────────────┐
    │ AuthContext catches error│
    │ - Sets error state       │
    │ - Sets isLoading = false │
    │ - Re-throws error        │
    └─────────────┬────────────┘
                  │
                  ▼
    ┌──────────────────────────────┐
    │ Login/Signup Component:      │
    │ - Catches error              │
    │ - Sets localError state      │
    │ - Displays error to user     │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ User sees error message:     │
    │ - "Invalid email or password"│
    │ - Red alert box              │
    │ - Can try again              │
    └──────────────────────────────┘
                   │
    ┌──────────────▼───────────────┐
    │ User types in form field     │
    └──────────────┬───────────────┘
                   │
                   ▼
    ┌──────────────────────────────┐
    │ clearError() called           │
    │ - error set to null           │
    │ - Error message disappears    │
    └──────────────────────────────┘
```

## localStorage Persistence

```
┌─────────────────────────────────────────────────────┐
│ Browser localStorage (Key-Value Pair)               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Key: "user"                                         │
│ Value: {                                            │
│   "id": "user-123",                                 │
│   "email": "user@example.com",                      │
│   "name": "John Doe",                               │
│   "token": "eyJhbGciOiJIUzI1NiIs..."               │
│ }                                                   │
│                                                     │
│ Key: "token"                                        │
│ Value: "eyJhbGciOiJIUzI1NiIs..."                   │
│                                                     │
└────────────────┬──────────────────────────────────┘
                 │
    ┌────────────▼─────────────────┐
    │ On App Load:                 │
    │ 1. AuthContext checks       │
    │    localStorage              │
    │ 2. If "user" exists:         │
    │    - Parse JSON              │
    │    - Set user state          │
    │    - Set isAuthenticated     │
    │ 3. If error/invalid:         │
    │    - Clear localStorage      │
    │    - Show login page         │
    └──────────────────────────────┘
```

## API Integration Points

```
┌─────────────────────────────────────────────────────┐
│ Your Backend API                                    │
└────────────┬────────────────────────────────────────┘
             │
    ┌────────┴─────────┐
    │                  │
    ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ POST         │  │ POST         │
│ /auth/login  │  │ /auth/signup │
└────┬─────────┘  └────┬─────────┘
     │                 │
Request Body:      Request Body:
{                  {
  email,             email,
  password           password,
}                    name
                 }
     │                 │
     ▼                 ▼
Response (Success):
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here"
}

Response (Error):
{
  "message": "Invalid credentials"
}
```

## Component Hierarchy

```
App
├─ AuthProvider
│  ├─ Routes
│  │  ├─ Route: /
│  │  │  └─ HomePage
│  │  │
│  │  ├─ Route: /login
│  │  │  └─ Login
│  │  │
│  │  ├─ Route: /signup
│  │  │  └─ SignUp
│  │  │
│  │  ├─ Route: /profile
│  │  │  └─ ProtectedRoute
│  │  │     └─ Profile
│  │  │        └─ useAuth()
│  │  │
│  │  ├─ Route: /favorites
│  │  │  └─ ProtectedRoute
│  │  │     └─ Favorites
│  │  │        └─ useAuth()
│  │  │
│  │  └─ Route: /* (404)
│  │     └─ NotFound
│  │
│  └─ AuthContext
│     ├─ user state
│     ├─ isAuthenticated state
│     ├─ login function
│     ├─ signup function
│     ├─ logout function
│     └─ useAuth hook
```

---

## Key Takeaways

1. **AuthProvider** wraps the entire app and provides authentication context
2. **ProtectedRoute** checks authentication before rendering protected components
3. **useAuth** hook gives any component access to auth state and functions
4. **localStorage** persists authentication across page refreshes
5. **Error handling** provides user feedback throughout the auth flow
