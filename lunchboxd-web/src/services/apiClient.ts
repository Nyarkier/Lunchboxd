// API Client Service - Handles both mock and real API calls
import type {
  Restaurant,
  FilterOptions,
  FilterCriteria,
  Cuisine,
} from "../types/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

// Simulate network delay for mock data
const MOCK_DELAY = 300; // milliseconds

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch restaurants with filtering
 * Automatically switches between mock and real API based on VITE_USE_MOCK env var
 */
export const fetchRestaurants = async (
  criteria?: FilterCriteria,
): Promise<Restaurant[]> => {
  if (USE_MOCK) {
    return fetchRestaurantsMock(criteria);
  } else {
    return fetchRestaurantsAPI(criteria);
  }
};

/**
 * Fetch a single restaurant by ID
 */
export const fetchRestaurantById = async (
  id: string,
): Promise<Restaurant | null> => {
  if (USE_MOCK) {
    return fetchRestaurantByIdMock(id);
  } else {
    return fetchRestaurantByIdAPI(id);
  }
};

/**
 * Fetch filter options (categories and budgets)
 */
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  if (USE_MOCK) {
    return fetchFilterOptionsMock();
  } else {
    return fetchFilterOptionsAPI();
  }
};

// ============================================================================
// MOCK DATA IMPLEMENTATIONS
// ============================================================================

// Import mock data (this stays the same as before)
import mockBackendData from "../../mock-backend/data.json";

const mockRestaurants: Restaurant[] = mockBackendData.restaurants.map((r) => ({
  ...r,
  cuisine: r.cuisine as Cuisine,
  sides: r.sides as
    | "Main Gate"
    | "Gate Six"
    | "Inside the School"
    | "North Gate"
    | "Hospital Gate",
  budgetRange: r.budgetRange as "10-50" | "50-150" | "150-500" | "500-1000",
  type: r.type as "Food" | "Drink" | undefined,
  paymentMode: r.paymentMode as ("Cash" | "GCash")[] | undefined,
}));

async function fetchRestaurantsMock(
  criteria?: FilterCriteria,
): Promise<Restaurant[]> {
  await delay(MOCK_DELAY);

  let filtered = [...mockRestaurants];

  // Search by name or cuisine
  if (criteria?.searchQuery) {
    const query = criteria.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.cuisine.toLowerCase().includes(query) ||
        r.location.toLowerCase().includes(query),
    );
  }

  // Filter by category (cuisine)
  if (criteria?.category && criteria.category !== "All") {
    filtered = filtered.filter((r) => r.cuisine === criteria.category);
  }

  // Filter by budget range
  if (criteria?.budgets && criteria.budgets.length > 0) {
    filtered = filtered.filter((r) =>
      criteria.budgets!.includes(r.budgetRange),
    );
  }

  // Filter by location (sides)
  if (criteria?.sides && criteria.sides.length > 0) {
    filtered = filtered.filter((r) =>
      criteria.sides!.some((side) =>
        r.location.toLowerCase().includes(side.toLowerCase()),
      ),
    );
  }

  return filtered;
}

async function fetchRestaurantByIdMock(id: string): Promise<Restaurant | null> {
  await delay(MOCK_DELAY);
  return mockRestaurants.find((r) => r.id === id) || null;
}

async function fetchFilterOptionsMock(): Promise<FilterOptions> {
  await delay(MOCK_DELAY);
  const categories = ["All", ...new Set(mockRestaurants.map((r) => r.cuisine))];
  const budgets = ["₱", "₱₱", "₱₱₱"];
  return {
    categories: categories as string[],
    budgets,
  };
}

// ============================================================================
// REAL API IMPLEMENTATIONS
// ============================================================================

/**
 * Real API call to fetch restaurants
 * Adjust endpoint based on your backend structure
 */
async function fetchRestaurantsAPI(
  criteria?: FilterCriteria,
): Promise<Restaurant[]> {
  const params = new URLSearchParams();

  if (criteria?.searchQuery) params.append("search", criteria.searchQuery);
  if (criteria?.category) params.append("category", criteria.category);
  if (criteria?.budgets) params.append("budgets", criteria.budgets.join(","));
  if (criteria?.sides) params.append("sides", criteria.sides.join(","));

  const url = `${API_BASE_URL}/restaurants${
    params.toString() ? "?" + params.toString() : ""
  }`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        `API error: ${response.statusText}, falling back to mock data`,
      );
      return fetchRestaurantsMock(criteria);
    }

    const data = await response.json();
    return data.restaurants || data; // Handle different response formats
  } catch (error) {
    console.warn(
      "Failed to fetch restaurants from API, falling back to mock data:",
      error,
    );
    return fetchRestaurantsMock(criteria);
  }
}

/**
 * Real API call to fetch single restaurant
 */
async function fetchRestaurantByIdAPI(id: string): Promise<Restaurant | null> {
  const url = `${API_BASE_URL}/restaurants/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Try falling back to mock data
        console.warn(`Restaurant ${id} not found in API, trying mock data`);
        return fetchRestaurantByIdMock(id);
      }
      console.warn(
        `API error: ${response.statusText}, falling back to mock data`,
      );
      return fetchRestaurantByIdMock(id);
    }

    const data = await response.json();
    return data.restaurant || data; // Handle different response formats
  } catch (error) {
    console.warn(
      `Failed to fetch restaurant ${id} from API, falling back to mock data:`,
      error,
    );
    return fetchRestaurantByIdMock(id);
  }
}

/**
 * Real API call to fetch filter options
 */
async function fetchFilterOptionsAPI(): Promise<FilterOptions> {
  const url = `${API_BASE_URL}/filters`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        `API error: ${response.statusText}, falling back to mock data`,
      );
      return fetchFilterOptionsMock();
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(
      "Failed to fetch filter options from API, falling back to mock data:",
      error,
    );
    return fetchFilterOptionsMock();
  }
}
