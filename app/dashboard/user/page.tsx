"use client"

import { TopNav } from "@/components/top-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const userNav = [
  { label: "Dashboard", href: "/dashboard/user", icon: "📊" },
  { label: "Registration", href: "/dashboard/user/registration", icon: "📝" },
  { label: "Arrival", href: "/dashboard/user/arrival", icon: "📍" },
  { label: "Verification", href: "/dashboard/user/verification", icon: "✓" },
  { label: "Reports", href: "/dashboard/user/reports", icon: "📈" },
  { label: "Graph", href: "/dashboard/user/graph", icon: "📊" },
]

export default function UserDashboard() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <TopNav items={userNav} userRole="user" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">User Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your operations and records</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Registrations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">125</div>
                  <p className="text-xs text-muted-foreground mt-1">Created by user</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Arrival</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">118</div>
                  <p className="text-xs text-muted-foreground mt-1">Approved & processed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Verifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">7</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">In the way</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">94.4%</div>
                  <p className="text-xs text-muted-foreground mt-1">Approval rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="operations" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="operations">My Operations</TabsTrigger>
                <TabsTrigger value="entries">Recent Entries</TabsTrigger>
                <TabsTrigger value="stats">Performance Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="operations" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>My Operations</CardTitle>
                    <CardDescription>Registered operations and entities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Total Registration",
                          value: "1,245",
                        },
                        {
                          label: "Total Arrival",
                          value: "982",
                        },
                        {
                          label: "Total Verifications",
                          value: "156",
                        },
                        {
                          label: "Rejected",
                          value: "23",
                        },
                      ].map((op, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <p className="text-sm font-medium text-foreground">{op.label}</p>
                          <div className="text-3xl font-bold text-primary">{op.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="entries" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Recent Entries</CardTitle>
                    <CardDescription>Latest entries created</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "ENT-00845",
                          operation: "Main Operation",
                          quantity: "450 units",
                          date: "Today 2:30 PM",
                          status: "verified",
                        },
                        {
                          id: "ENT-00844",
                          operation: "Main Operation",
                          quantity: "420 units",
                          date: "Today 10:15 AM",
                          status: "verified",
                        },
                        {
                          id: "ENT-00843",
                          operation: "Secondary Operation",
                          quantity: "280 units",
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
                            <p className="text-sm text-muted-foreground">{entry.operation}</p>
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
                    <CardTitle>Performance Statistics</CardTitle>
                    <CardDescription>Your activity and success metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Monthly Progress</span>
                          <span className="text-sm text-muted-foreground">118 / 125 entries</span>
                        </div>
                        <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary"
                            style={{ width: "94.4%" }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">Average Per Entry</p>
                          <p className="text-lg font-bold text-primary mt-1">385 units</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground">Daily Average</p>
                          <p className="text-lg font-bold text-primary mt-1">1,542 units</p>
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
