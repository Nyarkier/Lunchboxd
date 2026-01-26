import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

/**
 * EXAMPLE: Using Auth Context in Your Components
 *
 * This file shows various patterns for using the useAuth hook
 * in your React components.
 */

// Example 1: Displaying User Data
export function UserGreeting() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>
          Welcome, {user?.firstName} {user?.lastName}!
        </p>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  );
}

// Example 2: Conditional Rendering Based on Auth Status
export function NavigationMenu() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav>
      {isAuthenticated ? (
        <>
          <a href="/profile">Profile</a>
          <a href="/favorites">Favorites</a>
          <button onClick={handleLogout}>Logout</button>
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

// Example 3: Accessing User Token for API Calls
export function UserAPI() {
  const fetchUserData = async () => {
    // Note: User object doesn't include a token.
    // Token would typically be stored in localStorage or sessionStorage
    const token = localStorage.getItem("authToken");
    const response = await fetch("/api/user-data", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.json();
  };

  return <button onClick={fetchUserData}>Fetch My Data</button>;
}

// Example 4: Displaying Error Messages
export function LoginForm() {
  const { error, clearError } = useAuth();

  return (
    <div>
      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
    </div>
  );
}

// Example 5: Checking Authentication Status
export function ProtectedContent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <p>This content requires authentication</p>;
  }

  return (
    <div>
      <p>User ID: {user?.id}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}
