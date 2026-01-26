// Example: Refactored Favorites Page Component
// This shows how to refactor other pages/components using the new hook system

import { useRestaurants } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import { RestaurantCard } from "../components/RestaurantCard";

/**
 * Example of how to refactor a Favorites component
 * This demonstrates the minimal changes needed to adopt the new system
 */
export function FavoritesExample() {
  const { isAuthenticated } = useAuth();

  // Simple example: Fetch all restaurants
  const { data: allRestaurants, isLoading, error } = useRestaurants();

  // In a real scenario, you'd filter for user's favorites
  // This could be done in the API or on the client
  const favoriteRestaurants = allRestaurants.filter(
    (r) => true // Your favorite filtering logic here
  );

  if (!isAuthenticated) {
    return <div>Please log in to view favorites</div>;
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading favorites...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load favorites: {error.message}
      </div>
    );
  }

  if (favoriteRestaurants.length === 0) {
    return <div className="text-center py-12">No favorites yet</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {favoriteRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}

// ============================================================================
// Example: Refactored Store Details Page
// ============================================================================

import { useRestaurant } from "../hooks/useApi";
import { useParams } from "react-router-dom"; // if using React Router

export function StoreDetailsExample() {
  const { id } = useParams<{ id: string }>();

  // Fetch single restaurant by ID
  const { data: restaurant, isLoading, error } = useRestaurant(id || null);

  if (isLoading) {
    return <div>Loading restaurant details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>;
  }

  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.cuisine}</p>
      <p>Rating: {restaurant.rating}</p>
      <p>Location: {restaurant.location}</p>
      <p>Price: {restaurant.priceRange}</p>
    </div>
  );
}

// ============================================================================
// Example: Using Generic useFetchData Hook
// ============================================================================

import { useFetchData } from "../hooks/useApi";

interface CustomData {
  stats: {
    totalRestaurants: number;
    totalUsers: number;
    averageRating: number;
  };
}

export function DashboardExample() {
  // Use the generic hook for custom API endpoints
  const { data, isLoading, error, refetch } = useFetchData<CustomData>(
    async () => {
      const response = await fetch("/api/dashboard/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json();
    },
    [] // dependencies
  );

  return (
    <div>
      {isLoading && <p>Loading stats...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <div>
          <p>Total Restaurants: {data.stats.totalRestaurants}</p>
          <p>Total Users: {data.stats.totalUsers}</p>
          <p>Avg Rating: {data.stats.averageRating}</p>
          <button onClick={refetch}>Refresh Stats</button>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example: Advanced - Multiple Hooks in One Component
// ============================================================================

export function AdvancedSearchExample() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Multiple hooks working together
  const { data: restaurants, isLoading: loadingRestaurants } = useRestaurants({
    searchQuery,
    category: selectedCategory || undefined,
  });

  const { data: filterOptions, isLoading: loadingFilters } = useFilterOptions();

  const allLoading = loadingRestaurants || loadingFilters;

  return (
    <div>
      {loadingFilters && <p>Loading filters...</p>}

      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {filterOptions.categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {allLoading && <p>Loading restaurants...</p>}

      <div className="grid">
        {restaurants.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
    </div>
  );
}
