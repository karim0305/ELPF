"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const regionalAdminNav = [
  { label: "Dashboard", href: "/dashboard/regional-admin", icon: "📊" },
  { label: "Region Mills", href: "/dashboard/regional-admin/mills", icon: "🏭" },
  { label: "Loading Points", href: "/dashboard/regional-admin/loading-points", icon: "📍" },
  { label: "Entries to Verify", href: "/dashboard/regional-admin/verify-entries", icon: "✓" },
  { label: "Regional Reports", href: "/dashboard/regional-admin/reports", icon: "📈" },
]

export default function RegionalAdminDashboard() {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={regionalAdminNav} title="Regional Administrator" userRole="regional-admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Central Region Dashboard</h1>
            <p className="text-sm text-muted-foreground">Regional monitoring and approval management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50 bg-transparent">
              📋 Region Report
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">➕ Register Mill</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Mills in Region</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">24</div>
                  <p className="text-xs text-muted-foreground mt-1">Active mills</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Loading Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">56</div>
                  <p className="text-xs text-muted-foreground mt-1">Electronic points</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">1,240</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">23</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting regional approval</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="mills" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="mills">Mills & Loading Points</TabsTrigger>
                <TabsTrigger value="recent">Recent Entries</TabsTrigger>
                <TabsTrigger value="approval">Approval Queue</TabsTrigger>
              </TabsList>

              <TabsContent value="mills" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Mills in Central Region</CardTitle>
                    <CardDescription>Registered sugar mills with their operational status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: "Valley Sugar Mill", location: "District A", points: 8, status: "active" },
                        { name: "Golden Harvest Mill", location: "District B", points: 5, status: "active" },
                        { name: "Crown Sugar Works", location: "District C", points: 6, status: "active" },
                        { name: "Premium Mills Ltd", location: "District A", points: 4, status: "maintenance" },
                      ].map((mill, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-foreground">{mill.name}</p>
                            <p className="text-xs text-muted-foreground">{mill.location}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">{mill.points} loading points</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                mill.status === "active" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"
                              }`}
                            >
                              {mill.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Recent Entries in Region</CardTitle>
                    <CardDescription>Latest sugar cane loading entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCL-001245",
                          mill: "Valley Sugar Mill",
                          quantity: "2,450 tons",
                          date: "Today",
                          status: "pending",
                        },
                        {
                          id: "SCL-001244",
                          mill: "Golden Harvest Mill",
                          quantity: "1,820 tons",
                          date: "Today",
                          status: "verified",
                        },
                        {
                          id: "SCL-001243",
                          mill: "Crown Sugar Works",
                          quantity: "3,100 tons",
                          date: "Yesterday",
                          status: "verified",
                        },
                      ].map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{entry.id}</p>
                            <p className="text-sm text-muted-foreground">{entry.mill}</p>
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

              <TabsContent value="approval" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Approval Queue</CardTitle>
                    <CardDescription>Entries awaiting regional verification</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCL-001245",
                          mill: "Valley Sugar Mill",
                          submitted: "2 hours ago",
                          urgency: "high",
                        },
                        { id: "SCL-001246", mill: "Crown Sugar Works", submitted: "5 hours ago", urgency: "high" },
                        {
                          id: "SCL-001247",
                          mill: "Golden Harvest Mill",
                          submitted: "8 hours ago",
                          urgency: "medium",
                        },
                      ].map((item) => (
                        <div key={item.id} className="p-4 border border-border/50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-medium text-foreground">{item.id}</p>
                              <p className="text-sm text-muted-foreground">{item.mill}</p>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded font-medium ${
                                item.urgency === "high"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {item.urgency} priority
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">Submitted {item.submitted}</p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                            >
                              ✓ Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-border/50 text-xs bg-transparent">
                              ✗ Reject
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border/50 ml-auto text-xs bg-transparent"
                            >
                              📋 View Details
                            </Button>
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
