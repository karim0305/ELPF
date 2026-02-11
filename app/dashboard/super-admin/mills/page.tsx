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
import { MillFormModal } from "@/components/mill-form-modal"
import { getMillInfos, deleteMillInfo, updateMillInfo } from "@/app/api/fapi"
import { useToast } from "@/hooks/use-toast"

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
  const [mills, setMills] = useState<Mill[]>([])
  const [editingMill, setEditingMill] = useState<Mill | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)

  useEffect(() => {
    fetchMills()
  }, [])

  const fetchMills = async () => {
    try {
      setLoading(true)
      const res = await getMillInfos()
      setMills(res.data)
    } catch (error) {
      console.error("Failed to fetch mills", error)
      const message = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to fetch mills'
      toast({ title: 'Error', description: String(message), variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleNewMill = () => {
    setEditingMill(null)
    setIsModalOpen(true)
  }

  const handleEditMill = (mill: Mill) => {
    setEditingMill(mill)
    setIsModalOpen(true)
  }

  const handleDeleteMill = async (id: string) => {
    try {
      // call delete API
      await deleteMillInfo(id)
      setDeleteConfirm(null)
      fetchMills()
      toast({ title: 'Deleted', description: 'Mill deleted successfully.' })
    } catch (error) {
      console.error("Delete failed", error)
      const message = (error as any)?.response?.data?.message || (error as any)?.message || 'Delete failed'
      toast({ title: 'Error', description: String(message), variant: 'destructive' })
    }
  }

  const handleToggleStatus = async (mill: Mill) => {
    try {
      setUpdatingStatusId(mill._id)
      const newStatus = mill.status === "Active" ? "Inactive" : "Active"
      await updateMillInfo(mill._id, { status: newStatus })
      toast({ title: 'Updated', description: `Mill status set to ${newStatus}.` })
      fetchMills()
    } catch (error) {
      console.error("Status update failed", error)
      const message = (error as any)?.response?.data?.message || (error as any)?.message || 'Status update failed'
      toast({ title: 'Error', description: String(message), variant: 'destructive' })
    } finally {
      setUpdatingStatusId(null)
    }
  }

  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav title="All Mills" items={superAdminNav} userRole="super-admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Mills Management</h1>
            <p className="text-sm text-muted-foreground">
              Create, edit, and manage registered sugar mills
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleNewMill}
              >
                ➕ Add New Mill
              </Button>
            </DialogTrigger>

            <DialogContent className="!max-w-[900px] !max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMill ? "Edit Mill" : "Register New Mill"}
                </DialogTitle>
                <DialogDescription>
                  {editingMill
                    ? "Update mill information below"
                    : "Fill in the mill details to register a new sugar mill"}
                </DialogDescription>
              </DialogHeader>

              <MillFormModal
                initialData={editingMill}
                onClose={() => {
                  setIsModalOpen(false)
                  setEditingMill(null)
                }}
                onSuccess={() => {
                  fetchMills()
                  setIsModalOpen(false)
                  setEditingMill(null)
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Total Mills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{mills.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Active Mills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {mills.filter((m) => m.status === "Active").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Inactive Mills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">
                    {mills.filter((m) => m.status === "Inactive").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm text-muted-foreground">
                    Suspended Mills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {mills.filter((m) => m.status === "Suspended").length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Mills List</CardTitle>
                <CardDescription>
                  Manage all registered sugar mills
                </CardDescription>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <p className="text-center py-6">Loading mills...</p>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mill Name</TableHead>
                          <TableHead>Code</TableHead>
                          <TableHead>Focal Person</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {mills.map((mill) => (
                          <TableRow key={mill._id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                  {mill.profilePicture ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={mill.profilePicture} alt={mill.millname} className="h-full w-full object-cover" />
                                  ) : (
                                    <span className="text-sm font-medium">{mill.millname.charAt(0) || 'M'}</span>
                                  )}
                                </div>

                                <div>
                                  <p className="font-medium">{mill.millname}</p>
                                  <p className="text-xs text-muted-foreground">{mill.address}</p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>{mill.millcode}</TableCell>
                            <TableCell>{mill.focalperson}</TableCell>
                            <TableCell>{mill.phone}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{mill.status}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleToggleStatus(mill)}
                                  disabled={updatingStatusId === mill._id}
                                >
                                  {updatingStatusId === mill._id
                                    ? '...'
                                    : mill.status === 'Active'
                                    ? 'Deactivate'
                                    : 'Activate'}
                                </Button>
                              </div>
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditMill(mill)}
                                >
                                  ✏️ Edit
                                </Button>

                                {deleteConfirm === mill._id ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        handleDeleteMill(mill._id)
                                      }
                                    >
                                      Confirm
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        setDeleteConfirm(null)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-destructive"
                                    onClick={() =>
                                      setDeleteConfirm(mill._id)
                                    }
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
                )}

                {!loading && mills.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No mills found.
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
