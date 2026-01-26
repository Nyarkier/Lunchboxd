import { X, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  message?: string;
}

function SignInModal({ isOpen, onClose, message }: SignInModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const defaultMessage =
    "You need to be logged in to add to favorites. Sign in or create an account to continue.";
  const displayMessage = message || defaultMessage;

  const handleLoginClick = () => {
    onClose();
    navigate("/login");
  };

  const handleSignUpClick = () => {
    onClose();
    navigate("/signup");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md bg-[#FFFBE6] p-8 rounded-2xl shadow-lg border border-[#f0eebb] relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Sign in required
          </h2>
          <p className="text-gray-700 mb-8">{displayMessage}</p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleLoginClick}
              className="w-full py-3 px-4 border-2 border-forest-mid text-forest-mid font-bold rounded-full hover:bg-forest-mid hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              LOG IN
            </button>
            <button
              onClick={handleSignUpClick}
              className="w-full py-3 px-4 border-2 border-forest-mid text-forest-mid font-bold rounded-full hover:bg-forest-mid hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              SIGN UP
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { SignInModal };
