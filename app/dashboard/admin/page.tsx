"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const adminNav = [
  { label: "Dashboard", href: "/dashboard/admin", icon: "📊" },
  {
    label: "Manage",
    icon: "⚙️",
    children: [
      { label: "Manage User", href: "/dashboard/admin/manage/users", icon: "👥" },
      { label: "Manage LP", href: "/dashboard/admin/manage/loading-points", icon: "📍" },
      { label: "Manage Haulage", href: "/dashboard/admin/manage/haulage", icon: "🚚" },
    ],
  },
  { label: "Approve", href: "/dashboard/admin/approvals", icon: "✓" },
]

export default function AdminDashboard() {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={adminNav} userRole="admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Administrator Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage users, records, and approvals</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">156</div>
                  <p className="text-xs text-muted-foreground mt-1">Active users</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">24</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Records Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">3,240</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Completed Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">89%</div>
                  <p className="text-xs text-muted-foreground mt-1">Monthly target</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="users" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="users">Manage User</TabsTrigger>
                <TabsTrigger value="loading-points">Manage LP</TabsTrigger>
                <TabsTrigger value="haulage">Manage Haulage</TabsTrigger>
                <TabsTrigger value="approvals">Approve</TabsTrigger>
                <TabsTrigger value="records">Recent Records</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Manage Users</CardTitle>
                    <CardDescription>View and manage all system users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: "Alice Johnson", role: "User", status: "active", email: "alice@example.com" },
                        { name: "Bob Smith", role: "User", status: "active", email: "bob@example.com" },
                        { name: "Carol Davis", role: "User", status: "inactive", email: "carol@example.com" },
                      ].map((user, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                user.status === "active"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              {user.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="loading-points" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Loading Points Management</CardTitle>
                    <CardDescription>View and manage all loading points</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Placeholder for Loading Points content */}
                      <p>Loading Points content goes here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="haulage" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Haulage Management</CardTitle>
                    <CardDescription>View and manage all haulage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {/* Placeholder for Haulage content */}
                      <p>Haulage content goes here</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approvals" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Approval Queue</CardTitle>
                    <CardDescription>Records awaiting approval</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { id: "REC-001", type: "User Registration", submitted: "2 hours ago", urgency: "high" },
                        { id: "REC-002", type: "Document Upload", submitted: "5 hours ago", urgency: "high" },
                        { id: "REC-003", type: "Data Entry", submitted: "8 hours ago", urgency: "medium" },
                      ].map((item) => (
                        <div key={item.id} className="p-4 border border-border/50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium text-foreground">{item.id}</p>
                              <p className="text-sm text-muted-foreground">{item.type}</p>
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="records" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Recent Records</CardTitle>
                    <CardDescription>Latest created or modified records</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { id: "REC-0425", type: "Data Entry", created: "Today 3:30 PM", status: "completed" },
                        { id: "REC-0424", type: "Document Upload", created: "Today 2:15 PM", status: "completed" },
                        { id: "REC-0423", type: "User Registration", created: "Yesterday 4:45 PM", status: "pending" },
                      ].map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{record.id}</p>
                            <p className="text-sm text-muted-foreground">{record.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">{record.created}</p>
                            <span
                              className={`inline-block text-xs px-2 py-1 rounded mt-1 ${
                                record.status === "completed"
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary/20 text-secondary"
                              }`}
                            >
                              {record.status}
                            </span>
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
