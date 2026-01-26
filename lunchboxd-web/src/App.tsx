import { Route, Routes } from "react-router";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";

// Pages
import { HomePage } from "./pages/Homepage";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Directory } from "./pages/Directory";
import { StoreDetails } from "./pages/StoreDetails";
import { CantDecide } from "./pages/CantDecide";
import { Profile } from "./pages/Profile";
import { UserProfile } from "./pages/UserProfile";
import { Favorites } from "./pages/Favorites";
import { Reviews } from "./pages/Reviews";
import { Randomizer } from "./pages/Randomizer";
import { Spin } from "./pages/Spin";
import { NotFound } from "./pages/NotFound";
import { AddRestaurant } from "./pages/AddRestaurant";
import { TalkWithUs } from "./pages/TalkWithUs";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminUsers } from "./pages/AdminUsers";
import { AdminRestaurants } from "./pages/AdminRestaurants";
import { AdminReviews } from "./pages/AdminReviews";
import { AdminInbox } from "./pages/AdminInbox";
import { AdminRequestedRestaurants } from "./pages/AdminRequestedRestaurants";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/directory" element={<Directory />} />
        <Route path="/store/:id" element={<StoreDetails />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/cant-decide" element={<CantDecide />} />
        <Route path="/randomizer" element={<Randomizer />} />
        <Route path="/spin" element={<Spin />} />
        <Route path="/add-restaurant" element={<AddRestaurant />} />
        <Route path="/talk-with-us" element={<TalkWithUs />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <Reviews />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/restaurants"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminRestaurants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reviews"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminReviews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inbox"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminInbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requested-restaurants"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminRequestedRestaurants />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
