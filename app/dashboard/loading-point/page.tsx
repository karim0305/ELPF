"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const loadingPointNav = [
  { label: "Dashboard", href: "/dashboard/loading-point", icon: "📊" },
  { label: "Active Operations", href: "/dashboard/loading-point/operations", icon: "⚙️" },
  { label: "Received Entries", href: "/dashboard/loading-point/entries", icon: "📥" },
  { label: "Verify & Approve", href: "/dashboard/loading-point/verify", icon: "✓" },
  { label: "Equipment Status", href: "/dashboard/loading-point/equipment", icon: "🔧" },
  { label: "Daily Report", href: "/dashboard/loading-point/report", icon: "📊" },
]

export default function LoadingPointDashboard() {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={loadingPointNav} title="Loading Point Manager" userRole="loading-point" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Main Loading Yard - Valley Sugar Mill</h1>
            <p className="text-sm text-muted-foreground">Electronic loading point operations and monitoring</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50 bg-transparent">
              🔄 Live Status
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">📋 Today's Summary</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* Live Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Today's Loads</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">12</div>
                  <p className="text-xs text-muted-foreground mt-1">Sugar cane loads processed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">580</div>
                  <p className="text-xs text-muted-foreground mt-1">Metric tons today</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Point Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">72%</div>
                  <p className="text-xs text-muted-foreground mt-1">Current utilization</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">4</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting verification</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="active" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="active">Active Operations</TabsTrigger>
                <TabsTrigger value="pending">Pending Verification</TabsTrigger>
                <TabsTrigger value="daily">Daily Operations</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Currently Processing</CardTitle>
                    <CardDescription>Live operations at this loading point</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCLL-00524",
                          transporter: "Swift Logistics Co.",
                          quantity: "48 tons",
                          time: "Started 2:15 PM",
                          progress: 75,
                        },
                        {
                          id: "SCLL-00523",
                          transporter: "Green Transport Ltd",
                          quantity: "52 tons",
                          time: "Started 1:45 PM",
                          progress: 45,
                        },
                      ].map((op) => (
                        <div key={op.id} className="p-4 border border-border/50 rounded-lg bg-muted/20">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium text-foreground">{op.id}</p>
                              <p className="text-sm text-muted-foreground">{op.transporter}</p>
                            </div>
                            <span className="text-sm font-medium text-primary">{op.quantity}</span>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-xs text-muted-foreground">{op.time}</span>
                              <span className="text-xs text-muted-foreground">{op.progress}% complete</span>
                            </div>
                            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                style={{ width: `${op.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border/50 text-xs bg-transparent w-full"
                          >
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Entries Requiring Verification</CardTitle>
                    <CardDescription>Sugar cane entries waiting for loading point approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCL-001250",
                          mill: "Valley Sugar Mill",
                          transporter: "Swift Logistics",
                          docs: 4,
                          submitted: "30 minutes ago",
                        },
                        {
                          id: "SCL-001249",
                          mill: "Valley Sugar Mill",
                          transporter: "Green Transport",
                          docs: 4,
                          submitted: "1 hour ago",
                        },
                      ].map((entry) => (
                        <div key={entry.id} className="p-4 border border-border/50 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <p className="font-medium text-foreground">{entry.id}</p>
                              <p className="text-sm text-muted-foreground">{entry.mill}</p>
                              <p className="text-xs text-muted-foreground">{entry.transporter}</p>
                            </div>
                            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                              {entry.docs} documents
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">Submitted {entry.submitted}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                            >
                              ✓ Approve Load
                            </Button>
                            <Button size="sm" variant="outline" className="border-border/50 text-xs bg-transparent">
                              📋 Review Docs
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="daily" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Daily Operations Summary</CardTitle>
                    <CardDescription>Today's loading activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Capacity Utilization</span>
                          <span className="text-sm text-muted-foreground">360 / 500 tons</span>
                        </div>
                        <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: "72%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Completed</p>
                          <p className="text-2xl font-bold text-primary mt-1">10</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">In Progress</p>
                          <p className="text-2xl font-bold text-secondary mt-1">2</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">Pending</p>
                          <p className="text-2xl font-bold text-accent mt-1">4</p>
                        </div>
                      </div>
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
