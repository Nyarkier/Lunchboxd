# 🍽️ LUNCHBOXD - Complete System Overview

**Version:** 2.0 | **Last Updated:** January 2026 | **Status:** Production Ready

---

## 📖 Executive Summary

**Lunchboxd** is a comprehensive food discovery and directory platform built with React, TypeScript, and Vite. It enables users to explore restaurants, leave reviews, discover food options, and save favorites. The system includes a production-ready authentication layer and an admin dashboard for content moderation and user management.

### Key Features
- 🔐 **Authentication System** - Login/Signup with localStorage persistence
- 🍽️ **Restaurant Directory** - Browse, search, and filter restaurants
- ⭐ **Review System** - Leave and read reviews with ratings
- ❤️ **Favorites** - Save and manage favorite restaurants
- 🎲 **Discovery Tools** - Random restaurant picker and decision helper
- 👨‍💼 **Admin Dashboard** - User, restaurant, and review management
- 📱 **Responsive Design** - Mobile and desktop optimized

---

## 🏗️ System Architecture

### Frontend Stack
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **State Management:** React Context API (AuthContext)
- **Styling:** Tailwind CSS
- **HTTP Client:** Fetch API with custom API client
- **Data Persistence:** localStorage

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  (Pages, Components, UI - React)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              CONTEXT & STATE LAYER                          │
│  (AuthContext, useAuth hook, state management)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              SERVICES LAYER (Business Logic)                │
│  (authService, reviewsService, favoritesService,           │
│   dataService, adminService)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              DATA LAYER                                     │
│  (localStorage, API Client, mock-backend, real APIs)       │
└─────────────────────────────────────────────────────────────┘
```

### Core Modules

#### 1. **Authentication Module** (`src/contexts/AuthContext.tsx`)
- User login/signup/logout
- Session persistence via localStorage
- Role-based access control (User vs Admin)
- Protected routes with automatic redirects
- Error handling and loading states

**Key Functions:**
- `login(email, password)` - Authenticate user
- `signup(email, password, name)` - Create new account
- `logout()` - Clear session and redirect
- `clearError()` - Reset error state

#### 2. **Admin Module** (`src/pages/Admin*`, `src/components/Admin*`)
- Dashboard with KPI cards (Users, Restaurants, Reviews, Ratings)
- User inspection and management
- Restaurant content moderation
- Review approval/flagging system
- Activity tracking and analytics

**Admin Pages:**
- `/admin` - Main dashboard overview
- `/admin/users` - User management
- `/admin/restaurants` - Restaurant management
- `/admin/reviews` - Review moderation queue

#### 3. **Data Services** (`src/services/`)
- **authService.ts** - Authentication API calls
- **dataService.ts** - Restaurant and directory data
- **reviewsService.ts** - Review CRUD operations
- **favoritesService.ts** - Favorites management
- **adminService.ts** - Admin operations (15+ functions)
- **apiClient.ts** - Centralized API client

#### 4. **UI Components** (`src/components/`)
- Navigation (Header, BurgerMenu)
- Forms (Login, Signup, Profile Edit)
- Content (RestaurantCard, ReviewCard, CategoryTabs)
- Modals (Detail inspection, confirmation dialogs)
- Admin (Sidebar, Dashboard widgets)

---

## 🔌 API Integration

### Backend Endpoints Structure

**Base URL:** `http://localhost:3000/api`

#### Authentication Endpoints
```
POST   /auth/login          - User login (returns token & user data)
POST   /auth/signup         - User registration
POST   /auth/logout         - Logout (optional)
POST   /auth/refresh        - Refresh token
GET    /users/:id           - Get user profile
PUT    /users/:id           - Update user profile
```

#### Restaurant Endpoints
```
GET    /restaurants          - List all restaurants (with filters)
GET    /restaurants/:id      - Get restaurant details
GET    /restaurants/search   - Search by name/cuisine
GET    /categories           - Get all food categories
```

#### Review Endpoints
```
GET    /reviews             - List reviews (with filters)
GET    /reviews/:id         - Get review details
POST   /reviews             - Create review
PUT    /reviews/:id         - Update review
DELETE /reviews/:id         - Delete review
GET    /restaurants/:id/avg-rating - Get avg rating
```

#### Admin Endpoints
```
GET    /admin/dashboard     - Dashboard statistics
GET    /admin/users         - All users (admin only)
GET    /admin/restaurants   - All restaurants (admin only)
GET    /admin/reviews       - Moderation queue (admin only)
PUT    /admin/reviews/:id   - Approve/flag review
DELETE /admin/reviews/:id   - Delete review
```

#### Favorites Endpoints
```
GET    /favorites           - Get user's favorites
POST   /favorites/:restaurantId - Add favorite
DELETE /favorites/:restaurantId - Remove favorite
```

### Current Implementation

**Development Mode:** Uses localStorage and mock data
**Production Mode:** Seamlessly switches to real API calls via environment variables

```typescript
// Example API integration pattern
const response = await fetch(`${API_BASE_URL}/restaurants`, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}` // if needed
  }
});
```

---

## 👥 User Roles & Access Control

### User Role
- **Can:** Browse directory, search restaurants, leave reviews, mark favorites
- **Cannot:** Access admin dashboard, moderate content, view user data
- **Routes:** Public routes + `/profile`, `/favorites`

### Admin Role
- **Can:** Access admin dashboard, manage users, moderate reviews, manage restaurants
- **Cannot:** Override audit logs, cannot be performed by single admin without approval (future)
- **Routes:** All admin routes (`/admin/*`)
- **Implementation:** Role-based route protection in `App.tsx`

---

## 📊 Data Models

### User Model
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "username": "string (unique)",
  "email": "string (unique)",
  "mobile": "string (optional)",
  "avatar": "string|null (URL or base64)",
  "role": "user|admin",
  "createdAt": "ISO 8601 timestamp"
}
```

### Restaurant Model
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "cuisine": "string",
  "category": "string",
  "rating": "number (0-5)",
  "reviews": "number",
  "image": "string (URL)",
  "address": "string",
  "phone": "string",
  "hours": "object",
  "coordinates": { "lat": "number", "lng": "number" }
}
```

### Review Model
```json
{
  "id": "string",
  "restaurantId": "string",
  "userId": "string",
  "rating": "1-5",
  "comment": "string",
  "status": "approved|flagged|pending",
  "createdAt": "ISO 8601 timestamp"
}
```

### Favorite Model
```json
{
  "id": "string",
  "userId": "string",
  "restaurantId": "string",
  "addedAt": "ISO 8601 timestamp"
}
```

---

## 🔒 Security Features

### Authentication Security
- ✅ Password hashing (backend responsibility)
- ✅ JWT token management with localStorage
- ✅ Protected routes with automatic redirects
- ✅ Session persistence with logout capability
- ✅ Error handling without exposing sensitive data

### Authorization
- ✅ Role-based access control (RBAC)
- ✅ Protected admin endpoints require `role: 'admin'`
- ✅ User data isolation (users can only access their own data)
- ✅ Frontend route guards + backend verification

### Best Practices Implemented
- ✅ HTTPS required for production (via environment config)
- ✅ Secure token transmission (Authorization header)
- ✅ CSRF token support (via cookies, if needed)
- ✅ Input validation on frontend
- ✅ Error messages don't leak sensitive information

---

## 📂 Project Structure

```
lunchboxd-web/
├── src/
│   ├── assets/              (Images, logos)
│   ├── components/          (Reusable React components)
│   │   ├── AuthExample.tsx
│   │   ├── AdminHeader.tsx
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminDetailModal.tsx
│   │   ├── BurgerMenu.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── RestaurantCard.tsx
│   │   └── ... (30+ components)
│   │
│   ├── contexts/            (State management)
│   │   └── AuthContext.tsx  (Authentication state)
│   │
│   ├── pages/               (Page components/routes)
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignUpPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminUsers.tsx
│   │   ├── AdminRestaurants.tsx
│   │   └── AdminReviews.tsx
│   │
│   ├── services/            (Business logic & API calls)
│   │   ├── authService.ts
│   │   ├── dataService.ts
│   │   ├── reviewsService.ts
│   │   ├── favoritesService.ts
│   │   ├── adminService.ts
│   │   └── apiClient.ts
│   │
│   ├── hooks/               (Custom React hooks)
│   ├── types/               (TypeScript interfaces)
│   ├── utils/               (Utility functions)
│   │
│   ├── App.tsx              (Main app component with routing)
│   ├── main.tsx             (Entry point)
│   ├── index.css            (Global styles)
│   └── App.css
│
├── docs/                    (Documentation - organized by topic)
│   ├── getting-started/     (Quick start guides)
│   ├── architecture/        (System design & diagrams)
│   ├── api/                 (API documentation)
│   ├── admin/               (Admin dashboard docs)
│   ├── backend/             (Backend integration guides)
│   ├── authentication/      (Auth system docs)
│   ├── reference/           (Quick references & indexes)
│   └── archived/            (Old versions - can be deleted)
│
├── mock-backend/            (Mock data for development)
│   ├── data.json
│   ├── users.json
│   └── admin-data.json
│
├── public/                  (Static assets)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
├── index.html
└── README.md                (Main project readme)
```

---

## 🚀 Deployment & Environment Configuration

### Environment Variables
```
VITE_API_BASE_URL=http://localhost:3000/api    (development)
VITE_API_BASE_URL=https://api.lunchboxd.com    (production)
VITE_APP_ENV=production                         (or development)
```

### Deployment Checklist
- [ ] Update API URLs in environment variables
- [ ] Verify backend authentication endpoints
- [ ] Test login/logout flow
- [ ] Test protected routes
- [ ] Verify admin role assignment
- [ ] Test review moderation workflow
- [ ] Configure HTTPS and secure cookies
- [ ] Set up error logging/monitoring
- [ ] Performance testing (Lighthouse)
- [ ] Security audit

---

## 📚 Documentation Map

### Quick Start
- **START_HERE.md** - 5-minute orientation
- **GETTING_STARTED.md** - 30-minute comprehensive guide

### Authentication
- **README_AUTH.md** - Complete auth system documentation
- **AUTH_SETUP.md** - Technical setup guide

### Architecture
- **ARCHITECTURE.md** - System design and diagrams
- **ARCHITECTURE_DIAGRAMS.md** - Visual architecture
- **FILE_STRUCTURE.md** - Project file organization

### API Reference
- **API_DOCUMENTATION.md** - All endpoints and data models
- **BACKEND_INTEGRATION_GUIDE.md** - How to connect backend

### Admin Module
- **README_ADMIN_DASHBOARD.md** - Admin feature overview
- **ADMIN_MODULE_DOCUMENTATION.md** - Complete admin docs
- **ADMIN_TESTING_GUIDE.md** - Testing scenarios

### Quick References
- **COMPONENT_REFERENCE.md** - UI component library
- **QUICK_REFERENCE_API.md** - API endpoint quick reference
- **QUICK_REFERENCE.md** - General quick reference

---

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/lunchboxd-web.git

# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

### Build & Deploy
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🔄 Feature Workflow Examples

### User Registration Flow
1. User clicks "Sign Up"
2. Signup form validates input
3. Calls `authService.signup()` → API `/auth/signup`
4. Backend creates user and returns token + user data
5. AuthContext updates state and saves to localStorage
6. User is redirected to `/profile`
7. Session persists on refresh via AuthContext initialization

### Review Creation Flow
1. User reads restaurant details
2. Clicks "Leave a Review"
3. ReviewForm captures rating + comment
4. Calls `reviewsService.createReview()`
5. Saves to localStorage (or API)
6. Review appears in review list
7. Admins can approve/flag in admin dashboard

### Admin Moderation Flow
1. Admin logs in with `role: 'admin'`
2. Navigates to `/admin/reviews`
3. AdminReviews page shows pending reviews queue
4. Admin can:
   - Click to see full review details
   - Click "Approve" → Move to approved
   - Click "Flag" → Mark as suspicious
   - Click "Delete" → Remove review with confirmation
5. Dashboard updates with new statistics

---

## ⚙️ Configuration & Customization

### Styling
- **Framework:** Tailwind CSS
- **Location:** Inline classes in components
- **Config:** `tailwind.config.js` (in root)
- **Customization:** Edit component classes or Tailwind config

### Routes
- **Main Router:** `src/App.tsx`
- **Protected Routes:** Use `ProtectedRoute` component wrapper
- **Admin Routes:** Require `user.role === 'admin'` + `ProtectedRoute`

### API Integration
- **Client:** `src/services/apiClient.ts`
- **Base URL:** Environment variable `VITE_API_BASE_URL`
- **Headers:** Automatically includes auth token in Authorization header

---

## 📈 Performance Optimization

- ✅ Code splitting with dynamic imports
- ✅ Lazy loading of admin pages
- ✅ Image optimization (Vite asset handling)
- ✅ localStorage caching for offline support
- ✅ Context API with proper memoization
- ✅ Tailwind CSS with PurgeCSS

---

## 🐛 Known Limitations & Future Enhancements

### Current Limitations
- localStorage limited to ~5-10MB (suitable for MVP)
- No real-time notifications (polling approach if needed)
- Mock data used in development

### Planned Enhancements
- [ ] Real-time review notifications via WebSockets
- [ ] Advanced search with filters and facets
- [ ] User reputation system
- [ ] Photo uploads for reviews
- [ ] Social features (follow users, friend lists)
- [ ] Analytics dashboard for restaurants
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Advanced admin analytics

---

## 📞 Support & Maintenance

### Troubleshooting

**Issue:** localStorage not persisting
- **Solution:** Check browser privacy settings, ensure HTTPS in production

**Issue:** Authentication failing
- **Solution:** Verify backend API URL, check CORS headers

**Issue:** Admin dashboard not accessible
- **Solution:** Verify user role is set to 'admin' in backend

### Contributing Guidelines
- Follow TypeScript strict mode
- Use component composition over prop drilling
- Keep services focused on single responsibility
- Add types for all parameters and returns
- Test authentication flows thoroughly

---

## 📄 License & Credits

**Project:** Lunchboxd Web
**Version:** 2.0
**Built with:** React, TypeScript, Vite, Tailwind CSS
**Status:** Production Ready

---

## ✅ Verification Checklist

- [x] Authentication system implemented and tested
- [x] Admin dashboard fully functional
- [x] API integration documented
- [x] All routes protected appropriately
- [x] Error handling implemented
- [x] Responsive design verified
- [x] TypeScript types complete
- [x] Documentation comprehensive
- [x] Mock backend data available
- [x] Ready for backend integration

