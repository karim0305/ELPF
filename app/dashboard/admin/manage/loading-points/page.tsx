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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarNav } from "@/components/sidebar-nav"
import { LocationPicker } from "@/components/location-picker"

interface LoadingPoint {
  id: string
  companyCode: string
  companyName: string
  lpCode: string
  lpName: string
  gpsLatitude: string
  gpsLongitude: string
  radius: string
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

export default function ManageLPPage() {
  const [lps, setLps] = useState<LoadingPoint[]>([
    {
      id: "LP-001",
      companyCode: "COMP-001",
      companyName: "Alpha Sugar Mills",
      lpCode: "LP-A-001",
      lpName: "North Loading Point",
      gpsLatitude: "28.7041",
      gpsLongitude: "77.1025",
      radius: "500",
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: "LP-002",
      companyCode: "COMP-002",
      companyName: "Beta Transport",
      lpCode: "LP-B-001",
      lpName: "South Loading Point",
      gpsLatitude: "28.6139",
      gpsLongitude: "77.2090",
      radius: "450",
      status: "active",
      createdDate: "2024-01-20",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyCode: "",
    companyName: "",
    lpCode: "",
    lpName: "",
    gpsLatitude: "28.7041",
    gpsLongitude: "77.1025",
    radius: "",
    status: "active",
  })

  const handleSave = () => {
    if (editingId) {
      setLps(
        lps.map((lp) =>
          lp.id === editingId
            ? {
                ...lp,
                companyCode: formData.companyCode,
                companyName: formData.companyName,
                lpCode: formData.lpCode,
                lpName: formData.lpName,
                gpsLatitude: formData.gpsLatitude,
                gpsLongitude: formData.gpsLongitude,
                radius: formData.radius,
                status: formData.status,
              }
            : lp,
        ),
      )
    } else {
      const newId = `LP-${String(lps.length + 1).padStart(3, "0")}`
      setLps([
        ...lps,
        {
          id: newId,
          companyCode: formData.companyCode,
          companyName: formData.companyName,
          lpCode: formData.lpCode,
          lpName: formData.lpName,
          gpsLatitude: formData.gpsLatitude,
          gpsLongitude: formData.gpsLongitude,
          radius: formData.radius,
          status: formData.status,
          createdDate: new Date().toISOString().split("T")[0],
        },
      ])
    }
    setIsOpen(false)
    setFormData({
      companyCode: "",
      companyName: "",
      lpCode: "",
      lpName: "",
      gpsLatitude: "28.7041",
      gpsLongitude: "77.1025",
      radius: "",
      status: "active",
    })
    setEditingId(null)
  }

  const handleEdit = (lp: LoadingPoint) => {
    setFormData({
      companyCode: lp.companyCode,
      companyName: lp.companyName,
      lpCode: lp.lpCode,
      lpName: lp.lpName,
      gpsLatitude: lp.gpsLatitude,
      gpsLongitude: lp.gpsLongitude,
      radius: lp.radius,
      status: lp.status,
    })
    setEditingId(lp.id)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setLps(lps.filter((lp) => lp.id !== id))
  }

  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={adminNav} userRole="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Loading Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{lps.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered points</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {lps.filter((lp) => lp.status === "active").length}
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
                    {lps.filter((lp) => lp.status === "inactive").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Not operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Manage Loading Points</h2>
                <p className="text-sm text-muted-foreground">Manage all loading points and their configurations</p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        companyCode: "",
                        companyName: "",
                        lpCode: "",
                        lpName: "",
                        gpsLatitude: "28.7041",
                        gpsLongitude: "77.1025",
                        radius: "",
                        status: "active",
                      })
                    }}
                  >
                    + Add New LP
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Loading Point" : "Add New Loading Point"}</DialogTitle>
                    <DialogDescription>Fill in the loading point details below</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <label className="text-sm font-medium text-foreground">Company Code</label>
                      <Input
                        type="text"
                        placeholder="Company Code"
                        value={formData.companyCode}
                        onChange={(e) => setFormData({ ...formData, companyCode: e.target.value })}
                        className="mt-1 bg-muted border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Company Name</label>
                      <Input
                        type="text"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        className="mt-1 bg-muted border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">LP Code</label>
                      <Input
                        type="text"
                        placeholder="LP Code"
                        value={formData.lpCode}
                        onChange={(e) => setFormData({ ...formData, lpCode: e.target.value })}
                        className="mt-1 bg-muted border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">LP Name</label>
                      <Input
                        type="text"
                        placeholder="LP Name"
                        value={formData.lpName}
                        onChange={(e) => setFormData({ ...formData, lpName: e.target.value })}
                        className="mt-1 bg-muted border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">GPS Location</label>
                      <LocationPicker
                        onLocationSelected={(lat, lng) => {
                          setFormData({
                            ...formData,
                            gpsLatitude: lat,
                            gpsLongitude: lng,
                          })
                        }}
                        initialLatitude={formData.gpsLatitude}
                        initialLongitude={formData.gpsLongitude}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Radius (meters)</label>
                      <Input
                        type="text"
                        placeholder="Radius in meters"
                        value={formData.radius}
                        onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
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
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
                        {editingId ? "Update" : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-border/50 bg-transparent"
                        onClick={() => setIsOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Table */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>All Loading Points</CardTitle>
                <CardDescription>Manage all loading points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Company Code</TableHead>
                        <TableHead className="font-semibold">Company Name</TableHead>
                        <TableHead className="font-semibold">LP Code</TableHead>
                        <TableHead className="font-semibold">LP Name</TableHead>
                        <TableHead className="font-semibold">GPS Coordinates</TableHead>
                        <TableHead className="font-semibold">Radius (m)</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lps.map((lp) => (
                        <TableRow key={lp.id} className="hover:bg-muted/20">
                          <TableCell className="text-foreground">{lp.companyCode}</TableCell>
                          <TableCell className="text-foreground">{lp.companyName}</TableCell>
                          <TableCell className="text-foreground">{lp.lpCode}</TableCell>
                          <TableCell className="text-foreground">{lp.lpName}</TableCell>
                          <TableCell className="text-foreground text-xs">
                            {lp.gpsLatitude}, {lp.gpsLongitude}
                          </TableCell>
                          <TableCell className="text-foreground">{lp.radius}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
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
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
