"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const verificationNav = [
  { label: "Dashboard", href: "/dashboard/entry-verification", icon: "📊" },
  { label: "Pending Verification", href: "/dashboard/entry-verification/pending", icon: "⏳" },
  { label: "Verified Entries", href: "/dashboard/entry-verification/verified", icon: "✓" },
  { label: "Verification History", href: "/dashboard/entry-verification/history", icon: "📜" },
]

export default function EntryVerificationPage() {
  return (
    <div className="flex bg-background min-h-screen">
      <SidebarNav items={verificationNav} title="Entry Verification" userRole="regional-admin" />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-card border-b border-border/50 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Entry Verification & Tracking</h1>
            <p className="text-sm text-muted-foreground">Multi-stage verification workflow management</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="grid gap-6">
            {/* Verification Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pending Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">23</div>
                  <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Verified Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">45</div>
                  <p className="text-xs text-muted-foreground mt-1">Approved & processed</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">1,240</div>
                  <p className="text-xs text-muted-foreground mt-1">Entries processed</p>
                </CardContent>
              </Card>
            </div>

            {/* Verification Workflow Diagram */}
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle>Verification Workflow</CardTitle>
                <CardDescription>Multi-stage approval process</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between overflow-x-auto">
                  {[
                    { stage: "Entry Created", status: "complete", icon: "✎" },
                    { stage: "Doc Upload", status: "complete", icon: "📤" },
                    { stage: "LP Review", status: "in-progress", icon: "👁️" },
                    { stage: "Regional Approval", status: "pending", icon: "✓" },
                    { stage: "National Review", status: "pending", icon: "🏛️" },
                    { stage: "Completed", status: "pending", icon: "🎉" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                            item.status === "complete"
                              ? "bg-primary/20 text-primary"
                              : item.status === "in-progress"
                                ? "bg-secondary/20 text-secondary"
                                : "bg-muted/50 text-muted-foreground"
                          }`}
                        >
                          {item.icon}
                        </div>
                        <p className="text-xs mt-2 text-center text-foreground font-medium">{item.stage}</p>
                      </div>
                      {i < 5 && (
                        <div
                          className={`flex-1 h-1 mx-1 ${
                            item.status === "complete"
                              ? "bg-primary"
                              : item.status === "in-progress"
                                ? "bg-secondary"
                                : "bg-muted/50"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="pending" className="space-y-4">
              <TabsList className="bg-muted/50 border-border/50">
                <TabsTrigger value="pending">Pending Verification</TabsTrigger>
                <TabsTrigger value="review">Under Review</TabsTrigger>
                <TabsTrigger value="approved">Approved Entries</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Entries Awaiting Verification</CardTitle>
                    <CardDescription>Documents ready for initial loading point review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCL-001250",
                          mill: "Valley Sugar Mill",
                          transporter: "Swift Logistics",
                          submitted: "30 min ago",
                          stage: "Document Review",
                        },
                        {
                          id: "SCL-001251",
                          mill: "Crown Sugar Works",
                          transporter: "Green Transport",
                          submitted: "1 hour ago",
                          stage: "Document Review",
                        },
                        {
                          id: "SCL-001252",
                          mill: "Golden Harvest Mill",
                          transporter: "Fast Delivery",
                          submitted: "2 hours ago",
                          stage: "Document Review",
                        },
                      ].map((entry) => (
                        <div
                          key={entry.id}
                          className="p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{entry.id}</p>
                              <p className="text-sm text-muted-foreground">{entry.mill}</p>
                              <p className="text-xs text-muted-foreground">{entry.transporter}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{entry.submitted}</p>
                              <span className="inline-block text-xs px-2 py-1 mt-1 bg-secondary/20 text-secondary rounded">
                                {entry.stage}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                            >
                              ✓ Approve
                            </Button>
                            <Button size="sm" variant="outline" className="border-border/50 text-xs bg-transparent">
                              📋 Review
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-destructive/30 text-destructive text-xs bg-transparent"
                            >
                              ✗ Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="review" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Entries Under Review</CardTitle>
                    <CardDescription>Currently being verified at various stages</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        {
                          id: "SCL-001248",
                          stage: "Regional Approval",
                          progress: 50,
                          submitted: "3 hours ago",
                        },
                        {
                          id: "SCL-001247",
                          stage: "National Review",
                          progress: 75,
                          submitted: "6 hours ago",
                        },
                      ].map((entry) => (
                        <div key={entry.id} className="p-4 border border-border/50 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <p className="font-medium text-foreground">{entry.id}</p>
                            <span className="text-xs text-muted-foreground">{entry.submitted}</span>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">{entry.stage}</span>
                              <span className="text-xs text-muted-foreground">{entry.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                style={{ width: `${entry.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <Button size="sm" variant="outline" className="border-border/50 text-xs bg-transparent">
                            View Progress
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="approved" className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader>
                    <CardTitle>Approved & Completed Entries</CardTitle>
                    <CardDescription>Successfully verified entries</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { id: "SCL-001246", mill: "Valley Sugar Mill", completed: "Today 4:30 PM" },
                        { id: "SCL-001245", mill: "Crown Sugar Works", completed: "Today 2:15 PM" },
                        { id: "SCL-001244", mill: "Golden Harvest Mill", completed: "Yesterday" },
                      ].map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between"
                        >
                          <div>
                            <p className="font-medium text-foreground">{entry.id}</p>
                            <p className="text-sm text-muted-foreground">{entry.mill}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">✓ Completed</span>
                            <p className="text-xs text-muted-foreground mt-1">{entry.completed}</p>
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
