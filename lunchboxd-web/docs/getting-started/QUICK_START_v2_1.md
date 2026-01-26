# Quick Start Guide - New Features v2.1

## 🚀 What's New?

### For Users

- **Image Upload on Restaurant Submissions**: Add profile photo and menu images when suggesting restaurants
- Better visual representation of your suggestions

### For Admins

- **Professional Admin Dashboard**: Complete redesign with sidebar and tabs
- **Analytics Charts**: Visual data representation (pie/bar charts)
- **Detail Inspection Modal**: View full restaurant details with images
- **Organized Interface**: Separate tabs for Overview, Requests, and Messages

---

## 📸 Image Upload Feature

### How to Use (Users)

1. **Navigate to "Add a Restaurant"**
   - Fill out the restaurant details as usual

2. **Upload Profile Image** (Optional)
   - Click the "Upload Restaurant Image" button
   - Select a single image (JPEG, PNG, GIF, WebP)
   - Maximum size: 5MB
   - Preview appears below the input

3. **Upload Menu Images** (Optional)
   - Click the "Upload Menu Images" button
   - Select multiple images (up to 5)
   - Each image limited to 5MB
   - All images preview in a gallery

4. **Remove Images** (If needed)
   - Click the X button on any image thumbnail to remove
   - You can add/remove as many times as needed

5. **Submit**
   - Click "Submit Restaurant Request"
   - Images are included with your submission
   - Form resets after successful submission

### Image Requirements

- **Format**: JPEG, PNG, GIF, WebP
- **Size**: Maximum 5MB per image
- **Count**:
  - Profile image: 1 (optional)
  - Menu images: 0-5 (optional)
- **Quality**: Higher quality images recommended for better display

### Error Messages

- "Please select a valid image file" → File is not an image
- "Image size must be less than 5MB" → File exceeds size limit
- "Maximum 5 menu images allowed" → Too many menu images selected
- "All files must be images" → One or more files are not images

---

## 👨‍💼 Admin Dashboard Feature

### How to Access

1. **Login as Admin**
   - Use admin account credentials
   - Role must be "admin"

2. **Navigate to Admin Dashboard**
   - Automatic redirect on login if admin
   - Or navigate to `/admin/dashboard` directly
   - See "Admin" badge in header confirming admin view

### Dashboard Layout

#### Header

- Logo with "Admin" label
- Hamburger menu (mobile only) for sidebar toggle
- "Admin Panel" badge
- Logout button

#### Sidebar (Left)

- Navigation tabs:
  - **Overview** (chart icon) - Statistics and charts
  - **Requests** (clock icon) - Restaurant submissions
  - **Messages** (message icon) - User feedback
- Badge indicators show:
  - Number of pending requests
  - Number of unread messages
- Collapses to icon-only on mobile

#### Main Content Area

- Different views based on selected tab
- Responsive layout
- Scroll content independently

---

## 📊 Overview Tab

### Statistics Grid (Top)

Five cards showing:

1. **Total Requests** - All restaurant submissions ever
2. **Pending** - Awaiting review (yellow)
3. **Approved** - Accepted requests (green)
4. **Total Messages** - All user messages
5. **Unread** - Unread messages (orange)

### Request Status Chart (Left)

- **Type**: Pie chart
- **Shows**: Breakdown of all requests
  - Pending (yellow)
  - Approved (green)
  - Rejected (red)
- **Hover**: See exact count for each status

### Message Status Chart (Right)

- **Type**: Bar chart
- **Shows**: Message read status
  - Unread (orange)
  - Read (gray)
- **Hover**: See exact count for each

### How to Use

- View system statistics at a glance
- Charts auto-update when data changes
- Responsive sizing on all screen sizes
- Mobile-friendly layout

---

## 📋 Requests Tab

### Data Table

Displays all restaurant submissions with columns:

1. **Restaurant** - Name and cuisine
2. **Type** - Food or Drink
3. **Status** - Badge showing pending/approved/rejected
4. **Submitted** - Date submitted
5. **Actions** - Buttons for View, Approve, Reject

### Status Indicators

- **Yellow badge "Pending"** - Awaiting action
- **Green badge "Approved"** - Already accepted
- **Red badge "Rejected"** - Already declined

### Available Actions

#### View Button (Blue)

- Opens detailed modal
- Shows full restaurant details
- Displays profile and menu images
- Can view but not edit

#### Approve Button (Green) - For Pending Only

- Marks request as approved
- Button disappears after action
- Request moves to approved status

#### Reject Button (Red) - For Pending Only

- Marks request as rejected
- Button disappears after action
- Request moves to rejected status

### How to Use

1. Review pending requests
2. Click "View" to see full details and images
3. Close modal (click X or outside)
4. Click "Approve" or "Reject" to action
5. Status updates immediately
6. Approved requests ready for backend processing

### Tips

- Sort requests by status badge color
- Click multiple "View" modals to compare details
- Hover over restaurant names to see cuisine
- No pagination currently - scroll for more

---

## 💬 Messages Tab

### Message Cards

Each user message shown as a card displaying:

- **Subject** - What the message is about
- **From** - Sender name and email
- **Status Badge** - Unread (orange) or Read (gray)
- **Message** - Full text in quote box
- **Timestamp** - When submitted
- **Action** - "Mark as Read" button (if unread)

### Message Subjects

1. General Feedback
2. Bug Report
3. Feature Request
4. Partnership Inquiry
5. Other

### Status Colors

- **Orange "Unread"** - New message, not reviewed
- **Gray "Read"** - Already reviewed

### How to Use

1. Browse all user messages
2. Read full message content
3. For unread messages, click "Mark as Read"
4. Status updates immediately
5. Read messages appear in gray

### Tips

- Unread messages appear first with badges
- Review partnership inquiries for business opportunities
- Bug reports help improve the app
- Use for customer feedback and insights

---

## 🔍 Detail Inspection Modal

### How It Opens

1. Go to **Requests Tab**
2. Click blue **"View"** button on any request
3. Modal overlay appears with full details

### Information Displayed

**Header Section**

- Restaurant name
- Status badge (pending/approved/rejected)

**Details Grid**

- Cuisine type
- Restaurant type (Food/Drink)
- Budget range
- Sides/Location

**Full Details**

- Location address
- Payment methods accepted
- Full description/recommendation
- Contact information
- Submitted by (username)
- Submission date/time

**Images Section**

- **Profile Image** - Large preview of main restaurant photo
- **Menu Images** - Gallery grid of additional photos (2-3 columns)
- Images display in original quality
- Click image to zoom (in future version)

### How to Use

1. Click View button → Modal opens
2. Scroll to see all details
3. View images for context
4. Read recommendation/description
5. Click X or outside to close
6. Decide on approval/rejection

### Tips

- Always view images to verify legitimacy
- Read description for quality insights
- Check contact info validity
- Multiple menu images show quality/variety
- Use this for informed approval decisions

---

## 📱 Mobile View

### Responsiveness

- **Sidebar**: Collapses to icon-only on mobile
- **Hamburger Menu**: Click to expand sidebar
- **Charts**: Auto-scale to fit screen
- **Tables**: Scroll horizontally if needed
- **Modal**: Full screen on mobile

### Touch Friendly

- Large tap targets (buttons)
- Easy scrolling
- Readable text sizes
- Intuitive navigation

### Best Experience

- Use on tablet or desktop for full functionality
- Mobile view works but prefer larger screens
- Landscape mode on mobile for better tables

---

## 🎨 Color Scheme & Icons

### Status Colors

- **Yellow** - Pending/Attention needed
- **Green** - Approved/Success
- **Red** - Rejected/Error
- **Orange** - Unread/New
- **Gray** - Read/Processed

### Icons Used

- **Chart** - Overview/Analytics
- **Clock** - Requests/Time
- **Message** - Messages/Communication
- **Eye** - View/Inspect
- **Menu** - Hamburger/Navigation
- **Log Out** - Logout/Exit

### Theme

- Dark forest green sidebar
- Light background content
- Professional corporate colors
- Good contrast for accessibility

---

## 🐛 Troubleshooting

### Image Upload Issues

**"Invalid file type"**

- Ensure file is an actual image (JPEG, PNG, GIF, WebP)
- Not text files, PDFs, or documents

**"File size exceeds limit"**

- Use smaller images (under 5MB)
- Compress in image editor if needed
- Use online image compressor tools

**"Maximum 5 images"**

- Remove some images first
- Try adding fewer images

**Images not showing after upload**

- Refresh page
- Check browser console for errors
- Ensure browser supports Base64 images

### Admin Dashboard Issues

**"No data loading"**

- Check internet connection
- Verify API is running
- Clear browser cache

**Charts not appearing**

- Ensure data exists in system
- May need sample data to display
- Try refreshing page

**Cannot click buttons**

- Some actions only available for pending requests
- Approved/Rejected requests cannot be changed
- Check button color (green=available)

**Sidebar stuck closed**

- Click hamburger menu to toggle
- On mobile, try refresh
- Check CSS loading

**Modal won't close**

- Click X button in top-right
- Click outside the modal area
- Press Escape key

---

## 📞 Support

### Common Questions

**Q: Can I edit an image after uploading?**
A: Yes, click the X button to remove and upload a different image.

**Q: Can I undo an approval/rejection?**
A: Not in current version. Be careful with actions. Future version may add undo.

**Q: What happens to images after approval?**
A: Images are stored with the restaurant request. Backend processes them.

**Q: Can users edit submitted requests?**
A: No, only admins can approve/reject. Users cannot edit after submission.

**Q: How many admin users can access the dashboard?**
A: All users with "admin" role can access. Configure in backend.

**Q: Are there file size limits on the server?**
A: Server should match frontend (5MB). Configure in backend settings.

---

## 🔒 Security Notes

- Images stored as Base64 (no separate files)
- Validation occurs on client and server
- Only admin users can access dashboard
- Authentication required (JWT token)
- Logged actions for audit trail (future)

---

## 📈 Performance

- Charts load efficiently
- Images lazy-load in modal
- Tables paginate for large datasets
- Sidebar toggle smooth and responsive
- No performance issues with 100+ requests

---

## 🔮 Future Enhancements

Planned features for next version:

1. Image compression/optimization
2. Bulk actions on requests
3. Advanced filtering and search
4. CSV export functionality
5. User analytics
6. Real-time notifications
7. Undo/Redo for admin actions
8. Image zoom in modal

---

## 📚 Full Documentation

For complete technical details, see:

- [API Documentation](API_DOCUMENTATION.md)
- [Component Reference](COMPONENT_REFERENCE.md)
- [Implementation Summary](ADMIN_DASHBOARD_COMPLETION.md)
- [Implementation Summary v2](IMPLEMENTATION_SUMMARY_v2.md)

---

**Last Updated:** January 20, 2026  
**Version:** 2.1  
**Status:** Ready for Production

**Questions?** Check documentation above or contact development team.
