"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LocationMap } from "@/components/location-map"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { addVerification, getVerificationsAndArrivals } from "@/app/api/fapi"

interface Gps {
  latitude: number
  longitude: number
}

export interface Arrival {
  _id: string
  millid: string
  deviceId: string
  elpId: string
  gps: Gps
  towerId: string
  regid: string
  haulage: string
  vehicleNumber: string
  documentNo: string
  driverImage: string
  vehicleImage: string
  permitImage: string
  remarks: string
  status: string
}

export interface Registration {
  _id: string
  userid: string
  millid: string
  deviceId: string
  elpId: string
  gps: Gps
  towerId: string
  regid: string
  haulage: string
  vehicleNumber: string
  documentNo: string
  driverImage: string
  vehicleImage: string
  permitImage: string
  remarks: string
  status: "ACCEPTED" | "REJECTED" | "PENDING"
  arrivalData?: Arrival
}

export default function VerificationPage() {
  const [verifications, setVerifications] = useState<Registration[]>([])
  const [selectedVer, setSelectedVer] = useState<Registration | null>(null)

  const user = useSelector((state: RootState) => state.users.currentUser)

  useEffect(() => {
    const millid = user?.millid?._id
    if (millid) {
      fetchByMill(millid)
    }
  }, [user])

  const fetchByMill = async (millid: string) => {
    try {
      const response = await getVerificationsAndArrivals(millid)
      setVerifications(response.data)
    } catch (error) {
      console.error("Error fetching verifications:", error)
    }
  }

 const handleAccept = async () => {
  if (!selectedVer || !selectedVer.arrivalData) return;

  try {
    const payload = {
      millid: selectedVer.millid,
      registrationid: selectedVer._id,
      arrivalid: selectedVer.arrivalData._id,
      status: "ACCEPTED",
      remarks: selectedVer.remarks || "",
    };

    await addVerification(payload);

    // Update UI after success
    setVerifications((prev) =>
      prev.map((v) =>
        v._id === selectedVer._id ? { ...v, status: "ACCEPTED" } : v
      )
    );

    setSelectedVer(null);
  } catch (error) {
    console.error("Error saving verification:", error);
  }
};

  const handleReject = async () => {
    if (!selectedVer || !selectedVer.arrivalData) return;

  try {
    const payload = {
      millid: selectedVer.millid,
      registrationid: selectedVer._id,
      arrivalid: selectedVer.arrivalData._id,
      status: "REJECTED",
      remarks: selectedVer.remarks || "",
    };

    await addVerification(payload);

    // Update UI after success
    setVerifications((prev) =>
      prev.map((v) =>
        v._id === selectedVer._id ? { ...v, status: "REJECTED" } : v
      )
    );

    setSelectedVer(null);
  } catch (error) {
    console.error("Error saving verification:", error);
  }
  }

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-card border-b border-border/50 px-8 py-4">
          <h1 className="text-2xl font-bold">Verifications</h1>
          <p className="text-sm text-muted-foreground">
            Compare registration and arrival details
          </p>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Verifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {verifications.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification List</CardTitle>
                <CardDescription>
                  All records for this mill
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {verifications.map((ver) => (
                    <div
                      key={ver._id}
                      className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border"
                    >
                      <div>
                        <p className="font-medium">
                          {ver.vehicleNumber}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Reg: {ver.regid}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            ver.status === "ACCEPTED"
                              ? "bg-green-200 text-green-700"
                              : ver.status === "REJECTED"
                              ? "bg-red-200 text-red-700"
                              : "bg-yellow-200 text-yellow-700"
                          }`}
                        >
                          {ver.status}
                        </span>

                        <Button
                          size="sm"
                          onClick={() => setSelectedVer(ver)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {verifications.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No verifications found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={!!selectedVer} onOpenChange={() => setSelectedVer(null)}>
        <DialogContent className="!max-w-[1200px] !max-h-[100vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>
              Compare Registration vs Arrival
            </DialogDescription>
          </DialogHeader>

          {selectedVer && (
            <div className="grid grid-cols-2 gap-8">
              {/* Registration Section */}
              <div className="space-y-4 border-r pr-6">
                <h3 className="font-semibold text-lg">
                  Registration
                </h3>

                <p><strong>Vehicle:</strong> {selectedVer.vehicleNumber}</p>
                <p><strong>Reg ID:</strong> {selectedVer.regid}</p>
                <p><strong>Permit:</strong> {selectedVer.documentNo}</p>
                <p><strong>Type:</strong> {selectedVer.haulage}</p>
                <p>
                  <strong>Location:</strong>{" "}
                  {selectedVer.gps.latitude},{" "}
                  {selectedVer.gps.longitude}
                </p>

                <LocationMap location={selectedVer.gps} height="h-40 w-full" />

                <div className="grid grid-cols-3 gap-2">
                  <img src={selectedVer.permitImage} className="rounded border" />
                  <img src={selectedVer.driverImage} className="rounded border" />
                  <img src={selectedVer.vehicleImage} className="rounded border" />
                </div>
              </div>

              {/* Arrival Section */}
              <div className="space-y-4 pl-6">
                <h3 className="font-semibold text-lg">
                  Arrival
                </h3>

                {selectedVer.arrivalData ? (
                  <>
                    <p><strong>Vehicle:</strong> {selectedVer.arrivalData.vehicleNumber}</p>
                    <p><strong>Reg ID:</strong> {selectedVer.arrivalData.regid}</p>
                    <p><strong>Permit:</strong> {selectedVer.arrivalData.documentNo}</p>
                    <p><strong>Type:</strong> {selectedVer.arrivalData.haulage}</p>
                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedVer.arrivalData.gps.latitude},{" "}
                      {selectedVer.arrivalData.gps.longitude}
                    </p>

                    <LocationMap
                      location={selectedVer.arrivalData.gps}
                      height="h-40 w-full"
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <img src={selectedVer.arrivalData.permitImage} className="rounded border" />
                      <img src={selectedVer.arrivalData.driverImage} className="rounded border" />
                      <img src={selectedVer.arrivalData.vehicleImage} className="rounded border" />
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    No arrival data available
                  </p>
                )}
              </div>

              <div className="col-span-2 flex justify-end gap-3 pt-6 border-t">
                <Button variant="destructive" onClick={handleReject}>
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={handleAccept}
                >
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