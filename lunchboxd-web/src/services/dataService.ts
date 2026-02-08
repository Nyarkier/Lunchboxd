// Data service - supports both mock and backend API
import type { Restaurant, FilterOptions, FilterCriteria } from "../types/types";
import mockBackendData from "../../mock-backend/data.json";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

const mockRestaurants: Restaurant[] =
  mockBackendData.restaurants as Restaurant[];

export const getFilterOptions = async (): Promise<FilterOptions> => {
  if (USE_MOCK) {
    const categories = [
      "All",
      ...new Set(mockRestaurants.map((r) => r.cuisine)),
    ];
    const budgets = ["10-50", "50-150", "150-500", "500-1000"];
    const sides = [
      "Main Gate",
      "Gate Six",
      "Inside the School",
      "North Gate",
      "Hospital Gate",
    ];

    return {
      categories: categories as string[],
      budgets,
      sides,
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/filters`);
    if (!response.ok) {
      throw new Error("Failed to fetch filters");
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch filter options:", error);
    // Fallback to mock data
    const categories = [
      "All",
      ...new Set(mockRestaurants.map((r) => r.cuisine)),
    ];
    return {
      categories: categories as string[],
      budgets: ["10-50", "50-150", "150-500", "500-1000"],
      sides: [
        "Main Gate",
        "Gate Six",
        "Inside the School",
        "North Gate",
        "Hospital Gate",
      ],
    };
  }
};

export const filterRestaurants = async (
  criteria: FilterCriteria,
): Promise<Restaurant[]> => {
  if (USE_MOCK) {
    let filtered = [...mockRestaurants];

    // Search by name or cuisine
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(query) ||
          r.cuisine.toLowerCase().includes(query) ||
          r.location.toLowerCase().includes(query),
      );
    }

    // Filter by category (cuisine)
    if (criteria.category && criteria.category !== "All") {
      filtered = filtered.filter((r) => r.cuisine === criteria.category);
    }

    // Filter by budget range
    if (criteria.budgets && criteria.budgets.length > 0) {
      filtered = filtered.filter((r) =>
        criteria.budgets!.includes(r.budgetRange),
      );
    }

    // Filter by sides (gates near school)
    if (criteria.sides && criteria.sides.length > 0) {
      filtered = filtered.filter((r) =>
        criteria.sides!.some((side) =>
          r.sides.toLowerCase().includes(side.toLowerCase()),
        ),
      );
    }

    return filtered;
  }

  // Build query params for API
  const params = new URLSearchParams();
  if (criteria.searchQuery) {
    params.append("search", criteria.searchQuery);
  }
  if (criteria.category && criteria.category !== "All") {
    params.append("category", criteria.category);
  }
  if (criteria.budgets && criteria.budgets.length > 0) {
    params.append("budgets", criteria.budgets.join(","));
  }
  if (criteria.sides && criteria.sides.length > 0) {
    params.append("sides", criteria.sides.join(","));
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/restaurants?${params.toString()}`,
    );
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.restaurants || [];
  } catch (error) {
    console.error("Failed to filter restaurants:", error);
    return [];
  }
};

export const getRestaurantById = async (
  id: string,
): Promise<Restaurant | null> => {
  if (USE_MOCK) {
    return mockRestaurants.find((r) => r.id === id) || null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.restaurant;
  } catch (error) {
    console.error("Failed to get restaurant:", error);
    return null;
  }
};

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  if (USE_MOCK) {
    return mockRestaurants;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/restaurants`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.restaurants || [];
  } catch (error) {
    console.error("Failed to get all restaurants:", error);
    return [];
  }
};
