# Quick Reference Guide

## Environment Setup (5 minutes)

```bash
# 1. Update .env.local with Cloudinary values
NEXT_PUBLIC_CLOUDINARY_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_PRESET=your_upload_preset

# 2. Verify backend API is running
# http://localhost:3010/elpapi

# 3. Start frontend
npm run dev
```

## Component Usage

### UserFormModal
```tsx
import { UserFormModal } from "@/components/user-form-modal"

// Create mode
<UserFormModal
  onSubmit={handleCreate}
  onClose={handleClose}
/>

// Edit mode
<UserFormModal
  initialData={user}
  onSubmit={handleUpdate}
  onClose={handleClose}
  isLoading={submitting}
/>
```

### API Functions
```tsx
import { 
  getSuperAdmins,
  addSuperAdmin,
  updateSuperAdmin,
  deleteSuperAdmin 
} from "@/app/api/fapi"

// Fetch all
const response = await getSuperAdmins()

// Create
const response = await addSuperAdmin({
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  cnic: "12345-1234567-1",
  address: "123 Street",
  image: "https://cloudinary.com/...",
  role: "Admin",
  status: "Active",
  password: "securepass123"
})

// Update
const response = await updateSuperAdmin(id, updateData)

// Delete
const response = await deleteSuperAdmin(id)
```

## Form Validation

All validations happen in the `userFormSchema`:

```tsx
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  cnic: z.string().min(13, "CNIC must be at least 13 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  image: z.string().optional().default(""),
  status: z.enum(["Active", "Inactive"]),
  password: z.string().optional().default(""),
  role: z.enum(["SuperAdmin", "Admin"]),
})
```

## Image Upload

```tsx
// Automatic upload in form
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  )
  const data = await response.json()
  form.setValue("image", data.secure_url)
}
```

## Error Handling

```tsx
// All API calls wrapped in try-catch
try {
  const response = await addSuperAdmin(formData)
  toast.success("User created successfully!")
} catch (err: any) {
  const errorMessage = err.response?.data?.message || "Failed to create user"
  toast.error(errorMessage)
  console.error(err)
}
```

## Notifications

```tsx
import { toast } from "sonner"

// Success
toast.success("User created successfully!")

// Error
toast.error("Failed to create user")

// Info
toast.info("Processing your request")

// Warning
toast.warning("This action cannot be undone")
```

## Loading States

```tsx
// During form submission
const [submitting, setSubmitting] = useState(false)

// Disable buttons while submitting
<Button disabled={submitting || uploading}>
  {isLoading ? "Processing..." : "Submit"}
</Button>

// Disable form fields during API calls
<Input disabled={isLoading} />
```

## Avatar Component

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

<Avatar className="w-20 h-20">
  <AvatarImage src={user.image} alt={user.name} />
  <AvatarFallback>
    {user.name?.substring(0, 2).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

## Common Patterns

### Fetching Data on Mount
```tsx
useEffect(() => {
  fetchSuperAdmins()
}, [])

const fetchSuperAdmins = async () => {
  try {
    setLoading(true)
    const response = await getSuperAdmins()
    setUsers(response.data.data || response.data || [])
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to fetch")
  } finally {
    setLoading(false)
  }
}
```

### Creating Resource
```tsx
const handleCreate = async (formData) => {
  try {
    setSubmitting(true)
    const response = await addSuperAdmin(formData)
    setUsers([...users, response.data.data || response.data])
    setModalOpen(false)
    toast.success("Created successfully!")
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to create")
  } finally {
    setSubmitting(false)
  }
}
```

### Updating Resource
```tsx
const handleUpdate = async (formData) => {
  try {
    setSubmitting(true)
    const response = await updateSuperAdmin(userId, formData)
    setUsers(users.map(u => 
      u._id === userId ? response.data.data : u
    ))
    toast.success("Updated successfully!")
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to update")
  } finally {
    setSubmitting(false)
  }
}
```

### Deleting Resource
```tsx
const handleDelete = async (userId) => {
  try {
    setSubmitting(true)
    await deleteSuperAdmin(userId)
    setUsers(users.filter(u => u._id !== userId))
    toast.success("Deleted successfully!")
  } catch (err: any) {
    toast.error(err.response?.data?.message || "Failed to delete")
  } finally {
    setSubmitting(false)
  }
}
```

## Database Fields

Expected backend schema:
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (unique)",
  "phone": "string",
  "cnic": "string (unique)",
  "address": "string",
  "image": "string (URL)",
  "role": "SuperAdmin | Admin",
  "status": "Active | Inactive",
  "password": "string (hashed)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## Troubleshooting

### Image not uploading
- Check `.env.local` for correct Cloudinary credentials
- Verify NEXT_PUBLIC_CLOUDINARY_PRESET is set correctly
- Check browser console for upload errors
- Verify upload preset is "unsigned"

### API calls failing
- Check backend is running on http://localhost:3010
- Verify network tab in DevTools
- Check API response format matches expected
- Ensure error handling is catching exceptions

### Avatar not showing
- Check image URL is accessible
- Verify image was uploaded to Cloudinary
- Check AvatarImage src prop
- Verify AvatarFallback has initials

### Form not validating
- Check Zod schema is correct
- Verify react-hook-form is imported
- Check zodResolver is applied
- Look for form.formState.errors

### Notifications not showing
- Verify Toaster component is in layout
- Check toast import is from "sonner"
- Confirm toast() calls are correct
- Check z-index in CSS if hidden

## Performance Tips

1. **Optimize Images**: Cloudinary automatically handles this
2. **Memoize Components**: Use React.memo for list items
3. **Lazy Load**: Consider lazy loading the modal
4. **API Caching**: Cache user list if needed
5. **Validation**: Client-side prevents unnecessary API calls

## Security Notes

- ✅ Always validate on server side
- ✅ Hash passwords before storing
- ✅ Use HTTPS in production
- ✅ Validate file types on upload
- ✅ Implement rate limiting on API
- ✅ Use environment variables for secrets

## Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Zod Validation](https://zod.dev)
- [React Hook Form](https://react-hook-form.com)
- [Sonner Toasts](https://sonner.emilkowal.ski)
- [Radix UI Components](https://www.radix-ui.com)

## File Locations

| Component | Path |
|-----------|------|
| Form Modal | `components/user-form-modal.tsx` |
| Users Page | `app/dashboard/super-admin/users/page.tsx` |
| API Functions | `app/api/fapi.ts` |
| Cloudinary Utils | `lib/cloudinary.ts` |
| Avatar Component | `components/ui/avatar.tsx` |
| Environment | `.env.local` |

---

**Last Updated:** 2026-02-11
**Version:** 1.0.0
**Status:** Production Ready ✅
