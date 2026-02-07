import { useState, useEffect } from "react";

// 1. Point to your running Python Backend
const API_BASE_URL = "http://localhost:3000/api";

// This interface matches how your component expects data
interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  location: string;
  priceRange: string;
  sides: string;
  image: string;
}

export function useRestaurants({ searchQuery, category, budgets, sides }: any) {
  const [data, setData] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setIsLoading(true);
      try {
        // 2. Build the query URL (e.g. ?search=pizza&category=Rice+Meal)
        const params = new URLSearchParams();
        
        if (searchQuery) params.append("search", searchQuery);
        if (category && category !== "All") params.append("category", category);
        if (budgets && budgets.length > 0) params.append("budgets", budgets.join(","));
        if (sides && sides.length > 0) params.append("sides", sides.join(","));

        const url = `${API_BASE_URL}/restaurants?${params.toString()}`;

        // 3. Call the Python Backend
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error("Failed to fetch from backend");
        }

        const result = await response.json();
        
        // 4. Update State
        // backend returns { restaurants: [...] }
        setData(result.restaurants || []);
        setError(null);
      } catch (err: any) {
        console.error("Connection Error:", err);
        setError("Could not connect to server. Is it running?");
        // Optional: Fallback to empty list or keep old data
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce: Wait 300ms after typing stops before fetching
    const timeoutId = setTimeout(() => {
      fetchRestaurants();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, category, budgets, sides]);

  return { data, isLoading, error };
}

// Keep the filters static for now
export function useFilterOptions() {
  return {
    categories: ["All", "Rice Meal", "Silog", "Chicken", "Noodles", "Snacks", "Drinks"],
    budgets: ["₱10-50", "₱50-100", "₱100+"],
    sides: ["Main Gate", "Gate Six", "North Gate", "Hospital Gate", "Inside the School"]
  };
}