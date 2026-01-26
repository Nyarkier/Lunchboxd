import {
  X,
  Calendar,
  CheckCircle,
  AlertCircle,
  User,
  MapPin,
  DollarSign,
} from "lucide-react";
import type { RestaurantRequest } from "../types/types";

interface DetailInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: RestaurantRequest | null;
}

export function DetailInspectionModal({
  isOpen,
  onClose,
  title,
  data,
}: DetailInspectionModalProps) {
  if (!isOpen || !data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-50 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={20} />;
      case "rejected":
        return <AlertCircle size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-2xl font-bold text-forest-dark">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-6 max-h-96 overflow-y-auto">
            {/* Status Badge */}
            <div
              className={`flex items-center gap-2 w-fit px-4 py-2 rounded-lg border ${getStatusColor(data.status)}`}
            >
              {getStatusIcon(data.status)}
              <span className="font-semibold capitalize">{data.status}</span>
            </div>

            {/* Restaurant Name */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">
                Restaurant Name
              </h3>
              <p className="text-lg font-bold text-forest-dark">
                {data.restaurantName}
              </p>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cuisine */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                  Cuisine Type
                </h4>
                <p className="text-gray-800">{data.cuisine}</p>
              </div>

              {/* Type */}
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                  Type
                </h4>
                <p className="text-gray-800">{data.type}</p>
              </div>

              {/* Budget Range */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={14} className="text-gray-600" />
                  <h4 className="text-xs uppercase font-semibold text-gray-600">
                    Budget Range
                  </h4>
                </div>
                <p className="text-gray-800">₱{data.budgetRange}</p>
              </div>

              {/* Sides */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={14} className="text-gray-600" />
                  <h4 className="text-xs uppercase font-semibold text-gray-600">
                    Location/Side
                  </h4>
                </div>
                <p className="text-gray-800">{data.sides}</p>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                Street Address
              </h4>
              <p className="text-gray-800">{data.location}</p>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                Payment Methods
              </h4>
              <div className="flex gap-2 flex-wrap">
                {data.paymentMode.map((mode) => (
                  <span
                    key={mode}
                    className="px-3 py-1 bg-sand/30 text-forest-dark rounded-full text-sm font-semibold"
                  >
                    {mode}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {data.description && (
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {data.description}
                </p>
              </div>
            )}

            {/* Contact */}
            {data.contact && (
              <div>
                <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                  Contact
                </h4>
                <p className="text-gray-800">{data.contact}</p>
              </div>
            )}

            {/* Images */}
            {(data.profileImage ||
              (data.menuImages && data.menuImages.length > 0)) && (
              <div className="border-t pt-4 space-y-4">
                {/* Profile Image */}
                {data.profileImage && (
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                      Restaurant Logo
                    </h4>
                    <img
                      src={data.profileImage}
                      alt="Restaurant Logo"
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* Menu Images */}
                {data.menuImages && data.menuImages.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-gray-600 mb-2">
                      Menu Images
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {data.menuImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Menu ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Meta Information */}
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <User size={16} />
                <span>
                  <strong>Submitted by:</strong> {data.submittedBy}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={16} />
                <span>
                  <strong>Date:</strong>{" "}
                  {new Date(data.submittedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 font-semibold hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
