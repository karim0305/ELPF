"use client"

import { TopNav } from "@/components/top-nav"
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { BarChart2, PencilLine, MapPin, Check, FileText, BarChart } from "lucide-react"

const userNav = [
  { label: "Dashboard", href: "/dashboard/user", icon: <BarChart2 /> },
  { label: "Registration", href: "/dashboard/user/registration", icon: <PencilLine /> },
  { label: "Arrival", href: "/dashboard/user/arrival", icon: <MapPin /> },
  { label: "Verification", href: "/dashboard/user/verification", icon: <Check /> },
  { label: "Reports", href: "/dashboard/user/reports", icon: <FileText /> },
  { label: "Graph", href: "/dashboard/user/graph", icon: <BarChart /> },
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
