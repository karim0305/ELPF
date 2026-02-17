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
import { SidebarNav } from "@/components/sidebar-nav"
import { AdminLayout } from "../../AdminLayout"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Mill, setError, setLoading } from "@/redux/slices/userSlice"
import { addHaulage, getHaulages, updateHaulage } from "@/app/api/fapi"
import { toast } from "@/components/ui/use-toast"

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
  const user = useSelector((state: RootState) => state.users.currentUser);
 const [userName, setUserName] = useState("");
const [getmillid, setMillid] = useState<string>("");
 const [millName, setMillName] = useState("");
   const [haulages, setHaulages] = useState<Haulage[]>([])

    useEffect(() => {
      if (user) {
        const userName = user.name || "User";
        const millName = user.millid?.millname || "Mill";
        const millId = user.millid?._id || "Mill";
        setUserName(userName);
        setMillName(millName);
        setMillid(millId);
        fetchHoulages();
        console.log("Current User in AdminLayout:", user);
        console.log("User Name:", userName);
        console.log("Mill Name:", millId);
      }
     
     
    }, [user]);


      const fetchHoulages = async () => {
        try {
          setLoading(true)
          setError(null)
          const response = await getHaulages()
          setHaulages(response.data.data || response.data || [])
        } catch (err: any) {
          const errorMessage = err.response?.data?.message || "Failed to fetch haulages"
          setError(errorMessage)
          toast({ title: 'Error', description: errorMessage, variant: 'destructive' })
          console.error(err)
        } finally {
          setLoading(false)
        }
      }



  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    millid: "",
    haulageCode: "",
    haulageName: "",
    remarks: "",
  })

const handleSave = async () => {
  try {
    const payload = {
      millid: getmillid,
      haulageCode: formData.haulageCode,
      haulageName: formData.haulageName,
      remarks: formData.remarks,
    };
console.log("Payload being sent:", payload);
    if (editingId) {
      // UPDATE
      const response = await updateHaulage(editingId, payload);
      const updatedHaulage = response.data;

      setHaulages((prev) =>
        prev.map((h) => (h._id === editingId ? updatedHaulage : h))
      );
    } else {
      // CREATE
      const response = await addHaulage(payload);
      const newHaulage = response.data;

      setHaulages((prev) => [...prev, newHaulage]);
    }

    // Reset form
    setIsOpen(false);
    setFormData({
      millid: "",
      haulageCode: "",
      haulageName: "",
      remarks: "",
    });
    setEditingId(null);
  } catch (error) {
    console.error("Error saving haulage:", error);
  }
};


  const handleEdit = (haulage: Haulage) => {
    setFormData({remarks: haulage.remarks, millid: haulage.millid, haulageCode: haulage.haulageCode, haulageName: haulage.haulageName })
    setEditingId(haulage._id)
    setIsOpen(true)
  }

  const handleDelete = (id: string) => {
    setHaulages(haulages.filter((h) => h._id !== id))
  }

  return (
         <AdminLayout username={userName} millName={millName} >
    <div className="flex bg-background min-h-screen">


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
                    setFormData({millid:"", haulageCode: "", haulageName: "", remarks: ""})
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
                      value={formData.haulageName}
                      onChange={(e) => setFormData({ ...formData, haulageName: e.target.value })}
                      className="mt-1 bg-muted border-border/50"
                    />
                    <label className="text-sm font-medium text-foreground">Remarks</label>
                    <Input
                      type="text"
                      placeholder="Remarks"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="mt-1 bg-muted border-border/50">

                      </Input>
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
                      <TableRow key={haulage._id} className="hover:bg-muted/20">
                        <TableCell className="text-foreground">{haulage.haulageCode}</TableCell>
                        <TableCell className="text-foreground">{haulage.haulageName}</TableCell>
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
    </div>
    </AdminLayout>
  )
}
