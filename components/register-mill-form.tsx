"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RegisterMillFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface MillFormData {
  millName: string
  focalPerson: string
  personContact: string
  email: string
  username: string
  password: string
  status: string
}

export function RegisterMillForm({ open, onOpenChange }: RegisterMillFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<MillFormData>({
    defaultValues: {
      millName: "",
      focalPerson: "",
      personContact: "",
      email: "",
      username: "",
      password: "",
      status: "active",
    },
  })

  const onSubmit = async (data: MillFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      console.log("Mill Registration Data:", data)
      // Add your API call here
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Error registering mill:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Register New Mill</DialogTitle>
          <DialogDescription>Add a new sugar mill to the system with required information.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Mill Name */}
            <FormField
              control={form.control}
              name="millName"
              rules={{ required: "Mill name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mill Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter mill name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Focal Person */}
            <FormField
              control={form.control}
              name="focalPerson"
              rules={{ required: "Focal person name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focal Person Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter focal person's name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Person Contact */}
            <FormField
              control={form.control}
              name="personContact"
              rules={{
                required: "Contact number is required",
                pattern: {
                  value: /^[0-9+\-\s()]+$/,
                  message: "Invalid contact number",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Enter contact number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              rules={{
                required: "Username is required",
                minLength: {
                  value: 4,
                  message: "Username must be at least 4 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              rules={{ required: "Status is required" }}
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
            <div className="flex gap-3 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register Mill"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
