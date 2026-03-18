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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarNav } from "@/components/sidebar-nav"
import { LocationPicker } from "@/components/location-picker"
import { AdminLayout } from "../../AdminLayout"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"
import { setError, setLoading } from "@/redux/slices/userSlice"
import { addElp, deleteElp, getElps, updateElp } from "@/app/api/fapi"
import { toast } from "@/components/ui/use-toast"

interface LoadingPoint {
  _id: string
  millid: string
  elpCode: string
  elpName: string
  remarks: string
  status: string
}



export default function ManageLPPage() {
const user = useSelector((state: RootState) => state.users.currentUser);
 const [userName, setUserName] = useState("");
 const [millName, setMillName] = useState("");
 const [millid, setMillid] = useState("");
 const [lps, setLps] = useState<LoadingPoint[]>([])
 const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [logo , setLogo] = useState("");


    useEffect(() => {
      if (user) {
        const userName = user.name || "User";
        const millName = user.millid?.millname || "Mill";
        const millId = user.millid?._id || "Mill";
        const logopic = user.millid?.profilePicture || "";

        setUserName(userName);
        setMillName(millName);
        setMillid(millId);
        setLogo(logopic);
        GetElpByMill(millId);
        console.log("Current User in AdminLayout:", user);
        console.log("User Name:", userName);
        console.log("Mill Name:", millName);
      }
    }, [user]);


  const GetElpByMill = async (millid: string) => {
  try {
    const response = await getElps(millid);
    console.log("Elps fetched by millid:", response.data);
    setLps(response.data);
  } catch (error) {
    console.error("Error fetching elps by millid:", error);
  }
};


  

  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    millid: "",
  elpCode: "",
  elpName: "",
  remarks: "",
  status: "active",
  })


const handleSave = async () => {
  try {
    if (editingId) {
      // UPDATE
      const response = await updateElp(editingId, { ...formData, millid });
      const updatedLp = response.data;

      setLps((prev) =>
        prev.map((lp) => (lp._id === editingId ? updatedLp : lp))
      );

      toast({
        title: "Success",
        description: "Loading Point updated successfully",
        variant: "default",
      });
    } else {
      // CREATE
      const response = await addElp({ ...formData, millid });
      const newLp = response.data;

      setLps((prev) => [...prev, newLp]);

      toast({
        title: "Success",
        description: "Loading Point added successfully",
        variant: "default",
      });
    }

    // Reset form
    setFormData({
      millid: "",
      elpCode: "",
      elpName: "",
      remarks: "",
      status: "active",
    });
    setEditingId(null);
    setIsOpen(false);
  } catch (error: any) {
    console.error("Error saving LP:", error);

    // show toast for error
    const message =
      error.response?.data?.message ||
      "Failed to save Loading Point. Please try again.";
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
};

const handleEdit = (lp: LoadingPoint) => {
  setFormData({
    millid: lp.millid,
    elpCode: lp.elpCode,
    elpName: lp.elpName,
    remarks: lp.remarks,
    status: lp.status,
  });
  setEditingId(lp._id);
  setIsOpen(true);
};

const handleDelete = async (_id: string) => {
  try {
    await deleteElp(_id);
    setLps((prev) => prev.filter((lp) => lp._id !== _id));

    toast({
      title: "Success",
      description: "Loading Point deleted successfully",
      variant: "default",
    });
  } catch (error: any) {
    console.error("Error deleting LP:", error);
    const message =
      error.response?.data?.message ||
      "Failed to delete Loading Point. Please try again.";
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  }
};


const handleLpStatusToggle = async (lp: LoadingPoint) => {
  try {
    setUpdatingStatusId(lp._id);

    const newStatus = lp.status === "active" ? "inactive" : "active";

    const response = await updateElp(lp._id, { status: newStatus });
    const updatedLp = response.data;

    setLps((prev) =>
      prev.map((l) => (l._id === lp._id ? updatedLp : l))
    );

    toast({
      title: "Updated",
      description: `Loading Point status set to ${newStatus}.`,
      variant: "default",
    });
  } catch (err: any) {
    toast({
      title: "Error",
      description: err.response?.data?.message || "Failed to update status",
      variant: "destructive",
    });
  } finally {
    setUpdatingStatusId(null);
  }
};



  return (
     <AdminLayout username={userName} millName={millName} logo={logo} >
    <div className="flex bg-background min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Loading Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{lps.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered points</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {lps.filter((lp) => lp.status === "active").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Operational</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">
                    {lps.filter((lp) => lp.status === "inactive").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Not operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Manage Loading Points</h2>
                <p className="text-sm text-muted-foreground">Manage all loading points and their configurations</p>
              </div>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => {
                      setEditingId(null)
                      setFormData({
                        millid: "",
                        elpCode: "",
                        elpName: "",
                        remarks: "",
                        status: "active",
                      })
                    }}
                  >
                    + Add New LP
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto bg-card border-border/50">
                  <DialogHeader>
                    <DialogTitle>{editingId ? "Edit Loading Point" : "Add New Loading Point"}</DialogTitle>
                    <DialogDescription>Fill in the loading point details below</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                   
                    <div>
                      <label className="text-sm font-medium text-foreground">ELP Name</label>
                      <Input
                        type="text"
                        placeholder="Company Name"
                        value={formData.elpName}
                        onChange={(e) => setFormData({ ...formData, elpName: e.target.value })}
                        className="mt-1 bg-muted border-border/50"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">ELP Code</label>
                      <Input
                        type="text"
                        placeholder="LP Code"
                        value={formData.elpCode}
                        onChange={(e) => setFormData({ ...formData, elpCode: e.target.value })}
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
                <CardTitle>All Loading Points</CardTitle>
                <CardDescription>Manage all loading points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border/50 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">ElP Name</TableHead>
                        <TableHead className="font-semibold">ELP Code</TableHead>
                        <TableHead className="font-semibold">Remarks</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lps.map((lp) => (
                        <TableRow key={lp._id} className="hover:bg-muted/20">
                        
                          <TableCell className="text-foreground">{lp.elpName}</TableCell>
                          <TableCell className="text-foreground">{lp.elpCode}</TableCell>
                          <TableCell className="text-foreground">{lp.remarks}</TableCell>
                          <TableCell>
  <div className="flex items-center gap-2">
    <span className="capitalize">{lp.status}</span>
    <Button
      size="sm"
      variant="outline"
      onClick={() => handleLpStatusToggle(lp)}
      disabled={updatingStatusId === lp._id}
    >
      {updatingStatusId === lp._id
        ? "..."
        : lp.status === "active"
        ? "Deactivate"
        : "Activate"}
    </Button>
  </div>
</TableCell>



                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs bg-transparent border-border/50"
                                onClick={() => handleEdit(lp)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs bg-transparent border-border/50 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(lp._id)}
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
    </AdminLayout>
  )
}
