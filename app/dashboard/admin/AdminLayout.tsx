"use client"

import { ReactNode, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Factory, Users, Laptop, Settings, Check, Map } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: ReactNode
  username?: string
  millName?: string
  logo?: string
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
  {
    label: "Reports",
    icon: <Settings />,
    children: [
      { label: "Overall Reports", href: "/dashboard/admin/reports", icon: <Check /> },
    ],
  },
]

export function AdminLayout({ children, username, millName, logo }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex bg-background min-h-screen">

      {/* Sidebar for Desktop + Mobile */}
      <SidebarNav
        title="admin"
        items={adminNav}
        userRole="admin"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
<div className="flex-1 flex flex-col overflow-hidden ml-0 sm:ml-64 transition-all">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-4 sm:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Logo */}
            {logo && <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />}
            {/* Mill Name */}
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{millName}</h1>
          </div>

          {/* User Greeting */}
          <div className="text-foreground font-medium text-sm sm:text-base mt-1 sm:mt-0">
            Welcome, {username}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="sm:hidden absolute top-4 right-4 text-2xl font-bold text-foreground"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">{children}</div>
      </div>
    </div>
  )
}