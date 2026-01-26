import { Heart, MessageCircle, LogOut, Edit } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface ProfileHeaderProps {
  favoritesCount: number;
  reviewsCount: number;
  onEditClick: () => void;
  onLogoutClick: () => void;
}

export function ProfileHeader({
  favoritesCount,
  reviewsCount,
  onEditClick,
  onLogoutClick,
}: ProfileHeaderProps) {
  const { user } = useAuth();

  return (
    <div className="bg-linear-to-r from-[#2F532F] to-[#5a7a1e] rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 sm:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
          {/* Profile Avatar */}
          <div className="shrink-0">
            <img
              src={
                (user?.avatar as string | null | undefined) ||
                `https://i.pravatar.cc/150?u=${user?.id || "default"}`
              }
              alt={`${user?.firstName} ${user?.lastName}`}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
                {user?.firstName} {user?.lastName}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={onEditClick}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
                <button
                  onClick={onLogoutClick}
                  className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white px-3 py-1 rounded-full text-sm font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            </div>

            <p className="text-white/80 text-sm sm:text-base mb-4">
              @{user?.username}
            </p>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8 justify-center sm:justify-start text-white">
              <div className="flex items-center gap-2">
                <Heart size={20} className="text-red-300" />
                <span className="font-semibold">
                  {favoritesCount} Favorite{favoritesCount !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle size={20} className="text-yellow-300" />
                <span className="font-semibold">
                  {reviewsCount} Review{reviewsCount !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
