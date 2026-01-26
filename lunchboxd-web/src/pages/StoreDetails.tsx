import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import {
  Heart,
  MapPin,
  Clock,
  Mail,
  Banknote,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react";
import { useRestaurant, useRestaurants } from "../hooks/useApi";
import type { Restaurant, Review as ReviewType } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { SignInModal } from "../components/SignInModal";
import { ReviewModal } from "../components/ReviewModal";
import { PopularReviewsModal } from "../components/PopularReviewsModal";
import { Recommendations } from "../components/Recommendations";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
} from "../services/favoritesService";
import { getRestaurantReviews } from "../services/reviewsService";
import { getUserById } from "../services/authService";

export function StoreDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: restaurant, isLoading, error } = useRestaurant(id || null);
  const { data: allRestaurants, isLoading: restaurantsLoading } =
    useRestaurants();
  const { isAuthenticated, user } = useAuth();

  const [selectedMenuIndex, setSelectedMenuIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showAllReviewsModal, setShowAllReviewsModal] = useState(false);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Load favorite status
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (isAuthenticated && user && restaurant) {
        const favorited = await isFavorite(user.id, restaurant.id);
        setIsFavorited(favorited);
      } else {
        setIsFavorited(false);
      }
    };

    loadFavoriteStatus();
  }, [isAuthenticated, user, restaurant]);

  // Load reviews
  useEffect(() => {
    const loadReviews = async () => {
      if (id) {
        setReviewsLoading(true);
        try {
          const data = await getRestaurantReviews(id);
          setReviews(data);
        } catch (err) {
          console.error("Failed to load reviews:", err);
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }
      }
    };

    loadReviews();
  }, [id]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated || !user) {
      setShowSignInModal(true);
      return;
    }

    if (!restaurant) return;

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

  const handleNextMenu = () => {
    if (!restaurant?.menuImages?.length) return;
    setSelectedMenuIndex((prev) =>
      prev === restaurant.menuImages!.length - 1 ? 0 : prev + 1,
    );
  };

  const handlePrevMenu = () => {
    if (!restaurant?.menuImages?.length) return;
    setSelectedMenuIndex((prev) =>
      prev === 0 ? restaurant.menuImages!.length - 1 : prev - 1,
    );
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600 font-bold text-xl animate-pulse">
            Loading restaurant...
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !restaurant) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Restaurant Not Found
          </h2>
          <p className="text-gray-600">
            {error?.message ||
              "The restaurant you're looking for doesn't exist."}
          </p>
        </div>
        <Footer />
      </>
    );
  }

  // Filter out current restaurant from recommendations
  const recommendations = Array.isArray(allRestaurants)
    ? allRestaurants.filter((r: Restaurant) => r.id !== restaurant.id)
    : [];

  // Get top 3 reviews sorted by date
  const topReviews = reviews
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3F6F1] block">
        {/* Hero Image Section */}
        <div className="relative block w-full h-64 md:h-80 bg-gray-900 overflow-hidden group">
          {restaurant.profileImage ? (
            <img
              src={restaurant.profileImage}
              alt={restaurant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 block"
            />
          ) : (
            <div className="w-full h-full bg-gray-400 flex items-center justify-center">
              <span className="text-gray-600">No image</span>
            </div>
          )}

          {/* View Map Button */}
          <button className="absolute bottom-4 right-4 bg-white border-2 border-[#2F532F] text-[#2F532F] text-xs font-bold px-4 py-2 rounded-full hover:bg-[#2F532F] hover:text-white transition-colors uppercase tracking-wider shadow-md">
            View Map
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT COLUMN: Info & Reviews */}
            <div className="lg:col-span-2 space-y-6">
              {/* Store Header Info */}
              <div className="bg-[#F3F6F1] pt-4">
                <div className="flex items-center gap-3 mb-2">
                  {/* Heart Toggle */}
                  <button
                    onClick={handleFavoriteClick}
                    className="focus:outline-none transform hover:scale-110 transition-transform active:scale-95"
                  >
                    <Heart
                      size={32}
                      className={
                        isFavorited
                          ? "fill-red-500 text-red-500"
                          : "text-orange-500"
                      }
                      strokeWidth={2.5}
                    />
                  </button>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#2F532F] leading-tight">
                    {restaurant.name}
                  </h1>
                </div>

                <div className="space-y-2 text-sm md:text-base font-medium text-gray-700 ml-1">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-[#5a7a1e]" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-[#5a7a1e]" />
                    <span>8am - 9pm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-[#5a7a1e]" />
                    <span className="text-blue-600">japitfood@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote size={18} className="text-[#5a7a1e]" />
                    <span>
                      {restaurant.paymentMode &&
                      restaurant.paymentMode.length > 0
                        ? restaurant.paymentMode.join(", ")
                        : "Cash, GCash"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-[#F3F6F1] rounded-xl border-t-2 border-[#2F532F]/10 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Reviews</h3>
                    <p className="text-xs text-gray-500">
                      Based on recent visits
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        setShowSignInModal(true);
                      } else {
                        setShowReviewModal(true);
                      }
                    }}
                    className="bg-[#5a7a1e] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#2F532F] transition-colors shadow-sm"
                  >
                    Write a review
                  </button>
                </div>

                {/* Stars Interactive */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 text-center">
                  <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    Rate this place
                  </p>
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={32}
                        className="text-[#99BA75] fill-[#99BA75] hover:scale-110 cursor-pointer transition-transform"
                      />
                    ))}
                  </div>
                </div>

                {/* Rating Stats */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 border-b pb-1 border-gray-300">
                    Ratings
                  </h3>
                  <div className="flex items-end gap-4">
                    <Star
                      size={24}
                      className="text-[#5a7a1e] fill-[#5a7a1e] mb-1"
                    />

                    {/* Histogram */}
                    <div className="flex-1 flex items-end h-16 gap-1 pb-1">
                      {[10, 15, 40, 60, 30].map((height, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col justify-end h-full"
                        >
                          <div
                            style={{ height: `${height}%` }}
                            className="w-full bg-[#2F343A] rounded-t-sm hover:bg-[#5a7a1e] transition-colors"
                          ></div>
                        </div>
                      ))}
                    </div>

                    <div className="text-right mb-2">
                      <span className="text-4xl font-bold text-gray-800">
                        {restaurant.rating}
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={
                              s <= Math.round(restaurant.rating)
                                ? "text-[#5a7a1e] fill-[#5a7a1e]"
                                : "text-gray-300 fill-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      Popular Reviews
                    </h3>
                    <button
                      onClick={() => setShowAllReviewsModal(true)}
                      className="text-xs text-gray-500 font-bold cursor-pointer hover:underline"
                    >
                      more
                    </button>
                  </div>

                  <div className="space-y-4">
                    {reviewsLoading ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          Loading reviews...
                        </p>
                      </div>
                    ) : topReviews.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-sm">
                          No reviews yet. Be the first to review!
                        </p>
                      </div>
                    ) : (
                      topReviews.map((review, index) => (
                        <button
                          key={review.id}
                          onClick={() => setShowAllReviewsModal(true)}
                          className={`w-full text-left hover:bg-gray-100 p-2 -m-2 rounded transition ${
                            index < topReviews.length - 1
                              ? "border-b border-gray-300 pb-4"
                              : ""
                          }`}
                        >
                          <div className="flex gap-3 mb-1">
                            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden shrink-0">
                              <img
                                src={`https://i.pravatar.cc/150?u=${review.userId}`}
                                alt="User"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-gray-900">
                                <ReviewerName userId={review.userId} />
                                {review.userId === user?.id && (
                                  <span className="text-[#5a7a1e] ml-1">
                                    (you)
                                  </span>
                                )}
                                <span className="text-[#5a7a1e] ml-2">
                                  {"★".repeat(review.rating)}
                                </span>
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {review.comment.length > 100
                                  ? `${review.comment.substring(0, 100)}...`
                                  : review.comment}
                              </p>
                              <span className="text-[10px] text-gray-400 block mt-1">
                                {new Date(
                                  review.createdAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Store Menu */}
            <div className="lg:col-span-1">
              <div className="bg-[#F3F6F1] pt-6">
                <h2 className="text-2xl font-bold text-[#7A5C38] mb-4 text-center lg:text-left">
                  STORE MENU
                </h2>

                {/* Menu Card Container */}
                <div className="bg-[#FFFBE6] p-4 rounded-xl shadow-md border-2 border-[#F0E6D2] relative group">
                  {/* Image Display */}
                  <div className="relative aspect-4/5 bg-black rounded-lg overflow-hidden">
                    {restaurant.menuImages &&
                    restaurant.menuImages.length > 0 ? (
                      <img
                        src={restaurant.menuImages[selectedMenuIndex]}
                        alt="Menu Page"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <Banknote size={48} className="mb-2 opacity-50" />
                        <p>No Menu Available</p>
                      </div>
                    )}

                    {/* Navigation Arrows */}
                    {restaurant.menuImages &&
                      restaurant.menuImages.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevMenu}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm p-1.5 rounded-full text-white transition-all transform active:scale-95"
                          >
                            <ChevronLeft size={28} />
                          </button>
                          <button
                            onClick={handleNextMenu}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm p-1.5 rounded-full text-white transition-all transform active:scale-95"
                          >
                            <ChevronRight size={28} />
                          </button>

                          {/* Page Indicator */}
                          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-medium backdrop-blur-md">
                            {selectedMenuIndex + 1} /{" "}
                            {restaurant.menuImages.length}
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Section */}
          <Recommendations
            restaurants={recommendations}
            isLoading={restaurantsLoading}
          />
        </div>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        message="You need to be logged in to add to favorites. Sign in or create an account to continue."
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        restaurantName={restaurant?.name || ""}
        restaurantId={restaurant?.id || ""}
        onSuccess={() => {
          // Refresh reviews after submission
          window.location.reload();
        }}
      />

      {/* Popular Reviews Modal */}
      <PopularReviewsModal
        isOpen={showAllReviewsModal}
        onClose={() => setShowAllReviewsModal(false)}
        restaurantName={restaurant?.name || ""}
        restaurantId={id || ""}
        currentUserId={user?.id}
      />

      <Footer />
    </>
  );
}

// Helper component to display reviewer name
function ReviewerName({ userId }: { userId: string }) {
  const [name, setName] = useState<string>("Loading...");

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const userData = await getUserById(userId);
        if (userData) {
          setName(`${userData.firstName} ${userData.lastName}`);
        } else {
          setName("Anonymous User");
        }
      } catch {
        setName("Anonymous User");
      }
    };

    loadUserName();
  }, [userId]);

  return <>{name}</>;
}
