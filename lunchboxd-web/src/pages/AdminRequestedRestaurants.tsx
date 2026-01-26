import { useEffect, useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import {
  getRestaurantRequests,
  updateRestaurantRequestStatus,
} from "../services/adminService";
import type { RestaurantRequest } from "../types/types";

export function AdminRequestedRestaurants() {
  const [requests, setRequests] = useState<RestaurantRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<RestaurantRequest | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRestaurantRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setActionLoading(true);
      const request = requests.find((r) => r.id === requestId);
      if (request) {
        await updateRestaurantRequestStatus(requestId, "approved");

        // Add to restaurants list
        const restaurants = JSON.parse(
          localStorage.getItem("restaurants") || "[]",
        );
        const newRestaurant = {
          id: `rest_${Date.now()}`,
          name: request.restaurantName,
          cuisine: request.cuisine,
          location: request.location,
          budget: request.budgetRange,
          rating: 0,
          reviewCount: 0,
          tags: [request.cuisine],
          image: "/restaurant-placeholder.jpg",
          description: request.description,
          type: request.type,
          paymentMode: request.paymentMode,
          sides: request.sides,
          contact: request.contact,
          approvedAt: new Date().toISOString(),
        };
        restaurants.push(newRestaurant);
        localStorage.setItem("restaurants", JSON.stringify(restaurants));

        // Update state
        setRequests(
          requests.map((r) =>
            r.id === requestId ? { ...r, status: "approved" } : r,
          ),
        );
        if (selectedRequest?.id === requestId) {
          setSelectedRequest({ ...selectedRequest, status: "approved" });
        }
      }
    } catch (err) {
      console.error("Error approving request:", err);
      setError("Failed to approve request");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setActionLoading(true);
      await updateRestaurantRequestStatus(requestId, "rejected");
      setRequests(
        requests.map((r) =>
          r.id === requestId ? { ...r, status: "rejected" } : r,
        ),
      );
      if (selectedRequest?.id === requestId) {
        setSelectedRequest({ ...selectedRequest, status: "rejected" });
      }
    } catch (err) {
      console.error("Error rejecting request:", err);
      setError("Failed to reject request");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      default:
        return "❓";
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
            <p className="mt-4 text-slate-600">Loading requests...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const processedRequests = requests.filter((r) => r.status !== "pending");

  return (
    <AdminLayout>
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            🏪 Requested Restaurants
          </h1>
          <p className="text-slate-600">
            Review and approve restaurant submissions
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-yellow-500">
              {pendingRequests.length}
            </div>
            <p className="text-slate-600 text-sm mt-2">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-green-500">
              {requests.filter((r) => r.status === "approved").length}
            </div>
            <p className="text-slate-600 text-sm mt-2">Approved</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-3xl font-bold text-red-500">
              {requests.filter((r) => r.status === "rejected").length}
            </div>
            <p className="text-slate-600 text-sm mt-2">Rejected</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-2 space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-slate-600 text-lg">No requests yet</p>
              </div>
            ) : (
              <>
                {/* Pending Section */}
                {pendingRequests.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                      ⏳ Pending Approval
                    </h2>
                    <div className="space-y-3">
                      {pendingRequests.map((request) => (
                        <div
                          key={request.id}
                          onClick={() => setSelectedRequest(request)}
                          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all duration-200 ${
                            selectedRequest?.id === request.id
                              ? "ring-2 ring-orange-500 shadow-lg"
                              : "hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-900">
                                {request.restaurantName}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {request.cuisine} • {request.location}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                                  {request.budgetRange}
                                </span>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {request.type}
                                </span>
                              </div>
                            </div>
                            <span
                              className={`${getStatusBadge("pending")} px-3 py-1 rounded-full text-xs font-semibold`}
                            >
                              Pending
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Processed Section */}
                {processedRequests.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-3">
                      ✓ Processed
                    </h2>
                    <div className="space-y-3">
                      {processedRequests.map((request) => (
                        <div
                          key={request.id}
                          onClick={() => setSelectedRequest(request)}
                          className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all duration-200 opacity-75 ${
                            selectedRequest?.id === request.id
                              ? "ring-2 ring-orange-500"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-900">
                                {request.restaurantName}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">
                                {request.cuisine} • {request.location}
                              </p>
                            </div>
                            <span
                              className={`${getStatusBadge(request.status)} px-3 py-1 rounded-full text-xs font-semibold`}
                            >
                              {getStatusIcon(request.status)} {request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Detail Panel */}
          {selectedRequest && (
            <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-4">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900">Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm mb-6 pb-6 border-b">
                <div>
                  <p className="text-slate-600 font-semibold">Restaurant</p>
                  <p className="text-slate-900">
                    {selectedRequest.restaurantName}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Cuisine</p>
                  <p className="text-slate-900">{selectedRequest.cuisine}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Location</p>
                  <p className="text-slate-900">{selectedRequest.location}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Budget Range</p>
                  <p className="text-slate-900">
                    {selectedRequest.budgetRange}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Type</p>
                  <p className="text-slate-900">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">
                    Payment Methods
                  </p>
                  <p className="text-slate-900">
                    {selectedRequest.paymentMode.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Contact</p>
                  <p className="text-slate-900">{selectedRequest.contact}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-semibold">Submitted</p>
                  <p className="text-slate-900">
                    {formatDate(selectedRequest.submittedAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-slate-600 font-semibold text-sm mb-2">
                  Description
                </p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {selectedRequest.description}
                </p>
              </div>

              {selectedRequest.status === "pending" && (
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actionLoading}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 font-semibold"
                  >
                    {actionLoading ? "Processing..." : "✅ Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={actionLoading}
                    className="w-full bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 font-semibold"
                  >
                    {actionLoading ? "Processing..." : "❌ Reject"}
                  </button>
                </div>
              )}

              {selectedRequest.status !== "pending" && (
                <div
                  className={`mt-6 p-3 rounded-lg text-center text-sm font-semibold ${getStatusBadge(selectedRequest.status)}`}
                >
                  {getStatusIcon(selectedRequest.status)}{" "}
                  {selectedRequest.status.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
