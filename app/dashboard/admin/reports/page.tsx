"use client"

import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { use, useEffect, useState } from "react"
import { AdminLayout } from "../AdminLayout"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { Mill } from "@/redux/slices/userSlice"



// Sample ELPs (Electronic Loading Points)
const elps = [
  { id: 1, name: "Loading Point A" },
  { id: 2, name: "Loading Point B" },
  { id: 3, name: "Loading Point C" },
  { id: 4, name: "Loading Point D" },
  { id: 5, name: "Loading Point E" },
]

interface ReportFilters {
  fromDate: string
  toDate: string
  elp: string
}

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

export default function ReportsPage() {
  const user = useSelector((state: RootState) => state.users.currentUser);
 const [userName, setUserName] = useState("");
 const [millName, setMillName] = useState("");
 const [millid, setMillid] = useState("");
  const [logo , setLogo] = useState("");
 useEffect(() => {
   if (user) {
     setUserName(user.name);  
     setMillName(user.millid?.millname ?? "");
     setMillid(user.millid?._id ?? "");
     setLogo(user.millid?.profilePicture ?? "");
   }
 }, [user])
  const [registrationFilters, setRegistrationFilters] = useState<ReportFilters>({
    fromDate: "",
    toDate: "",
    elp: "",
  })
  const [arrivalFilters, setArrivalFilters] = useState<ReportFilters>({
    fromDate: "",
    toDate: "",
    elp: "",
  })
  const [verificationFilters, setVerificationFilters] = useState<ReportFilters>({
    fromDate: "",
    toDate: "",
    elp: "",
  })

  const ReportFiltersSection = ({ title, filters, setFilters }: any) => (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{title} Filters</CardTitle>
          <CardDescription>Select date range and loading point</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* From Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">From Date</label>
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                className="bg-background border-input"
              />
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">To Date</label>
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                className="bg-background border-input"
              />
            </div>

            {/* ELP Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Loading Point (ELP)</label>
              <Select value={filters.elp} onValueChange={(value) => setFilters({ ...filters, elp: value })}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="Select ELP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Loading Points</SelectItem>
                  {elps.map((elp) => (
                    <SelectItem key={elp.id} value={elp.id.toString()}>
                      {elp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Generate Report Button */}
            <div className="space-y-2 flex items-end">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Data Table */}
      <Card className="bg-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{title} Report Data</CardTitle>
          <CardDescription>Showing filtered results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Vehicle</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ELP</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Driver</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item} className="border-b border-border/50 hover:bg-secondary/5">
                    <td className="py-3 px-4 text-foreground">#{1000 + item}</td>
                    <td className="py-3 px-4 text-foreground">2024-01-{15 + item}</td>
                    <td className="py-3 px-4 text-foreground">MH-01-AB-{1200 + item}</td>
                    <td className="py-3 px-4 text-foreground">Loading Point A</td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Accepted
                      </span>
                    </td>
                    <td className="py-3 px-4 text-foreground">Rajesh Kumar</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <AdminLayout username={userName} millName={millName} logo={logo} >
    <div className="flex flex-col bg-background min-h-screen">
    
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">Generate and view detailed reports</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <Tabs defaultValue="registration" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-secondary/20 p-1 rounded-lg mb-6">
              <TabsTrigger value="registration" className="text-foreground data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Registration
              </TabsTrigger>
              <TabsTrigger value="arrival" className="text-foreground data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Arrival
              </TabsTrigger>
              <TabsTrigger value="verification" className="text-foreground data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                Verification
              </TabsTrigger>
            </TabsList>

            {/* Registration Tab */}
            <TabsContent value="registration" className="space-y-4">
              <ReportFiltersSection
                title="Registration"
                filters={registrationFilters}
                setFilters={setRegistrationFilters}
              />
            </TabsContent>

            {/* Arrival Tab */}
            <TabsContent value="arrival" className="space-y-4">
              <ReportFiltersSection
                title="Arrival"
                filters={arrivalFilters}
                setFilters={setArrivalFilters}
              />
            </TabsContent>

            {/* Verification Tab */}
            <TabsContent value="verification" className="space-y-4">
              <ReportFiltersSection
                title="Verification"
                filters={verificationFilters}
                setFilters={setVerificationFilters}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </AdminLayout>
  )
}
