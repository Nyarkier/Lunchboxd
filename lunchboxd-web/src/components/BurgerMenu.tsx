import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BurgerMenu({ isOpen, onClose }: MobileMenuProps) {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  // 1. State to track which link is currently highlighted
  const [activeLink, setActiveLink] = useState("Home");

  // List of menu items to make rendering cleaner
  const menuItems = isAuthenticated
    ? [
        { name: "Home", path: "/" },
        { name: "Directory", path: "/directory" },
        { name: "Can't Decide", path: "/cant-decide" },
        { name: "Profile", path: "/profile" },
        { name: "Favorites", path: "/favorites" },
      ]
    : [
        { name: "Home", path: "/" },
        { name: "Directory", path: "/directory" },
        { name: "Can't Decide", path: "/cant-decide" },
        { name: "Log In", path: "/login" },
      ];

  if (!isOpen) return null;

  return (
    <>
      {/* --- BACKDROP --- */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 animate-in fade-in duration-200"
      ></div>

      {/* --- MENU CONTAINER --- */}
      {/* Responsiveness Changes:
          - Position: top-20 right-4 (Mobile) -> sm:top-24 sm:right-6 (Desktop)
          - Width: min-w-[250px] (Mobile) -> sm:min-w-[320px] (Desktop)
      */}
      <div className="absolute top-20 right-4 sm:top-24 sm:right-6 z-50 min-w-65 sm:min-w-80 animate-in fade-in slide-in-from-top-5 duration-200">
        {/* The White Box */}
        {/* Responsiveness Changes:
            - Padding: p-6 (Mobile) -> sm:p-10 (Desktop)
            - Radius: rounded-2xl (Mobile) -> rounded-3xl (Desktop)
        */}
        <div className="bg-off-white rounded-2xl sm:rounded-3xl shadow-2xl border border-sand/20 p-6 sm:p-10 flex flex-col items-end gap-4 sm:gap-5">
          {/* Loop through menu items */}
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                setActiveLink(item.name);
                navigate(item.path);
                onClose();
              }}
              className={`
                font-extrabold uppercase tracking-wide transition-all duration-200
                ${
                  // Responsive Font Size: text-3xl (Mobile) -> text-4xl (Desktop)
                  "text-3xl sm:text-4xl"
                }
                ${
                  // Color Logic: If active -> Orange. If inactive -> Sand (hover to Orange)
                  activeLink === item.name
                    ? "text-[#E67E22]"
                    : "text-[#E5C287] hover:text-[#E67E22]"
                }
                ${item.name === "Can't Decide" ? "whitespace-nowrap" : ""}
                bg-transparent border-none cursor-pointer
              `}
            >
              {item.name}
            </button>
          ))}
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                navigate("/");
                onClose();
              }}
              className="font-extrabold uppercase tracking-wide transition-all duration-200 text-3xl sm:text-4xl text-[#E5C287] hover:text-red-500 bg-transparent border-none cursor-pointer"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
