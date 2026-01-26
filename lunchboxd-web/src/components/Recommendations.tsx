import { useNavigate } from "react-router";
import { RestaurantCard } from "./RestaurantCard";
import type { Restaurant } from "../types/types";

interface RecommendationsProps {
  restaurants: Restaurant[];
  isLoading?: boolean;
}

export function Recommendations({
  restaurants,
  isLoading,
}: RecommendationsProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          RECOMMENDATIONS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-2xl h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  return (
    <div className="py-12 border-t border-gray-200">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">RECOMMENDATIONS</h2>
        <button
          onClick={() => navigate("/directory")}
          className="text-orange-500 font-semibold hover:text-orange-600 transition"
        >
          more
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurants.slice(0, 4).map((restaurant) => (
          <div key={restaurant.id}>
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>
    </div>
  );
}
