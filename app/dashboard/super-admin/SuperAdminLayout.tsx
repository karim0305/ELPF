"use client"

import { ReactNode, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Factory, Users, Truck, Menu } from "lucide-react"

interface SuperAdminLayoutProps {
  children: ReactNode
  username?: string
  title?: string
}

const superAdminNav = [
  { label: "All Mills", href: "/dashboard/super-admin/mills", icon: <Factory /> },
  { label: "All Users", href: "/dashboard/super-admin/users", icon: <Users /> },
  { label: "Manage Haulage", href: "/dashboard/super-admin/haulage", icon: <Truck /> },
]

export function SuperAdminLayout({ children, username, title }: SuperAdminLayoutProps) {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex bg-background min-h-screen">

      <SidebarNav
        title="Super Admin"
        items={superAdminNav}
        userRole="super-admin"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden sm:ml-64">

        {/* Top Bar */}
        {(username || title) && (
          <div className="bg-card border-b border-border/50 px-4 sm:px-8 py-4 flex justify-between items-center">

            <div className="flex items-center gap-3">

              {/* Mobile Hamburger */}
              <button
                className="sm:hidden"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {title && (
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {title}
                </h1>
              )}
            </div>

            {username && (
              <div className="text-foreground font-medium text-sm sm:text-base">
                Welcome, {username}
              </div>
            )}

          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          {children}
        </div>

      </div>
    </div>
  )
}