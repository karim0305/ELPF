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

interface ManageUser {
  id: string
  companyName: string
  username: string
  registrations: number
  arrivals: number
  verifications: number
  misReport: number
  verificationReport: number
  summaryReport: number
  graph: number
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

export default function ManageUsersPage() {
  const [users, setUsers] = useState<ManageUser[]>([
    {
      id: "USR-001",
      companyName: "Alpha Sugar Mills",
      username: "alpha.mills",
      registrations: 45,
      arrivals: 42,
      verifications: 40,
      misReport: 8,
      verificationReport: 7,
      summaryReport: 6,
      graph: 5,
      status: "active",
      createdDate: "2024-01-15",
    },
    {
      id: "USR-002",
      companyName: "Beta Transport",
      username: "beta.transport",
      registrations: 32,
      arrivals: 31,
      verifications: 29,
      misReport: 5,
      verificationReport: 4,
      summaryReport: 3,
      graph: 2,
      status: "active",
      createdDate: "2024-01-20",
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    companyName: "",
    username: "",
    status: "active",
  })

  const handleSave = () => {
    if (editingId) {
      setUsers(
        users.map((u) =>
          u.id === editingId
            ? {
                ...u,
                companyName: formData.companyName,
                username: formData.username,
                status: formData.status,
              }
            : u,
        ),
      )
    } else {
      const newId = `USR-${String(users.length + 1).padStart(3, "0")}`
      setUsers([
        ...users,
        {
          id: newId,
          companyName: formData.companyName,
          username: formData.username,
          registrations: 0,
          arrivals: 0,
          verifications: 0,
          misReport: 0,
          verificationReport: 0,
          summaryReport: 0,
          graph: 0,
          status: formData.status,
          createdDate: new Date().toISOString().split("T")[0],
        },
      ])
    }
    setIsOpen(false)
    setFormData({ companyName: "", username: "", status: "active" })
    setEditingId(null)
  }

  const handleEdit = (user: ManageUser) => {
    setFormData({ companyName: user.companyName, username: user.username, status: user.status })
    setEditingId(user.id)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={adminNav} userRole="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{users.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered companies</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {users.filter((u) => u.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Operational</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {users.reduce((sum, u) => sum + u.registrations, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All companies</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Verifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {users.reduce((sum, u) => sum + u.verifications, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">All companies</p>
                </CardContent>
              </Card>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Manage Users</h2>
                <p className="text-sm text-muted-foreground">Manage all system users and their access levels</p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({ companyName: "", username: "", status: "active" })
                    }}
                  >
                    + Add New User
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit User" : "Add New User"}</DialogTitle>
                    <DialogDescription>Fill in the user details below</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
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
                      <label className="text-sm font-medium text-foreground">Username</label>
                      <Input
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                <CardTitle>All Users</CardTitle>
                <CardDescription>View and manage all system users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Company Name</TableHead>
                        <TableHead className="font-semibold">Username</TableHead>
                        <TableHead className="font-semibold text-center">Registrations</TableHead>
                        <TableHead className="font-semibold text-center">Arrivals</TableHead>
                        <TableHead className="font-semibold text-center">Verifications</TableHead>
                        <TableHead className="font-semibold text-center">MIS Report</TableHead>
                        <TableHead className="font-semibold text-center">Verification Report</TableHead>
                        <TableHead className="font-semibold text-center">Summary Report</TableHead>
                        <TableHead className="font-semibold text-center">Graph</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium text-foreground">{user.companyName}</TableCell>
                          <TableCell className="text-foreground">{user.username}</TableCell>
                          <TableCell className="text-center text-foreground">{user.registrations}</TableCell>
                          <TableCell className="text-center text-foreground">{user.arrivals}</TableCell>
                          <TableCell className="text-center text-foreground">{user.verifications}</TableCell>
                          <TableCell className="text-center text-foreground">{user.misReport}</TableCell>
                          <TableCell className="text-center text-foreground">{user.verificationReport}</TableCell>
                          <TableCell className="text-center text-foreground">{user.summaryReport}</TableCell>
                          <TableCell className="text-center text-foreground">{user.graph}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs bg-transparent border-border/50"
                                onClick={() => handleEdit(user)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs bg-transparent border-border/50 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(user.id)}
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
