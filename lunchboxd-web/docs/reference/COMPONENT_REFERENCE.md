# Component Implementation Reference

## AdminHeader Component

**Location:** `src/components/AdminHeader.tsx`  
**Type:** Functional React Component  
**Purpose:** Specialized header for admin dashboard

### Props

```typescript
interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
```

### Features

- Hamburger menu toggle (mobile-only)
- Logo with admin branding
- Admin panel badge
- Logout button

### Key Code

```tsx
export function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-forest-dark text-white sticky top-0 z-40 shadow-lg">
      {/* Header content */}
    </header>
  );
}
```

---

## DetailInspectionModal Component

**Location:** `src/components/DetailInspectionModal.tsx`  
**Type:** Functional React Component  
**Purpose:** Modal overlay for viewing restaurant request details

### Props

```typescript
interface DetailInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: RestaurantRequest | null;
}
```

### Features

- Status badge with dynamic colors
- Full request details display
- Image preview sections
- Scrollable content area
- Close functionality

### Image Sections

1. **Profile Image**: Full-width display
2. **Menu Images**: 2-3 column responsive grid

### Key Code

```tsx
export function DetailInspectionModal({
  isOpen,
  onClose,
  title,
  data,
}: DetailInspectionModalProps) {
  if (!isOpen || !data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-50 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
    </div>
  );
}
```

---

## AdminDashboard Page

**Location:** `src/pages/AdminDashboard.tsx`  
**Type:** Functional React Component  
**Purpose:** Main admin interface with dashboard, tables, and charts

### State Management

```typescript
const [restaurantRequests, setRestaurantRequests] = useState<RestaurantRequest[]>([]);
const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
const [stats, setStats] = useState({ ... });
const [sidebarOpen, setSidebarOpen] = useState(true);
const [isLoading, setIsLoading] = useState(true);
const [activeTab, setActiveTab] = useState<"overview" | "requests" | "messages">("overview");
const [selectedRequest, setSelectedRequest] = useState<RestaurantRequest | null>(null);
const [modalOpen, setModalOpen] = useState(false);
```

### Main Sections

#### 1. Sidebar

- Fixed or absolute positioning (responsive)
- Navigation buttons for each tab
- Badge indicators (pending count, unread count)
- Dark forest theme

#### 2. Header

- AdminHeader component integration
- Sticky positioning
- Responsive layout

#### 3. Content Area (Tabbed)

**Overview Tab:**

- Statistics grid (5 metrics)
- Pie chart: Request Status Distribution
- Bar chart: Message Status

**Requests Tab:**

- Data table with columns:
  - Restaurant Name
  - Type
  - Status
  - Submitted Date
  - Actions (View, Approve, Reject)
- Row hover effects
- Color-coded status badges

**Messages Tab:**

- Message cards with:
  - Subject and sender info
  - Full message text
  - Timestamp
  - Status badge
  - Mark as read button

#### 4. Modal

- DetailInspectionModal overlay
- Opens when clicking "View" button
- Displays full request with images

### Data Fetching

```typescript
useEffect(() => {
  const loadData = async () => {
    setIsLoading(true);
    try {
      const requests = await getRestaurantRequests();
      const messages = await getContactMessages();
      const dashboardStats = await getDashboardStats();

      setRestaurantRequests(requests);
      setContactMessages(messages);
      setStats(dashboardStats);
    } finally {
      setIsLoading(false);
    }
  };

  loadData();
}, []);
```

### Charts Implementation

```typescript
// Request Status Chart
const statusData = [
  { name: "Pending", value: stats.pendingRequests, color: "#FCD34D" },
  { name: "Approved", value: stats.approvedRequests, color: "#10B981" },
  { name: "Rejected", value: stats.totalRestaurantRequests - ..., color: "#EF4444" },
].filter((d) => d.value > 0);

// Message Status Chart
const messageStatusData = [
  { name: "Unread", value: stats.unreadMessages, color: "#F97316" },
  { name: "Read", value: stats.totalContactMessages - ..., color: "#6B7280" },
].filter((d) => d.value > 0);
```

---

## AddRestaurant Component - Image Upload

**Location:** `src/pages/AddRestaurant.tsx`  
**Section:** Image Upload (integrated into existing form)

### New State Fields

```typescript
const [formData, setFormData] = useState<RestaurantRequestPayload>({
  // ... existing fields
  profileImage: null,
  menuImages: [],
});
```

### Image Handlers

**Base64 Conversion:**

```typescript
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
```

**Profile Image Handler:**

```typescript
const handleProfileImageChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const file = e.target.files?.[0];
  if (file) {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }
    try {
      const base64 = await convertFileToBase64(file);
      setFormData((prev) => ({ ...prev, profileImage: base64 }));
      setError(null);
    } catch {
      setError("Failed to process image");
    }
  }
};
```

**Menu Images Handler:**

```typescript
const handleMenuImagesChange = async (
  e: React.ChangeEvent<HTMLInputElement>,
) => {
  const files = e.target.files;
  if (files) {
    if (formData.menuImages.length + files.length > 5) {
      setError("Maximum 5 menu images allowed");
      return;
    }

    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith("image/")) {
          setError("All files must be images");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setError("Each image must be less than 5MB");
          return;
        }
        const base64 = await convertFileToBase64(file);
        newImages.push(base64);
      }
      setFormData((prev) => ({
        ...prev,
        menuImages: [...prev.menuImages, ...newImages],
      }));
      setError(null);
    } catch {
      setError("Failed to process images");
    }
  }
};
```

**Remove Functions:**

```typescript
const removeProfileImage = () => {
  setFormData((prev) => ({ ...prev, profileImage: null }));
};

const removeMenuImage = (index: number) => {
  setFormData((prev) => ({
    ...prev,
    menuImages: prev.menuImages.filter((_, i) => i !== index),
  }));
};
```

### Image Upload UI

```tsx
{
  /* Profile Image Section */
}
<div className="form-group">
  <label>Restaurant Profile Image (Optional)</label>
  <input type="file" accept="image/*" onChange={handleProfileImageChange} />
  {formData.profileImage && (
    <div className="preview">
      <img src={formData.profileImage} alt="preview" />
      <button onClick={removeProfileImage}>Remove</button>
    </div>
  )}
</div>;

{
  /* Menu Images Section */
}
<div className="form-group">
  <label>Menu Images (Optional, up to 5)</label>
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleMenuImagesChange}
  />
  <div className="gallery">
    {formData.menuImages.map((img, idx) => (
      <div key={idx} className="preview">
        <img src={img} alt={`menu-${idx}`} />
        <button onClick={() => removeMenuImage(idx)}>Remove</button>
      </div>
    ))}
  </div>
</div>;
```

### Form Submission

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const payload = {
      ...formData,
      submittedBy: currentUser.id,
      submittedAt: new Date().toISOString(),
    };

    await createRestaurantRequest(payload);

    // Reset form
    setFormData({
      // ... reset all fields
      profileImage: null,
      menuImages: [],
    });

    setSuccessMessage("Request submitted successfully!");
  } catch (err) {
    setError("Failed to submit request");
  }
};
```

---

## Type Definitions

**Location:** `src/types/types.ts`

### RestaurantRequest Interface

```typescript
export interface RestaurantRequest {
  id: string;
  restaurantName: string;
  cuisine: string;
  location: string;
  budgetRange: string;
  type: string;
  paymentMode: string[];
  sides: string;
  description?: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  contact?: string;
  profileImage?: string | null; // NEW
  menuImages?: string[]; // NEW
}
```

### RestaurantRequestPayload

```typescript
export interface RestaurantRequestPayload {
  restaurantName: string;
  cuisine: string;
  location: string;
  budgetRange: string;
  type: string;
  paymentMode: string[];
  sides: string;
  description?: string;
  submittedBy: string;
  submittedAt: string;
  contact?: string;
  profileImage?: string | null;
  menuImages?: string[];
}
```

---

## Tailwind CSS Classes Used

### Colors (Theme)

- `bg-forest-dark` - Main sidebar color
- `bg-forest-mid` - Hover/accent color
- `bg-sand` - Accent highlights
- `bg-off-white` - Background
- `text-forest-dark` - Primary text

### Layout Classes

- `flex` - Flexbox container
- `grid` - CSS Grid layout
- `gap-*` - Spacing between items
- `fixed/absolute/sticky` - Positioning
- `z-*` - Z-index stacking

### Interactive

- `hover:` - Hover states
- `transition-colors` - Smooth color changes
- `rounded-*` - Border radius
- `shadow-*` - Drop shadows
- `opacity-*` - Transparency

### Responsive

- `md:` - Medium screens (tablets)
- `lg:` - Large screens (desktops)
- `hidden/inline` - Display utilities

---

## Integration Points

1. **App.tsx Route**

   ```tsx
   <Route
     path="/admin/dashboard"
     element={
       <ProtectedRoute requiredRole="admin">
         <AdminDashboard />
       </ProtectedRoute>
     }
   />
   ```

2. **AuthContext Integration**
   - useAuth hook for logout functionality
   - User role validation (admin)

3. **Admin Service Integration**
   - getRestaurantRequests()
   - getContactMessages()
   - getDashboardStats()
   - updateRestaurantRequestStatus()
   - updateContactMessageStatus()

4. **Recharts Integration**
   - PieChart, Pie, Cell
   - BarChart, Bar, Cell
   - ResponsiveContainer

---

## Performance Optimization

1. **Image Handling**
   - Client-side validation before upload
   - Base64 limit (5MB per image)
   - Limited count (5 max)

2. **Dashboard**
   - Single data fetch on mount
   - Conditional rendering for charts
   - Memoized components (optional)

3. **Charts**
   - ResponsiveContainer for scaling
   - Filtered data (no zero values)
   - Tooltip and Legend on demand

4. **Modal**
   - Lazy rendering (not shown until needed)
   - Click outside to close
   - Smooth animations

---

## Accessibility Features

- Semantic HTML elements
- Proper heading hierarchy (h1, h2, h3)
- Alt text for images
- ARIA labels for icons
- Keyboard navigation support
- Color contrast compliance
- Focus indicators on interactive elements

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari 12+, Chrome Mobile)

---

**Last Updated:** January 20, 2026  
**Version:** 1.0  
**Status:** Production Ready
