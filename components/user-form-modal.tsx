"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"

export interface MillFormData {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  image?: string;
  status: "Active" | "Inactive";
  password?: string;
  role: "SuperAdmin" | "Admin";
}

interface SuperAdmin {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  image: string;
  status: "Active" | "Inactive";
  password: string;
  role: "SuperAdmin" | "Admin";
  createdAt: string;
}

interface CreateUserData {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  image: string;
  role: "SuperAdmin" | "Admin";
  status: "Active" | "Inactive";
  password: string;
}

interface UpdateUserData {
  name: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  image: string;
  role: "SuperAdmin" | "Admin" | "User";
  status: "Active" | "Inactive";
  password?: string;
}

interface UserFormModalProps {
  initialData?: SuperAdmin
  onSubmit: (data: CreateUserData | UpdateUserData) => void | Promise<void>
  onClose: () => void
  isLoading?: boolean
}

export function UserFormModal({ initialData, onSubmit, onClose, isLoading = false }: UserFormModalProps) {
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(initialData?.image || "")

  const form = useForm<MillFormData>({
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          cnic: initialData.cnic || "",
          address: initialData.address || "",
          image: initialData.image || "",
          role: initialData.role || "Admin",
          password: "",
          status: initialData.status || "Active",
        }
      : {
          name: "",
          email: "",
          phone: "",
          cnic: "",
          address: "",
          image: "",
          role: "Admin",
          password: "",
          status: "Active",
        },
  })

  // Cloudinary config - hardcoded
  const CLOUDINARY_UPLOAD_PRESET = 'tailorImages'
  const CLOUDINARY_CLOUD_NAME = 'dzfqgziwl'
  const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

  const uploadToCloudinary = async (file: File) => {
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const res = await fetch(CLOUDINARY_API, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      return data.secure_url || data.url
    } catch (err) {
      console.error('Cloudinary upload failed', err)
      return null
    }
  }

  const handleSubmit = async (data: MillFormData) => {
    try {
      const payload = { ...data }
      if (!payload.password) delete payload.password

      // If a new file was selected, upload it first and attach URL
      if (selectedFile) {
        const url = await uploadToCloudinary(selectedFile)
        if (url) payload.image = url
      }

      // If editing, and no new file selected, keep existing image value
      if (!payload.image && initialData?.image) {
        payload.image = initialData.image
      }

      if (initialData) {
        // For update: password is optional
        const submitData: UpdateUserData = {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          cnic: payload.cnic,
          address: payload.address,
          image: payload.image || "",
          role: payload.role,
          status: payload.status,
        }
        if (payload.password) {
          submitData.password = payload.password
        }
        await onSubmit(submitData)
      } else {
        // For create: password is required
        const submitData: CreateUserData = {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          cnic: payload.cnic,
          address: payload.address,
          image: payload.image || "",
          role: payload.role,
          status: payload.status,
          password: payload.password || "",
        }
        await onSubmit(submitData)
      }
    } catch (error) {
      console.error("Form submission error:", error)
      toast({ title: 'Error', description: 'Failed to submit form', variant: 'destructive' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Profile picture upload */}
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm text-muted-foreground">No Image</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <FormLabel>Profile Picture</FormLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setSelectedFile(f)
                if (f) setPreview(URL.createObjectURL(f))
              }}
              disabled={isLoading}
              className="text-sm"
            />
            {preview && (
              <button
                type="button"
                className="text-sm text-destructive"
                onClick={() => {
                  setSelectedFile(null)
                  setPreview("")
                }}
                disabled={isLoading}
              >
                Remove
              </button>
            )}
            <p className="text-xs text-muted-foreground">JPG, PNG or GIF (max 5MB)</p>
          </div>
        </div>

        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name *</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" type="text" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., john@example.com" type="email" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Field */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1 (555) 123-4567" type="tel" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CNIC Field */}
        <FormField
          control={form.control}
          name="cnic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNIC *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 12345-1234567-1" type="text" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address Field */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Input placeholder="Enter full address" type="text" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role Field */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{initialData ? "Password (Leave blank to keep current)" : "Password *"}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder={initialData ? "Leave blank to keep current password" : "Enter a secure password"}
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                {initialData ? "Leave blank to keep the current password" : "Minimum 8 characters recommended"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status Field */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                <FormControl>
                  <SelectTrigger disabled={isLoading}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-2 pt-4">
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : initialData ? "Update User" : "Create User"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="border-border/50 bg-transparent flex-1" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
