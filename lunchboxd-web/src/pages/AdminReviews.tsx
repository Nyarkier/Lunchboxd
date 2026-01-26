import { useEffect, useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import type { Review } from "../types/types";

interface ReviewWithDetails extends Review {
  restaurantName?: string;
  userName?: string;
  status?: "approved" | "flagged" | "deleted";
}

export function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<ReviewWithDetails[]>(
    [],
  );
  const [filterStatus, setFilterStatus] = useState<
    "all" | "approved" | "flagged"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  useEffect(() => {
    // Load reviews from mock backend
    const loadReviews = async () => {
      try {
        const response = await fetch("/mock-backend/data.json");
        const data = await response.json();
        const mockReviews: ReviewWithDetails[] = (data.reviews || []).map(
          (review: Review, index: number) => ({
            ...review,
            restaurantName: `Restaurant ${index + 1}`,
            userName: `User ${index + 1}`,
            status: Math.random() > 0.7 ? "flagged" : "approved",
          }),
        );
        setReviews(mockReviews);
      } catch (error) {
        console.error("Error loading reviews:", error);
        // Fallback mock data
        const mockReviews: ReviewWithDetails[] = [
          {
            id: "rev_1",
            restaurantId: "1",
            userId: "1",
            rating: 5,
            comment: "Excellent food and great service! Highly recommended.",
            createdAt: new Date().toISOString(),
            restaurantName: "JAP-IT Food Hauz",
            userName: "Prince Lord Mendoza",
            status: "approved",
          },
          {
            id: "rev_2",
            restaurantId: "2",
            userId: "2",
            rating: 3,
            comment: "Average quality, could improve the menu variety.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            restaurantName: "Haven Cafe",
            userName: "Kurt Valera",
            status: "flagged",
          },
          {
            id: "rev_3",
            restaurantId: "3",
            userId: "3",
            rating: 4,
            comment: "Good food but a bit expensive for the portion size.",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            restaurantName: "Taba Eatery",
            userName: "Raisen Yamul",
            status: "approved",
          },
        ];
        setReviews(mockReviews);
      }
    };
    loadReviews();
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = reviews;

    if (filterStatus !== "all") {
      filtered = filtered.filter((review) => review.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.restaurantName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.userName?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    setFilteredReviews(filtered);
  }, [reviews, filterStatus, searchTerm]);

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId ? { ...review, status: "deleted" } : review,
      ),
    );
    setDeletingReviewId(null);
  };

  const handleFlagReview = (reviewId: string) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              status: review.status === "flagged" ? "approved" : "flagged",
            }
          : review,
      ),
    );
  };

  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const flaggedCount = reviews.filter((r) => r.status === "flagged").length;
  const deletedCount = reviews.filter((r) => r.status === "deleted").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Review Moderation
          </h1>
          <p className="text-slate-600 mt-1">
            Review and manage user-submitted reviews
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-600 font-semibold">Approved</p>
            <p className="text-2xl font-bold text-green-700 mt-1">
              {approvedCount}
            </p>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-semibold">Flagged</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">
              {flaggedCount}
            </p>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-600 font-semibold">Deleted</p>
            <p className="text-2xl font-bold text-red-700 mt-1">
              {deletedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search reviews or restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "approved" | "flagged")
            }
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Reviews</option>
            <option value="approved">Approved</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews
            .filter((r) => r.status !== "deleted")
            .map((review) => (
              <div
                key={review.id}
                className={`border-2 rounded-lg p-4 ${
                  review.status === "flagged"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Review Info */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-xl font-bold text-yellow-500">
                        {"⭐".repeat(review.rating)}
                      </div>
                      <span className="text-sm font-semibold text-slate-600">
                        {review.rating}/5 stars
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900 mb-2">
                      {review.restaurantName}
                    </p>
                    <p className="text-slate-700 mb-2">"{review.comment}"</p>
                    <p className="text-sm text-slate-600">
                      By {review.userName} on{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status & ID */}
                  <div className="md:col-span-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        review.status === "flagged"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-green-200 text-green-800"
                      }`}
                    >
                      {review.status === "flagged"
                        ? "⚠️ Flagged"
                        : "✓ Approved"}
                    </span>
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                      ID: {review.id}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="md:col-span-1 flex flex-col gap-2">
                    <button
                      onClick={() => handleFlagReview(review.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        review.status === "flagged"
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-yellow-500 text-white hover:bg-yellow-600"
                      }`}
                    >
                      {review.status === "flagged" ? "Approve" : "Flag"}
                    </button>
                    <button
                      onClick={() => setDeletingReviewId(review.id)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete Confirmation */}
                {deletingReviewId === review.id && (
                  <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-red-800">
                      Are you sure you want to permanently delete this review?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeletingReviewId(null)}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm font-semibold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-semibold transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

          {filteredReviews.filter((r) => r.status !== "deleted").length ===
            0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 text-lg">No reviews found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
