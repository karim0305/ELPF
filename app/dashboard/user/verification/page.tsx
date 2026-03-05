"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LocationMap } from "@/components/location-map"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { addVerification, getVerificationsAndArrivals, updateVerification } from "@/app/api/fapi"
import { Mill } from "@/redux/slices/userSlice"

interface Gps {
  latitude: number
  longitude: number
}
export interface Elp {
  _id: string;
  millid: string;
  elpCode: string;
  elpName: string;
  remarks: string;
  status: string; // "active" | "inactive" agar fixed values hain to union bana sakte ho
  createdAt: string;
  updatedAt: string;
  __v: number;
}


interface Arrival {
  _id: string
  millid: string
  deviceId: string
  elpId: Elp
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
  createdAt: string
  updatedAt: string
}

interface Registration {
  _id: string
  userid?: string
  millid?: string
  deviceId?: string
  elpId?: Elp
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
  createdAt?: string
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
      console.log("Fetched verifications:", response.data)
    } catch (error) {
      console.error("Error fetching verifications:", error)
    }
  }
 
const handleAccept = async () => {
  if (!selectedVer) return;

  try {
    await updateVerification(selectedVer._id, {
      status: "Accepted",
    });

    // 🔥 Remove from list immediately
    setVerifications((prev) =>
      prev.filter((v) => v._id !== selectedVer._id)
    );

    setSelectedVer(null);
  } catch (error) {
    console.error("Error updating verification:", error);
  }
};

const handleReject = async () => {
  if (!selectedVer) return;

  try {
    await updateVerification(selectedVer._id, {
      status: "Rejected",
    });

    setVerifications((prev) =>
      prev.filter((v) => v._id !== selectedVer._id)
    );

    setSelectedVer(null);
  } catch (error) {
    console.error("Error updating verification:", error);
  }
};

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
                         Vehicle Number {ver.registrationid?.vehicleNumber || "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Registration ID {ver.registrationid?.regid || "-"}
                        </p>
                            <p className="text-sm text-muted-foreground">
                          Document No {ver.registrationid?.documentNo || "-"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                           <span
                          className={`text-xs px-2 py-1 rounded font-medium ${ver.status === "Accepted"
                              ? "bg-primary/20 text-primary"
                              : ver.status === "Rejected"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-accent/20 text-accent"
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
                <p><strong>Tower ID:</strong> {selectedVer.registrationid?.towerId || "-"}</p>
                <p><strong>ELP:</strong> {selectedVer.registrationid?.elpId?.elpName || "-"}</p>
                <p>
                   <span className="font-semibold">Registration Time:</span> 
  <span className="bg-gray-100 text-green-700 px-2 py-1 rounded-lg">
     6h 33m ago
  </span>
                  </p>

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

              {/* 


              
              
              
              */}
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
                    <p><strong>Tower ID:</strong> {selectedVer.arrivalid.towerId}</p>
                    <p><strong>ELP:</strong> {selectedVer.arrivalid.elpId.elpName}</p>
                     <p>
                      <span className="font-semibold">Arrival Time:</span> 
  <span className="bg-gray-100 text-green-700 px-2 py-1 rounded-lg">
     1h 33m ago
  </span>
                     </p>

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