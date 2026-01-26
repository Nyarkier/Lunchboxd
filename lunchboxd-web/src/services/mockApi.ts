/**
 * MOCK API EXAMPLES
 *
 * This file shows example API endpoints and mock implementations
 * for testing the authentication system without a real backend.
 *
 * Replace these with your actual API endpoints in AuthContext.tsx
 */

// Mock user database
const mockUsers: Record<string, any> = {
  "user@example.com": {
    id: "user-1",
    email: "user@example.com",
    password: "password123", // In production, never store plain passwords!
    name: "John Doe",
  },
};

const mockTokens = new Map<string, string>();

/**
 * MOCK LOGIN ENDPOINT
 *
 * Replace fetch URL in AuthContext.tsx with your actual endpoint:
 * const response = await fetch('https://api.your-domain.com/auth/login', ...)
 */
export async function mockLogin(email: string, password: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers[email];

  if (!user || user.password !== password) {
    throw new Error("Invalid email or password");
  }

  const token = `mock-token-${Date.now()}`;
  mockTokens.set(token, email);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    token,
  };
}

/**
 * MOCK SIGNUP ENDPOINT
 *
 * Replace fetch URL in AuthContext.tsx with your actual endpoint:
 * const response = await fetch('https://api.your-domain.com/auth/signup', ...)
 */
export async function mockSignup(
  email: string,
  password: string,
  name: string
) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (mockUsers[email]) {
    throw new Error("Email already in use");
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
  };

  mockUsers[email] = newUser;

  const token = `mock-token-${Date.now()}`;
  mockTokens.set(token, email);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
    token,
  };
}

/**
 * REAL API IMPLEMENTATION EXAMPLES
 *
 * Below are examples of how to structure your actual API calls
 */

// Example 1: Using axios
/*
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.your-domain.com',
});

export async function loginWithAPI(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

export async function signupWithAPI(email: string, password: string, name: string) {
  const response = await api.post('/auth/signup', { email, password, name });
  return response.data;
}
*/

// Example 2: Using fetch with better error handling
/*
const API_BASE = process.env.REACT_APP_API_URL || 'https://api.your-domain.com';

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
}

export async function loginWithFetch(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function signupWithFetch(email: string, password: string, name: string) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  });
  return handleResponse(response);
}
*/

// Example 3: Using fetch with interceptors for token management
/*
export class APIClient {
  private baseURL = process.env.REACT_APP_API_URL || 'https://api.your-domain.com';

  async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  signup(email: string, password: string, name: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }
}

const apiClient = new APIClient();
export default apiClient;
*/
