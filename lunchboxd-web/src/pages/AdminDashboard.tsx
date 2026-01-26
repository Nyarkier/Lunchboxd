import { AdminLayout } from "../layouts/AdminLayout";
import { useAdminStats } from "../hooks/useAdminStats";

export function AdminDashboard() {
  const { stats, loading, error } = useAdminStats();

  // Define card configuration separately for reactive updates
  const cardConfig = [
    {
      key: "users",
      label: "Total Users",
      icon: "👥",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-600",
    },
    {
      key: "restaurants",
      label: "Restaurants",
      icon: "🍽️",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-600",
    },
    {
      key: "requests",
      label: "Pending Requests",
      icon: "⏳",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-600",
    },
    {
      key: "reviews",
      label: "Total Reviews",
      icon: "⭐",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-600",
    },
    {
      key: "messages",
      label: "Unread Messages",
      icon: "📧",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      textColor: "text-orange-600",
    },
  ];

  const getStatValue = (key: string): number => {
    switch (key) {
      case "users":
        return stats.totalUsers;
      case "restaurants":
        return stats.totalRestaurants;
      case "requests":
        return stats.pendingRequests;
      case "reviews":
        return stats.totalReviews;
      case "messages":
        return stats.unreadMessages;
      default:
        return 0;
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
            <p className="mt-4 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {cardConfig.map((card) => (
            <div
              key={card.key}
              className={`${card.bgColor} border-2 ${card.borderColor} rounded-lg p-6 transition-transform hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-600">
                    {card.label}
                  </p>
                  <p className={`text-3xl font-bold ${card.textColor} mt-2`}>
                    {getStatValue(card.key)}
                  </p>
                </div>
                <div className="text-4xl opacity-50">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-2xl">✅</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    New restaurant request
                  </p>
                  <p className="text-xs text-slate-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-2xl">⭐</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    New reviews pending moderation
                  </p>
                  <p className="text-xs text-slate-600">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-2xl">👤</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900">
                    New user registered
                  </p>
                  <p className="text-xs text-slate-600">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Platform Health
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700">
                    User Activity
                  </p>
                  <span className="text-sm text-green-600 font-semibold">
                    78%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: "78%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Restaurant Coverage
                  </p>
                  <span className="text-sm text-blue-600 font-semibold">
                    65%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "65%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Data Accuracy
                  </p>
                  <span className="text-sm text-purple-600 font-semibold">
                    92%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: "92%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Analytics Overview
          </h3>
          <div className="bg-slate-100 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-600 text-lg">📊</p>
              <p className="text-slate-600 mt-2">
                Charts and detailed analytics coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
