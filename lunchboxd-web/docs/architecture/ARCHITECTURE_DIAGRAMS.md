# Architecture Diagrams

## Data Flow Architecture

### Current State (Development)

```
┌─────────────────────────────────────────────────────────────────┐
│                     React Components                            │
│  (Directory, Favorites, StoreDetails, etc.)                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Import & Use
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              Custom Hooks (src/hooks/useApi.ts)                 │
│                                                                  │
│  • useRestaurants(criteria)  → auto-fetches with filters       │
│  • useRestaurant(id)         → fetches single restaurant       │
│  • useFilterOptions()        → fetches available filters       │
│  • useFetchData<T>()         → generic hook for any data       │
│                                                                  │
│  Returns: { data, isLoading, error, refetch? }                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Uses
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│           API Client Service (src/services/apiClient.ts)        │
│                                                                  │
│  • fetchRestaurants(criteria)                                  │
│  • fetchRestaurantById(id)                                     │
│  • fetchFilterOptions()                                        │
│                                                                  │
│  Checks environment variable: VITE_USE_MOCK                    │
└──────────────────┬──────────────────────────┬───────────────────┘
                   │                          │
            ┌──────▼────────┐         ┌──────▼────────┐
            │ VITE_USE_MOCK  │         │ VITE_USE_MOCK  │
            │    = true      │         │    = false     │
            │ (Development)  │         │ (Production)   │
            └──────┬─────────┘         └──────┬─────────┘
                   │                          │
                   ▼                          ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │  Mock Data Path      │   │  Real API Path       │
        ├──────────────────────┤   ├──────────────────────┤
        │                      │   │                      │
        │ • Reads from         │   │ • Makes HTTP         │
        │   mock-backend/      │   │   fetch() call       │
        │   data.json          │   │                      │
        │                      │   │ • Base URL:          │
        │ • Simulates 300ms    │   │   VITE_API_BASE_URL  │
        │   network delay      │   │                      │
        │                      │   │ • Real backend API   │
        │ • Perfect for        │   │                      │
        │   development &      │   │ • Production ready   │
        │   testing            │   │                      │
        └──────────────────────┘   └──────────────────────┘
```

---

## Component Refactoring Flow

### Before Refactoring

```
┌─────────────────────────────────────────────────────┐
│  React Component                                    │
│                                                     │
│  import { filterRestaurants } from dataService    │
│  const [data, setData] = useState([])             │
│  const [isLoading, setIsLoading] = useState(true) │
│  const [error, setError] = useState(null)         │
│                                                     │
│  useEffect(() => {                                 │
│    const load = async () => {                      │
│      try {                                          │
│        setIsLoading(true)                          │
│        const result = await filterRestaurants()   │
│        setData(result)                            │
│      } catch(err) {                                │
│        setError(err)                              │
│      } finally {                                   │
│        setIsLoading(false)                        │
│      }                                             │
│    }                                               │
│    load()                                          │
│  }, [deps])                                        │
│                                                     │
│  return (                                          │
│    {isLoading && <Spinner />}                     │
│    {error && <Error />}                           │
│    {data.map(...)}                                │
│  )                                                 │
│                                                     │
│  ~50 lines of boilerplate                         │
└─────────────────────────────────────────────────────┘
```

### After Refactoring

```
┌─────────────────────────────────────────────────────┐
│  React Component                                    │
│                                                     │
│  import { useRestaurants } from useApi            │
│  const { data, isLoading, error } =               │
│    useRestaurants(criteria)                        │
│                                                     │
│  return (                                          │
│    {isLoading && <Spinner />}                     │
│    {error && <Error />}                           │
│    {data.map(...)}                                │
│  )                                                 │
│                                                     │
│  ~5 lines - Clean & Simple!                        │
└─────────────────────────────────────────────────────┘
```

---

## Data Source Switching

```
┌──────────────────────────────────────────────────────────┐
│                   .env Configuration                     │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  VITE_USE_MOCK=true                    (or false)       │
│  VITE_API_BASE_URL=http://localhost:...                │
│                                                          │
└────────────────┬───────────────────────────────────────┬─┘
                 │                                       │
        ┌────────▼─────────┐                 ┌──────────▼────────┐
        │  Development     │                 │  Production       │
        ├──────────────────┤                 ├───────────────────┤
        │                  │                 │                   │
        │ VITE_USE_MOCK:   │                 │ VITE_USE_MOCK:    │
        │ true             │                 │ false             │
        │                  │                 │                   │
        │ → Uses mock data │                 │ → Real API calls  │
        │   from JSON file │                 │   over HTTP       │
        │                  │                 │                   │
        │ → 300ms delay    │                 │ → Production URL  │
        │   for realism    │                 │   in config       │
        │                  │                 │                   │
        │ → No backend     │                 │ → Full backend    │
        │   required       │                 │   required        │
        │                  │                 │                   │
        │ • Development    │                 │ • Production      │
        │ • Testing        │                 │ • Live API        │
        │ • Demos          │                 │ • Real data       │
        │                  │                 │                   │
        └──────────────────┘                 └───────────────────┘

        ✨ NO COMPONENT CHANGES NEEDED ✨
        Data structure remains identical in both modes
```

---

## State Management Comparison

### Old Approach

```
Component State                   Side Effects
┌─────────────────┐             ┌──────────────────┐
│ data            │             │ useEffect(() => {│
│ isLoading       │             │   if (deps       │
│ error           │             │   changed) {     │
│                 │             │     fetch()      │
│ 3 separate      │◄────────────┤     setData()    │
│ useState calls  │             │   }              │
│                 │             │ })               │
│ Manual sync     │             │                  │
│ of states       │             │ Complex cleanup  │
└─────────────────┘             └──────────────────┘
         △
         │
         │ Lots of boilerplate
         │
```

### New Approach (Custom Hooks)

```
┌────────────────────────────────────────┐
│  useRestaurants(criteria)              │
├────────────────────────────────────────┤
│ Encapsulates:                          │
│ • State management                     │
│ • Side effects                         │
│ • Error handling                       │
│ • Loading states                       │
│ • Memory leak prevention               │
│                                        │
│ Returns:                               │
│ { data, isLoading, error }             │
│                                        │
│ One hook call replaces 50+ lines       │
└────────────────────────────────────────┘
```

---

## API Endpoints Expected

```
Backend API Server (when VITE_USE_MOCK=false)
└── /api
    ├── /restaurants (GET)
    │   ├── Query: ?search=...&category=...&budgets=...&sides=...
    │   └── Response: { restaurants: [...] }
    │
    ├── /restaurants/:id (GET)
    │   └── Response: { restaurant: {...} }
    │
    └── /filters (GET)
        └── Response: { categories: [...], budgets: [...] }
```

---

## Hook Usage Pattern

```
┌─────────────────────────────────────────┐
│  Component Usage                        │
├─────────────────────────────────────────┤
│                                         │
│  const { data, isLoading, error } =    │
│    useRestaurants({                    │
│      searchQuery: "rice",              │
│      category: "Rice Meal",            │
│      budgets: ["₱"]                    │
│    })                                  │
│                                         │
└────────────┬────────────────────────────┘
             │
             │ Dependencies
             │ (auto-refetch when these change)
             │
             ├─ searchQuery
             ├─ category
             ├─ budgets
             └─ sides
```

---

## File Organization

```
lunchboxd-web/
│
├── src/
│   ├── services/
│   │   ├── apiClient.ts        ✅ NEW - API logic
│   │   ├── dataService.ts      ⚠️ DEPRECATED
│   │   ├── authService.ts
│   │   └── ...
│   │
│   ├── hooks/
│   │   └── useApi.ts           ✅ NEW - Custom hooks
│   │
│   ├── pages/
│   │   └── Directory.tsx        ✅ UPDATED
│   │
│   ├── components/
│   ├── types/
│   └── ...
│
├── mock-backend/
│   └── data.json               ✅ Used by apiClient
│
├── .env                        ✅ NEW - Dev config
├── .env.production             ✅ NEW - Prod config
├── .env.example                ✅ NEW - Template
│
└── 📚 Documentation Files:
    ├── API_REFACTORING_GUIDE.md (detailed guide)
    ├── QUICK_REFERENCE_API.md (cheat sheet)
    ├── API_IMPLEMENTATION_SUMMARY.md (this impl)
    └── EXAMPLE_REFACTORED_COMPONENTS.tsx (examples)
```

---

## Refactoring Process

```
Step 1: Change Import
┌────────────────────────────────┐
│ import { useRestaurants }      │
│   from "../hooks/useApi"       │
└────────────────────────────────┘
         │
         ▼
Step 2: Replace State Management
┌────────────────────────────────┐
│ const { data, isLoading,       │
│   error } = useRestaurants()   │
└────────────────────────────────┘
         │
         ▼
Step 3: Keep JSX Unchanged ✅
┌────────────────────────────────┐
│ Your component renders the     │
│ same way - no changes needed!  │
└────────────────────────────────┘
```

---

## Request/Response Flow

### Example: Fetch Restaurants with Filters

```
User filters restaurants (e.g., "Rice Meal", "₱50-150")
              │
              ▼
Component updates state: selectedCategory, selectedBudgets
              │
              ▼
useRestaurants hook dependency array triggers
              │
              ▼
Hook calls: fetchRestaurants({ category: "Rice Meal", budgets: ["₱50-150"] })
              │
              ▼
apiClient checks: VITE_USE_MOCK ?
         │                         │
         ▼                         ▼
    (true)                    (false)
      │                         │
      ▼                         ▼
   Mock Path              Real API Path
      │                         │
      ▼                         ▼
Read from JSON          fetch("/api/restaurants?...")
Simulate 300ms              │
      │                      ▼
      │                  HTTP Response
      │                      │
      └──────────┬───────────┘
                 │
                 ▼
Return: { restaurants: [...] }
                 │
                 ▼
Hook updates: data = restaurants
              isLoading = false
              error = null
                 │
                 ▼
Component re-renders with new data
```

---

## Environment Configuration

```
Development Mode              Production Mode
┌──────────────────────┐      ┌──────────────────────┐
│ .env                 │      │ .env.production      │
├──────────────────────┤      ├──────────────────────┤
│                      │      │                      │
│ VITE_USE_MOCK=true   │      │ VITE_USE_MOCK=false  │
│ VITE_API_BASE_URL=   │      │ VITE_API_BASE_URL=   │
│ http://localhost:... │      │ https://api.example. │
│                      │      │ com/api              │
│                      │      │                      │
│ npm run dev          │      │ npm run build        │
│ ↓                    │      │ ↓                    │
│ Uses mock data       │      │ Uses real API        │
│ No backend needed    │      │ Full backend ready   │
│ 300ms delays         │      │ Real network latency │
│                      │      │                      │
└──────────────────────┘      └──────────────────────┘
```

---

## Summary: What Gets Replaced vs What Stays

```
┌─────────────────┬──────────────────┬──────────────┐
│ Item            │ Before           │ After        │
├─────────────────┼──────────────────┼──────────────┤
│ Imports         │ dataService      │ useApi hooks │
│ State mgmt      │ useState x3       │ 1 hook       │
│ Effects         │ useEffect        │ Hook handles │
│ Error handling  │ Manual           │ Automatic    │
│ Loading state   │ Manual           │ Built-in     │
│ JSX             │ {...}            │ {...} Same!  │
│ Data structure  │ Same             │ Same ✅      │
│ Component UI    │ Unchanged        │ Unchanged ✅ │
│ Network switching│ Code change      │ .env only    │
└─────────────────┴──────────────────┴──────────────┘
```

---

This architecture provides:
✅ Clean separation of concerns
✅ Easy testing and mocking
✅ Smooth transition to real API
✅ Zero UI component changes
✅ Automatic error/loading handling
✅ Memory leak prevention
✅ Type safety throughout
