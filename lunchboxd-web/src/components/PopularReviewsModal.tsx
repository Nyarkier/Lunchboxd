import { X, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getRestaurantReviews } from "../services/reviewsService";
import { getUserById } from "../services/authService";
import type { Review as ReviewType } from "../types/types";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  isUser?: boolean;
}

interface PopularReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantId: string;
  currentUserId?: string;
}

export function PopularReviewsModal({
  isOpen,
  onClose,
  restaurantName,
  restaurantId,
  currentUserId,
}: PopularReviewsModalProps) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && restaurantId) {
      setIsLoading(true);
      getRestaurantReviews(restaurantId)
        .then(async (data: ReviewType[]) => {
          const formattedReviews: Review[] = await Promise.all(
            data.map(async (review: ReviewType) => {
              // Fetch user info
              const user = await getUserById(review.userId);
              const userName = user
                ? `${user.firstName} ${user.lastName}`
                : "Anonymous User";

              // Get user avatar from pravatar using userId as seed
              const userAvatar = `https://i.pravatar.cc/150?u=${review.userId}`;

              return {
                id: review.id,
                userId: review.userId,
                userName,
                userAvatar,
                rating: review.rating,
                comment: review.comment,
                date: review.createdAt,
                isUser: review.userId === currentUserId,
              };
            })
          );
          // Sort by date descending
          formattedReviews.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setReviews(formattedReviews);
        })
        .catch((error) => {
          console.error("Failed to fetch reviews:", error);
          setReviews([]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, restaurantId, currentUserId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Reviews</h2>
            <p className="text-sm text-gray-600 mt-1">{restaurantName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Reviews List */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-600">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <div className="space-y-4 p-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="shrink-0">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <button
                            onClick={() => navigate(`/user/${review.userId}`)}
                            className="font-bold text-gray-900 hover:text-[#5a7a1e] transition-colors text-left"
                          >
                            {review.userName}
                            {review.isUser && (
                              <span className="text-[#5a7a1e] ml-2">(you)</span>
                            )}
                          </button>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={14}
                                  className={
                                    star <= review.rating
                                      ? "fill-[#5a7a1e] text-[#5a7a1e]"
                                      : "text-gray-300"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {review.rating} of 5
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500 text-right">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-3 text-sm">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-900 font-bold rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
