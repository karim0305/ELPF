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

interface Mill {
  _id: string
  millcode?: string
  millname?: string
  focalperson?: string
  cnic?: string
  phone?: string
  address?: string
  email?: string
  profilePicture?: string
  status?: string
}

interface Arrival {
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

interface Registration {
  _id: string
  userid?: string
  millid?: string
  deviceId?: string
  elpId?: string
  gps?: Gps
  towerId?: string
  regid?: string
  haulage?: string
  vehicleNumber?: string
  documentNo?: string
  driverImage?: string
  vehicleImage?: string
  permitImage?: string
  remarks?: string
  status?: "Accepted" | "Rejected" | "Pending"
}

interface Verification {
  _id: string
  millid: Mill
  registrationid: Registration
  arrivalid?: Arrival
  status: string
  remarks?: string
  createdAt?: string
  updatedAt?: string
}

export default function VerificationPage() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [selectedVer, setSelectedVer] = useState<Verification | null>(null)

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
    if (!selectedVer) return;

    try {
      const payload = {
        millid: selectedVer.millid?._id || selectedVer.millid,
        registrationid: selectedVer.registrationid?._id || selectedVer.registrationid,
        arrivalid: selectedVer.arrivalid?._id || selectedVer.arrivalid,
        status: "Accepted",
        remarks: selectedVer.remarks || "",
      };

      await addVerification(payload as any);

      // Update UI after success
      setVerifications((prev) =>
        prev.map((v) =>
          v._id === selectedVer._id ? { ...v, status: "Accepted" } : v
        )
      );

      setSelectedVer(null);
    } catch (error) {
      console.error("Error saving verification:", error);
    }
  };

  const handleReject = async () => {
    if (!selectedVer) return;

    try {
      const payload = {
        millid: selectedVer.millid?._id || selectedVer.millid,
        registrationid: selectedVer.registrationid?._id || selectedVer.registrationid,
        arrivalid: selectedVer.arrivalid?._id || selectedVer.arrivalid,
        status: "Rejected",
        remarks: selectedVer.remarks || "",
      };

      await addVerification(payload as any);

      // Update UI after success
      setVerifications((prev) =>
        prev.map((v) =>
          v._id === selectedVer._id ? { ...v, status: "Rejected" } : v
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
                          {ver.registrationid?.vehicleNumber || "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Reg: {ver.registrationid?.regid || "-"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${
                            ver.status === "Accepted"
                              ? "bg-green-200 text-green-700"
                              : ver.status === "Rejected"
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
                <p><strong>Vehicle:</strong> {selectedVer.registrationid?.vehicleNumber || "-"}</p>
                <p><strong>Reg ID:</strong> {selectedVer.registrationid?.regid || "-"}</p>
                <p><strong>Permit:</strong> {selectedVer.registrationid?.documentNo || "-"}</p>
                <p><strong>Type:</strong> {selectedVer.registrationid?.haulage || "-"}</p>

                {selectedVer.registrationid?.gps ? (
                  <>
                    <p>
                      <strong>Location:</strong>{" "}
                      {selectedVer.registrationid.gps.latitude},{" "}
                      {selectedVer.registrationid.gps.longitude}
                    </p>

                    <LocationMap location={selectedVer.registrationid.gps} height="h-40 w-full" />
                  </>
                ) : (
                  <p className="text-muted-foreground">No registration location</p>
                )}

                <div className="grid grid-cols-3 gap-2">
                  <img src={selectedVer.registrationid?.permitImage} className="rounded border" />
                  <img src={selectedVer.registrationid?.driverImage} className="rounded border" />
                  <img src={selectedVer.registrationid?.vehicleImage} className="rounded border" />
                </div>
              </div>

              {/* Arrival Section */}
              <div className="space-y-4 pl-6">
                <h3 className="font-semibold text-lg">
                  Arrival
                </h3>
                {selectedVer.arrivalid ? (
                  <>
                    <p><strong>Vehicle:</strong> {selectedVer.arrivalid.vehicleNumber}</p>
                    <p><strong>Reg ID:</strong> {selectedVer.arrivalid.regid}</p>
                    <p><strong>Permit:</strong> {selectedVer.arrivalid.documentNo}</p>
                    <p><strong>Type:</strong> {selectedVer.arrivalid.haulage}</p>
                    {selectedVer.arrivalid.gps ? (
                      <>
                        <p>
                          <strong>Location:</strong>{" "}
                          {selectedVer.arrivalid.gps.latitude},{" "}
                          {selectedVer.arrivalid.gps.longitude}
                        </p>

                        <LocationMap
                          location={selectedVer.arrivalid.gps}
                          height="h-40 w-full"
                        />
                      </>
                    ) : (
                      <p className="text-muted-foreground">No arrival location</p>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <img src={selectedVer.arrivalid.permitImage} className="rounded border" />
                      <img src={selectedVer.arrivalid.driverImage} className="rounded border" />
                      <img src={selectedVer.arrivalid.vehicleImage} className="rounded border" />
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