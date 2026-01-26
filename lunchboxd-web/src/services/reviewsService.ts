// Reviews service using mock backend data
import type { Review } from "../types/types";
import mockBackendData from "../../mock-backend/data.json";

// Store reviews in localStorage for persistence
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

// Update reviews in memory and localStorage
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
  comment: string
): Promise<Review> => {
  const reviews = getReviewsFromBackend();

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
};

export const getRestaurantReviews = async (
  restaurantId: string
): Promise<Review[]> => {
  const reviews = getReviewsFromBackend();
  return reviews.filter((r) => r.restaurantId === restaurantId);
};

export const getUserReviews = async (userId: string): Promise<Review[]> => {
  const reviews = getReviewsFromBackend();
  return reviews.filter((r) => r.userId === userId);
};

export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  return getUserReviews(userId);
};

export const updateReview = async (
  reviewId: string,
  rating: number,
  comment: string
): Promise<Review | null> => {
  const reviews = getReviewsFromBackend();
  const review = reviews.find((r) => r.id === reviewId);

  if (review) {
    review.rating = rating;
    review.comment = comment;
    updateBackendReviews(reviews);
    return review;
  }

  return null;
};

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  const reviews = getReviewsFromBackend();
  const index = reviews.findIndex((r) => r.id === reviewId);

  if (index > -1) {
    reviews.splice(index, 1);
    updateBackendReviews(reviews);
    return true;
  }

  return false;
};

export const getAllReviews = async (): Promise<Review[]> => {
  return getReviewsFromBackend();
};

export const getAverageRating = async (
  restaurantId: string
): Promise<number> => {
  const reviews = getReviewsFromBackend();
  const restaurantReviews = reviews.filter(
    (r) => r.restaurantId === restaurantId
  );

  if (restaurantReviews.length === 0) {
    return 0;
  }

  const sum = restaurantReviews.reduce((acc, r) => acc + r.rating, 0);
  return sum / restaurantReviews.length;
};
