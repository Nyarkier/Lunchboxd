import { LogOut, BarChart3, Menu, X } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { LogoText } from "./LogoText";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-forest-dark text-white sticky top-0 z-40 shadow-lg">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left Section - Menu & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-forest-mid rounded-lg transition-colors md:hidden"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex items-center gap-2">
            <BarChart3 size={28} className="text-sand" />
            <LogoText />
            <span className="hidden sm:inline text-sand font-bold">Admin</span>
          </div>
        </div>

        {/* Right Section - User & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-forest-mid rounded-lg">
            <div className="w-8 h-8 bg-sand rounded-full flex items-center justify-center">
              <span className="text-forest-dark font-bold text-sm">A</span>
            </div>
            <span className="text-sm font-semibold">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
            title="Logout"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline text-sm font-semibold">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
