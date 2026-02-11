# Super Admin Users Management Setup Guide

## Overview
The Super Admin Users Management system has been fully updated with the following features:
- Complete API integration for CRUD operations
- Cloudinary image upload with avatar display
- Form validation using Zod
- Real-time notifications using Sonner
- Enhanced user avatar in tables
- Full error handling and loading states

## Prerequisites
- Cloudinary account (free tier available at https://cloudinary.com)
- Node.js and npm/pnpm installed
- Existing API endpoints working at `http://localhost:3010/elpapi`

## Setup Instructions

### 1. Cloudinary Configuration

#### Create Cloudinary Account
1. Go to https://cloudinary.com and create a free account
2. Navigate to your Dashboard
3. Copy your **Cloud Name**

#### Create Unsigned Upload Preset
1. In Cloudinary Dashboard, go to **Settings >> Upload**
2. Scroll to "Upload presets"
3. Click **"Add upload preset"**
4. Set the following:
   - **Preset Name**: `elpf-uploads` (or any name you prefer)
   - **Unsigned**: Toggle to ON (important for client-side uploads)
   - **Folder**: `elp-super-admin` (optional but recommended)
5. Click **Save**
6. Copy the preset name

#### Update Environment Variables
Update your `.env.local` file:

```env
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_PRESET=your_upload_preset_here
```

Example:
```env
NEXT_PUBLIC_CLOUDINARY_NAME=dxyz12345
NEXT_PUBLIC_CLOUDINARY_PRESET=elpf-uploads
```

### 2. API Integration

The system uses the following API endpoints:

- `GET /super-admin` - Fetch all super admins
- `POST /super-admin` - Create new super admin
- `PATCH /super-admin/:id` - Update super admin
- `DELETE /super-admin/:id` - Delete super admin

These are imported from `@/app/api/fapi.ts`.

### 3. Component Updates

#### UserFormModal (`components/user-form-modal.tsx`)
**Features:**
- ✅ Image upload with Cloudinary integration
- ✅ Avatar preview with initials fallback
- ✅ Zod validation schema
- ✅ All required fields: name, email, phone, CNIC, address, role, status
- ✅ Loading states during submission
- ✅ Optional password field for edit mode

**Usage:**
```tsx
<UserFormModal
  initialData={user} // For edit mode, omit for create
  onSubmit={handleSubmit} // Async function
  onClose={handleClose}
  isLoading={loading}
/>
```

#### Users Page (`app/dashboard/super-admin/users/page.tsx`)
**Features:**
- ✅ Full CRUD operations with API integration
- ✅ Avatar display in table
- ✅ Real-time notifications (Sonner)
- ✅ Loading and error states
- ✅ Confirmation dialog for delete
- ✅ KPI cards showing user statistics

**Handlers:**
- `fetchSuperAdmins()` - Fetches users from API on mount
- `handleCreateUser()` - Creates new user via API
- `handleUpdateUser()` - Updates user via API
- `handleDeleteUser()` - Deletes user via API

## File Structure

```
components/
├── user-form-modal.tsx          # Updated with validation & image upload
└── ui/
    └── avatar.tsx               # Avatar component for display

app/
├── api/
│   └── fapi.ts                  # API functions
└── dashboard/
    └── super-admin/
        └── users/
            └── page.tsx         # Updated with full API integration

lib/
├── cloudinary.ts                # Cloudinary utility functions
└── utils.ts                     # General utilities

.env.local                        # Environment configuration (ADD THIS)
```

## Form Fields

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| Name | Text | Min 2 characters | ✓ |
| Email | Email | Valid email format | ✓ |
| Phone | Tel | Min 10 characters | ✓ |
| CNIC | Text | Min 13 characters | ✓ |
| Address | Text | Min 5 characters | ✓ |
| Image | File | JPG, PNG, WebP, GIF (Max 5MB) | ✗ |
| Role | Select | SuperAdmin or Admin | ✓ |
| Password | Password | Optional for edit | ✓* |
| Status | Select | Active or Inactive | ✓ |

*Required for creation, optional for updates

## Image Upload

### Features
- **Format**: Supports JPG, PNG, WebP, GIF
- **Max Size**: 5MB
- **Storage**: Cloudinary (free tier includes 25GB)
- **URL**: Securely stored image URL in database
- **Preview**: Real-time avatar preview before submission

### How It Works
1. User selects image file in form
2. Image is uploaded to Cloudinary immediately
3. URL is stored in form state
4. URL is sent to backend when form is submitted
5. Avatar displays in table using `<Avatar>` component

## Error Handling

The application includes:
- ✅ Try-catch blocks in all API calls
- ✅ User-friendly error notifications via Sonner toast
- ✅ Loading states to prevent duplicate submissions
- ✅ Disabled buttons during operations
- ✅ Console error logging for debugging

## Notifications

Using **Sonner** for toasts:
```tsx
toast.success("User created successfully!")
toast.error("Failed to create user")
```

Add `<Toaster />` to your root layout to display toasts (usually already in next.js setup).

## Testing Checklist

- [ ] Cloudinary configuration is set in .env.local
- [ ] Can create a new user with image
- [ ] Avatar displays correctly in table
- [ ] Can edit existing user
- [ ] Can delete user with confirmation
- [ ] Error messages display on API failure
- [ ] Loading states work during submissions
- [ ] Form validation prevents invalid submissions

## Common Issues & Solutions

### Issue: Image upload fails
**Solution**: Check Cloudinary credentials in `.env.local`

### Issue: Toasts not showing
**Solution**: Ensure `<Toaster />` is added to app layout

### Issue: API calls fail
**Solution**: Verify backend is running at `http://localhost:3010/elpapi`

### Issue: Avatar not showing
**Solution**: Check if image URL is valid by opening in browser

## Database Fields

When creating/updating users, ensure your backend accepts:

```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "cnic": "string",
  "address": "string",
  "image": "string (URL)",
  "role": "SuperAdmin | Admin",
  "status": "Active | Inactive",
  "password": "string (hashed)"
}
```

## Performance Tips

1. **Image Optimization**: Cloudinary automatically optimizes images
2. **Caching**: API responses are fresh on each mount
3. **Validation**: Client-side validation reduces API calls
4. **Loading States**: Prevent duplicate submissions

## Security Notes

- ✅ Cloudinary uses HTTPS for secure uploads
- ✅ Upload preset is unsigned but folder-restricted
- ✅ Passwords should be hashed on backend
- ✅ Validate all inputs on server side

## Next Steps

1. Set up Cloudinary account and credentials
2. Update `.env.local` with your credentials
3. Verify backend API is running
4. Test the complete flow with a test user
5. Monitor console for any errors during operations

## Support

For issues:
1. Check browser console for error messages
2. Check network tab in DevTools for API responses
3. Verify `.env.local` variables are correctly set
4. Check Cloudinary dashboard for upload history
