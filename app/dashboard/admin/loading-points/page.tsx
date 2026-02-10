"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarNav } from "@/components/sidebar-nav"

interface LoadingPoint {
  id: string
  name: string
  location: string
  status: string
  createdDate: string
}

const adminNav = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "📊" },
  {
    label: "Manage",
    icon: "⚙️",
    children: [
      { label: "Manage User", href: "/dashboard/admin/manage/users", icon: "👥" },
      { label: "Manage LP", href: "/dashboard/admin/manage/loading-points", icon: "📍" },
      { label: "Manage Haulage", href: "/dashboard/admin/manage/haulage", icon: "🚚" },
    ],
  },
  { label: "Approve", href: "/dashboard/admin/approvals", icon: "✓" },
]

export default function LoadingPointsPage() {
  const [loadingPoints, setLoadingPoints] = useState<LoadingPoint[]>([
    { id: "LP-001", name: "North Loading Point", location: "District A", status: "active", createdDate: "2024-01-15" },
    { id: "LP-002", name: "South Loading Point", location: "District B", status: "active", createdDate: "2024-01-16" },
    { id: "LP-003", name: "East Loading Point", location: "District C", status: "inactive", createdDate: "2024-01-17" },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", location: "", status: "active" })

  const handleSave = () => {
    if (editingId) {
      setLoadingPoints(
        loadingPoints.map((lp) =>
          lp.id === editingId
            ? { ...lp, name: formData.name, location: formData.location, status: formData.status }
            : lp,
        ),
      )
    } else {
      const newId = `LP-${String(loadingPoints.length + 1).padStart(3, "0")}`
      setLoadingPoints([
        ...loadingPoints,
        {
          id: newId,
          name: formData.name,
          location: formData.location,
          status: formData.status,
          createdDate: new Date().toISOString().split("T")[0],
        },
      ])
    }
    setIsOpen(false)
    setFormData({ name: "", location: "", status: "active" })
    setEditingId(null)
  }

  const handleEdit = (lp: LoadingPoint) => {
    setFormData({ name: lp.name, location: lp.location, status: lp.status })
    setEditingId(lp.id)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setLoadingPoints(loadingPoints.filter((lp) => lp.id !== id))
  }

  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={adminNav} userRole="admin" />

      <div className="flex-1 flex flex-col overflow-hidden p-8">
        <div className="grid gap-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Loading Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{loadingPoints.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered points</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {loadingPoints.filter((lp) => lp.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Operational</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {loadingPoints.filter((lp) => lp.status === "inactive").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Not operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Loading Points Management</h2>
              <p className="text-sm text-muted-foreground">Manage all loading points</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ name: "", location: "", status: "active" })
                  }}
                >
                  + Add Loading Point
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Loading Point" : "Add New Loading Point"}</DialogTitle>
                  <DialogDescription>Fill in the details below</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <Input
                      type="text"
                      placeholder="Loading Point Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <Input
                      type="text"
                      placeholder="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Status</label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="mt-1 bg-muted border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border/50">
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
                    {editingId ? "Update" : "Add"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Table */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>All Loading Points</CardTitle>
              <CardDescription>View and manage loading points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {loadingPoints.map((lp) => (
                  <div
                    key={lp.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{lp.name}</p>
                      <p className="text-xs text-muted-foreground">{lp.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${lp.status === "active" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"}`}
                      >
                        {lp.status}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent border-border/50"
                        onClick={() => handleEdit(lp)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent border-border/50 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(lp.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
