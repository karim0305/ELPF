// components/AdminLayout.tsx
"use client"

import { ReactNode } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Factory, Users, Laptop, Settings, Check, Map } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
  username?: string
  millName?: string
}

const adminNav = [
  { label: "Dashboard", href: "/dashboard/admin", icon: <Factory /> },
  {
    label: "Manage",
    icon: <Settings />,
    children: [
      { label: "Manage User", href: "/dashboard/admin/manage/users", icon: <Users /> },
      { label: "Manage LP", href: "/dashboard/admin/manage/loading-points", icon: <Map /> },
      { label: "Manage Devices", href: "/dashboard/admin/manage/devices", icon: <Laptop /> },
    ],
  },
  { label: "Approve", href: "/dashboard/admin/approvals", icon: <Check /> },
]

export function AdminLayout({ children, username, millName }: AdminLayoutProps) {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav title="admin" items={adminNav} userRole="admin" />
     <div className="flex-1 flex flex-col overflow-hidden">
  {/* Optional Top Bar */}
  {username && (
    <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{millName}</h1>
      </div>

      {/* Right: User Greeting */}
      <div className="text-foreground font-medium">
        Welcome, {username}{/* Replace username with your dynamic value */}
      </div>
    </div>
  )}
 
  {/* Main Content */}
  <div className="flex-1 overflow-auto p-8">{children}</div>
</div>

    </div>
  )
}
