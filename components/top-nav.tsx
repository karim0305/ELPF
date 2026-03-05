"use client"

import { cn } from "@/lib/utils"
import { logoutUser } from "@/redux/slices/userSlice"
import { RootState } from "@/redux/store"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import logos from "@/src/logo5.png"
import Image from "next/image"
import { Bell, LogOut } from "lucide-react"

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
    const user = useSelector((state: RootState) => state.users.currentUser);
    const dispatch = useDispatch();
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
   const [userName, setUserName] = useState("");
 const [millName, setMillName] = useState("");
 const [logo , setLogo] = useState("");
 const [millid, setMillid] = useState("");
 
  useEffect(() => {
      if (user) {
        const userName = user.name || "User";
        const millName = user.millid?.millname || "Mill";
        const millid = user.millid?._id || "";
        const logo = user.millid?.profilePicture || "";

        setUserName(userName);
        setMillName(millName);
        setMillid(millid);
        setLogo(logo);
        console.log("Current User in AdminLayout:", user);
        console.log("User Name:", userName);
        console.log("Mill Name:", millName);
        console.log("Mill ID:", millid);
      }
     
  
    }, [user]);


const handleLogout = () => {
  // 1️⃣ Remove cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

  // 2️⃣ Clear redux state
  dispatch(logoutUser());

  // 3️⃣ Clear session storage (optional)
  sessionStorage.clear();

  // 4️⃣ Redirect to login
  router.replace("/");
};


  return (
    <nav className="bg-card border-b border-border/50 sticky top-0 z-50">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Left: Logo and Company Name */}
        <div className="flex items-center gap-2 min-w-fit">
              <Image src={logos} alt="Logo" width={150} height={150} />
          <div>
            
            <p className="text-xs text-muted-foreground mt-2">Sugar Cane Loading</p>
          </div>
        </div>

         <div className="flex items-center gap-2 min-w-fit">
          <span className="text-2xl font-bold text-primary">{logo && <img src={logo} alt="Logo" className="h-8 w-8 rounded-full" />}</span>
          <div>
            <h1 className="text-lg font-bold text-foreground">{millName}</h1>
            <p className="text-xs text-muted-foreground -mt-1">{userName}</p>
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
            <span className="text-3xl"><Bell /></span>
            <span>Notification</span>
            <span className="absolute top-0 right-0 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              100
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors ml-2 border-l border-border/50 pl-6"
          >
            <span className="text-3xl"><LogOut /></span>
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
            <span className="text-2xl"><Bell /></span>
            <span>Notification</span>
            <span className="absolute top-1 right-4 bg-destructive text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              100
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <span className="text-2xl"><LogOut /></span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  )
}
