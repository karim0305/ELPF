"use client"
import { addMillInfo } from "@/app/api/fapi"
import { Mill } from "@/app/dashboard/super-admin/mills/page"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"

export interface MillFormData {
  millcode: string
  millname: string
  focalperson: string
  cnic: string
  phone: string
  address?: string
  email: string
  role?: string
  status: "Active" | "Inactive" | "Suspended"
  password?: string
}

interface MillFormModalProps {
  initialData?: Mill
  onSubmit: (data: MillFormData) => void
  onClose: () => void
}

export function MillFormModal({ initialData, onSubmit, onClose }: MillFormModalProps) {
  const form = useForm<MillFormData>({
    defaultValues: initialData
      ? {
          millcode: initialData.millcode,
          millname: initialData.millname,
          focalperson: initialData.focalperson,
          cnic: initialData.cnic,
          phone: initialData.phone,
          address: initialData.address,
          email: initialData.email,
          role: initialData.role,
          status: initialData.status || "Active",
          password: "",
        }
      : {
          millcode: "",
          millname: "",
          focalperson: "",
          cnic: "",
          phone: "",
          address: "",
          email: "",
          role: "",
          status: "Active",
          password: "",
        },
  })

  const handleSubmit = async (data: MillFormData) => {
    // Only send password if user provided it
    const payload = { ...data }
    if (!payload.password) delete payload.password

    await addMillInfo(payload)
    onSubmit(payload)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {/* Mill Name */}
        <FormField
          control={form.control}
          name="millname"
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

        {/* Focal Person */}
        <FormField
          control={form.control}
          name="focalperson"
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

        {/* CNIC */}
        <FormField
          control={form.control}
          name="cnic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNIC</FormLabel>
              <FormControl>
                <Input placeholder="Enter CNIC" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="+92 300 1234567" type="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input placeholder="Enter role" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
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

        {/* Status */}
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
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
