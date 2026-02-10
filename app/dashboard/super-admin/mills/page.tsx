"use client"

import { useEffect, useState } from "react"

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
import { MillFormData, MillFormModal } from "@/components/mill-form-modal"
import { addMillInfo, getMillInfos, updateMillInfo } from "@/app/api/fapi"

const superAdminNav = [
  { label: "All Mills", href: "/dashboard/super-admin/mills", icon: "🏭" },
  { label: "All Users", href: "/dashboard/super-admin/users", icon: "👥" },
]
export interface Mill {
  _id: string
  millcode: string
  millname: string
  focalperson: string
  cnic: string
  phone: string
  address: string
  email: string
  role: string
  profilePicture?: string
  status: "Active" | "Inactive" | "Suspended"
  lastLogin?: string
  createdAt: string
  updatedAt?: string
}



export default function MillsPage() {
 
  const [editingMill, setEditingMill] = useState<Mill | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [mills, setMills] = useState<Mill[]>([])
useEffect(() => {
 
 fetchMills();
}, [])
const fetchMills = async () => {
  try {
    const res = await getMillInfos()

    // 🔴 IMPORTANT:
    // If your backend returns { data: [...] }
    setMills(res.data)
    console.log(res.data)

    // If backend returns { success: true, data: [...] }
    // setMills(res.data.data)

  } catch (error) {
    console.error("Failed to fetch mills", error)
  }
}

  const handleCreateMill = async (data: MillFormData) => {
  await addMillInfo(data)
  fetchMills()
  setIsModalOpen(false)
}

const handleUpdateMill = async (data: MillFormData) => {
  if (!editingMill) return
  await updateMillInfo(editingMill._id, data)
  fetchMills()
  setEditingMill(null)
  setIsModalOpen(false)
}

  const handleDeleteMill = (millId: string) => {
    setMills(mills.filter((m) => m._id !== millId))
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
      <SidebarNav title="All Mills" items={superAdminNav} userRole="super-admin" />

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
                    {mills.filter((m) => m.status === "Active").length}
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
                    {mills.filter((m) => m.status === "Inactive").length}
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
                    {mills.filter((m) => m.status === "Suspended").length}
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
                        <TableHead className="font-semibold">Mill Code</TableHead>
                        <TableHead className="font-semibold">Focal Person</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">CNIC</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>

                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mills.map((mill) => (
                        <TableRow key={mill._id} className="hover:bg-muted/20">
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{mill.millname}</p>
                              <p className="text-xs text-muted-foreground">{mill.address}</p>
                            </div>
                          </TableCell>
                             <TableCell>
                            <span className="text-sm text-foreground">{mill.millcode}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mill.focalperson}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mill.phone}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mill.cnic}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{mill.email}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                mill.status === "Active"
                                  ? "bg-primary/20 text-primary"
                                  : mill.status === "Inactive"
                                    ? "bg-secondary/20 text-secondary"
                                    : "bg-accent/20 text-accent"
                              }`}
                            >
                              {mill.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{mill.role}</span>
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
                              {deleteConfirm === mill._id ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-destructive hover:bg-destructive/90 text-xs h-7"
                                    onClick={() => handleDeleteMill(mill._id)}
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
                                  onClick={() => setDeleteConfirm(mill._id)}
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
