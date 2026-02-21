"use client"

import { ReactNode } from "react"
import { SidebarNav } from "@/components/sidebar-nav"

interface SuperAdminLayoutProps {
  children: ReactNode
  username?: string
  title?: string
}

const superAdminNav = [
  { label: "All Mills", href: "/dashboard/super-admin/mills", icon: "🏭" },
  { label: "All Users", href: "/dashboard/super-admin/users", icon: "👥" },
  { label: "Manage Haulage", href: "/dashboard/super-admin/haulage", icon: "🚚" },
]

export function SuperAdminLayout({ children, username, title }: SuperAdminLayoutProps) {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav
        title="Super Admin"
        items={superAdminNav}
        userRole="super-admin"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        {(username || title) && (
          <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
            {/* Left: Page Title */}
            <div>
              {title && <h1 className="text-2xl font-bold text-foreground">{title}</h1>}
            </div>

            {/* Right: User Greeting */}
            {username && (
              <div className="text-foreground font-medium">
                Welcome, {username}
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
