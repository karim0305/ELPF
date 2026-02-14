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
import { AdminLayout } from "../../AdminLayout"

interface Device {
  id: string
  deviceName: string
  emiNo: string
  status: string
  remarks: string
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

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "DEV-001",
      deviceName: "Weigh Scale A1",
      emiNo: "WS-2024-001",
      status: "active",
      remarks: "Primary scale",
      createdDate: "2024-01-15",
    },
    {
      id: "DEV-002",
      deviceName: "Weigh Scale A2",
      emiNo: "WS-2024-002",
      status: "active",
      remarks: "Secondary scale",
      createdDate: "2024-01-16",
    },
    {
      id: "DEV-003",
      deviceName: "GPS Device B1",
      emiNo: "GPS-2024-001",
      status: "inactive",
      remarks: "Under maintenance",
      createdDate: "2024-01-17",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ deviceName: "", emiNo: "", status: "active", remarks: "" })

  const handleSave = () => {
    if (editingId) {
      setDevices(
        devices.map((d) =>
          d.id === editingId
            ? {
                ...d,
                deviceName: formData.deviceName,
                emiNo: formData.emiNo,
                status: formData.status,
                remarks: formData.remarks,
              }
            : d,
        ),
      )
    } else {
      const newId = `DEV-${String(devices.length + 1).padStart(3, "0")}`
      setDevices([
        ...devices,
        {
          id: newId,
          deviceName: formData.deviceName,
          emiNo: formData.emiNo,
          status: formData.status,
          remarks: formData.remarks,
          createdDate: new Date().toISOString().split("T")[0],
        },
      ])
    }
    setIsOpen(false)
    setFormData({ deviceName: "", emiNo: "", status: "active", remarks: "" })
    setEditingId(null)
  }

  const handleEdit = (device: Device) => {
    setFormData({ deviceName: device.deviceName, emiNo: device.emiNo, status: device.status, remarks: device.remarks })
    setEditingId(device.id)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id))
  }

  return (
    <AdminLayout title="Manage Devices">
      <div className="flex bg-background min-h-screen">
        <div className="flex-1 flex flex-col overflow-hidden p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{devices.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered devices</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {devices.filter((d) => d.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Operational</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {devices.filter((d) => d.status === "inactive").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Maintenance</p>
              </CardContent>
            </Card>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Device Management</h2>
              <p className="text-sm text-muted-foreground">Manage all system devices</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ deviceName: "", emiNo: "", status: "active", remarks: "" })
                  }}
                >
                  + Add Device
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Device" : "Add New Device"}</DialogTitle>
                  <DialogDescription>Fill in the device details below</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Device Name</label>
                    <Input
                      type="text"
                      placeholder="Device Name"
                      value={formData.deviceName}
                      onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">EMI No</label>
                    <Input
                      type="text"
                      placeholder="EMI Number"
                      value={formData.emiNo}
                      onChange={(e) => setFormData({ ...formData, emiNo: e.target.value })}
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
                  <div>
                    <label className="text-sm font-medium text-foreground">Remarks</label>
                    <Input
                      type="text"
                      placeholder="Remarks"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
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
              <CardTitle>All Devices</CardTitle>
              <CardDescription>View and manage all devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{device.deviceName}</p>
                      <p className="text-xs text-muted-foreground">
                        {device.emiNo} • {device.remarks}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${device.status === "active" ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"}`}
                      >
                        {device.status}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent border-border/50"
                        onClick={() => handleEdit(device)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent border-border/50 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(device.id)}
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
    </AdminLayout>
  )
}
