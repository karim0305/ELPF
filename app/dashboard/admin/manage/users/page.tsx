"use client"

import { useEffect, useState } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserFormModal } from "@/components/admin-user-form-modal"
import { getUsers, addUser, updateUser, deleteUser } from "@/app/api/fapi"
import { AdminLayout } from "../../AdminLayout"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

const superAdminNav = [
  { label: "All Mills", href: "/dashboard/super-admin/mills", icon: "🏭" },
  { label: "All Users", href: "/dashboard/super-admin/users", icon: "👥" },
]

export interface SuperAdmin {
  _id: string;
  name: string;
  millid: string;
  email: string;
  phone: string;
  cnic: string;
  address: string;
  image: string;
  status: "Active" | "Inactive";
  password: string;
  role: "Admin" | "User";
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<SuperAdmin[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<SuperAdmin | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  const user = useSelector((state: RootState) => state.users.currentUser);
 const [userName, setUserName] = useState("");
 const [millName, setMillName] = useState("");
   const { toast } = useToast()

    useEffect(() => {
      if (user) {
        const userName = user.name || "User";
        const millName = user.millid?.millname || "Mill";
        setUserName(userName);
        setMillName(millName);
        console.log("Current User in AdminLayout:", user);
        console.log("User Name:", userName);
        console.log("Mill Name:", millName);
      }
     
     
    }, [user]);


  useEffect(() => {
    fetchSuperAdmins()
  }, [])

  const fetchSuperAdmins = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getUsers()
      setUsers(response.data.data || response.data || [])
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch users"
      setError(errorMessage)
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
 
  const handleCreateUser = async (formData: any) => {
    try {
      setSubmitting(true)
      console.log('➕ Creating User:', formData)
      const response = await addUser(formData)
      const newUser = response.data.data || response.data
      console.log('✅ User Created:', newUser)
      setUsers([...users, newUser])
      setIsModalOpen(false)
      toast({ title: 'Created', description: 'User created successfully.' })
    } catch (err: any) {
      console.error('❌ Create Error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        url: err.config?.url,
        error: err.message
      })
      const errorMessage = err.response?.data?.message || 
        (err.response?.status === 404 ? `API Endpoint not found. Make sure backend is running on http://localhost:3010` : "Failed to create user")
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateUser = async (formData: any) => {
    if (!editingUser) return

    try {
      setSubmitting(true)
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cnic: formData.cnic,
        address: formData.address,
        image: formData.image,
        role: formData.role,
        status: formData.status,
      }
      if (formData.password !== undefined && formData.password) {
        updateData.password = formData.password
      }
      
      console.log('🔄 Updating User:', { userId: editingUser._id, data: updateData })
      const response = await updateUser(editingUser._id, updateData)
      const updatedUser = response.data.data || response.data
      console.log('✅ User Updated:', updatedUser)
      
      setUsers(users.map((u) => (u._id === editingUser._id ? updatedUser : u)))
      setEditingUser(null)
      setIsModalOpen(false)
      toast({ title: 'Updated', description: 'User updated successfully.' })
    } catch (err: any) {
      console.error('❌ Update Error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        url: err.config?.url,
        error: err.message
      })
      const errorMessage = err.response?.data?.message || 
        (err.response?.status === 404 ? `API Endpoint not found. Make sure backend is running on http://localhost:3010` : "Failed to update user")
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      setSubmitting(true)
      console.log('🗑️ Deleting User:', userId)
      await deleteUser(userId)
      console.log('✅ User Deleted')
      setUsers(users.filter((u) => u._id !== userId))
      setDeleteConfirm(null)
      toast({ title: 'Deleted', description: 'User deleted successfully.' })
    } catch (err: any) {
      console.error('❌ Delete Error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        url: err.config?.url,
        error: err.message
      })
      const errorMessage = err.response?.data?.message || 
        (err.response?.status === 404 ? `API Endpoint not found. Make sure backend is running on http://localhost:3010` : "Failed to delete user")
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewUser = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: SuperAdmin) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleStatusToggle = async (user: SuperAdmin) => {
    try {
      setUpdatingStatusId(user._id)
      const newStatus = user.status === "Active" ? "Inactive" : "Active"
      console.log('🔄 Toggling Status:', { userId: user._id, from: user.status, to: newStatus })

      const response = await updateUser(user._id, { status: newStatus })
      const updatedUser = response.data.data || response.data
      console.log('✅ Status Updated:', updatedUser)
      
      setUsers(users.map((u) => (u._id === user._id ? updatedUser : u)))
      toast({ title: 'Updated', description: `User status set to ${newStatus}.` })
    } catch (err: any) {
      console.error('❌ Status Update Error:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        url: err.config?.url,
        error: err.message
      })
      const errorMessage = err.response?.data?.message || "Failed to update status"
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
    } finally {
      setUpdatingStatusId(null)
    }
  }
  // Filter users based on role and millid
const filteredUsers = users.filter(
  (u) =>
    (u.role === "User" || u.role === "Admin") &&
    u.millid === user?.millid?._id // make sure to match the ID
)


  return (
       <AdminLayout username={userName} millName={millName} >
    <div className="flex bg-background min-h-screen">
      

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Users Management</h1>
            <p className="text-sm text-muted-foreground">Create, edit, and manage system users</p>
            {error && <p className="text-sm text-destructive mt-1">{error}</p>}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50 bg-transparent" disabled={loading}>
              📥 Export Users
            </Button>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground" 
                  onClick={handleNewUser}
                  disabled={loading}
                >
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
                  isLoading={submitting}
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
                  <div className="text-3xl font-bold text-primary">{filteredUsers.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Active accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {filteredUsers.filter((u) => u.role === "User").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">System users</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Admins</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {filteredUsers.filter((u) => u.role === "Admin").length}
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
                    {filteredUsers.filter((u) => u.status === "Active").length}
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
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Role</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Created</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">Loading users...</p>
                          </TableCell>
                        </TableRow> : users.length === 0 ? <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <p className="text-muted-foreground">No users found. Create a new user to get started.</p>
                          </TableCell>
                        </TableRow> : filteredUsers.map((user) => (
                          <TableRow key={user._id} className="hover:bg-muted/20">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={user.image} alt={user.name} />
                                  <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-foreground">{user.name}</p>
                                  <p className="text-xs text-muted-foreground">{user.address}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-foreground">{user.email}</span>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`text-xs px-2 py-1 rounded font-medium ${
                                  user.role === "Admin"
                                    ? "bg-primary/20 text-primary"
                                    : user.role === "User"
                                      ? "bg-secondary/20 text-secondary"
                                      : "bg-muted/50 text-muted-foreground"
                                }`}
                              >
                                {user.role}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-foreground">{user.phone}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{user.status}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusToggle(user)}
                                  disabled={updatingStatusId === user._id}
                                >
                                  {updatingStatusId === user._id
                                    ? '...'
                                    : user.status === 'Active'
                                    ? 'Deactivate'
                                    : 'Activate'}
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-border/50 bg-transparent text-xs h-7"
                                  onClick={() => handleEditUser(user)}
                                  disabled={submitting}
                                >
                                  ✏️ Edit
                                </Button>
                                {deleteConfirm === user._id ? (
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-destructive hover:bg-destructive/90 text-xs h-7"
                                      onClick={() => handleDeleteUser(user._id)}
                                      disabled={submitting}
                                    >
                                      Confirm
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-border/50 bg-transparent text-xs h-7"
                                      onClick={() => setDeleteConfirm(null)}
                                      disabled={submitting}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-destructive/50 bg-destructive/5 text-destructive hover:bg-destructive/10 text-xs h-7"
                                    onClick={() => setDeleteConfirm(user._id)}
                                    disabled={submitting}
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
</AdminLayout>
  )
}