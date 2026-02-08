// src/hooks/useApi.ts
import { useState, useEffect } from "react"; // <--- Removed useCallback
import type { Restaurant, FilterOptions, FilterCriteria } from "../types/types";
import {
  fetchRestaurants,
  fetchRestaurantById,
  fetchFilterOptions,
} from "../services/apiClient";

export function useRestaurants(criteria: FilterCriteria = {}) {
  const [data, setData] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchRestaurants(criteria);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [JSON.stringify(criteria)]);

  return { data, isLoading, error };
}

export function useRestaurant(id: string | null) {
  const [data, setData] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchRestaurantById(id);
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [id]);

  return { data, isLoading, error };
}

export function useFilterOptions() {
  const [data, setData] = useState<FilterOptions>({ categories: [], budgets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const result = await fetchFilterOptions();
        if (isMounted) setData(result);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    loadData();
    return () => { isMounted = false; };
  }, []);

  return { data, isLoading, error };
}