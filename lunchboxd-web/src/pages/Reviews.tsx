import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import { Star, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { SignInModal } from "../components/SignInModal";
import { ReviewModal } from "../components/ReviewModal";
import { getReviewsByUserId, deleteReview } from "../services/reviewsService";
import { fetchRestaurants } from "../services/apiClient";
import type { Review as ReviewType, Restaurant } from "../types/types";

interface ReviewWithRestaurant extends ReviewType {
  restaurant?: Restaurant;
}

export function Reviews() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [reviews, setReviews] = useState<ReviewWithRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] =
    useState<ReviewWithRestaurant | null>(null);

  // Function to load reviews
  const loadReviews = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const userReviews = await getReviewsByUserId(user.id);
      const restaurants = await fetchRestaurants();

      const reviewsWithRestaurant = userReviews.map((review) => ({
        ...review,
        restaurant: restaurants.find((r) => r.id === review.restaurantId),
      }));

      // Sort by date descending
      reviewsWithRestaurant.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setReviews(reviewsWithRestaurant);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch user reviews on mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadReviews();
    }
  }, [isAuthenticated, user?.id, loadReviews]);

  // Handle edit button click
  const handleEditReview = (review: ReviewWithRestaurant) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  // Handle delete button click
  const handleDeleteReview = async (reviewId: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        loadReviews();
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Failed to delete review");
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F3F6F1] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Your Reviews
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Please log in to view and manage your reviews
            </p>
            <button
              onClick={() => setShowSignInModal(true)}
              className="px-6 py-2 bg-[#5a7a1e] text-white rounded-full hover:bg-[#2F532F] transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
        <SignInModal
          isOpen={showSignInModal}
          onClose={() => setShowSignInModal(false)}
          message="Sign in to view your reviews"
        />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3F6F1] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button and Header */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2F532F] hover:text-[#1a331a] font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 uppercase tracking-wider">
              Your Reviews
            </h1>
            <p className="text-gray-600">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Reviews List */}
          {isLoading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F532F] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Reviews Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't written any reviews. Start by reviewing a
                restaurant!
              </p>
              <button
                onClick={() => navigate("/directory")}
                className="px-6 py-2 bg-[#5a7a1e] text-white rounded-full hover:bg-[#2F532F] transition-colors"
              >
                Browse Restaurants
              </button>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-5">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Restaurant Image */}
                    <div className="shrink-0">
                      <img
                        src={
                          review.restaurant?.profileImage ||
                          "https://via.placeholder.com/80"
                        }
                        alt={review.restaurant?.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-gray-300 cursor-pointer"
                        onClick={() =>
                          review.restaurant?.id &&
                          navigate(`/store/${review.restaurant.id}`)
                        }
                      />
                    </div>

                    {/* Review Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <button
                          onClick={() =>
                            review.restaurant?.id &&
                            navigate(`/store/${review.restaurant.id}`)
                          }
                          className="text-left"
                        >
                          <h3 className="font-bold text-base sm:text-lg text-[#2F532F] line-clamp-1 hover:text-[#5a7a1e] transition-colors">
                            {review.restaurant?.name || "Restaurant"}
                          </h3>
                        </button>

                        {/* Edit/Delete Buttons */}
                        <div className="flex gap-2 ml-2 shrink-0">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-2 text-gray-500 hover:text-[#5a7a1e] hover:bg-gray-100 rounded-full transition-colors"
                            title="Edit review"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Delete review"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Location */}
                      {review.restaurant?.location && (
                        <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                          {review.restaurant.location}
                        </p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-2 my-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                        <span className="text-xs sm:text-sm text-gray-600 ml-1 font-semibold">
                          {review.rating}/5
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-2">
                        {review.comment}
                      </p>

                      {/* Date */}
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Review Modal for Editing */}
      {selectedReview && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedReview(null);
          }}
          restaurantName={selectedReview.restaurant?.name || "Restaurant"}
          restaurantId={selectedReview.restaurantId}
          reviewId={selectedReview.id}
          existingReview={{
            rating: selectedReview.rating,
            comment: selectedReview.comment,
          }}
          onSuccess={() => {
            setShowReviewModal(false);
            setSelectedReview(null);
            loadReviews();
          }}
        />
      )}

      <Footer />
    </>
  );
}
