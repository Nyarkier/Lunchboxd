# 🎯 Admin Dashboard - Quick Reference Card

## 🚀 Quick Start (60 seconds)

```bash
# 1. Dev server is already running on port 5173
# 2. Open browser and go to:
http://localhost:5173/

# 3. Login with admin credentials:
Email: admin_user@example.com
Password: admin123

# 4. Redirects to /admin/dashboard
```

---

## 📱 The 4 Admin Pages

| Page        | URL                  | Purpose              | Main Feature           |
| ----------- | -------------------- | -------------------- | ---------------------- |
| Dashboard   | `/admin/dashboard`   | Overview & stats     | 4 KPI cards            |
| Users       | `/admin/users`       | User management      | Search & inspect users |
| Restaurants | `/admin/restaurants` | Restaurant directory | Cards grid + filter    |
| Reviews     | `/admin/reviews`     | Moderation queue     | Flag, approve, delete  |

---

## 🎮 How to Use Each Page

### Dashboard

```
Click "Dashboard" in sidebar
→ See 4 stat cards
→ View recent activity
→ Check platform health
```

### Users

```
Click "Users" in sidebar
→ Type name to search
→ Click "Inspect" button
→ See user profile & reviews
→ Close modal to return
```

### Restaurants

```
Click "Restaurants" in sidebar
→ Select type: All/Food/Drink
→ Type to search
→ Click "Inspect Details"
→ View images & info
→ See menu photos
```

### Reviews

```
Click "Reviews" in sidebar
→ See approval stats
→ Click "Flag" to flag review
→ Click "Delete" then confirm
→ Search or filter by status
```

---

## 🔑 Key Buttons & Actions

```
🔘 "Inspect" / "Inspect Details"
   → Opens full-screen modal with details

🔘 "Flag" or "Approve"
   → Toggles review status between approved/flagged

🔘 "Delete"
   → Shows confirmation, then deletes

🔘 "Close" / Click Outside Modal
   → Closes modal, returns to list

🔘 Hamburger Menu (📱 mobile)
   → Opens/closes sidebar
```

---

## 📊 Modal Details

### User Modal

```
👤 Profile Picture
📧 Email & Mobile
👥 Role (admin/user)
📅 Join Date
🔗 User ID
📊 Activity Summary
⭐ Associated Reviews
```

### Restaurant Modal

```
🍽️ Profile Image
⭐ Rating
💰 Budget Range
🥘 Cuisine Type
📍 Location
🖼️ Menu Images (gallery)
📌 Sides Location
⭐ Associated Reviews
```

---

## 🔍 Search & Filter Quick Tips

**Users Page:**

```
Search: Type name, email, or username
Search box updates in real-time
Clear to show all users
```

**Restaurants Page:**

```
Search: Name, cuisine, or location
Filter dropdown: All / Food / Drink
Combine both for precise results
```

**Reviews Page:**

```
Search: Review text or restaurant name
Filter: All / Approved / Flagged
Status cards show counts
```

---

## ⚡ Common Tasks

### Delete a Review

```
1. Go to Reviews
2. Find review to delete
3. Click "Delete" button
4. Click "Delete" in confirmation
5. Review removed, count updated
```

### Find a Specific User

```
1. Go to Users
2. In search box, type: "kurt"
3. Kurt Valera appears
4. Click "Inspect"
5. See all details
```

### Browse Restaurant Menu

```
1. Go to Restaurants
2. Click "Inspect Details"
3. Scroll to "Menu Images"
4. See up to 4 menu photos
5. Close modal
```

### Flag Inappropriate Review

```
1. Go to Reviews
2. Click "Flag" button on review
3. Button changes color (yellow)
4. Status updates in card
```

---

## 📱 Mobile vs Desktop

| Feature | Mobile            | Desktop        |
| ------- | ----------------- | -------------- |
| Sidebar | Hidden by default | Always visible |
| Menu    | Hamburger button  | Sidebar        |
| Tables  | Single column     | Full columns   |
| Modals  | Full screen       | Centered box   |
| Touch   | Button size 44px+ | Hover effects  |

---

## 🎨 Status Indicators

```
✅ Green = Approved / Active
⚠️ Yellow = Flagged / Warning
🔴 Red = Deleted / Critical
🔵 Blue = Information
🟠 Orange = Active page / Highlight
```

---

## 💾 Available Test Data

### Sample Users

- Prince Lord Mendoza
- Kurt Valera
- Raisen Yamul
- Maria Santos
- (4+ more available)

### Sample Restaurants

- JAP-IT Food Hauz
- Haven Cafe
- Taba Eatery
- (12+ more available)

### Sample Reviews

- Multiple reviews available
- Different ratings (1-5 stars)
- Various statuses (approved/flagged)

---

## 🚨 Troubleshooting

| Problem               | Solution                             |
| --------------------- | ------------------------------------ |
| Can't see admin pages | Verify logged in as admin            |
| Modal won't close     | Click close button or background     |
| Search not working    | Check spelling, full name works best |
| Mobile menu stuck     | Click background overlay             |
| No data showing       | Refresh page, check mock data        |

---

## 📝 Keyboard Tips

```
Ctrl+Shift+M    → Toggle mobile view (DevTools)
F12             → Open DevTools
Ctrl+F          → Find on page
Click outside   → Close modals
Tab             → Navigate buttons
```

---

## 🎯 What's Available

✅ User inspection & viewing
✅ Restaurant inspection & filtering
✅ Review moderation (flag, approve, delete)
✅ Search across all pages
✅ Filter by type/status
✅ Mobile responsive design
✅ Real-time updates
✅ Confirmation dialogs

---

## 🚀 URLs for Quick Access

```
Homepage:           http://localhost:5173/
Admin Dashboard:    http://localhost:5173/admin/dashboard
Users:              http://localhost:5173/admin/users
Restaurants:        http://localhost:5173/admin/restaurants
Reviews:            http://localhost:5173/admin/reviews
Login:              http://localhost:5173/login
```

---

## 💡 Pro Tips

1. **Use Search First**: Faster than scrolling through lists
2. **Filter Type Before Search**: Narrows results quickly
3. **Check Status Cards**: Shows count without scrolling
4. **Mobile Menu Tip**: Click item to close after selecting
5. **Bulk Delete**: Delete multiple reviews one by one (for now)

---

## 📞 If Something Goes Wrong

```
1. Refresh browser (Ctrl+R)
2. Check console (F12)
3. Verify still logged in as admin
4. Check dev server is running
5. Clear browser cache (Ctrl+Shift+Del)
```

---

## 🎓 Learning Path

**New to Admin Dashboard?**

1. Start with Dashboard → overview
2. Go to Users → practice searching
3. Try Restaurants → test filtering
4. Explore Reviews → test delete feature
5. Try mobile view → test responsiveness

---

**Version**: 1.0.0
**Status**: ✅ Ready to Use
**Last Updated**: January 19, 2026

_For detailed documentation, see ADMIN_DASHBOARD_COMPLETE.md_
