import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Heart, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import { RestaurantCard } from "../components/RestaurantCard";
import type { Restaurant } from "../types/types";
import { getAllRestaurants } from "../services/dataService";
import { getUserFavorites } from "../services/favoritesService";

export function Favorites() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      try {
        const allRestaurants = await getAllRestaurants();
        const userFavorites = await getUserFavorites(user.id, allRestaurants);
        setFavorites(userFavorites);
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">
              Please log in to view your favorites
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2F532F] hover:text-[#1a331a] font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* Header Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-[#FFFBE6] p-4 rounded-full">
              <Heart size={32} className="text-orange-500 fill-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                My Favorites
              </h1>
              <p className="text-gray-600 mt-2">
                {favorites.length} saved restaurant
                {favorites.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl animate-pulse overflow-hidden h-80"
                />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Heart size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 text-lg">
                You haven't saved any favorites yet
              </p>
              <p className="text-gray-500 mt-2">
                Start adding restaurants to your favorites to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
