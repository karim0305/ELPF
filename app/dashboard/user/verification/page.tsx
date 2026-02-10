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

interface VerificationData {
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
  registrationDetails: {
    vehicleNumber: string
    registrationNumber: string
    permitNumber: string
    vehicleType: string
    driverName: string
    vehicleLocation: string
    location: string
  }
  arrivalDetails: {
    vehicleNumber: string
    registrationNumber: string
    arrivalTime: string
    arrivalLocation: string
    location: string
  }
  createdAt: string
  status: "pending" | "approved" | "rejected"
}

const mockVerifications: VerificationData[] = [
  {
    id: "VER-001",
    vehicleNumber: "MH-01-AB-1234",
    registrationNumber: "REG-2024-001",
    permitNumber: "PERMIT-2024-001",
    vehicleType: "Truck",
    driverName: "Rajesh Kumar",
    vehicleLocation: "Loading Point A",
    location: "Pune, Maharashtra",
    vehiclePicture: "vehicle_001.jpg",
    permitPicture: "permit_001.jpg",
    driverPicture: "driver_001.jpg",
    registrationDetails: {
      vehicleNumber: "MH-01-AB-1234",
      registrationNumber: "REG-2024-001",
      permitNumber: "PERMIT-2024-001",
      vehicleType: "Truck",
      driverName: "Rajesh Kumar",
      vehicleLocation: "Loading Point A",
      location: "Pune, Maharashtra",
    },
    arrivalDetails: {
      vehicleNumber: "MH-01-AB-1234",
      registrationNumber: "REG-2024-001",
      arrivalTime: "10:30 AM",
      arrivalLocation: "Mill Gate A",
      location: "Pune, Maharashtra",
    },
    createdAt: "2024-01-15",
    status: "pending",
  },
  {
    id: "VER-002",
    vehicleNumber: "MH-02-CD-5678",
    registrationNumber: "REG-2024-002",
    permitNumber: "PERMIT-2024-002",
    vehicleType: "Truck",
    driverName: "Priya Singh",
    vehicleLocation: "Loading Point B",
    location: "Nashik, Maharashtra",
    vehiclePicture: "vehicle_002.jpg",
    permitPicture: "permit_002.jpg",
    driverPicture: "driver_002.jpg",
    registrationDetails: {
      vehicleNumber: "MH-02-CD-5678",
      registrationNumber: "REG-2024-002",
      permitNumber: "PERMIT-2024-002",
      vehicleType: "Truck",
      driverName: "Priya Singh",
      vehicleLocation: "Loading Point B",
      location: "Nashik, Maharashtra",
    },
    arrivalDetails: {
      vehicleNumber: "MH-02-CD-5678",
      registrationNumber: "REG-2024-002",
      arrivalTime: "11:45 AM",
      arrivalLocation: "Mill Gate B",
      location: "Nashik, Maharashtra",
    },
    createdAt: "2024-01-16",
    status: "approved",
  },
]

export default function VerificationPage() {
  const [verifications, setVerifications] = useState<VerificationData[]>(mockVerifications)
  const [selectedVer, setSelectedVer] = useState<VerificationData | null>(null)

  const handleViewDetails = (ver: VerificationData) => {
    setSelectedVer(ver)
  }

  const handleAccept = () => {
    if (selectedVer) {
      setVerifications(verifications.map((v) => (v.id === selectedVer.id ? { ...v, status: "approved" } : v)))
      setSelectedVer(null)
    }
  }

  const handleReject = () => {
    if (selectedVer) {
      setVerifications(verifications.map((v) => (v.id === selectedVer.id ? { ...v, status: "rejected" } : v)))
      setSelectedVer(null)
    }
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <TopNav items={userNav} userRole="user" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Verifications</h1>
          <p className="text-sm text-muted-foreground">Compare registration and arrival details for verification</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-4">
            {/* KPI Card */}
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{verifications.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>

            {/* Verifications List */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Verification List</CardTitle>
                <CardDescription>All verifications requiring comparison of registration and arrival</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verifications.map((ver) => (
                    <div
                      key={ver.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/30"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{ver.vehicleNumber}</p>
                        <p className="text-sm text-muted-foreground">Reg: {ver.registrationNumber}</p>
                        <p className="text-xs text-muted-foreground mt-1">Driver: {ver.driverName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            ver.status === "approved"
                              ? "bg-primary/20 text-primary"
                              : ver.status === "rejected"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-accent/20 text-accent"
                          }`}
                        >
                          {ver.status}
                        </span>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                          onClick={() => handleViewDetails(ver)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {verifications.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No verifications found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* View Details Modal with Both Sections */}
      <Dialog open={!!selectedVer} onOpenChange={() => setSelectedVer(null)}>
        <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>Comparing Registration vs Arrival - {selectedVer?.vehicleNumber}</DialogDescription>
          </DialogHeader>

          {selectedVer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                {/* Registration Section */}
                <div className="space-y-4 border-r border-gray-300 pr-6">
                  <h3 className="text-lg font-semibold text-gray-800">Registration Section</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Vehicle Number</label>
                      <p className="text-base">{selectedVer.registrationDetails.vehicleNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Registration Number</label>
                      <p className="text-base">{selectedVer.registrationDetails.registrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Permit Number</label>
                      <p className="text-base">{selectedVer.registrationDetails.permitNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
                      <p className="text-base">{selectedVer.registrationDetails.vehicleType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Driver Name</label>
                      <p className="text-base">{selectedVer.registrationDetails.driverName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Vehicle Location</label>
                      <p className="text-base">{selectedVer.registrationDetails.vehicleLocation}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Registration Location Map</label>
                    <LocationMap location={selectedVer.registrationDetails.location} height="h-30 w-50" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-3">Registration Documents</label>
                    <div className="grid grid-cols-3 gap-3">
                      <img
                        src={selectedVer.vehiclePicture || "/placeholder.svg"}
                        alt="Vehicle"
                        className="w-full h-30 object-cover rounded-lg border border-gray-300"
                      />
                      <img
                        src={selectedVer.permitPicture || "/placeholder.svg"}
                        alt="Permit"
                        className="w-full h-30 object-cover rounded-lg border border-gray-300"
                      />
                      <img
                        src={selectedVer.driverPicture || "/placeholder.svg"}
                        alt="Driver"
                        className="w-full h-30 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Arrival Section */}
                <div className="space-y-4 pl-6">
                  <h3 className="text-lg font-semibold text-gray-800">Arrival Section</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Vehicle Number</label>
                      <p className="text-base">{selectedVer.arrivalDetails.vehicleNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Registration Number</label>
                      <p className="text-base">{selectedVer.arrivalDetails.registrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Arrival Time</label>
                      <p className="text-base">{selectedVer.arrivalDetails.arrivalTime}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Arrival Location</label>
                      <p className="text-base">{selectedVer.arrivalDetails.arrivalLocation}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Arrival Location Map</label>
                    <LocationMap location={selectedVer.arrivalDetails.location} height="h-30 w-50" />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 block mb-3">Arrival Documents</label>
                    <div className="grid grid-cols-3 gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300&h=300&fit=crop"
                        alt="Vehicle"
                        className="w-full h-30 object-cover rounded-lg border border-gray-300"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1578575494967-25de1025183e?w=300&h=300&fit=crop"
                        alt="Permit"
                        className="w-full h-30 object-cover rounded-lg border border-gray-300"
                      />
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
                        alt="Driver"
                        className="w-full h-30 object-cover rounded-lg border border-gray-300"
                      />
                    </div>
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
