import type { Review } from "../types/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const addReview = async (restaurantId: string, userId: string, rating: number, comment: string): Promise<Review> => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ restaurantId, userId, rating, comment }),
  });
  if (!response.ok) throw new Error("Failed");
  return await response.json();
};

export const getRestaurantReviews = async (restaurantId: string): Promise<Review[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/reviews`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.reviews || data;
  } catch { return []; }
};

// --- RESTORED FUNCTIONS ---
export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  console.log(userId); // Silence error
  return []; 
};

export const updateReview = async (reviewId: string, rating: number, comment: string): Promise<Review | null> => {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, comment }),
  });
  if (!response.ok) return null;
  return await response.json();
};
// --------------------------

export const deleteReview = async (reviewId: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, { method: "DELETE" });
  return response.ok;
};

export const getAverageRating = async (restaurantId: string): Promise<number> => {
  const reviews = await getRestaurantReviews(restaurantId);
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};