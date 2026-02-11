"use client"

import { addMillInfo, updateMillInfo } from "@/app/api/fapi"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Mill } from "@/app/dashboard/super-admin/mills/page"

export interface MillFormData {
  millcode: string
  millname: string
  focalperson: string
  cnic: string
  phone: string
  address?: string
  email: string
  profilePicture?: string
  status: "Active" | "Inactive" | "Suspended"
  password?: string
}



interface MillFormModalProps {
  initialData?: Mill | null
  onClose: () => void
  onSuccess: () => void
}

export function MillFormModal({ initialData, onClose, onSuccess }: MillFormModalProps) {
  const { toast } = useToast()
  const form = useForm<MillFormData>({
    defaultValues: {
      millcode: initialData?.millcode || "",
      millname: initialData?.millname || "",
      focalperson: initialData?.focalperson || "",
      cnic: initialData?.cnic || "",
      phone: initialData?.phone || "",
      address: initialData?.address || "",
      email: initialData?.email || "",
    
      profilePicture: initialData?.profilePicture || "",
      status: initialData?.status || "Active",
      password: "",
    },
  })

  // Cloudinary config
  const CLOUDINARY_UPLOAD_PRESET = 'tailorImages'
  const CLOUDINARY_CLOUD_NAME = 'dzfqgziwl'
  const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(initialData?.profilePicture || "")

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
        if (url) payload.profilePicture = url
      }

      // If editing, and no new file selected, keep existing profilePicture value
      if (!payload.profilePicture && initialData?.profilePicture) {
        payload.profilePicture = initialData.profilePicture
      }

      if (initialData && initialData._id) {
        await updateMillInfo(initialData._id, payload)
        toast({ title: 'Updated', description: 'Mill information updated successfully.' })
      } else {
        await addMillInfo(payload)
        toast({ title: 'Created', description: 'Mill registered successfully.' })
      }

      form.reset()
      setSelectedFile(null)
      setPreview("")
      onSuccess() // refresh parent + close modal
    } catch (error: any) {
      console.error("Failed to add mill", error)
      const message = error?.response?.data?.message || error?.message || 'Something went wrong'
      toast({ title: 'Error', description: String(message), variant: 'destructive' })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Profile picture upload */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full overflow-hidden bg-muted flex items-center justify-center">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm text-muted-foreground">No Image</span>
            )}
          </div>
          <div className="flex flex-col">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0] || null
                setSelectedFile(f)
                if (f) setPreview(URL.createObjectURL(f))
              }}
            />
            {preview && (
              <button
                type="button"
                className="text-sm text-destructive mt-2"
                onClick={() => {
                  setSelectedFile(null)
                  setPreview("")
                }}
              >
                Remove
              </button>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="millname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mill Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter mill name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="millcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mill Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter mill code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="focalperson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focal Person</FormLabel>
              <FormControl>
                <Input placeholder="Enter focal person" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cnic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNIC</FormLabel>
              <FormControl>
                <Input placeholder="Enter CNIC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+92 300 1234567" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter password" {...field} />
              </FormControl>
              <FormDescription>Minimum 8 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 pt-4">
          <Button type="submit" className="flex-1">
            {initialData ? "Save Changes" : "Register Mill"}
          </Button>
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
