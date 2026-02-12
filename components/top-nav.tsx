"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

interface NavItem {
  label: string
  href: string
  icon: string
}

interface TopNavProps {
  items: NavItem[]
  userRole: string
}

export function TopNav({ items, userRole }: TopNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

 const handleLogout = () => {
  // ✅ Remove specific items
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  // ✅ OR clear everything (if safe)
  // localStorage.clear()

  // Optional: clear sessionStorage too
  sessionStorage.clear()

  // Redirect to login
  router.push("/")
}


  return (
    <nav className="bg-card border-b border-border/50 sticky top-0 z-50">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left: Logo and Company Name */}
        <div className="flex items-center gap-2 min-w-fit">
          <span className="text-2xl font-bold text-primary">🌱</span>
          <div>
            <h1 className="text-lg font-bold text-foreground">SCLS</h1>
            <p className="text-xs text-muted-foreground -mt-1">Sugar Cane Loading</p>
          </div>
        </div>

        {/* Right: Navigation Items */}
        <div className="hidden md:flex items-center gap-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
                )}
              >
                <span className="text-3xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}

          <button className="relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-colors ml-2">
            <span className="text-3xl">🔔</span>
            <span>Notification</span>
            <span className="absolute top-0 right-0 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              100
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-2 border-l border-border/50 pl-6"
          >
            <span className="text-3xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground hover:text-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border/50 p-4 space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
          <button className="w-full relative flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/10 hover:text-secondary transition-colors">
            <span className="text-2xl">🔔</span>
            <span>Notification</span>
            <span className="absolute top-1 right-4 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              100
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <span className="text-2xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  )
}
