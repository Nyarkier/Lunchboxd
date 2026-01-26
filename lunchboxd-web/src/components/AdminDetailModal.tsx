import { useState } from "react";
import type { User, Restaurant, Review } from "../types/types";

interface DetailInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "user" | "restaurant";
  data: User | Restaurant | null;
  reviews?: Review[];
  onDeleteReview?: (reviewId: string) => void;
}

export function DetailInspectionModal({
  isOpen,
  onClose,
  type,
  data,
  reviews = [],
  onDeleteReview,
}: DetailInspectionModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );

  if (!isOpen || !data) return null;

  const isUser = type === "user";
  const user = isUser ? (data as User) : null;
  const restaurant = !isUser ? (data as Restaurant) : null;

  const handleDeleteReview = (reviewId: string) => {
    if (onDeleteReview) {
      onDeleteReview(reviewId);
      setShowDeleteConfirm(null);
    }
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-linear-to-r from-slate-900 to-slate-800 text-white p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isUser ? "User Details" : "Restaurant Details"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {isUser && user ? (
              <>
                {/* User Profile Section */}
                <div className="flex items-start gap-4">
                  {user.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.firstName}
                      className="w-24 h-24 rounded-lg object-cover border-2 border-slate-200"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-slate-600">@{user.username}</p>
                    <p className="text-slate-600">{user.email}</p>
                  </div>
                </div>

                {/* User Info Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">
                      Mobile
                    </p>
                    <p className="text-slate-900">{user.mobile || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">Role</p>
                    <p className="text-slate-900 capitalize">
                      {user.role || "user"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">
                      Join Date
                    </p>
                    <p className="text-slate-900">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">
                      User ID
                    </p>
                    <p className="text-slate-900 font-mono text-sm">
                      {user.id}
                    </p>
                  </div>
                </div>

                {/* Activity Logs Placeholder */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Recent Activity
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p>✓ Last login: Today</p>
                    <p>✓ Reviews written: {reviews.length}</p>
                    <p>✓ Restaurants favorited: 5</p>
                  </div>
                </div>
              </>
            ) : restaurant ? (
              <>
                {/* Restaurant Profile Section */}
                {restaurant.profileImage && (
                  <img
                    src={restaurant.profileImage}
                    alt={restaurant.name}
                    className="w-full h-64 object-cover rounded-lg border-2 border-slate-200"
                  />
                )}

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {restaurant.name}
                  </h3>
                  <p className="text-slate-600">{restaurant.cuisine}</p>
                </div>

                {/* Restaurant Info Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">
                      Rating
                    </p>
                    <p className="text-slate-900 text-lg font-bold">
                      ⭐ {restaurant.rating}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">
                      Budget Range
                    </p>
                    <p className="text-slate-900">₱{restaurant.budgetRange}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">Type</p>
                    <p className="text-slate-900">{restaurant.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-semibold">
                      Location
                    </p>
                    <p className="text-slate-900">{restaurant.sides}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-600 font-semibold">
                      Address
                    </p>
                    <p className="text-slate-900">{restaurant.location}</p>
                  </div>
                </div>

                {/* Menu Images */}
                {restaurant.menuImages && restaurant.menuImages.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">
                      Menu Images ({restaurant.menuImages.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {restaurant.menuImages.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Menu ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-slate-200 hover:border-orange-500 transition-colors"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : null}

            {/* Reviews Section */}
            {reviews.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-semibold text-slate-900 mb-4">
                  Associated Reviews ({reviews.length})
                </h4>
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-900">
                              ⭐ {review.rating}/5
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">
                            {review.comment}
                          </p>
                        </div>
                        {onDeleteReview && (
                          <button
                            onClick={() => setShowDeleteConfirm(review.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete review"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Delete Confirmation */}
                      {showDeleteConfirm === review.id && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded flex items-center justify-between gap-2">
                          <p className="text-sm text-red-800">
                            Delete this review?
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-slate-50 border-t p-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition-colors font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
