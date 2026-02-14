"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { login } from "@/app/api/fapi" // adjust path
import { useToast } from "@/hooks/use-toast"
import { useDispatch } from "react-redux"
import { setCurrentUser, setLoading } from "@/redux/slices/userSlice"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please enter both email and password.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      dispatch(setLoading(true));
      const response = await login({ email, password });
      const { access_token, user } = response.data;
         if (access_token) {
            // ✅ Save to Redux
      dispatch(
        setCurrentUser({
          user: {
            _id: user._id,
            millid: user.millid ?? null, 
            name: user.name,
            email: user.email,
            phone: user.phone,
            cnic: user.cnic,
            address: user.address,
            role: user.role,
            image: user.image,
            lastLogin: user.lastLogin,
            status: user.status,
            otp: user.otp,
            otpExpiresAt: user.otpExpiresAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
          token: access_token,
        })
      );

         }
console.log("User Name:", user.name);
console.log("Mill Name:", user.millid?.millname);
      toast({
        title: "Login Successful",
        description: `Welcome, ${user.name || user.email}!`,
        variant: "default",
      })
      switch (user.role) {
        case "SuperAdmin":
          router.push("/dashboard/super-admin")
          break
        case "Admin":
          router.push("/dashboard/admin")
          break
        case "User":
          router.push("/dashboard/user")
          break
        default:
          router.push("/")
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data || error.message)
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message || "Login failed.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
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
              {/* <div className="text-center">
                <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                  Forgot your password?
                </a>
              </div> */}
            </form>
          </CardContent>
        </Card>

        {/* Demo Info */}
        {/* <div className="mt-6 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-secondary">Demo Login:</span> Use any email and password with a selected
            role to explore the system.
          </p>
        </div> */}
      </div>
    </div>
  )
}
