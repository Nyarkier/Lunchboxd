import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: "📊",
      description: "Overview & statistics",
    },
    {
      label: "Users",
      path: "/admin/users",
      icon: "👥",
      description: "User management",
    },
    {
      label: "Restaurants",
      path: "/admin/restaurants",
      icon: "🍽️",
      description: "Restaurant approval",
    },
    {
      label: "Reviews",
      path: "/admin/reviews",
      icon: "⭐",
      description: "Review moderation",
    },
    {
      label: "Inbox",
      path: "/admin/inbox",
      icon: "📧",
      description: "Contact messages",
    },
    {
      label: "Requested Restaurants",
      path: "/admin/requested-restaurants",
      icon: "🏪",
      description: "New submissions",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-auto w-64 bg-linear-to-b from-slate-900 to-slate-800 text-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:w-64 md:min-h-[calc(100vh-4rem)] overflow-y-auto`}
      >
        <nav className="p-6 space-y-2">
          <div className="mb-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-6">
              Management
            </h2>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-orange-500 text-white shadow-lg"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{item.label}</div>
                      <div className="text-xs opacity-75 hidden sm:block">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-slate-700" />

          {/* Quick Actions */}
          <div>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-6">
              Quick Actions
            </h2>
            <button
              onClick={() => handleNavigation("/")}
              className="w-full text-left px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🏠</span>
                <span className="font-semibold text-sm">Back to Home</span>
              </div>
            </button>
          </div>

          {/* User Section */}
          <div className="mt-auto pt-8 border-t border-slate-700">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
