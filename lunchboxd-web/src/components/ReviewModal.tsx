import { useState } from "react";
import { X, Star, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  addReview,
  updateReview,
  deleteReview,
} from "../services/reviewsService";
import { addFavorite } from "../services/favoritesService";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurantName: string;
  restaurantId: string;
  reviewId?: string;
  existingReview?: { rating: number; comment: string };
  onSuccess?: () => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  restaurantName,
  restaurantId,
  reviewId,
  existingReview,
  onSuccess,
}: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(existingReview?.rating ?? 3);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ate");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    if (!user) {
      alert("You must be logged in to submit a review");
      return;
    }

    setIsSubmitting(true);
    try {
      if (reviewId) {
        // Update existing review
        await updateReview(reviewId, rating, comment);
      } else {
        // Create new review
        await addReview(restaurantId, user.id, rating, comment);
      }

      // Handle favorite
      if (isFavorited) {
        await addFavorite(user.id, restaurantId);
      }

      setComment("");
      setRating(3);
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!reviewId) return;

    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(reviewId);
        setComment("");
        setRating(3);
        onClose();
        onSuccess?.();
      } catch (error) {
        console.error("Failed to delete review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-2xl my-8 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <p className="text-sm text-gray-600 mb-1">kumain ako sa...</p>
            <h2 className="text-3xl font-bold text-gray-900">
              {restaurantName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 px-6 pt-6 border-b border-gray-200">
          <button
            onClick={() => setSelectedTab("ate")}
            className={`pb-3 px-3 font-medium transition ${
              selectedTab === "ate"
                ? "text-[#5a7a1e] border-b-2 border-[#5a7a1e]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="bg-gray-300 text-xs px-2 py-1 rounded mr-2">
              Ate on {formattedDate}
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("visited")}
            className={`pb-3 px-3 font-medium transition ${
              selectedTab === "visited"
                ? "text-[#5a7a1e] border-b-2 border-[#5a7a1e]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span className="bg-gray-300 text-xs px-2 py-1 rounded">
              I&apos;ve ate here before
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Review Text Area */}
          <div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a review..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5a7a1e] focus:border-transparent resize-none bg-gray-100"
            />
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-center">
            <div className="space-y-3">
              {/* Rating */}
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-700">Rating</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          star <= rating
                            ? "fill-[#5a7a1e] text-[#5a7a1e]"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">
                  {rating} of 5
                </span>
              </div>

              {/* Favorite */}
              <button
                onClick={() => setIsFavorited(!isFavorited)}
                className="flex items-center gap-2 transition"
              >
                <Heart
                  size={20}
                  className={
                    isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
                  }
                />
                <span className="text-sm text-gray-600">
                  {isFavorited ? "Favorited" : "Favorite"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 justify-end px-6 py-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-gray-400 text-white font-bold rounded hover:bg-gray-500 transition uppercase text-sm"
          >
            Delete
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-[#5a7a1e] text-white font-bold rounded hover:bg-[#2F532F] transition uppercase text-sm disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
