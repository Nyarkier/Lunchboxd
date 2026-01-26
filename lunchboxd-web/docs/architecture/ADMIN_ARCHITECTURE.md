# Admin Dashboard - Architecture & Component Diagram

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LUNCHBOXD ADMIN DASHBOARD                    │
└─────────────────────────────────────────────────────────────────┘

                          ┌──────────────┐
                          │   App.tsx    │
                          │  (Router)    │
                          └──────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
            ┌───────────────┐          ┌────────────────┐
            │ Public Routes │          │ Admin Routes   │
            │ (Header/Foot) │          │ (AdminLayout)  │
            └───────────────┘          └────────────────┘
                                               │
        ┌──────────────────────────────────────┼──────────────────────────────┐
        │                                      │                              │
        │                          ┌──────────────────┐                       │
        │                          │  AdminLayout.tsx │◄──────┐               │
        │                          │  (Header/Sidebar)│       │               │
        │                          └──────────────────┘       │               │
        │                                  │ │ │ │            │               │
        │    ┌─────────────────────────────┼─┼─┼─┼────────────┤               │
        │    │                             │ │ │ │            │               │
        │    ▼                             ▼ ▼ ▼ ▼            │               │
        │ ┌────────────────┐          ┌────────────────────────┐               │
        │ │  Header       │          │   AdminSidebar.tsx     │               │
        │ │  "Lunchboxd   │          │  (Navigation Menu)     │               │
        │ │   Admin"      │          │                        │               │
        │ │  (z-40)       │          │  - Dashboard           │               │
        │ │               │          │  - Users               │               │
        │ └────────────────┘          │  - Restaurants         │               │
        │                             │  - Reviews             │               │
        │                             │  - Logout              │               │
        │                             └────────────────────────┘               │
        │                                                                      │
        └──────────────────────────────────────────────────────────────────────┘
                                      │
                ┌─────────────────────┼─────────────────────┐
                │                     │                     │
                ▼                     ▼                     ▼
    ┌─────────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │ AdminDashboard.tsx  │  │ AdminUsers.tsx   │  │ AdminRestaurants │
    │                     │  │                  │  │      .tsx        │
    │ ┌─────────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │
    │ │  Stat Cards (4) │ │  │ │ Search Bar   │ │  │ │ Search/Filter│ │
    │ │  - Users        │ │  │ │              │ │  │ │              │ │
    │ │  - Restaurants  │ │  │ │ User Table   │ │  │ │ Cards Grid   │ │
    │ │  - Pending      │ │  │ │ ┌──────────┐ │ │  │ │ ┌──────────┐ │ │
    │ │  - Reviews      │ │  │ │ │Inspect   │ │ │  │ │ │Inspect   │ │ │
    │ │                 │ │  │ │ │  button  │ │ │  │ │ │  button  │ │ │
    │ │                 │ │  │ │ └──────────┘ │ │  │ │ └──────────┘ │ │
    │ ├─────────────────┤ │  │ └──────────────┘ │  │ └──────────────┘ │
    │ │ Activity Feed   │ │  │                  │  │                  │
    │ │                 │ │  │ Modals: ◄────────┼──┼─► AdminDetailModal│
    │ │ Health Metrics  │ │  │ User Inspector   │  │  Restaurant      │
    │ │ (3 Progress Bars)│ │  │                  │  │  Inspector       │
    │ └─────────────────┘ │  └──────────────────┘  └──────────────────┘
    │                     │
    └─────────────────────┘
                │
                │
                ▼
    ┌──────────────────────┐
    │  AdminReviews.tsx    │
    │                      │
    │ ┌──────────────────┐ │
    │ │  Stat Cards (3)  │ │
    │ │  - Approved      │ │
    │ │  - Flagged       │ │
    │ │  - Deleted       │ │
    │ │                  │ │
    │ ├──────────────────┤ │
    │ │ Search/Filter    │ │
    │ │                  │ │
    │ ├──────────────────┤ │
    │ │ Review List      │ │
    │ │ ┌──────────────┐ │ │
    │ │ │ Review Card  │ │ │
    │ │ │ ┌──────────┐ │ │ │
    │ │ │ │ Flag ✓   │ │ │ │
    │ │ │ │ Delete ✗ │ │ │ │
    │ │ │ └──────────┘ │ │ │
    │ │ └──────────────┘ │ │
    │ └──────────────────┘ │
    └──────────────────────┘
```

---

## 📊 Component Hierarchy

```
App
├── AuthProvider
│   └── Routes
│       ├── Public Routes
│       │   ├── HomePage
│       │   ├── Directory
│       │   └── ... (other public pages)
│       │
│       └── Protected Routes (RequiredRole = "admin")
│           ├── AdminDashboard
│           │   └── AdminLayout
│           │       ├── Header
│           │       ├── AdminSidebar
│           │       └── Main Content
│           │
│           ├── AdminUsers
│           │   └── AdminLayout
│           │       ├── Header
│           │       ├── AdminSidebar
│           │       ├── Search Bar
│           │       ├── User Table
│           │       └── AdminDetailModal (User)
│           │
│           ├── AdminRestaurants
│           │   └── AdminLayout
│           │       ├── Header
│           │       ├── AdminSidebar
│           │       ├── Search/Filter
│           │       ├── Card Grid
│           │       └── AdminDetailModal (Restaurant)
│           │
│           └── AdminReviews
│               └── AdminLayout
│                   ├── Header
│                   ├── AdminSidebar
│                   ├── Stats
│                   ├── Search/Filter
│                   ├── Review List
│                   └── Delete Confirmation
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        DATA FLOW DIAGRAM                         │
└─────────────────────────────────────────────────────────────────┘

USER LOGS IN
    │
    ▼
Login Page (/login)
    │
    ├─► authService.authenticateUser()
    │        │
    │        ▼
    │   Check credentials against mock-backend/users.json
    │
    ▼
Redirect to /admin/dashboard
    │
    ├─► ProtectedRoute checks:
    │   - isAuthenticated? ✓
    │   - user.role === "admin"? ✓
    │
    ▼
AdminDashboard Loads
    │
    ├─► adminService.getDashboardStats()
    │        │
    │        ▼
    │   Load from mock data + calculate
    │        │
    │        ▼
    │   Display 4 KPI cards
    │
    ▼
User Navigates to /admin/users
    │
    ├─► adminService.getAllUsers()
    │        │
    │        ▼
    │   Fetch from mock-backend/users.json
    │        │
    │        ▼
    │   Filter admin users out
    │        │
    │        ▼
    │   Display user list
    │
    ▼
User Searches "kurt"
    │
    ├─► Real-time filter on client
    │        │
    │        ▼
    │   Show only matching users
    │
    ▼
User Clicks "Inspect" on Kurt
    │
    ├─► adminService.getUserById("2")
    │        │
    │        ▼
    │   Find user in mock data
    │        │
    │        ▼
    │   Fetch reviews for user
    │
    ▼
AdminDetailModal Opens
    │
    ├─► Display user details
    ├─► Display associated reviews
    ├─► Show delete button for each review
    │
    ▼
User Clicks "Delete" on a review
    │
    ├─► Show confirmation dialog
    │
    ▼
User Confirms Delete
    │
    ├─► adminService.deleteReview("rev_1")
    │        │
    │        ▼
    │   Mock backend removes review
    │
    ▼
Update UI
    │
    ├─► Remove review from list
    ├─► Increment deleted count
    └─► User sees feedback
```

---

## 🗂️ File Structure

```
src/
├── layouts/
│   ├── AdminLayout.tsx ..................... Admin page wrapper
│   │   ├── Header with hamburger menu
│   │   ├── AdminSidebar container
│   │   └── Main content area
│   │
│   ├── Footer.tsx .......................... Shared footer
│   └── Header.tsx .......................... User header
│
├── components/
│   ├── AdminSidebar.tsx .................... Navigation menu
│   │   ├── Dashboard link (📊)
│   │   ├── Users link (👥)
│   │   ├── Restaurants link (🍽️)
│   │   ├── Reviews link (⭐)
│   │   └── Logout button
│   │
│   └── AdminDetailModal.tsx ............... Inspection modal
│       ├── User profile view
│       ├── Restaurant detail view
│       ├── Review list section
│       ├── Delete buttons
│       └── Close button
│
├── pages/
│   ├── AdminDashboard.tsx ................. Dashboard page
│   │   ├── Stat cards (4)
│   │   ├── Activity feed
│   │   └── Health metrics
│   │
│   ├── AdminUsers.tsx ..................... User management
│   │   ├── Search bar
│   │   ├── User table
│   │   ├── Inspect buttons
│   │   └── Modal integration
│   │
│   ├── AdminRestaurants.tsx .............. Restaurant management
│   │   ├── Search bar
│   │   ├── Type filter
│   │   ├── Card grid
│   │   ├── Inspect buttons
│   │   └── Modal integration
│   │
│   ├── AdminReviews.tsx .................. Review moderation
│   │   ├── Status stats
│   │   ├── Search/filter
│   │   ├── Review list
│   │   ├── Flag/Approve buttons
│   │   ├── Delete buttons
│   │   └── Confirmation dialogs
│   │
│   └── ... (other pages)
│
├── services/
│   ├── adminService.ts ................... Admin API functions
│   │   ├── getAllUsers()
│   │   ├── getUserById()
│   │   ├── getAllRestaurants()
│   │   ├── getReviewsByRestaurant()
│   │   ├── deleteReview() ◄─── MODERATION
│   │   └── ...
│   │
│   ├── authService.ts .................... Auth functions
│   ├── dataService.ts .................... Data functions
│   └── ... (other services)
│
├── contexts/
│   └── AuthContext.tsx ................... Auth provider
│
├── types/
│   └── types.ts .......................... TypeScript types
│
└── App.tsx ............................... Main router
    ├── Public routes
    ├── Protected user routes
    └── Protected admin routes ◄─── NEW
```

---

## 🔐 Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────────┐
│         ADMIN ROUTE PROTECTION & AUTHORIZATION                  │
└─────────────────────────────────────────────────────────────────┘

Request to /admin/dashboard
    │
    ▼
ProtectedRoute Component
    │
    ├─► Check: isLoading?
    │   ├─ YES: Show loading spinner
    │   └─ NO: Continue
    │
    ├─► Check: isAuthenticated?
    │   ├─ NO: Redirect to /login
    │   └─ YES: Continue
    │
    ├─► Check: requiredRole === "admin"?
    │   ├─ NO: Redirect to /profile
    │   └─ YES: Continue
    │
    ▼
Render AdminDashboard ✓
```

---

## 📱 Responsive Behavior

```
DESKTOP (>1024px)
┌──────────────────────────────────────────────┐
│ Header (h-16)                                │
├────────┬───────────────────────────────────┤
│Sidebar │ Main Content (p-8)                │
│ w-64   │ max-w-7xl                         │
│        │                                   │
│ Fixed  │ Grid: lg:grid-cols-4              │
│ h-calc │ Tables: Full width                │
│        │ Cards: lg:grid-cols-3             │
│        │                                   │
├────────┴───────────────────────────────────┤
│ Footer                                      │
└──────────────────────────────────────────────┘

TABLET (640px - 1024px)
┌──────────────────────────────┐
│ Header + Hamburger           │
├──────────────────────────────┤
│ Main Content (p-6)           │
│ Grid: md:grid-cols-2         │
│ Tables: Scrollable           │
│ Cards: md:grid-cols-2        │
├──────────────────────────────┤
│ Footer                       │
└──────────────────────────────┘

MOBILE (<640px)
┌─────────────────────┐
│ Header + Menu       │
├─────────────────────┤
│ Main Content (p-4)  │
│ Single column       │
│ Stacked items       │
│ Full-width modals   │
├─────────────────────┤
│ Footer              │
└─────────────────────┘

When hamburger clicked:
┌─────────────────────┐
│ Header + Menu       │
├─────────────────────┤
│ [Overlay] Sidebar   │
│           Animated  │
│           In from   │
│           left      │
│                     │
│ Click outside: close│
└─────────────────────┘
```

---

## 🎯 Component State Management

```
AdminDashboard
├── stats: DashboardStats ─────► useEffect → Load data
│   ├── totalUsers
│   ├── totalRestaurants
│   ├── pendingRequests
│   └── totalReviews

AdminUsers
├── userList: User[] ──────────► useEffect → Load from API
├── selectedUser: User | null ─► setState on Inspect click
├── searchTerm: string ────────► Real-time filter
├── isModalOpen: boolean ──────► Toggle modal
└── userReviews: Review[] ─────► Fetch on inspect

AdminRestaurants
├── restaurants: Restaurant[] ─► useEffect → Load from API
├── selectedRestaurant ────────► setState on Inspect click
├── searchTerm: string ────────► Real-time filter
├── filterType: "all"|"food"|"drink" ─► Combine with search
└── isModalOpen: boolean ─────► Toggle modal

AdminReviews
├── reviews: ReviewWithDetails[] ─► useEffect → Load
├── filteredReviews: Review[] ───► Computed from filters
├── filterStatus: "all"|"approved"|"flagged"
├── searchTerm: string ────────► Combined filter
├── deletingReviewId: string | null ─► Confirm dialog
└── useEffect ────────────────► Apply all filters

AdminDetailModal
├── isOpen: boolean ──────────► Controlled by parent
├── type: "user" | "restaurant"
├── data: User | Restaurant | null ─► Passed from parent
├── reviews: Review[] ────────► Associated reviews
├── showDeleteConfirm: string | null ─► Per-review confirm
└── onDeleteReview: callback ─► Parent notification
```

---

## 🚀 API Integration Points

```
Current: Mock Backend ◄─── Ready for Real Backend
         mock-backend/
         ├── users.json
         ├── data.json
         └── admin-data.json

Connection Points:
├── adminService.ts
│   ├── fetch("/mock-backend/users.json")
│   ├── fetch("/mock-backend/data.json")
│   └── Mock functions for CRUD
│
└── To Connect Real Backend:
    Replace fetch() with axios/fetch to:
    ├── GET /api/admin/users
    ├── GET /api/admin/restaurants
    ├── GET /api/admin/reviews
    ├── DELETE /api/admin/reviews/:id
    ├── POST /api/admin/reviews/:id/flag
    └── POST /api/admin/reviews/:id/approve
```

---

## 📊 CSS Tailwind Utility Summary

```
Layout:
- min-h-screen, flex, overflow-hidden
- p-4, sm:p-6, lg:p-8 (responsive padding)
- max-w-7xl mx-auto (content width)

Grid:
- grid-cols-1, sm:grid-cols-2, lg:grid-cols-4
- gap-4, gap-6 (responsive gaps)

Backgrounds:
- bg-slate-50 (light)
- bg-slate-900 (dark)
- bg-orange-500 (accent)
- bg-green/yellow/red-50 (status)

Text:
- text-3xl font-bold (headings)
- text-sm font-semibold (labels)
- text-slate-600 (muted)

Borders:
- border-2 border-slate-200
- rounded-lg
- shadow-md, shadow-lg

Interactive:
- hover:bg-slate-700, hover:scale-105
- focus:ring-2 focus:ring-orange-500
- transition-colors, transition-transform
```

---

**Version**: 1.0.0 | **Status**: ✅ Complete
**Diagrams**: Architecture, Component, Data Flow, Responsive, File Structure
