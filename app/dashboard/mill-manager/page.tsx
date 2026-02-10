"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { RegisterMillForm } from "@/components/register-mill-form"

const millManagerNav = [
  { label: "Dashboard", href: "/dashboard/mill-manager", icon: "📊" },
  { label: "Loading Points", href: "/dashboard/mill-manager/loading-points", icon: "📍" },
  { label: "Create Entry", href: "/dashboard/mill-manager/create-entry", icon: "✎" },
  { label: "My Entries", href: "/dashboard/mill-manager/entries", icon: "📝" },
  { label: "Documents", href: "/dashboard/mill-manager/documents", icon: "📄" },
  { label: "Reports", href: "/dashboard/mill-manager/reports", icon: "📈" },
]

export default function MillManagerDashboard() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false)

  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={millManagerNav} title="Mill Manager" userRole="mill-manager" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Valley Sugar Mill</h1>
            <p className="text-sm text-muted-foreground">Manage loading operations and entries</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setRegisterModalOpen(true)}
              variant="outline"
              className="border-border hover:bg-muted/50"
            >
              + Register Mill
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">+ New Loading Entry</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Entries This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">45</div>
                  <p className="text-xs text-muted-foreground mt-1">Sugar cane loads</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">2,150</div>
                  <p className="text-xs text-muted-foreground mt-1">Metric tons loaded</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Verified Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">42</div>
                  <p className="text-xs text-muted-foreground mt-1">Approved & completed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="points" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="points">Loading Points</TabsTrigger>
                <TabsTrigger value="entries">Recent Entries</TabsTrigger>
                <TabsTrigger value="stats">Loading Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="points" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>My Loading Points</CardTitle>
                    <CardDescription>Electronic loading points registered for this mill</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: "Main Loading Yard", location: "North Gate", status: "active", capacity: "500 tons" },
                        {
                          name: "Secondary Yard",
                          location: "East Wing",
                          status: "active",
                          capacity: "300 tons",
                        },
                        {
                          name: "Emergency Station",
                          location: "South Area",
                          status: "standby",
                          capacity: "200 tons",
                        },
                      ].map((point, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-foreground">{point.name}</p>
                            <p className="text-xs text-muted-foreground">{point.location}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">Max: {point.capacity}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                point.status === "active"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {point.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="entries" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Recent Loading Entries</CardTitle>
                    <CardDescription>Latest entries from your mill</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCL-001248",
                          point: "Main Loading Yard",
                          quantity: "450 tons",
                          date: "Today 2:30 PM",
                          status: "verified",
                        },
                        {
                          id: "SCL-001247",
                          point: "Main Loading Yard",
                          quantity: "420 tons",
                          date: "Today 10:15 AM",
                          status: "verified",
                        },
                        {
                          id: "SCL-001246",
                          point: "Secondary Yard",
                          quantity: "280 tons",
                          date: "Yesterday 4:45 PM",
                          status: "pending",
                        },
                      ].map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-foreground">{entry.id}</p>
                            <p className="text-sm text-muted-foreground">{entry.point}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{entry.quantity}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">{entry.date}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  entry.status === "pending" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                                }`}
                              >
                                {entry.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Loading Statistics</CardTitle>
                    <CardDescription>Monthly loading performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Month Progress</span>
                          <span className="text-sm text-muted-foreground">2,150 / 3,000 tons</span>
                        </div>
                        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: "71.7%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">Average Load</p>
                          <p className="text-lg font-bold text-primary mt-1">47.8 tons</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">Daily Average</p>
                          <p className="text-lg font-bold text-primary mt-1">143.3 tons</p>
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

      <RegisterMillForm open={registerModalOpen} onOpenChange={setRegisterModalOpen} />
    </div>
  )
}
