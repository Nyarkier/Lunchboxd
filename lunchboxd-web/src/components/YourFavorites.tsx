import { useNavigate } from "react-router";
import type { Restaurant } from "../types/types";

interface YourFavoritesProps {
  restaurants: Restaurant[];
  onViewMore: () => void;
}

export function YourFavorites({ restaurants, onViewMore }: YourFavoritesProps) {
  const navigate = useNavigate();

  return (
    <div className="mt-8 sm:mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 uppercase tracking-wider">
          Your Favorites
        </h2>
        <button
          onClick={onViewMore}
          className="text-[#5a7a1e] hover:text-[#2F532F] font-semibold text-sm transition-colors"
        >
          more
        </button>
      </div>

      {restaurants.length === 0 ? (
        <div className="bg-[#F3F6F1] rounded-lg p-8 text-center">
          <p className="text-gray-600 text-sm">
            You haven't added any favorites yet. Start exploring restaurants!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {restaurants.slice(0, 4).map((restaurant) => (
            <button
              key={restaurant.id}
              onClick={() => navigate(`/store/${restaurant.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative bg-gray-300 rounded-lg overflow-hidden h-32 sm:h-40 mb-3 shadow-md hover:shadow-lg transition-shadow">
                {restaurant.profileImage ? (
                  <img
                    src={restaurant.profileImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                    <span className="text-gray-600 text-xs">No image</span>
                  </div>
                )}
              </div>

              <div className="text-left">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 group-hover:text-[#5a7a1e] transition-colors">
                  {restaurant.name}
                </h3>
                <p className="text-xs text-gray-600 line-clamp-1">
                  {restaurant.location}
                </p>
                <div className="flex gap-1 mt-2">
                  <span className="inline-block bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-semibold">
                    {restaurant.cuisine}
                  </span>
                  <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-semibold">
                    ₱{restaurant.budgetRange}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
