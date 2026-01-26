import { useState } from "react";
import { X, Camera, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: ProfileUpdates) => Promise<void>;
}

export interface ProfileUpdates {
  firstName: string;
  lastName: string;
  username: string;
  avatar?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

export function EditProfileModal({
  isOpen,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    username: user?.username || "",
    avatar: (user?.avatar as string | null | undefined) || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First and Last name are required");
      return false;
    }

    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }

    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        setError("Current password is required to set a new password");
        return false;
      }

      if (!formData.newPassword || !formData.confirmPassword) {
        setError("New password and confirmation are required");
        return false;
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match");
        return false;
      }

      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await onSave(formData);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-linear-to-r from-[#2F532F] to-[#5a7a1e] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-3 pb-4 border-b border-gray-200">
            <img
              src={
                formData.avatar ||
                `https://i.pravatar.cc/150?u=${user?.id || "default"}`
              }
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-[#2F532F]"
            />
            <label className="flex items-center gap-2 bg-[#2F532F] text-white px-4 py-2 rounded-full cursor-pointer hover:bg-[#1a331a] transition-colors text-sm font-medium">
              <Camera size={16} />
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F532F] focus:border-transparent outline-none transition"
              placeholder="Enter first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F532F] focus:border-transparent outline-none transition"
              placeholder="Enter last name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F532F] focus:border-transparent outline-none transition"
              placeholder="Enter username"
            />
          </div>

          {/* Password Section */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Change Password (Optional)
            </p>

            {/* Current Password */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F532F] focus:border-transparent outline-none transition pr-10"
                  placeholder="Leave empty to skip"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F532F] focus:border-transparent outline-none transition"
                placeholder="Leave empty to skip"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Confirm New Password
              </label>
              <input
                type={showPasswords ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F532F] focus:border-transparent outline-none transition"
                placeholder="Leave empty to skip"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-linear-to-r from-[#2F532F] to-[#5a7a1e] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
