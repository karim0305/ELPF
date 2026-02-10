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
import { UserFormModal } from "@/components/user-form-modal"

const superAdminNav = [
  { label: "All Mills", href: "/dashboard/super-admin/mills", icon: "🏭" },
  { label: "All Users", href: "/dashboard/super-admin/users", icon: "👥" },
]

interface User {
  id: string
  name: string
  contact: string
  address: string
  role: "SuperAdmin" | "Admin" | "User"
  username: string
  status: "active" | "inactive"
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Administrator",
    contact: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY",
    role: "SuperAdmin",
    username: "john.admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Sarah Manager",
    contact: "+1 (555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA",
    role: "Admin",
    username: "sarah.manager",
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "Mike Operator",
    contact: "+1 (555) 345-6789",
    address: "789 Pine Rd, Chicago, IL",
    role: "User",
    username: "mike.operator",
    status: "inactive",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "Emily Davis",
    contact: "+1 (555) 456-7890",
    address: "321 Elm St, Houston, TX",
    role: "Admin",
    username: "emily.davis",
    status: "active",
    createdAt: "2024-02-10",
  },
  {
    id: "5",
    name: "David Chen",
    contact: "+1 (555) 567-8901",
    address: "654 Maple Dr, Phoenix, AZ",
    role: "User",
    username: "david.chen",
    status: "active",
    createdAt: "2024-02-15",
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleCreateUser = (formData: Omit<User, "id" | "createdAt">) => {
    const newUser: User = {
      ...formData,
      id: `${users.length + 1}`,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setUsers([...users, newUser])
    setIsModalOpen(false)
  }

  const handleUpdateUser = (formData: Omit<User, "id" | "createdAt">) => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...u, ...formData } : u)))
      setEditingUser(null)
      setIsModalOpen(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
    setDeleteConfirm(null)
  }

  const handleNewUser = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={superAdminNav} userRole="super-admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Users Management</h1>
            <p className="text-sm text-muted-foreground">Create, edit, and manage system users</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50 bg-transparent">
              📥 Export Users
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleNewUser}>
                  ➕ Add New User
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
                  <DialogDescription>
                    {editingUser ? "Update user information below" : "Fill in the user details to create a new account"}
                  </DialogDescription>
                </DialogHeader>
                <UserFormModal
                  initialData={editingUser || undefined}
                  onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{users.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">SuperAdmins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {users.filter((u) => u.role === "SuperAdmin").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">System administrators</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {users.filter((u) => u.role === "Admin").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Regular administrators</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Currently active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {users.filter((u) => u.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active users count</p>
                </CardContent>
              </Card>
            </div>

            {/* Users Table */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Users List</CardTitle>
                <CardDescription>Manage all system users and their access levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Name</TableHead>
                        <TableHead className="font-semibold">Username</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-muted/20">
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">{user.address}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{user.username}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                user.role === "SuperAdmin"
                                  ? "bg-primary/20 text-primary"
                                  : user.role === "Admin"
                                    ? "bg-secondary/20 text-secondary"
                                    : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {user.role}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-foreground">{user.contact}</span>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                user.status === "active"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{user.createdAt}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border/50 bg-transparent text-xs h-7"
                                onClick={() => handleEditUser(user)}
                              >
                                ✏️ Edit
                              </Button>
                              {deleteConfirm === user.id ? (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-destructive hover:bg-destructive/90 text-xs h-7"
                                    onClick={() => handleDeleteUser(user.id)}
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
                                  onClick={() => setDeleteConfirm(user.id)}
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

                {users.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No users found. Create a new user to get started.</p>
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
