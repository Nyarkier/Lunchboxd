import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import logo from "../assets/logo.svg";

export function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login, error, clearError, isAuthenticated, user } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Route based on role
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile");
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    try {
      await login(usernameOrEmail, password);
      // Navigation will be handled by useEffect above
    } catch {
      setLocalError(error || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const displayError = localError || error;

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-[#E5C287] py-8 sm:py-12 px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
          {/* Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl p-5 sm:p-6 md:p-8">
            <h2 className="text-center text-2xl sm:text-3xl font-bold text-forest-mid mb-6 sm:mb-8">
              lunchboxd
            </h2>

            {displayError && (
              <div className="rounded-md bg-red-50 p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="text-xs sm:text-sm font-medium text-red-800">
                  {displayError}
                </h3>
              </div>
            )}

            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              {/* Email/Username Input */}
              <input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                autoComplete="username"
                required
                placeholder="Email or username"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                value={usernameOrEmail}
                onChange={(e) => {
                  setUsernameOrEmail(e.target.value);
                  clearError();
                }}
              />

              {/* Password Input */}
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-mid focus:border-transparent"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
              />

              {/* Log In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 px-4 bg-forest-mid text-white text-sm sm:text-base font-bold rounded-lg hover:bg-[#5a7a1e] transition-colors disabled:bg-gray-400 mt-6 sm:mt-8"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>

              {/* Create New Account Button */}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="w-full py-2.5 sm:py-3 px-4 bg-transparent border-2 border-[#E67E22] text-[#E67E22] text-sm sm:text-base font-bold rounded-lg hover:bg-[#E67E22] hover:text-white transition-colors"
              >
                Create new account
              </button>

              {/* Forgot Password Link */}
              <p className="text-center text-xs sm:text-xs text-gray-600 mt-3 sm:mt-4">
                <a href="#" className="hover:text-gray-800">
                  Forgot password?
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
