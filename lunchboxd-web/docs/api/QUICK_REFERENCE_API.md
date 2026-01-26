# Quick Reference: API Refactoring

## File Structure

```
src/
├── services/
│   └── apiClient.ts          ✅ NEW - Central API service
├── hooks/
│   └── useApi.ts             ✅ NEW - Custom hooks for data fetching
├── pages/
│   └── Directory.tsx          ✅ UPDATED - Uses new hooks
└── ...

.env                           ✅ NEW - Local dev config (mock data)
.env.production                ✅ NEW - Prod config (real API)
.env.example                   ✅ NEW - Template
API_REFACTORING_GUIDE.md       ✅ NEW - Full documentation
EXAMPLE_REFACTORED_COMPONENTS.tsx ✅ NEW - Example implementations
```

## Three-Step Refactoring

### 1️⃣ Replace Import

```typescript
// ❌ OLD
import { filterRestaurants, getFilterOptions } from "../services/dataService";

// ✅ NEW
import { useRestaurants, useFilterOptions } from "../hooks/useApi";
```

### 2️⃣ Replace State Management

```typescript
// ❌ OLD
const [data, setData] = useState([]);
const [isLoading, setIsLoading] = useState(true);
useEffect(() => {
  const load = async () => {
    const result = await filterRestaurants(criteria);
    setData(result);
  };
  load();
}, [dependencies]);

// ✅ NEW
const { data, isLoading } = useRestaurants(criteria);
```

### 3️⃣ Keep JSX the Same!

```typescript
// Your JSX doesn't change - data structure is identical!
{
  isLoading && <Loading />;
}
{
  data.map((item) => <Card item={item} />);
}
```

## Available Hooks

| Hook                             | Purpose                        | Returns                               |
| -------------------------------- | ------------------------------ | ------------------------------------- |
| `useRestaurants(criteria)`       | Fetch restaurants with filters | `{ data, isLoading, error }`          |
| `useRestaurant(id)`              | Fetch single restaurant        | `{ data, isLoading, error }`          |
| `useFilterOptions()`             | Fetch filter options           | `{ data, isLoading, error }`          |
| `useFetchData<T>(fetcher, deps)` | Generic data fetching          | `{ data, isLoading, error, refetch }` |

## Environment Variables

| Variable            | Purpose        | Development                 | Production                    |
| ------------------- | -------------- | --------------------------- | ----------------------------- |
| `VITE_USE_MOCK`     | Use mock data? | `true`                      | `false`                       |
| `VITE_API_BASE_URL` | API endpoint   | `http://localhost:3000/api` | `https://api.example.com/api` |

## Common Patterns

### Pattern 1: Simple Data Fetching

```typescript
const { data, isLoading, error } = useRestaurants();
```

### Pattern 2: Filtering

```typescript
const { data } = useRestaurants({
  searchQuery: "rice",
  category: "Rice Meal",
  budgets: ["₱"],
});
```

### Pattern 3: Error Handling

```typescript
const { data, isLoading, error } = useRestaurants(criteria);

if (error) return <ErrorComponent error={error} />;
if (isLoading) return <Spinner />;
return <RestaurantList data={data} />;
```

### Pattern 4: Refetch on Button Click

```typescript
const { data, refetch } = useFetchData(
  async () => fetch("/api/data").then((r) => r.json()),
  []
);

return <button onClick={refetch}>Refresh</button>;
```

## Switching Data Sources

**No code changes needed!** Just update `.env`:

```bash
# Development (Mock Data)
VITE_USE_MOCK=true

# Production (Real API)
VITE_USE_MOCK=false
```

Restart dev server and everything works with the new data source.

## Expected API Responses

### GET /api/restaurants

```json
{
  "restaurants": [
    {
      "id": "1",
      "name": "Restaurant Name",
      "cuisine": "Rice Meal",
      "rating": 4.5,
      "location": "Main Gate",
      "priceRange": "₱50-150"
    }
  ]
}
```

### GET /api/restaurants/:id

```json
{
  "restaurant": {
    "id": "1",
    "name": "Restaurant Name",
    ...
  }
}
```

### GET /api/filters

```json
{
  "categories": ["All", "Rice Meal", "Cafe", ...],
  "budgets": ["₱", "₱₱", "₱₱₱"]
}
```

## Troubleshooting

| Problem               | Solution                                       |
| --------------------- | ---------------------------------------------- |
| Hook not working      | Check `.env` file exists in root               |
| Still using mock data | Verify `.env` has `VITE_USE_MOCK=false`        |
| API endpoint 404      | Check `VITE_API_BASE_URL` matches your backend |
| Stale data            | Use `refetch()` from `useFetchData` hook       |
| Memory leak warning   | Hooks handle cleanup automatically ✅          |

## Checklist for Refactoring Components

- [ ] Import from `useApi` instead of `dataService`
- [ ] Replace `useState` + `useEffect` with single hook call
- [ ] Remove manual loading/error state management
- [ ] Keep JSX unchanged
- [ ] Test with `VITE_USE_MOCK=true`
- [ ] Test with `VITE_USE_MOCK=false` (if API ready)

## Files to Keep Using

- ✅ `src/services/dataService.ts` - Old file (still works, but deprecated)
- ✅ `mock-backend/data.json` - Still used by apiClient.ts
- ✅ `src/types/types.ts` - Unchanged, still used

## Files to Use Going Forward

- ✅ `src/services/apiClient.ts` - Use this for any custom API calls
- ✅ `src/hooks/useApi.ts` - Use hooks in components
- ✅ `.env` / `.env.production` - Control mock vs. real API

---

**Benefits:**
✨ Less code in components
✨ Automatic error/loading handling
✨ Easy switching between mock and real API
✨ Type-safe throughout
✨ Memory leak prevention
✨ Zero changes to JSX when swapping data sources
