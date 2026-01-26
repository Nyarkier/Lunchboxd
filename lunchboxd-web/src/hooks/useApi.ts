// Custom hooks for data fetching
import { useState, useEffect, useCallback } from "react";
import type { Restaurant, FilterOptions, FilterCriteria } from "../types/types";
import {
  fetchRestaurants,
  fetchRestaurantById,
  fetchFilterOptions,
} from "../services/apiClient";

// ============================================================================
// useRestaurants Hook
// ============================================================================
/**
 * Hook to fetch restaurants with filtering
 * Automatically handles loading and error states
 */
export function useRestaurants(criteria?: FilterCriteria) {
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
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [criteria]);

  return { data, isLoading, error };
}

// ============================================================================
// useRestaurant Hook (Single)
// ============================================================================
/**
 * Hook to fetch a single restaurant by ID
 */
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
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, isLoading, error };
}

// ============================================================================
// useFilterOptions Hook
// ============================================================================
/**
 * Hook to fetch filter options (categories, budgets, etc.)
 */
export function useFilterOptions() {
  const [data, setData] = useState<FilterOptions>({
    categories: [],
    budgets: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFilterOptions();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

// ============================================================================
// useFetchData Hook (Generic)
// ============================================================================
/**
 * Generic hook for fetching any data
 * Usage: const { data, isLoading, error } = useFetchData<T>(fetcher, dependencies)
 */
export function useFetchData<T>(
  fetcher: () => Promise<T>,
  dependencies: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  return { data, isLoading, error, refetch };
}
