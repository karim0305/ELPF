"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

interface NavItem {
  label: string
  href?: string
  icon: string
  children?: NavItem[]
}

interface SidebarNavProps {
  items: NavItem[]
  title: string
  userRole: string
}

export function SidebarNav({ items, title, userRole }: SidebarNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => (prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]))
  }

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="w-64 bg-card border-r border-border/50 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <h1 className="text-2xl font-bold text-primary">🌱 SCLS</h1>
        <p className="text-xs text-muted-foreground mt-1">Sugar Cane Loading System</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const isExpanded = expandedItems.includes(item.label)
          const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false
          const hasChildren = item.children && item.children.length > 0

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpand(item.label)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isExpanded
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <span className="text-xs">{isExpanded ? "▼" : "▶"}</span>
                </button>
              ) : (
                <Link
                  href={item.href!}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
                  )}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )}

              {/* Submenu */}
              {hasChildren && isExpanded && (
                <div className="space-y-1 mt-2">
                  {item.children.map((child) => {
                    const isChildActive =
                      child.href && (pathname === child.href || pathname.startsWith(child.href + "/"))
                    return (
                      <Link
                        key={child.href}
                        href={child.href!}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-6",
                          isChildActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-secondary/10 hover:text-secondary",
                        )}
                      >
                        <span className="text-lg w-6">{child.icon}</span>
                        <span>{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
