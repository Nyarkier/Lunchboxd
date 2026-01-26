# API Integration & Refactoring Guide

## Overview

This guide explains the refactored data fetching architecture that supports seamless switching between mock data and real API calls without breaking your UI components.

---

## Architecture

### 1. **API Client Service** (`src/services/apiClient.ts`)

Central service that handles data fetching logic and environment variable switching.

**Key Features:**

- Environment variable-based switching (`VITE_USE_MOCK`)
- Automatic mock delay simulation (300ms)
- Error handling and type safety
- Same data structure for both mock and API modes

**Functions:**

- `fetchRestaurants(criteria)` - Get filtered restaurants
- `fetchRestaurantById(id)` - Get single restaurant
- `fetchFilterOptions()` - Get available filters

### 2. **Custom Hooks** (`src/hooks/useApi.ts`)

React hooks that manage data fetching state automatically.

**Available Hooks:**

- `useRestaurants(criteria)` - Fetch restaurants with filtering
- `useRestaurant(id)` - Fetch single restaurant
- `useFilterOptions()` - Fetch filter options
- `useFetchData<T>(fetcher, dependencies)` - Generic fetch hook

**Returns:**

```typescript
{
  data: T,           // The fetched data
  isLoading: boolean // Loading state
  error: Error | null // Error if any
  refetch?: () => Promise<void> // For useFetchData only
}
```

### 3. **Environment Configuration**

Control mock vs. real API via environment variables.

**Files:**

- `.env` - Local development (uses mock data)
- `.env.production` - Production (uses real API)
- `.env.example` - Template for configuration

---

## How to Use

### Basic Usage in Components

**Before (Old Way):**

```typescript
import { filterRestaurants } from "../services/dataService";

export function Directory() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await filterRestaurants({...});
        setRestaurants(data);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
}
```

**After (New Way):**

```typescript
import { useRestaurants } from "../hooks/useApi";

export function Directory() {
  const { data: restaurants, isLoading } = useRestaurants({
    searchQuery,
    category: selectedCategory || undefined,
    budgets: selectedBudgets.length > 0 ? selectedBudgets : undefined,
    sides: selectedSides.length > 0 ? selectedSides : undefined,
  });

  // That's it! isLoading and error handling are built-in
}
```

---

## Switching Between Mock and Real API

### Development (Using Mock Data)

```bash
# .env file
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:3000/api
```

### Production (Using Real API)

```bash
# .env.production file
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.example.com/api
```

**No component changes needed!** The data structure remains identical.

---

## API Endpoints Expected

When switching to real API (`VITE_USE_MOCK=false`), your backend should provide these endpoints:

### 1. List Restaurants with Filters

```
GET /api/restaurants?search=...&category=...&budgets=...&sides=...

Query Parameters:
  - search (optional): Search term
  - category (optional): Cuisine category
  - budgets (optional): Comma-separated price ranges (₱,₱₱,₱₱₱)
  - sides (optional): Comma-separated locations

Response:
{
  "restaurants": [
    {
      "id": "1",
      "name": "Restaurant Name",
      "cuisine": "Rice Meal",
      "rating": 4.5,
      "location": "Main Gate Avenue",
      "priceRange": "₱50-150",
      "profileImage": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      "menuImages": [
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop"
      ]
    },
    ...
  ]
}
```

### 2. Get Single Restaurant

```
GET /api/restaurants/:id

Response:
{
  "restaurant": {
    "id": "1",
    "name": "Restaurant Name",
    ...
  }
}
```

### 3. Get Filter Options

```
GET /api/filters

Response:
{
  "categories": ["All", "Rice Meal", "Cafe", "Chicken", ...],
  "budgets": ["₱", "₱₱", "₱₱₱"]
}
```

---

## Refactoring Existing Components

### Example: Refactoring a Component

**Step 1: Replace imports**

```typescript
// OLD
import { filterRestaurants } from "../services/dataService";

// NEW
import { useRestaurants } from "../hooks/useApi";
```

**Step 2: Replace state management**

```typescript
// OLD
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const load = async () => {
    try {
      const result = await filterRestaurants(criteria);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };
  load();
}, [dependencies]);

// NEW
const { data, isLoading, error } = useRestaurants(criteria);
```

**Step 3: Update JSX** (no changes needed - data structure is identical!)

```typescript
{
  isLoading && <LoadingSpinner />;
}
{
  error && <ErrorMessage error={error} />;
}
{
  data.map((item) => <Card item={item} />);
}
```

---

## Generic Hook Usage

For more complex data fetching scenarios, use `useFetchData`:

```typescript
import { useFetchData } from "../hooks/useApi";

export function MyComponent() {
  const { data, isLoading, error, refetch } = useFetchData<CustomType>(
    async () => {
      const response = await fetch("/api/custom");
      return response.json();
    },
    [] // dependencies
  );

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <YourComponent data={data} />}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

---

## Error Handling

All hooks automatically handle errors. Access error state:

```typescript
const { data, isLoading, error } = useRestaurants(criteria);

if (error) {
  return <ErrorComponent message={error.message} />;
}
```

---

## Performance Optimization

### 1. **Prevent Unnecessary Rerenders**

The hooks use proper dependency tracking:

```typescript
// Hook dependencies are automatically managed
// Only refetches when these specific values change
const { data } = useRestaurants({
  searchQuery, // watches this
  category, // watches this
  budgets, // watches this
  sides, // watches this
});
```

### 2. **Cleanup on Unmount**

Hooks automatically clean up when component unmounts (prevents memory leaks).

### 3. **Request Cancellation**

The hooks use a mounted flag to prevent state updates on unmounted components.

---

## Testing

### Mock Testing (Default)

```bash
npm run dev
# VITE_USE_MOCK=true is set in .env
# Tests will use mock data with 300ms delay
```

### Integration Testing (Real API)

Create a `.env.test` file:

```
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:3001/api
```

Then run tests against a test server.

---

## Troubleshooting

### Issue: "Cannot find module 'useApi'"

**Solution:** Make sure the file exists at `src/hooks/useApi.ts`

### Issue: "VITE_USE_MOCK is undefined"

**Solution:** Restart your dev server after creating `.env` file

### Issue: API calls still using mock data

**Solution:** Check your `.env` file:

```bash
VITE_USE_MOCK=false  # must be exactly "false" (string)
```

### Issue: Real API endpoint not working

**Solution:** Verify your backend endpoint structure matches the expected format in the API Endpoints section above.

---

## Migration Checklist

- [ ] Create `.env` and `.env.production` files
- [ ] Create `src/services/apiClient.ts`
- [ ] Create `src/hooks/useApi.ts`
- [ ] Update component imports (replace `dataService` with `useApi`)
- [ ] Replace state management with hooks
- [ ] Test with mock data (`VITE_USE_MOCK=true`)
- [ ] Update backend API endpoints (if needed)
- [ ] Test with real API (`VITE_USE_MOCK=false`)
- [ ] Deploy with proper `.env.production`

---

## Summary

✅ **Benefits of this approach:**

- Zero UI component changes when switching data sources
- Centralized data fetching logic
- Automatic loading/error handling
- Environment-based configuration
- Type-safe throughout
- Easy to test

✅ **Single Source of Truth:**

- Mock data stored in `mock-backend/data.json`
- Real API calls defined in `apiClient.ts`
- Components use standardized hooks from `useApi.ts`
