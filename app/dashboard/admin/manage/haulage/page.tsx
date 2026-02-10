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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarNav } from "@/components/sidebar-nav"

interface Haulage {
  id: string
  haulageCode: string
  haulaugeName: string
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

export default function ManageHaulagePages() {
  const [haulages, setHaulages] = useState<Haulage[]>([
    {
      id: "HAU-001",
      haulageCode: "HAU-A-001",
      haulaugeName: "Alpha Transport Services",
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: "HAU-002",
      haulageCode: "HAU-B-001",
      haulaugeName: "Beta Logistics",
      status: "active",
      createdDate: "2024-01-20",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    haulageCode: "",
    haulaugeName: "",
  })

  const handleSave = () => {
    if (editingId) {
      setHaulages(
        haulages.map((h) =>
          h.id === editingId
            ? {
                ...h,
                haulageCode: formData.haulageCode,
                haulaugeName: formData.haulaugeName,
              }
            : h,
        ),
      )
    } else {
      const newId = `HAU-${String(haulages.length + 1).padStart(3, "0")}`
      setHaulages([
        ...haulages,
        {
          id: newId,
          haulageCode: formData.haulageCode,
          haulaugeName: formData.haulaugeName,
          status: "active",
          createdDate: new Date().toISOString().split("T")[0],
        },
      ])
    }
    setIsOpen(false)
    setFormData({ haulageCode: "", haulaugeName: "" })
    setEditingId(null)
  }

  const handleEdit = (haulage: Haulage) => {
    setFormData({ haulageCode: haulage.haulageCode, haulaugeName: haulage.haulaugeName })
    setEditingId(haulage.id)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setHaulages(haulages.filter((h) => h.id !== id))
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Haulage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{haulages.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered haulage companies</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Haulage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {haulages.filter((h) => h.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Operational</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Haulage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {haulages.filter((h) => h.status === "inactive").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Not operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Manage Haulage</h2>
              <p className="text-sm text-muted-foreground">Manage all haulage companies</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ haulageCode: "", haulaugeName: "" })
                  }}
                >
                  + Add New Haulage
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>{editingId ? "Edit Haulage" : "Add New Haulage"}</DialogTitle>
                  <DialogDescription>Fill in the haulage details below</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Haulage Code</label>
                    <Input
                      type="text"
                      placeholder="Haulage Code"
                      value={formData.haulageCode}
                      onChange={(e) => setFormData({ ...formData, haulageCode: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Haulage Name</label>
                    <Input
                      type="text"
                      placeholder="Haulage Name"
                      value={formData.haulaugeName}
                      onChange={(e) => setFormData({ ...formData, haulaugeName: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
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
              <CardTitle>All Haulage Companies</CardTitle>
              <CardDescription>Manage all haulage companies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Haulage Code</TableHead>
                      <TableHead className="font-semibold">Haulage Name</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {haulages.map((haulage) => (
                      <TableRow key={haulage.id} className="hover:bg-muted/20">
                        <TableCell className="text-foreground">{haulage.haulageCode}</TableCell>
                        <TableCell className="text-foreground">{haulage.haulaugeName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-transparent border-border/50"
                              onClick={() => handleEdit(haulage)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-transparent border-border/50 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(haulage.id)}
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
  )
}
