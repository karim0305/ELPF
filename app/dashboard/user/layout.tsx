"use client"

import { TopNav } from "@/components/top-nav"
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

const userNav = [
  { label: "Dashboard", href: "/dashboard/user", icon: "📊" },
  { label: "Registration", href: "/dashboard/user/registration", icon: "📝" },
  { label: "Arrival", href: "/dashboard/user/arrival", icon: "📍" },
  { label: "Verification", href: "/dashboard/user/verification", icon: "✓" },
  { label: "Reports", href: "/dashboard/user/reports", icon: "📈" },
  { label: "Graph", href: "/dashboard/user/graph", icon: "📊" },
]

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
      const user = useSelector((state: RootState) => state.users.currentUser);
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <TopNav items={userNav} userRole="user" />
      <div className="flex-1">{children}</div>
    </div>
  )
}
