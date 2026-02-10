"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const transporterNav = [
  { label: "Dashboard", href: "/dashboard/transporter", icon: "📊" },
  { label: "Available Loads", href: "/dashboard/transporter/loads", icon: "🚚" },
  { label: "My Assignments", href: "/dashboard/transporter/assignments", icon: "📋" },
  { label: "Create Entry", href: "/dashboard/transporter/create-entry", icon: "✎" },
  { label: "Document Upload", href: "/dashboard/transporter/documents", icon: "📤" },
  { label: "Trip History", href: "/dashboard/transporter/history", icon: "🔄" },
  { label: "Earnings", href: "/dashboard/transporter/earnings", icon: "💰" },
]

export default function TransporterDashboard() {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={transporterNav} title="Transporter" userRole="transporter" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Swift Logistics Co.</h1>
            <p className="text-sm text-muted-foreground">Transport and entry management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50 bg-transparent">
              📍 My Location
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ New Entry</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Active assignments</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">28</div>
                  <p className="text-xs text-muted-foreground mt-1">Completed deliveries</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Verified Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">27</div>
                  <p className="text-xs text-muted-foreground mt-1">Documents approved</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">1</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="active" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="active">Active Trips</TabsTrigger>
                <TabsTrigger value="submit">Submit Entry</TabsTrigger>
                <TabsTrigger value="status">Entry Status</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Your Active Trips</CardTitle>
                    <CardDescription>Ongoing sugar cane transportation assignments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "TRIP-0845",
                          mill: "Valley Sugar Mill",
                          pickup: "Main Yard",
                          destination: "Central Mill Depot",
                          status: "in-transit",
                          progress: 65,
                          quantity: "48 tons",
                        },
                        {
                          id: "TRIP-0844",
                          mill: "Valley Sugar Mill",
                          pickup: "Secondary Yard",
                          destination: "East Distribution",
                          status: "assigned",
                          progress: 0,
                          quantity: "42 tons",
                        },
                        {
                          id: "TRIP-0843",
                          mill: "Crown Sugar Works",
                          pickup: "Main Gate",
                          destination: "North Hub",
                          status: "scheduled",
                          progress: 0,
                          quantity: "55 tons",
                        },
                      ].map((trip) => (
                        <div key={trip.id} className="p-4 border border-border/50 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium text-foreground">{trip.id}</p>
                              <p className="text-sm text-muted-foreground">{trip.mill}</p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                trip.status === "in-transit"
                                  ? "bg-primary/20 text-primary"
                                  : trip.status === "assigned"
                                    ? "bg-secondary/20 text-secondary"
                                    : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {trip.status.replace("-", " ")}
                            </span>
                          </div>

                          <div className="text-sm text-muted-foreground mb-3">
                            <p>From: {trip.pickup}</p>
                            <p>To: {trip.destination}</p>
                            <p className="text-primary font-medium mt-1">{trip.quantity}</p>
                          </div>

                          {trip.progress > 0 && (
                            <div className="mb-3">
                              <div className="flex justify-between mb-1">
                                <span className="text-xs text-muted-foreground">Progress</span>
                                <span className="text-xs text-muted-foreground">{trip.progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-secondary"
                                  style={{ width: `${trip.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="border-border/50 text-xs bg-transparent">
                              📍 Update Location
                            </Button>
                            <Button size="sm" variant="outline" className="border-border/50 text-xs bg-transparent">
                              ✓ Complete Trip
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="submit" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Submit New Entry</CardTitle>
                    <CardDescription>Create a new loading entry for approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Mill</label>
                          <select className="w-full px-3 py-2 bg-input border border-border/50 rounded-lg text-foreground">
                            <option>Valley Sugar Mill</option>
                            <option>Crown Sugar Works</option>
                            <option>Golden Harvest Mill</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Select Loading Point</label>
                          <select className="w-full px-3 py-2 bg-input border border-border/50 rounded-lg text-foreground">
                            <option>Main Loading Yard</option>
                            <option>Secondary Yard</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Quantity (Metric Tons)</label>
                          <input
                            type="number"
                            placeholder="Enter quantity"
                            className="w-full px-3 py-2 bg-input border border-border/50 rounded-lg text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Destination</label>
                          <input
                            type="text"
                            placeholder="Delivery location"
                            className="w-full px-3 py-2 bg-input border border-border/50 rounded-lg text-foreground"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Vehicle Details</label>
                        <input
                          type="text"
                          placeholder="Vehicle registration & details"
                          className="w-full px-3 py-2 bg-input border border-border/50 rounded-lg text-foreground"
                        />
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Proceed to Document Upload
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Entry Status Tracker</CardTitle>
                    <CardDescription>Track approval progress of your entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCL-001250",
                          mill: "Valley Sugar Mill",
                          submitted: "Today",
                          stage: "Loading Point Review",
                          progress: 30,
                        },
                        {
                          id: "SCL-001249",
                          mill: "Valley Sugar Mill",
                          submitted: "Yesterday",
                          stage: "Regional Approval",
                          progress: 65,
                        },
                        {
                          id: "SCL-001248",
                          mill: "Valley Sugar Mill",
                          submitted: "2 days ago",
                          stage: "Completed",
                          progress: 100,
                        },
                      ].map((entry) => (
                        <div key={entry.id} className="p-4 border border-border/50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-foreground">{entry.id}</p>
                              <p className="text-sm text-muted-foreground">{entry.mill}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{entry.submitted}</span>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-foreground font-medium">{entry.stage}</span>
                              <span className="text-xs text-muted-foreground">{entry.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                style={{ width: `${entry.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {entry.progress < 100 && (
                              <Button size="sm" variant="outline" className="border-border/50 text-xs bg-transparent">
                                View Details
                              </Button>
                            )}
                            {entry.progress === 100 && (
                              <Button size="sm" className="bg-primary/20 text-primary text-xs" disabled>
                                ✓ Completed
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
