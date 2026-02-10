"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

interface UserFormData {
  name: string
  contact: string
  address: string
  role: "SuperAdmin" | "Admin" | "User"
  username: string
  password: string
  status: "active" | "inactive"
}

interface UserFormModalProps {
  initialData?: {
    name: string
    contact: string
    address: string
    role: "SuperAdmin" | "Admin" | "User"
    username: string
    status: "active" | "inactive"
  }
  onSubmit: (data: Omit<UserFormData, "password"> | UserFormData) => void
  onClose: () => void
}

export function UserFormModal({ initialData, onSubmit, onClose }: UserFormModalProps) {
  const form = useForm<UserFormData>({
    defaultValues: initialData
      ? { ...initialData, password: "" }
      : {
          name: "",
          contact: "",
          address: "",
          role: "User",
          username: "",
          password: "",
          status: "active",
        },
  })

  const handleSubmit = (data: UserFormData) => {
    if (initialData) {
      const { password, ...restData } = data
      onSubmit(restData)
    } else {
      onSubmit(data)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter full name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Contact Field */}
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., +1 (555) 123-4567" type="tel" {...field} />
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
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter full address" type="text" {...field} />
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
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
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

        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" type="text" {...field} />
              </FormControl>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder={initialData ? "Leave blank to keep current password" : "Enter password"}
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {initialData ? "Leave blank to keep the current password" : "Minimum 8 characters"}
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
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">
            {initialData ? "Update User" : "Create User"}
          </Button>
          <Button type="button" variant="outline" className="border-border/50 bg-transparent flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
