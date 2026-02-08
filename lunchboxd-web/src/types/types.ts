// User types
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

// Restaurant types
export type Side =
  | "Main Gate"
  | "Gate Six"
  | "Inside the School"
  | "North Gate"
  | "Hospital Gate";

export type Cuisine =
  | "cafe"
  | "rice meal"
  | "chicken"
  | "fast food"
  | "noodles"
  | "bread";

export interface OpenHours {
  open: string; // e.g., "8:00 AM"
  close: string; // e.g., "9:00 PM"
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: Cuisine;
  rating: number;
  location: string;
  budgetRange: "10-50" | "50-150" | "150-500" | "500-1000";
  type?: "Food" | "Drink";
  paymentMode?: ("Cash" | "GCash")[];
  sides: Side;
  profileImage?: string | null;
  menuImages?: string[];
  link?: string;
  openHours?: OpenHours;
}

// Filter types
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

// Favorites type
export interface Favorite {
  userId: string;
  restaurantId: string;
}

// Review type
export interface Review {
  id: string;
  restaurantId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Mock backend data structure
export interface MockBackendData {
  restaurants: Restaurant[];
  favorites: Favorite[];
  reviews: Review[];
  users?: User[];
  restaurantRequests?: RestaurantRequest[];
  contactMessages?: ContactMessage[];
}

// Admin feature types
export interface RestaurantRequest {
  id: string;
  restaurantName: string;
  cuisine: Cuisine;
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
  profileImage?: string | null;
  menuImages?: string[];
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
