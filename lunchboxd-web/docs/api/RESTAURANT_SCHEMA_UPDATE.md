# Restaurant Schema Update - Backend API Documentation

**Date:** February 8, 2026  
**Version:** 2.0.0

This document describes the updated Restaurant data schema for the Lunchboxd API. Please update the backend endpoints to match this new structure.

---

## Summary of Changes

1. **`cuisine`** - Changed from generic `string` to a strict union type
2. **`link`** - New field for restaurant contact/social media link
3. **`openHours`** - New field for operating hours

---

## Restaurant Response Schema

### Full Restaurant Object

```typescript
interface Restaurant {
  id: string;
  name: string;
  cuisine: Cuisine; // UPDATED: Now a union type
  rating: number;
  location: string;
  budgetRange: "10-50" | "50-150" | "150-500" | "500-1000";
  type?: "Food" | "Drink";
  paymentMode?: ("Cash" | "GCash")[];
  sides: Side;
  profileImage?: string | null;
  menuImages?: string[];
  link?: string; // NEW: Contact URL/email/phone as string
  openHours?: OpenHours; // NEW
}
```

---

## Type Definitions

### Cuisine (UPDATED)

The `cuisine` field must be one of these exact lowercase values:

```typescript
type Cuisine =
  | "cafe"
  | "rice meal"
  | "chicken"
  | "fast food"
  | "noodles"
  | "bread";
```

**Note:** Previously this was a generic `string`. Backend validation should now enforce these specific values.

---

### link (NEW)

The `link` field is a simple string containing the restaurant's contact URL, email address, or phone number.

```typescript
link?: string; // Optional contact link (URL, email, or phone)
```

**Examples:**

```json
"link": "japitfood@gmail.com"
"link": "https://facebook.com/havencafe"
"link": "+63912345678"
"link": "https://instagram.com/brewandbean"
"link": "https://quickbites.ph"
```

---

### OpenHours (NEW)

```typescript
interface OpenHours {
  open: string; // Opening time (e.g., "8:00 AM")
  close: string; // Closing time (e.g., "9:00 PM")
}
```

| Field   | Type     | Required | Description                               |
| ------- | -------- | -------- | ----------------------------------------- |
| `open`  | `string` | Yes      | Opening time in 12-hour format with AM/PM |
| `close` | `string` | Yes      | Closing time in 12-hour format with AM/PM |

**Examples:**

```json
{ "open": "8:00 AM", "close": "9:00 PM" }
{ "open": "6:30 AM", "close": "8:00 PM" }
{ "open": "10:00 AM", "close": "11:00 PM" }
```

---

### Side (Unchanged)

```typescript
type Side =
  | "Main Gate"
  | "Gate Six"
  | "Inside the School"
  | "North Gate"
  | "Hospital Gate";
```

---

## Example API Response

### GET /api/restaurants/:id

```json
{
  "id": "1",
  "name": "JAP-IT Food Hauz",
  "cuisine": "rice meal",
  "rating": 4.5,
  "location": "108 Nori, Mabini Extension",
  "budgetRange": "10-50",
  "type": "Food",
  "paymentMode": ["Cash", "GCash"],
  "sides": "Main Gate",
  "profileImage": "https://example.com/image.jpg",
  "menuImages": [
    "https://example.com/menu1.jpg",
    "https://example.com/menu2.jpg"
  ],
  "link": "japitfood@gmail.com",
  "openHours": {
    "open": "8:00 AM",
    "close": "9:00 PM"
  }
}
```

### GET /api/restaurants

Returns an array of Restaurant objects with the same structure.

---

## Migration Notes for Backend

1. **Database Migration Required:**
   - Add `link` column as a string (VARCHAR or TEXT)
   - Add `open_hours_open` and `open_hours_close` columns (or a JSON `openHours` column)
   - Migrate existing `cuisine` values to lowercase

2. **Validation Updates:**
   - Enforce `cuisine` to be one of the 6 allowed values
   - Validate time format for `openHours` fields

3. **Default Values:**
   - `link` and `openHours` are optional fields
   - Frontend handles missing values gracefully

---

## Questions?

Contact the frontend team for clarification on any schema requirements.
