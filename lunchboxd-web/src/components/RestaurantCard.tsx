import { useState, useEffect } from "react";
import { Heart, UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router";
import { SignInModal } from "./SignInModal";
import { useAuth } from "../hooks/useAuth";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../services/favoritesService";

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    rating: number;
    location: string;
    budgetRange: string;
    sides: string;
    profileImage?: string | null;
    menuImages?: string[];
  };
}

function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Load favorite status when component mounts or user changes
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (isAuthenticated && user) {
        const favorited = await isFavorite(user.id, restaurant.id);
        setIsFavorited(favorited);
      } else {
        setIsFavorited(false);
      }
    };

    loadFavoriteStatus();
  }, [isAuthenticated, user, restaurant.id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated || !user) {
      setShowSignInModal(true);
      return;
    }

    try {
      if (isFavorited) {
        await removeFavorite(user.id, restaurant.id);
        setIsFavorited(false);
      } else {
        await addFavorite(user.id, restaurant.id);
        setIsFavorited(true);
      }
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const handleCardClick = () => {
    navigate(`/store/${restaurant.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-off-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col group ring-1 ring-gray-300 shadow-md"
      >
        {/* Image area with heart button */}
        <div className="relative w-full h-48 bg-linear-to-br from-[#4a5f75] to-[#3a4e5e] flex items-center justify-center overflow-hidden">
          {restaurant.profileImage ? (
            <img
              src={restaurant.profileImage}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <UtensilsCrossed size={64} className="text-gray-400 opacity-40" />
          )}

          {/* Heart Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all group-hover:scale-110"
          >
            <Heart
              size={24}
              className={
                isFavorited ? "fill-red-500 text-red-500" : "text-white"
              }
            />
          </button>
        </div>

        {/* Card content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          {/* Restaurant Info */}
          <div>
            <h3 className="font-bold text-xl text-forest-mid mb-2 line-clamp-2">
              {restaurant.name}
            </h3>
            <div className="flex items-start gap-1 mb-4">
              <span className="text-gray-300 text-sm">📍</span>
              <p className="text-sm text-black line-clamp-2">
                {restaurant.location}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-500">
            <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {restaurant.cuisine}
            </span>
            {restaurant.rating && (
              <span className="inline-block bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                {restaurant.rating}★
              </span>
            )}
            <span className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              ₱{restaurant.budgetRange}
            </span>
            <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {restaurant.sides}
            </span>
          </div>
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        message="You need to be logged in to add to favorites. Sign in or create an account to continue."
      />
    </>
  );
}

export { RestaurantCard };
