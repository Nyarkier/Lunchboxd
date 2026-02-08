// src/types/types.ts

export type Side =
  | "Main Gate"
  | "Gate Six"
  | "Inside the School"
  | "North Gate"
  | "Hospital Gate"
  | string;

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  location: string;
  // ✅ CHANGED BACK: Required string (remove the ?)
  budgetRange: string; 
  type?: "Food" | "Drink" | string;
  paymentMode?: ("Cash" | "GCash" | string)[];
  sides: string;
  profileImage?: string | null; 
  menuImages?: string[];
  [key: string]: any;
}

// ... (keep the rest of the file exactly as it was) ...

// Just ensure RestaurantRequest also has budgetRange as string
export interface RestaurantRequest {
  id: string;
  restaurantName: string;
  cuisine: string;
  location: string;
  budgetRange: string; // ✅ Required string
  type: "Food" | "Drink" | string;
  paymentMode: ("Cash" | "GCash" | string)[];
  sides: string;
  description?: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  contact?: string;
  profileImage?: string | null;
  menuImages?: string[];
}

// Keep the other interfaces (User, AuthUser, etc.) same as before
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  mobile?: string;
  avatar?: string | null;
  createdAt?: string;
  role?: "user" | "admin";
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string | null;
  role?: "user" | "admin";
}

export interface FilterOptions {
  categories: string[];
  budgets: string[];
  sides?: string[];
}

export interface FilterCriteria {
  searchQuery?: string;
  category?: string;
  budgets?: string[];
  sides?: string[];
}

export interface Favorite {
  userId: string;
  restaurantId: string;
}

export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  submittedAt: string;
  status: "unread" | "read";
}