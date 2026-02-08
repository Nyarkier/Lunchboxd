import type { Restaurant, FilterOptions, FilterCriteria } from "../types/types";
import { fetchRestaurants, fetchFilterOptions } from "./apiClient";

export const getFilterOptions = async (): Promise<FilterOptions> => {
  return await fetchFilterOptions();
};

export const filterRestaurants = async (criteria: FilterCriteria): Promise<Restaurant[]> => {
  return await fetchRestaurants(criteria);
};

// --- RESTORED FUNCTION ---
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  return await fetchRestaurants({});
};