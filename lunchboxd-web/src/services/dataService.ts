// Data service for fetching and filtering restaurant data
import type { Restaurant, FilterOptions, FilterCriteria } from "../types/types";
import mockBackendData from "../../mock-backend/data.json";

const mockRestaurants: Restaurant[] =
  mockBackendData.restaurants as Restaurant[];

export const getFilterOptions = async (): Promise<FilterOptions> => {
  const categories = ["All", ...new Set(mockRestaurants.map((r) => r.cuisine))];
  const budgets = ["₱", "₱₱", "₱₱₱"];
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
};

export const filterRestaurants = async (
  criteria: FilterCriteria,
): Promise<Restaurant[]> => {
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
};

export const getRestaurantById = async (
  id: string,
): Promise<Restaurant | null> => {
  return mockRestaurants.find((r) => r.id === id) || null;
};

export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  return mockRestaurants;
};
