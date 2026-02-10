"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const nationalAdminNav = [
  { label: "Dashboard", href: "/dashboard/national-admin", icon: "📊" },
  { label: "All Regions", href: "/dashboard/national-admin/regions", icon: "🗺️" },
  { label: "All Mills", href: "/dashboard/national-admin/mills", icon: "🏭" },
  { label: "Loading Points", href: "/dashboard/national-admin/loading-points", icon: "📍" },
  { label: "Entries & Verification", href: "/dashboard/national-admin/entries", icon: "✓" },
  { label: "Reports & Analytics", href: "/dashboard/national-admin/reports", icon: "📈" },
  { label: "System Management", href: "/dashboard/national-admin/management", icon: "⚙️" },
]

export default function NationalAdminDashboard() {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={nationalAdminNav} title="National Administrator" userRole="national-admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">National Administrator</h1>
            <p className="text-sm text-muted-foreground">System-wide monitoring and management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border/50 bg-transparent">
              📥 Export Data
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">➕ Add Region</Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">24</div>
                  <p className="text-xs text-muted-foreground mt-1">Active regions nationwide</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Mills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">156</div>
                  <p className="text-xs text-muted-foreground mt-1">Registered sugar mills</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Loading Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">342</div>
                  <p className="text-xs text-muted-foreground mt-1">Electronic loading points</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">87</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="overview">System Overview</TabsTrigger>
                <TabsTrigger value="recent">Recent Activities</TabsTrigger>
                <TabsTrigger value="alerts">Alerts & Issues</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Regional Distribution</CardTitle>
                    <CardDescription>Sugar cane entries processed by region (Last 30 days)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["North Region", "Central Region", "South Region", "East Region", "West Region"].map(
                        (region) => (
                          <div key={region} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{region}</span>
                            <div className="flex items-center gap-4 flex-1 ml-4">
                              <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-secondary"
                                  style={{ width: `${Math.random() * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-muted-foreground w-12 text-right">
                                {Math.floor(Math.random() * 1000)}
                              </span>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recent" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Recent System Activities</CardTitle>
                    <CardDescription>Latest operations across all regions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { action: "Entry Verified", region: "North Region", time: "2 hours ago", status: "success" },
                        {
                          action: "New Mill Registered",
                          region: "Central Region",
                          time: "4 hours ago",
                          status: "success",
                        },
                        {
                          action: "Loading Point Update",
                          region: "South Region",
                          time: "6 hours ago",
                          status: "pending",
                        },
                        { action: "Document Rejected", region: "East Region", time: "1 day ago", status: "error" },
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="text-sm font-medium">{activity.action}</p>
                            <p className="text-xs text-muted-foreground">{activity.region}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                                activity.status === "success"
                                  ? "bg-primary/20 text-primary"
                                  : activity.status === "pending"
                                    ? "bg-secondary/20 text-secondary"
                                    : "bg-destructive/20 text-destructive"
                              }`}
                            >
                              {activity.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>System Alerts</CardTitle>
                    <CardDescription>Critical issues requiring attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          icon: "⚠️",
                          title: "High Verification Backlog",
                          desc: "87 entries awaiting national approval",
                          severity: "high",
                        },
                        {
                          icon: "🔔",
                          title: "Regional Admin Inactivity",
                          desc: "West Region hasn't logged in for 7 days",
                          severity: "medium",
                        },
                        {
                          icon: "📊",
                          title: "System Performance",
                          desc: "API response time exceeding 500ms",
                          severity: "medium",
                        },
                      ].map((alert, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-lg border ${
                            alert.severity === "high"
                              ? "bg-destructive/5 border-destructive/20"
                              : "bg-accent/5 border-accent/20"
                          }`}
                        >
                          <div className="flex gap-3">
                            <span className="text-xl">{alert.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{alert.title}</p>
                              <p className="text-sm text-muted-foreground">{alert.desc}</p>
                            </div>
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
