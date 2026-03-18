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
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SuperAdminLayout } from "../SuperAdminLayout"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { setError, setLoading } from "@/redux/slices/userSlice"
import { addHaulage, deleteHaulage, getHaulages, updateHaulage } from "@/app/api/fapi"
import { useToast } from "@/hooks/use-toast"

interface Haulage {
  _id: string
  millid: string
  haulageCode: string
  haulageName: string
  remarks: string
  status: string
  createdDate: string
}

export default function ManageHaulagePages() {
  const user = useSelector((state: RootState) => state.users.currentUser)
  const [userName, setUserName] = useState("")
  const [getmillid, setMillid] = useState<string>("")
  const [millName, setMillName] = useState("")
  const [haulages, setHaulages] = useState<Haulage[]>([])
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    millid: "",
    haulageCode: "",
    haulageName: "",
    remarks: "",
  })

  useEffect(() => {
    if (user) {
      const userName = user.name || "User"
      const millName = user.millid?.millname || "Mill"
      const millId = user.millid?._id || "Mill"
      setUserName(userName)
      setMillName(millName)
      setMillid(millId)
      fetchHoulages()
    }
  }, [user])

  const fetchHoulages = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getHaulages()
      setHaulages(response.data.data || response.data || [])
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to fetch haulages"
      setError(errorMessage)
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const payload = {
        millid: getmillid,
        haulageCode: formData.haulageCode,
        haulageName: formData.haulageName,
        remarks: formData.remarks,
      }

      if (editingId) {
        const response = await updateHaulage(editingId, payload)
        const updatedHaulage = response.data
        setHaulages((prev) => prev.map((h) => (h._id === editingId ? updatedHaulage : h)))
        toast({ title: "Updated", description: "Haulage updated successfully", variant: "default" })
      } else {
        const response = await addHaulage(payload)
        const newHaulage = response.data
        setHaulages((prev) => [...prev, newHaulage])
        toast({ title: "Created", description: "Haulage added successfully", variant: "default" })
      }

      setIsOpen(false)
      setFormData({ millid: "", haulageCode: "", haulageName: "", remarks: "" })
      setEditingId(null)
    } catch (error: any) {
      const isDuplicate =
        error.response?.data?.code === 11000 || error.response?.data?.errmsg?.includes("duplicate key")
      if (isDuplicate) {
        console.error("Duplicate key error, not showing toast:", error.response?.data)
        return
      }
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errmsg ||
        error.message ||
        "Something went wrong"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
      console.error("Error saving haulage:", error)
    }
  }

  const handleEdit = (haulage: Haulage) => {
    setFormData({
      remarks: haulage.remarks,
      millid: haulage.millid,
      haulageCode: haulage.haulageCode,
      haulageName: haulage.haulageName,
    })
    setEditingId(haulage._id)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteHaulage(id)
      setHaulages((prev) => prev.filter((h) => h._id !== id))
      toast({ title: "Deleted", description: "Haulage deleted successfully", variant: "default" })
    } catch (error: any) {
      console.error("Delete failed:", error)
      const errorMessage =
        error.response?.data?.message || error.response?.data?.errmsg || error.message || "Failed to delete haulage"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    }
  }

  return (
    <SuperAdminLayout title="Administrator" username={userName}>
      <div className="flex flex-col md:flex-row bg-background min-h-screen">
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
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
                <div className="text-3xl font-bold text-primary">{haulages.filter((h) => h.status === "active").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Operational</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Haulage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{haulages.filter((h) => h.status === "inactive").length}</div>
                <p className="text-xs text-muted-foreground mt-1">Not operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Header + Add Button */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Manage Haulage</h2>
              <p className="text-sm text-muted-foreground">Manage all haulage companies</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setFormData({ millid: "", haulageCode: "", haulageName: "", remarks: "" })}
                >
                  + Add New Haulage
                </Button>
              </DialogTrigger>
              <DialogContent className="!max-w-[1200px] !max-h-[90vh] !overflow-y-auto bg-card border-border/50">
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
                      value={formData.haulageName}
                      onChange={(e) => setFormData({ ...formData, haulageName: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
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
                  <div className="flex flex-col md:flex-row gap-2 pt-4">
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
          <Card className="bg-card border-border/50 overflow-x-auto">
            <CardHeader>
              <CardTitle>All Haulage Companies</CardTitle>
              <CardDescription>Manage all haulage companies</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <div className="min-w-[500px]">
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
                      <TableRow key={haulage._id} className="hover:bg-muted/20">
                        <TableCell className="text-foreground">{haulage.haulageCode}</TableCell>
                        <TableCell className="text-foreground">{haulage.haulageName}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end flex-wrap">
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
                              onClick={() => handleDelete(haulage._id)}
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
    </SuperAdminLayout>
  )
}