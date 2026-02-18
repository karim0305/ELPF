"use client"

import { use, useEffect, useState } from "react"
import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LocationMap } from "@/components/location-map"
import { getRegistrationbyMill, updateRegistration } from "@/app/api/fapi"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"



interface Registration {
  _id: string;
  millid: string;
  deviceId: string;
  elpId: string;

  gps: {
    latitude: number;
    longitude: number;
  };
  towerId: string;
  regid: string;
  haulage: string;
  vehicleNumber: string;
  documentNo: string;

  driverImage: string;
  vehicleImage: string;
  permitImage: string;

  remarks: string;
  status: "Accepted" | "Rejected" | "Pending"; //
}



export default function RegistrationPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [vehicleNumber, setVehicleNumber] = useState(selectedReg?.vehicleNumber || "");
const [permitNumber, setPermitNumber] = useState(selectedReg?.documentNo || "");
const [haulage, setHaulage] = useState(selectedReg?.haulage || "");
const [loading, setLoading] = useState(false);



  const handleViewDetails = (reg: Registration) => {
    setSelectedReg(reg)
  }

  const handleAccept = async ( selectedReg: Registration) => {
    if (!selectedReg) return;
    setLoading(true);
    try {
      await updateRegistration(selectedReg._id, {
        vehicleNumber,
        documentNo: permitNumber,
        haulage,
        status: "Accepted",
      });
      setSelectedReg(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }



 const handleReject = async (selectedReg: Registration) => {
  if (!selectedReg) return;
  setLoading(true);

  try {
    await updateRegistration(selectedReg._id, {
      vehicleNumber,
      documentNo: permitNumber,
      haulage,
      status: "Rejected", // set status to Rejected
    });

    // Close dialog
    setSelectedReg(null);

  } catch (error) {
    console.error("Failed to reject registration:", error);
  } finally {
    setLoading(false);
  }
};


  const user = useSelector((state: RootState) => state.users.currentUser);
  useEffect(() => {
    const millid = user?.millid?._id;
    if (millid) {
      GetRegistrationsByMill(millid);
    }
      setVehicleNumber(selectedReg?.vehicleNumber || "");
  setPermitNumber(selectedReg?.documentNo || "");
  setHaulage(selectedReg?.haulage || "");
  }, [registrations.length, selectedReg]);

  const GetRegistrationsByMill = async (millid: string) => {
    try {
      const response = await getRegistrationbyMill(millid);
      console.log("Registrations fetched by millid:", response.data);
      setRegistrations(response.data);
    } catch (error) {
      console.error("Error fetching registrations by millid:", error);
    }
  };



  return (
    <div className="flex flex-col bg-background min-h-screen">

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Registrations from Loading Points</h1>
          <p className="text-sm text-muted-foreground">View and approve vehicle registrations</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-4">
            {/* KPI Card */}
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{registrations.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </CardContent>
            </Card>

            {/* Registrations List */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Registration List</CardTitle>
                <CardDescription>All registrations from loading points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {registrations.map((reg) => (
                    <div
                      key={reg._id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border/30"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <img
                          src={reg.driverImage}
                          alt="Driver"
                          className="w-16 h-16 rounded-full object-cover object-[50%_30%] scale-110 border"
                        />
                        {/* Text Content */}
                        <div className="flex-1">
                          <p className="font-sm text-foreground">{reg.elpId}</p>
                          <p className="font-medium text-foreground">Reg: {reg.regid}</p>
                          <p className="font-sm text-foreground">Doc: {reg.towerId}</p>
                        </div>
                      </div>
                           {/* Forgetting ELP Name update backend registration service */}
                      {/* async getByMillId(millid: string, deviceId?: string) {
  const query: any = { millid };

  if (deviceId) query.deviceId = deviceId;

  return this.registrationModel
    .find(query)
    .populate('millid')   // <-- populate MillInfo
    .populate('deviceId') // <-- populate Device
    .populate('elpId')    // <-- populate Elp
    .exec();
} */}

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-xs px-2 py-1 rounded font-medium ${reg.status === "Accepted"
                              ? "bg-primary/20 text-primary"
                              : reg.status === "Rejected"
                                ? "bg-destructive/20 text-destructive"
                                : "bg-accent/20 text-accent"
                            }`}
                        >
                          {reg.status}
                        </span>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                          onClick={() => handleViewDetails(reg)}
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {registrations.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No registrations found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
        <DialogContent className="!max-w-[1200px] !max-h-[100vh] !overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
            <DialogDescription>Vehicle Registration - {selectedReg?.vehicleNumber}</DialogDescription>
          </DialogHeader>
          {selectedReg && (<div className="space-y-0">
            <div className="space-y-0">
              <div className="grid grid-cols-2 gap-2">
                 <div>
      <label className="text-sm font-semibold text-gray-700">Registration Number</label>
       <p className="text-base">{selectedReg.regid}</p> 
       </div>
              <div>
  <label className="text-sm font-semibold text-gray-700">Vehicle Number</label>
  <input
    type="text"
    value={vehicleNumber}
    onChange={(e) => setVehicleNumber(e.target.value)}
    className="w-full border border-gray-300 rounded-md p-2 mt-1"
    placeholder="Enter Vehicle Number"
  />
</div>
               <div>
  <label className="text-sm font-semibold text-gray-700">Permit Number</label>
  <input
    type="text"
    value={permitNumber}
    onChange={(e) => setPermitNumber(e.target.value)}
    className="w-full border border-gray-300 rounded-md p-2 mt-1"
    placeholder="Enter Permit Number"
  />
</div>
              <div>
  <label className="text-sm font-semibold text-gray-700">Vehicle Type</label>
  <select
    value={haulage}
    onChange={(e) => setHaulage(e.target.value)}
    className="w-full border border-gray-300 rounded-md p-2 mt-1"
  >
    <option value="">Select Vehicle Type</option>
    <option value="Truck">Truck</option>
    <option value="Trailer">Trailer</option>
    <option value="Tipper">Tipper</option>
    <option value="Crane">Crane</option>
    {/* Add all haulage types your backend accepts */}
  </select>
</div>


                {/* <div> <label className="text-sm font-semibold text-gray-700">Driver Name</label>
        <p className="text-base">{selectedReg.driverImage}</p>
         </div>  */}


                <div>
                  <label className="text-sm font-semibold text-gray-700">Vehicle Location</label>
                  <p className="text-base">
                    {selectedReg?.gps?.latitude ?? "N/A"}, {selectedReg?.gps?.longitude ?? "N/A"}
                  </p>
                </div>

              </div>


              <div> <label className="text-sm font-semibold text-gray-700 block mb-3">Documents</label> <div className="grid grid-cols-3 gap-2">
                <img src={selectedReg.vehicleImage || "/placeholder.svg"} alt="Vehicle" className="w-full h-30 object-cover rounded-lg border border-gray-300" />
                <img src={selectedReg.permitImage || "/placeholder.svg"} alt="Permit" className="w-full h-30 object-cover rounded-lg border border-gray-300" />
                <img src={selectedReg.driverImage || "/placeholder.svg"} alt="Driver" className="w-full h-30 object-cover rounded-lg border border-gray-300" />
              </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Location Map</label>
                <LocationMap
                  location={{
                    latitude: selectedReg.gps.latitude,
                    longitude: selectedReg.gps.longitude,
                  }}
                  height="h-[200px]"
                />


              </div> </div> <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
  onClick={() => handleReject(selectedReg)}
  variant="destructive"
>
  Reject
</Button>

             
<Button
  className="bg-green-600 hover:bg-green-700"
  disabled={loading}
  onClick={async () => handleAccept(selectedReg)}
>
  {loading ? "Updating..." : "Accept"}
</Button>
                
                </div> </div>)}

        </DialogContent>
      </Dialog>
    </div>
  )
}
