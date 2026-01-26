import { useState } from "react";
import { useNavigate } from "react-router";
import logo from "../assets/logo.svg";
import { Burger } from "../components/Buttons/Burger";
import { LogoText } from "../components/LogoText";
import { BurgerMenu } from "../components/BurgerMenu";
import { useAuth } from "../hooks/useAuth";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-slate-blue h-18.75 px-4 sm:px-8 md:px-12 lg:px-20 flex items-center justify-between z-50 relative">
      {/* Left Side (Logo) - Clickable */}
      <button
        onClick={() => handleNavigate("/")}
        className="flex items-center gap-2 sm:gap-3 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-15.25 md:h-12.5">
          <img
            className="w-full h-full object-contain"
            src={logo}
            alt="lunchboxd logo"
          />
        </div>
        <LogoText />
      </button>

      {/* Center Navigation - Desktop Only */}
      <nav className="hidden md:flex items-center gap-8 lg:gap-12">
        <button
          onClick={() => handleNavigate("/")}
          className="text-white font-semibold hover:text-[#E67E22] transition-colors"
        >
          Home
        </button>
        <button
          onClick={() => handleNavigate("/directory")}
          className="text-white font-semibold hover:text-[#E67E22] transition-colors"
        >
          Directory
        </button>
        <button
          onClick={() => handleNavigate("/cant-decide")}
          className="text-white font-semibold hover:text-[#E67E22] transition-colors"
        >
          Can't Decide
        </button>
        {isAuthenticated && (
          <>
            <button
              onClick={() => handleNavigate("/profile")}
              className="text-white font-semibold hover:text-[#E67E22] transition-colors"
            >
              Profile
            </button>
            <button
              onClick={() => handleNavigate("/favorites")}
              className="text-white font-semibold hover:text-[#E67E22] transition-colors"
            >
              Favorites
            </button>
          </>
        )}
        {!isAuthenticated && (
          <button
            onClick={() => handleNavigate("/login")}
            className="text-white font-semibold hover:text-[#E67E22] transition-colors"
          >
            Log In
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-white font-semibold hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Right Side (Burger + Menu) - Mobile Only */}
      <div className="md:hidden relative flex items-center gap-2 sm:gap-3">
        <Burger isOpen={isMenuOpen} toggle={() => setIsMenuOpen(!isMenuOpen)} />
        <BurgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      </div>
    </header>
  );
}
