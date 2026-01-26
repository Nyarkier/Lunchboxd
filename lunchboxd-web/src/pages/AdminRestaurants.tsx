import { useEffect, useState } from "react";
import { AdminLayout } from "../layouts/AdminLayout";
import { DetailInspectionModal } from "../components/AdminDetailModal";
import type { Restaurant } from "../types/types";

export function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "food" | "drink">("all");

  useEffect(() => {
    // Load restaurants from mock backend
    const loadRestaurants = async () => {
      try {
        const response = await fetch("/mock-backend/data.json");
        const data = await response.json();
        setRestaurants(data.restaurants as Restaurant[]);
      } catch (error) {
        console.error("Error loading restaurants:", error);
      }
    };
    loadRestaurants();
  }, []);

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "all" ||
      (filterType === "food" && restaurant.type === "Food") ||
      (filterType === "drink" && restaurant.type === "Drink");

    return matchesSearch && matchesType;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Restaurants</h1>
            <p className="text-slate-600 mt-1">
              Manage all approved restaurants ({filteredRestaurants.length})
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 rounded-lg p-4">
          <input
            type="text"
            placeholder="Search by name, cuisine, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value as "all" | "food" | "drink")
            }
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Types</option>
            <option value="food">Food</option>
            <option value="drink">Drink</option>
          </select>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              {restaurant.profileImage && (
                <img
                  src={restaurant.profileImage}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-slate-600">{restaurant.cuisine}</p>
                </div>

                {/* Rating & Type */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">
                    ⭐ {restaurant.rating}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {restaurant.type}
                  </span>
                </div>

                {/* Budget & Location */}
                <div className="text-sm text-slate-600 space-y-1">
                  <p>💰 Budget: ₱{restaurant.budgetRange}</p>
                  <p>📍 {restaurant.sides}</p>
                </div>

                {/* Status Badge */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                    ✓ Approved
                  </span>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleRestaurantClick(restaurant)}
                  className="w-full mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                >
                  Inspect Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No restaurants found</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <DetailInspectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRestaurant(null);
        }}
        type="restaurant"
        data={selectedRestaurant}
      />
    </AdminLayout>
  );
}
