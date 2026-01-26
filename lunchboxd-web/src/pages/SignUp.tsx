import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import logo from "../assets/logo.svg";

export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const navigate = useNavigate();
  const { signup, error, clearError, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!agreeToTerms) {
      setLocalError("Please agree to the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signup(firstName, lastName, username, email, password);
      navigate("/profile", { replace: true });
    } catch {
      setLocalError(error || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-cream py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          {/* Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-forest-mid mb-1 sm:mb-2">
              lunchboxd
            </h2>
            <p className="text-center text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8">
              Create a new account <br /> Get started - it's free!
            </p>

            {displayError && (
              <div className="rounded-md bg-red-50 p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-medium text-red-800">
                  {displayError}
                </h3>
              </div>
            )}

            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              {/* First and Last Name Row */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <input
                  type="text"
                  placeholder="First name"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    clearError();
                  }}
                />
                <input
                  type="text"
                  placeholder="Last name"
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError();
                  }}
                />
              </div>

              {/* Username */}
              <input
                type="text"
                placeholder="Username"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearError();
                }}
              />

              {/* Email */}
              <input
                type="email"
                placeholder="Mobile number or email"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError();
                }}
              />

              {/* Password */}
              <input
                type="password"
                placeholder="Password"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
              />

              {/* Confirm Password */}
              <input
                type="password"
                placeholder="Confirm Password"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError();
                }}
              />

              {/* Checkbox */}
              <div className="flex items-start sm:items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-4 h-4 rounded mt-0.5 sm:mt-0 shrink-0"
                />
                <label
                  htmlFor="terms"
                  className="text-xs sm:text-xs text-gray-600 leading-tight"
                >
                  I have read and agree to the{" "}
                  <span className="font-semibold">Terms and Conditions</span>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-4 bg-forest-mid text-white text-sm sm:text-base font-bold rounded-lg hover:bg-[#5a7a1e] transition-colors disabled:bg-gray-400 mt-4 sm:mt-6"
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>

              {/* Already have account */}
              <p className="text-center text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-bold text-forest-mid hover:text-[#5a7a1e]"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>

          {/* Logo Section */}
          <div className="flex flex-col items-center mt-8 sm:mt-12 text-center">
            <div className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mb-3 sm:mb-4">
              <img
                src={logo}
                alt="lunchboxd"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-gray-800">
              Find your next perfect meal near <br /> Wesleyan
              university-Philippines
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
