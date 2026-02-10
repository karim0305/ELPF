"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

interface MillFormData {
  millName: string
  focalPerson: string
  contact: string
  address: string
  username: string
  password: string
  status: "active" | "inactive" | "suspended"
}

interface MillFormModalProps {
  initialData?: {
    millName: string
    focalPerson: string
    contact: string
    address: string
    username: string
    status: "active" | "inactive" | "suspended"
  }
  onSubmit: (data: Omit<MillFormData, "password"> | MillFormData) => void
  onClose: () => void
}

export function MillFormModal({ initialData, onSubmit, onClose }: MillFormModalProps) {
  const form = useForm<MillFormData>({
    defaultValues: initialData
      ? { ...initialData, password: "" }
      : {
          millName: "",
          focalPerson: "",
          contact: "",
          address: "",
          username: "",
          password: "",
          status: "active",
        },
  })

  const handleSubmit = (data: MillFormData) => {
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
        {/* Mill Name Field */}
        <FormField
          control={form.control}
          name="millName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mill Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter mill name" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Focal Person Field */}
        <FormField
          control={form.control}
          name="focalPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focal Person</FormLabel>
              <FormControl>
                <Input placeholder="Enter focal person name" type="text" {...field} />
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
                <Input placeholder="e.g., +91 98765 43210" type="tel" {...field} />
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
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex gap-2 pt-4">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">
            {initialData ? "Update Mill" : "Register Mill"}
          </Button>
          <Button type="button" variant="outline" className="border-border/50 bg-transparent flex-1" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
