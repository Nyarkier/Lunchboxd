import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import { ProfileHeader } from "../components/ProfileHeader";
import { YourFavorites } from "../components/YourFavorites";
import { YourReviews } from "../components/YourReviews";
import {
  EditProfileModal,
  type ProfileUpdates,
} from "../components/EditProfileModal";
import { updateUserProfile, updateUserPassword } from "../services/userService";
import { getUserFavorites } from "../services/favoritesService";
import { getReviewsByUserId } from "../services/reviewsService";
import { fetchRestaurants } from "../services/apiClient";
import type { Restaurant, Review } from "../types/types";

interface ReviewWithRestaurant extends Review {
  restaurant: Restaurant;
}

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<Restaurant[]>([]);
  const [reviews, setReviews] = useState<ReviewWithRestaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate("/", { replace: true });
        return;
      }

      try {
        // Load restaurants
        const restaurants = await fetchRestaurants();

        // Load user favorites
        const userFavorites = await getUserFavorites(user.id, restaurants);
        setFavorites(userFavorites);

        // Load user reviews
        const userReviews = await getReviewsByUserId(user.id);
        const reviewsWithRestaurant = userReviews
          .map((review) => ({
            ...review,
            restaurant:
              restaurants.find(
                (r: Restaurant) => r.id === review.restaurantId,
              ) || ({} as Restaurant),
          }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        setReviews(reviewsWithRestaurant);
      } catch (error) {
        console.error("Failed to load profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleSaveProfile = async (updates: ProfileUpdates) => {
    if (!user) return;

    // Update profile information
    await updateUserProfile(user.id, {
      firstName: updates.firstName,
      lastName: updates.lastName,
      username: updates.username,
      avatar: updates.avatar,
    });

    // Update password if provided
    if (
      updates.currentPassword &&
      updates.newPassword &&
      updates.currentPassword !== updates.newPassword
    ) {
      await updateUserPassword(
        user.id,
        updates.currentPassword,
        updates.newPassword,
      );
    }

    // Refresh page to show updated data
    window.location.reload();
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#F3F6F1] flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F532F] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
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
          {/* Profile Header */}
          <ProfileHeader
            favoritesCount={favorites.length}
            reviewsCount={reviews.length}
            onEditClick={() => setIsEditModalOpen(true)}
            onLogoutClick={handleLogout}
          />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Favorites and Reviews */}
            <div className="lg:col-span-2">
              {/* Your Favorites */}
              <YourFavorites
                restaurants={favorites}
                onViewMore={() => navigate("/favorites")}
              />

              {/* Your Reviews */}
              <YourReviews
                reviews={reviews}
                onViewMore={() => navigate("/reviews")}
              />
            </div>

            {/* Right Column - Profile Stats and Info */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#5a7a1e]">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Profile Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Username</span>
                    <span className="font-semibold text-[#2F532F]">
                      @{user?.username}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">Email</span>
                    <span className="font-semibold text-sm break-all text-right">
                      {user?.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-semibold text-[#2F532F]">
                      {new Date().getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Info Card */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-bold text-green-900 mb-3">
                  Account
                </h3>
                <p className="text-sm text-green-800 mb-4">
                  Manage your account settings and preferences
                </p>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
      />

      <Footer />
    </>
  );
}
