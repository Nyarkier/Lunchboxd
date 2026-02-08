// Reviews service - supports both mock and backend API
import type { Review } from "../types/types";
import mockBackendData from "../../mock-backend/data.json";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Helper to get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Store reviews in localStorage for persistence (mock mode)
const REVIEWS_STORAGE_KEY = "lunchboxd_reviews";

// Get reviews from mock backend and localStorage
const getReviewsFromBackend = (): Review[] => {
  // Try to get from localStorage first
  const stored = localStorage.getItem(REVIEWS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error("Failed to parse stored reviews:", error);
    }
  }
  // Fall back to mock data
  return mockBackendData.reviews || [];
};

// Update reviews in memory and localStorage (mock mode)
const updateBackendReviews = (reviews: Review[]) => {
  mockBackendData.reviews = reviews;
  // Persist to localStorage
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to save reviews to localStorage:", error);
  }
};

let reviewIdCounter = 1000;

export const addReview = async (
  restaurantId: string,
  userId: string,
  rating: number,
  comment: string,
): Promise<Review> => {
  if (USE_MOCK) {
    const reviews = getReviewsFromBackend();

    // Check if user already has a review for this restaurant
    const existingReview = reviews.find(
      (r) => r.restaurantId === restaurantId && r.userId === userId,
    );
    if (existingReview) {
      throw new Error(
        "You have already reviewed this restaurant. Please edit or delete your existing review.",
      );
    }

    const newReview: Review = {
      id: (reviewIdCounter++).toString(),
      restaurantId,
      userId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    reviews.push(newReview);
    updateBackendReviews(reviews);
    return newReview;
  }

  // Real API call
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ restaurantId, userId, rating, comment }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add review");
  }

  const data = await response.json();
  return data.review;
};

export const getRestaurantReviews = async (
  restaurantId: string,
): Promise<Review[]> => {
  if (USE_MOCK) {
    const reviews = getReviewsFromBackend();
    return reviews.filter((r) => r.restaurantId === restaurantId);
  }

  const response = await fetch(
    `${API_BASE_URL}/reviews/restaurant/${restaurantId}`,
  );
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.reviews || [];
};

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  if (USE_MOCK) {
    const reviews = getReviewsFromBackend();
    return reviews.filter((r) => r.userId === userId);
  }

  // Backend doesn't have a user reviews endpoint, so we get all and filter
  const response = await fetch(`${API_BASE_URL}/reviews`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return (data.reviews || []).filter((r: Review) => r.userId === userId);
};

export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  return getUserReviews(userId);
};

// Check if user has already reviewed a specific restaurant
export const getUserReviewForRestaurant = async (
  userId: string,
  restaurantId: string,
): Promise<Review | null> => {
  if (USE_MOCK) {
    const reviews = getReviewsFromBackend();
    return (
      reviews.find(
        (r) => r.userId === userId && r.restaurantId === restaurantId,
      ) || null
    );
  }

  const reviews = await getRestaurantReviews(restaurantId);
  return reviews.find((r) => r.userId === userId) || null;
};

export const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string,
): Promise<Review | null> => {
  if (USE_MOCK) {
    const reviews = getReviewsFromBackend();
    const review = reviews.find((r) => r.id === reviewId);

    if (review) {
      review.rating = rating;
      review.comment = comment;
      updateBackendReviews(reviews);
      return review;
    }
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating, comment }),
  });

  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.review;
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  if (USE_MOCK) {
    const reviews = getReviewsFromBackend();
    const index = reviews.findIndex((r) => r.id === reviewId);

    if (index > -1) {
      reviews.splice(index, 1);
      updateBackendReviews(reviews);
      return true;
    }
    return false;
  }

  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return response.ok;
};

export const getAllReviews = async (): Promise<Review[]> => {
  if (USE_MOCK) {
    return getReviewsFromBackend();
  }

  const response = await fetch(`${API_BASE_URL}/reviews`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.reviews || [];
};

export const getAverageRating = async (
  restaurantId: string,
): Promise<number> => {
  const reviews = await getRestaurantReviews(restaurantId);

  if (reviews.length === 0) {
    return 0;
  }

  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / reviews.length;
};
