import { Star } from "lucide-react";
import { useNavigate } from "react-router";
import type { Review, Restaurant } from "../types/types";

export interface ReviewWithRestaurant extends Review {
  restaurant: Restaurant;
}

interface YourReviewsProps {
  reviews: ReviewWithRestaurant[];
  onViewMore: () => void;
}

export function YourReviews({ reviews, onViewMore }: YourReviewsProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-wider">
          Your Reviews
        </h2>
        <button
          onClick={onViewMore}
          className="text-[#5a7a1e] hover:text-[#2F532F] font-semibold text-sm transition-colors"
        >
          more
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-[#F3F6F1] rounded-lg p-8 text-center">
          <p className="text-gray-600 text-sm">
            You haven't written any reviews yet. Share your dining experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {reviews.slice(0, 3).map((review) => (
            <button
              key={review.id}
              onClick={() => navigate(`/store/${review.restaurantId}`)}
              className="w-full bg-white rounded-lg p-4 sm:p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 text-left"
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
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-gray-300"
                  />
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-[#2F532F] line-clamp-1">
                    {review.restaurant?.name || "Restaurant"}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 my-1">
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
                    <span className="text-xs sm:text-sm text-gray-600 ml-1">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">
                    {review.comment}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
