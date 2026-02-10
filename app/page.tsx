"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userRole, setUserRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !userRole) return

    setIsLoading(true)
    // Simulate login delay
    setTimeout(() => {
      switch (userRole) {
        case "super-admin":
          router.push("/dashboard/super-admin")
          break
        case "admin":
          router.push("/dashboard/admin")
          break
        case "user":
          router.push("/dashboard/user")
          break
        default:
          setIsLoading(false)
      }
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-lg mb-4">
            <h1 className="text-3xl font-bold text-primary">🌱</h1>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Sugar Cane Loading System</h1>
          <p className="text-sm text-muted-foreground">Electronic Loading Point Management Platform</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 bg-card shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input border-border/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">User Role</label>
                <Select value={userRole} onValueChange={setUserRole}>
                  <SelectTrigger className="bg-input border-border/50">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super-admin">Super Administrator</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input border-border/50"
                  required
                />
              </div>

              {/* Sign In Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-secondary">Demo Login:</span> Use any email and password with a selected
            role to explore the system.
          </p>
        </div>
      </div>
    </div>
  )
}
