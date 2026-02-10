"use client"

import { useState } from "react"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MillFormModal } from "@/components/mill-form-modal"

const superAdminNav = [
  { label: "All Mills", href: "/dashboard/super-admin/mills", icon: "🏭" },
  { label: "All Users", href: "/dashboard/super-admin/users", icon: "👥" },
]

interface Mill {
  id: string
  millName: string
  focalPerson: string
  contact: string
  address: string
  username: string
  status: "active" | "inactive" | "suspended"
  createdAt: string
}

const mockMills: Mill[] = [
  {
    id: "1",
    millName: "Valley Sugar Mill",
    focalPerson: "Rajesh Kumar",
    contact: "+91 98765 43210",
    address: "123 Mill Road, Maharashtra, India",
    username: "valley.mill",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    millName: "Golden Harvest Mill",
    focalPerson: "Priya Singh",
    contact: "+91 87654 32109",
    address: "456 Factory Lane, Uttar Pradesh, India",
    username: "golden.harvest",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "3",
    millName: "Green Fields Mill",
    focalPerson: "Amit Patel",
    contact: "+91 76543 21098",
    address: "789 Agricultural Park, Gujarat, India",
    username: "green.fields",
    status: "inactive",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    millName: "Premium Sugarcane Processing",
    focalPerson: "Deepika Sharma",
    contact: "+91 65432 10987",
    address: "321 Industrial Zone, Karnataka, India",
    username: "premium.sugar",
    status: "active",
    createdAt: "2024-02-10",
  },
]

export default function MillsPage() {
  const [mills, setMills] = useState<Mill[]>(mockMills)
  const [editingMill, setEditingMill] = useState<Mill | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreateMill = (formData: Omit<Mill, "id" | "createdAt">) => {
    const newMill: Mill = {
      ...formData,
      id: `${mills.length + 1}`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setMills([...mills, newMill])
    setIsModalOpen(false)
  }

  const handleUpdateMill = (formData: Omit<Mill, "id" | "createdAt">) => {
    if (editingMill) {
      setMills(mills.map((m) => (m.id === editingMill.id ? { ...m, ...formData } : m)))
      setEditingMill(null)
      setIsModalOpen(false)
    }
  }

  const handleDeleteMill = (millId: string) => {
    setMills(mills.filter((m) => m.id !== millId))
    setDeleteConfirm(null)
  }

  const handleNewMill = () => {
    setEditingMill(null)
    setIsModalOpen(true)
  }

  const handleEditMill = (mill: Mill) => {
    setEditingMill(mill)
    setIsModalOpen(true)
  }

  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={superAdminNav} userRole="super-admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Mills Management</h1>
            <p className="text-sm text-muted-foreground">Create, edit, and manage registered sugar mills</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50 bg-transparent">
              📥 Export Mills
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleNewMill}>
                  ➕ Add New Mill
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingMill ? "Edit Mill" : "Register New Mill"}</DialogTitle>
                  <DialogDescription>
                    {editingMill
                      ? "Update mill information below"
                      : "Fill in the mill details to register a new sugar mill"}
                  </DialogDescription>
                </DialogHeader>
                <MillFormModal
                  initialData={editingMill || undefined}
                  onSubmit={editingMill ? handleUpdateMill : handleCreateMill}
                  onClose={() => setIsModalOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Mills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{mills.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered mills</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Mills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {mills.filter((m) => m.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Currently operational</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Mills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {mills.filter((m) => m.status === "inactive").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Not operational</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Suspended Mills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {mills.filter((m) => m.status === "suspended").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Temporarily suspended</p>
                </CardContent>
              </Card>
            </div>

            {/* Mills Table */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Mills List</CardTitle>
                <CardDescription>Manage all registered sugar mills and their operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Mill Name</TableHead>
                        <TableHead className="font-semibold">Focal Person</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Username</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mills.map((mill) => (
                        <TableRow key={mill.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{mill.millName}</p>
                              <p className="text-xs text-muted-foreground">{mill.address}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mill.focalPerson}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mill.contact}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mill.username}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                mill.status === "active"
                                  ? "bg-primary/20 text-primary"
                                  : mill.status === "inactive"
                                    ? "bg-secondary/20 text-secondary"
                                    : "bg-accent/20 text-accent"
                              }`}
                            >
                              {mill.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{mill.createdAt}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border/50 bg-transparent text-xs h-7"
                                onClick={() => handleEditMill(mill)}
                              >
                                ✏️ Edit
                              </Button>
                              {deleteConfirm === mill.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-destructive hover:bg-destructive/90 text-xs h-7"
                                    onClick={() => handleDeleteMill(mill.id)}
                                  >
                                    Confirm
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-border/50 bg-transparent text-xs h-7"
                                    onClick={() => setDeleteConfirm(null)}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-destructive/50 bg-destructive/5 text-destructive hover:bg-destructive/10 text-xs h-7"
                                  onClick={() => setDeleteConfirm(mill.id)}
                                >
                                  🗑️ Delete
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {mills.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No mills found. Create a new mill to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
