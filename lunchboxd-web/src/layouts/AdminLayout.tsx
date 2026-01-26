import { useState } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { Footer } from "./Footer";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Admin Header */}
      <div className="bg-linear-to-r from-slate-900 to-slate-800 text-white h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-lg z-40">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-xl sm:text-2xl font-bold">Lunchboxd Admin</h1>
        <div className="w-6" />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
