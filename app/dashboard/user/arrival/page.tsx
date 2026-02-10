"use client"

import { useState } from "react"
import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LocationMap } from "@/components/location-map"

const userNav = [
  { label: "Dashboard", href: "/dashboard/user", icon: "📊" },
  { label: "Registration", href: "/dashboard/user/registration", icon: "📝" },
  { label: "Arrival", href: "/dashboard/user/arrival", icon: "📍" },
  { label: "Verification", href: "/dashboard/user/verification", icon: "✓" },
  { label: "Reports", href: "/dashboard/user/reports", icon: "📈" },
  { label: "Graph", href: "/dashboard/user/graph", icon: "📊" },
]

interface Arrival {
  id: string
  vehicleNumber: string
  registrationNumber: string
  permitNumber: string
  vehicleType: string
  driverName: string
  vehicleLocation: string
  location: string
  vehiclePicture: string
  permitPicture: string
  driverPicture: string
  arrivalTime: string
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

const mockArrivals: Arrival[] = [
  {
    id: "ARR-001",
    vehicleNumber: "MH-01-AB-1234",
    registrationNumber: "REG-2024-001",
    permitNumber: "PERMIT-2024-001",
    vehicleType: "Truck",
    driverName: "Rajesh Kumar",
    vehicleLocation: "Mill Gate A",
    location: "Pune, Maharashtra",
    vehiclePicture: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300&h=300&fit=crop",
    permitPicture: "https://images.unsplash.com/photo-1578575494967-25de1025183e?w=300&h=300&fit=crop",
    driverPicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    arrivalTime: "10:30 AM",
    createdAt: "2024-01-15",
    status: "pending",
  },
  {
    id: "ARR-002",
    vehicleNumber: "MH-02-CD-5678",
    registrationNumber: "REG-2024-002",
    permitNumber: "PERMIT-2024-002",
    vehicleType: "Truck",
    driverName: "Priya Singh",
    vehicleLocation: "Mill Gate B",
    location: "Nashik, Maharashtra",
    vehiclePicture: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300&h=300&fit=crop",
    permitPicture: "https://images.unsplash.com/photo-1578575494967-25de1025183e?w=300&h=300&fit=crop",
    driverPicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
    arrivalTime: "11:45 AM",
    createdAt: "2024-01-16",
    status: "approved",
  },
]

export default function ArrivalPage() {
  const [arrivals, setArrivals] = useState<Arrival[]>(mockArrivals)
  const [selectedArr, setSelectedArr] = useState<Arrival | null>(null)

  const handleViewDetails = (arr: Arrival) => {
    setSelectedArr(arr)
  }

  const handleAccept = () => {
    if (selectedArr) {
      setArrivals(arrivals.map((a) => (a.id === selectedArr.id ? { ...a, status: "approved" } : a)))
      setSelectedArr(null)
    }
  }

  const handleReject = () => {
    if (selectedArr) {
      setArrivals(arrivals.map((a) => (a.id === selectedArr.id ? { ...a, status: "rejected" } : a)))
      setSelectedArr(null)
    }
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <TopNav items={userNav} userRole="user" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Arrivals at Mill Gate</h1>
          <p className="text-sm text-muted-foreground">View and verify vehicle arrivals</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-4">
            {/* KPI Card */}
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Arrivals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{arrivals.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>

            {/* Arrivals List */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Arrival List</CardTitle>
                <CardDescription>All arrivals at the mill gate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {arrivals.map((arr) => (
                    <div
                      key={arr.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{arr.vehicleNumber}</p>
                        <p className="text-sm text-muted-foreground">Reg: {arr.registrationNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">Driver: {arr.driverName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            arr.status === "approved"
                              ? "bg-primary/20 text-primary"
                              : arr.status === "rejected"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-accent/20 text-accent"
                          }`}
                        >
                          {arr.status}
                        </span>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                          onClick={() => handleViewDetails(arr)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {arrivals.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No arrivals found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={!!selectedArr} onOpenChange={() => setSelectedArr(null)}>
        <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Arrival Details</DialogTitle>
            <DialogDescription>Vehicle Arrival at Mill - {selectedArr?.vehicleNumber}</DialogDescription>
          </DialogHeader>

          {selectedArr && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Vehicle Number</label>
                    <p className="text-base">{selectedArr.vehicleNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Registration Number</label>
                    <p className="text-base">{selectedArr.registrationNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Permit Number</label>
                    <p className="text-base">{selectedArr.permitNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
                    <p className="text-base">{selectedArr.vehicleType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Driver Name</label>
                    <p className="text-base">{selectedArr.driverName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Arrival Time</label>
                    <p className="text-base">{selectedArr.arrivalTime}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Location Map</label>
                  <LocationMap location={selectedArr.location} height="h-30 w-50" />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-3">Documents</label>
                  <div className="grid grid-cols-3 gap-3">
                    <img
                      src={selectedArr.vehiclePicture || "/placeholder.svg"}
                      alt="Vehicle"
                      className="w-full h-30 object-cover rounded-lg border border-gray-300"
                    />
                    <img
                      src={selectedArr.permitPicture || "/placeholder.svg"}
                      alt="Permit"
                      className="w-full h-30 object-cover rounded-lg border border-gray-300"
                    />
                    <img
                      src={selectedArr.driverPicture || "/placeholder.svg"}
                      alt="Driver"
                      className="w-full h-30 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button onClick={handleReject} variant="destructive">
                  Reject
                </Button>
                <Button onClick={handleAccept} className="bg-green-600 hover:bg-green-700">
                  Accept
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
