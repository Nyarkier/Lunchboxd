import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import { createRestaurantRequest } from "../services/adminService";
import type { Side } from "../types/types";
import { ArrowLeft, CheckCircle, Upload, X } from "lucide-react";

export function AddRestaurant() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    restaurantName: "",
    cuisine: "",
    location: "",
    budgetRange: "50-150" as "10-50" | "50-150" | "150-500" | "500-1000",
    type: "Food" as "Food" | "Drink",
    paymentMode: [] as ("Cash" | "GCash")[],
    sides: "Main Gate" as Side,
    description: "",
    contact: "",
    profileImage: null as string | null,
    menuImages: [] as string[],
  });

  const sides: Side[] = [
    "Main Gate",
    "Gate Six",
    "Inside the School",
    "North Gate",
    "Hospital Gate",
  ];

  const budgetRanges = ["10-50", "50-150", "150-500", "500-1000"];

  const handlePaymentModeChange = (mode: "Cash" | "GCash") => {
    setFormData((prev) => ({
      ...prev,
      paymentMode: prev.paymentMode.includes(mode)
        ? prev.paymentMode.filter((m) => m !== mode)
        : [...prev.paymentMode, mode],
    }));
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      try {
        const base64 = await convertFileToBase64(file);
        setFormData((prev) => ({ ...prev, profileImage: base64 }));
        setError(null);
      } catch {
        setError("Failed to process image");
      }
    }
  };

  const handleMenuImagesChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (files) {
      if (formData.menuImages.length + files.length > 5) {
        setError("Maximum 5 menu images allowed");
        return;
      }

      try {
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.startsWith("image/")) {
            setError("All files must be images");
            return;
          }
          if (file.size > 5 * 1024 * 1024) {
            setError("Each image must be less than 5MB");
            return;
          }
          const base64 = await convertFileToBase64(file);
          newImages.push(base64);
        }
        setFormData((prev) => ({
          ...prev,
          menuImages: [...prev.menuImages, ...newImages],
        }));
        setError(null);
      } catch {
        setError("Failed to process images");
      }
    }
  };

  const removeMenuImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      menuImages: prev.menuImages.filter((_, i) => i !== index),
    }));
  };

  const removeProfileImage = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Validation
      if (!formData.restaurantName.trim()) {
        throw new Error("Restaurant name is required");
      }
      if (!formData.cuisine.trim()) {
        throw new Error("Cuisine type is required");
      }
      if (!formData.location.trim()) {
        throw new Error("Location is required");
      }
      if (formData.paymentMode.length === 0) {
        throw new Error("Please select at least one payment method");
      }

      const request = await createRestaurantRequest({
        restaurantName: formData.restaurantName,
        cuisine: formData.cuisine,
        location: formData.location,
        budgetRange: formData.budgetRange,
        type: formData.type,
        paymentMode: formData.paymentMode,
        sides: formData.sides,
        description: formData.description,
        submittedBy: user?.id || "unknown",
        contact: formData.contact,
        profileImage: formData.profileImage,
        menuImages: formData.menuImages,
      });

      if (request) {
        setSubmitted(true);
        // Reset form
        setFormData({
          restaurantName: "",
          cuisine: "",
          location: "",
          budgetRange: "50-150",
          type: "Food",
          paymentMode: [],
          sides: "Main Gate",
          description: "",
          contact: "",
          profileImage: null,
          menuImages: [],
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-off-white py-12 px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center">
            <CheckCircle className="mx-auto mb-4 text-green-600" size={64} />
            <h1 className="text-3xl font-bold text-forest-dark mb-4">
              Thank You!
            </h1>
            <p className="text-gray-600 mb-6">
              Your restaurant request has been submitted successfully. Our admin
              team will review your request and get back to you soon.
            </p>
            <button
              onClick={() => navigate("/directory")}
              className="w-full px-6 py-3 bg-forest-dark text-white font-bold rounded-lg hover:bg-[#5a7a1e] transition-colors"
            >
              Back to Directory
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
      <div className="min-h-screen bg-off-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-forest-mid hover:text-forest-dark mb-8 font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </button>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h1 className="text-3xl font-bold text-forest-dark mb-2">
              Add a Restaurant
            </h1>
            <p className="text-gray-600 mb-8">
              Know a great restaurant near Wesleyan? Submit it for us to review!
            </p>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-6">
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Restaurant Name */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., The Grill House"
                  value={formData.restaurantName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      restaurantName: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent"
                />
              </div>

              {/* Cuisine & Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-forest-dark mb-2">
                    Cuisine Type *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rice Meal, Cafe"
                    value={formData.cuisine}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cuisine: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-forest-dark mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        type: e.target.value as "Food" | "Drink",
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent"
                  >
                    <option value="Food">Food</option>
                    <option value="Drink">Drink</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 108 Nori, Mabini Extension"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent"
                />
              </div>

              {/* Budget & Side Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <div className="relative z-20">
                  <label className="block text-sm font-semibold text-forest-dark mb-2">
                    Budget Range *
                  </label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        budgetRange: e.target.value as
                          | "10-50"
                          | "50-150"
                          | "150-500"
                          | "500-1000",
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent appearance-none bg-white"
                  >
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        ₱{range}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative z-10">
                  <label className="block text-sm font-semibold text-forest-dark mb-2">
                    Side/Location *
                  </label>
                  <select
                    value={formData.sides}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        sides: e.target.value as Side,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent appearance-none bg-white"
                  >
                    {sides.map((side) => (
                      <option key={side} value={side}>
                        {side}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-3">
                  Payment Methods * (Select at least one)
                </label>
                <div className="space-y-2">
                  {["Cash", "GCash"].map((mode) => (
                    <label
                      key={mode}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.paymentMode.includes(
                          mode as "Cash" | "GCash",
                        )}
                        onChange={() =>
                          handlePaymentModeChange(mode as "Cash" | "GCash")
                        }
                        className="w-5 h-5 rounded border-gray-300 cursor-pointer"
                      />
                      <span className="text-gray-700">{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Tell us about the restaurant. What makes it special?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent resize-none"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Contact Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g., +639171234567"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contact: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-dark focus:border-transparent"
                />
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Restaurant Logo/Profile Image (Optional)
                </label>
                <div className="space-y-3">
                  {formData.profileImage ? (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300 bg-gray-100">
                      <img
                        src={formData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-forest-mid rounded-lg cursor-pointer bg-forest-dark/5 hover:bg-forest-dark/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-forest-mid" />
                        <p className="text-sm text-forest-dark font-semibold">
                          Click to upload
                        </p>
                        <p className="text-xs text-gray-600">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Menu Images Upload */}
              <div>
                <label className="block text-sm font-semibold text-forest-dark mb-2">
                  Menu Images (Optional - Max 5 images)
                </label>
                <div className="space-y-3">
                  {formData.menuImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.menuImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-300"
                        >
                          <img
                            src={image}
                            alt={`Menu ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeMenuImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.menuImages.length < 5 && (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-forest-mid rounded-lg cursor-pointer bg-forest-dark/5 hover:bg-forest-dark/10 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-forest-mid" />
                        <p className="text-sm text-forest-dark font-semibold">
                          Click to upload
                        </p>
                        <p className="text-xs text-gray-600">
                          {formData.menuImages.length}/5 images
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleMenuImagesChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-forest-dark text-white font-bold rounded-lg hover:bg-[#5a7a1e] disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? "Submitting..." : "Submit Restaurant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
