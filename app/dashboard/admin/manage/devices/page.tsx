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
import { SidebarNav } from "@/components/sidebar-nav"
import { AdminLayout } from "../../AdminLayout"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { getDeviceByMillid, getElps, updateDeviceByImei, updateElp } from "@/app/api/fapi"
import { Mill } from "@/redux/slices/userSlice"
import { Switch } from "@radix-ui/react-switch"

export interface Location {
  _id: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
}

export interface Elp {
  _id: string;         // MongoDB ObjectId as string
  millid: string;      // reference to Mill ObjectId
  elpCode: string;
  elpName: string;
  remarks?: string;    // optional in case some ELPs don't have remarks
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
  __v?: number;        // optional version key
}


export interface Device {
  _id: string;
  millid:  Mill ;   // can be ObjectId or populated object
  elpid: Elp;
  deviceModel: string;
  deviceBrand: string;
  location: Location;
  type: string;
  imei: string;
  Tawerid: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}




export default function DevicesPage() {
  const user = useSelector((state: RootState) => state.users.currentUser);
 const [userName, setUserName] = useState("");
 const [millName, setMillName] = useState("");
 const [millid, setMillid] = useState("");
  const [devices, setDevices] = useState<Device[]>([])
  const [elps, setElps] = useState<Elp[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({elpId: "", imei: "" })

    useEffect(() => {
      if (user) {
        const userName = user.name || "User";
        const millName = user.millid?.millname || "Mill";
        const millid = user.millid?._id || "";

        setUserName(userName);
        setMillName(millName);
        setMillid(millid);
        GetDevicesByMill(millid);
        GetElpByMill(millid);
        console.log("Current User in AdminLayout:", user);
        console.log("User Name:", userName);
        console.log("Mill Name:", millName);
        console.log("Mill ID:", millid);
      }
     
  
    }, [user]);



    const GetElpByMill = async (millid: string) => {
  try {
    const response = await getElps(millid);
    console.log("Elps fetched by millid:", response.data);
    setElps(response.data);
  } catch (error) {
    console.error("Error fetching elps by millid:", error);
  }
};

const GetDevicesByMill = async (millid: string) => {
  try {
    const response = await getDeviceByMillid(millid);
    console.log("Devices fetched by millid:", response.data);
    setDevices(response.data);
  } catch (error) {
    console.error("Error fetching devices by millid:", error);
  }
};

// Add state for tracking which device is being updated
const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

const handleStatusToggle = async (device: Device) => {
  try {
    setUpdatingStatusId(device._id); // start loading
    const newStatus = device.status.toLowerCase() === "active" ? "inactive" : "active";

    // Call API
    await updateDeviceByImei(device.imei, { status: newStatus });

    // Update local state
    setDevices((prevDevices) =>
      prevDevices.map((d) =>
        d._id === device._id ? { ...d, status: newStatus } : d
      )
    );
  } catch (error) {
    console.error("Error updating device status:", error);
  } finally {
    setUpdatingStatusId(null); // stop loading
  }
};




 const handleEdit = (device: Device) => {
  setFormData({ elpId: device.elpid._id, imei: device.imei }); // store IMEI too
  setEditingId(device._id);
  setIsOpen(true);
};

  const handleDelete = (id: string) => {
    setDevices(devices.filter((d) => d._id !== id))
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
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{devices.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Registered devices</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {devices.filter((d) => d.status === "active").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Operational</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inactive Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {devices.filter((d) => d.status === "inactive").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Maintenance</p>
              </CardContent>
            </Card>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Device Management</h2>
              <p className="text-sm text-muted-foreground">Manage all system devices</p>
            </div>
           <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="bg-card border-border/50">
    <DialogHeader>
      <DialogTitle>{editingId ? "Edit Device ELP" : "Add New Device"}</DialogTitle>
      <DialogDescription>Select the ELP for this device</DialogDescription>
    </DialogHeader>

    <div className="space-y-4">
      {/* ELP Select */}
      <div>
        <label className="text-sm font-medium text-foreground">ELP</label>
        <Select
          value={formData.elpId}
          onValueChange={(value) => setFormData({ ...formData, elpId: value })}
        >
          <SelectTrigger className="mt-1 bg-muted border-border/50">
            <SelectValue placeholder="Select ELP" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border/50">
  {elps.length > 0 ? (
    elps.map((elp) => (
      <SelectItem key={elp._id} value={elp._id}>
        {elp.elpName}
      </SelectItem>
    ))
  ) : (
    <SelectItem value="no-elp" disabled>
      No ELPs available
    </SelectItem>
  )}
</SelectContent>

        </Select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen(false);
            setEditingId(null);
            setFormData({ elpId: "", imei: "" });
          }}
        >
          Cancel
        </Button>
       <Button
  className="bg-primary hover:bg-primary/90"
  onClick={async () => {
    if (!formData.imei) return;

    try {
      // ✅ Update device ELP using device IMEI
      await updateDeviceByImei(formData.imei, { elpid: formData.elpId });

      // Update local state
      setDevices((prev) =>
        prev.map((d) =>
          d._id === editingId
            ? {
                ...d,
                elpid: elps.find((e) => e._id === formData.elpId) || d.elpid,
              }
            : d
        )
      );

      setIsOpen(false);
      setEditingId(null);
      setFormData({ elpId: "", imei: "" });
    } catch (error) {
      console.error("Error updating device ELP:", error);
    }
  }}
>
  Update
</Button>

      </div>
    </div>
  </DialogContent>
</Dialog>

          </div>

          {/* Table */}
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>All Devices</CardTitle>
              <CardDescription>View and manage all devices</CardDescription>
            </CardHeader>
            <CardContent>
          <div className="overflow-x-auto">
  {/* Header */}
  <div className="hidden md:flex items-center justify-between p-3 bg-muted/50 rounded-t-lg font-semibold text-sm text-foreground">
    <div className="flex-1">Device Brand</div>
    <div className="flex-1">Device Model</div>
    <div className="flex-1">IMEI</div>
    <div className="flex-1">Tawerid</div>
    <div className="flex-1">ELP Name</div>
    <div className="flex-1">Status</div>
    <div className="flex-1 text-right">Actions</div>
  </div>

  {/* Device Rows */}
  <div className="space-y-2">
    {devices.map((device) => (
      <div
        key={device._id}
        className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
      >
        {/* Device Brand */}
        <div className="flex-1 font-medium text-foreground">{device.deviceBrand}</div>

        {/* Device Model */}
        <div className="flex-1 text-xs text-muted-foreground mt-1 md:mt-0">
          {device.deviceModel}
        </div>

        {/* IMEI */}
        <div className="flex-1 text-xs text-muted-foreground mt-1 md:mt-0">
          {device.imei}
        </div>

        {/* Tawerid */}
        <div className="flex-1 text-xs text-muted-foreground mt-1 md:mt-0">
          {device.Tawerid}
        </div>

        {/* ELP Name */}
        <div className="flex-1 mt-1 md:mt-0">
          <span className="text-xs px-2 py-1 rounded bg-secondary/50 text-secondary-foreground">
            {device.elpid.elpName}
          </span>
        </div>

        {/* Status */}
      {/* Status */}
<div className="flex-1 mt-1 md:mt-0 flex items-center gap-2">
  <span className="text-xs font-medium capitalize">{device.status}</span>
  <Button
    size="sm"
    variant="outline"
    onClick={() => handleStatusToggle(device)}
    disabled={updatingStatusId === device._id}
  >
    {updatingStatusId === device._id
      ? "..."
      : device.status.toLowerCase() === "active"
      ? "Deactivate"
      : "Activate"}
  </Button>
</div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Button
            size="sm"
            variant="outline"
            className="text-xs bg-transparent border-border/50"
            onClick={() => handleEdit(device)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs bg-transparent border-border/50 text-destructive hover:text-destructive"
            onClick={() => handleDelete(device._id)}
          >
            Delete
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>


            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}
