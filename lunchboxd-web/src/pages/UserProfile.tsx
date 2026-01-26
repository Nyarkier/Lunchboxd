import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { YourFavorites } from "../components/YourFavorites";
import { YourReviews } from "../components/YourReviews";
import { getUserById } from "../services/authService";
import { getReviewsByUserId } from "../services/reviewsService";
import { getUserFavorites } from "../services/favoritesService";
import { fetchRestaurants } from "../services/apiClient";
import type { User } from "../contexts/AuthContext";
import type { Restaurant } from "../types/types";
import type { ReviewWithRestaurant } from "../components/YourReviews";

export function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [reviews, setReviews] = useState<ReviewWithRestaurant[]>([]);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setError("User ID not provided");
        setIsLoading(false);
        return;
      }

      try {
        // Load user profile
        const userData = await getUserById(userId);
        if (!userData) {
          setError("User not found");
          setIsLoading(false);
          return;
        }
        setProfile(userData as User);

        // Load restaurants
        const restaurants = await fetchRestaurants();

        // Load user reviews
        const userReviews = await getReviewsByUserId(userId);
        const reviewsWithRestaurants = userReviews
          .map((review) => ({
            ...review,
            restaurant: restaurants.find((r) => r.id === review.restaurantId),
          }))
          .filter(
            (review) => review.restaurant !== undefined
          ) as ReviewWithRestaurant[];
        setReviews(reviewsWithRestaurants);
        setReviewCount(reviewsWithRestaurants.length);

        // Load user favorites
        const userFavorites = await getUserFavorites(userId, restaurants);
        setFavorites(userFavorites);
      } catch (err) {
        console.error("Failed to load user profile:", err);
        setError("Failed to load user profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [userId]);

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F3F6F1] flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F532F] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F3F6F1] flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">
              {error || "User not found"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mx-auto bg-[#2F532F] hover:bg-[#1a331a] text-white px-6 py-2 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3F6F1] py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2F532F] hover:text-[#1a331a] font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* Profile Header */}
          <div className="bg-linear-to-r from-[#2F532F] to-[#5a7a1e] rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="px-4 sm:px-8 py-6 sm:py-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                {/* Profile Avatar */}
                <div className="shrink-0">
                  <img
                    src={
                      (profile?.avatar as string | null | undefined) ||
                      `https://i.pravatar.cc/150?u=${profile?.id || "default"}`
                    }
                    alt={`${profile?.firstName} ${profile?.lastName}`}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                    {profile?.firstName} {profile?.lastName}
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base mb-4">
                    @{profile?.username}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-6 sm:gap-8 justify-center sm:justify-start text-white">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={20} className="text-yellow-300" />
                      <span className="font-semibold">
                        {reviewCount} Review{reviewCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Favorites and Reviews */}
          <YourFavorites restaurants={favorites} onViewMore={() => {}} />

          <YourReviews reviews={reviews} onViewMore={() => {}} />
        </div>
      </div>
      <Footer />
    </>
  );
}
