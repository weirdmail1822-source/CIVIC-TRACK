"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, AlertTriangle } from "lucide-react"

interface DashboardProps {
  totalIssues: number
  pendingIssues: number
  resolvedIssues: number
  totalUsers: number
  recentIssues: Array<{
    id: string
    title: string
    category: string
    status: string
    reportedAt: string
    location: string
  }>
}

export function Dashboard({ totalIssues, pendingIssues, resolvedIssues, totalUsers, recentIssues }: DashboardProps) {
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0
  const pendingRate = totalIssues > 0 ? Math.round((pendingIssues / totalIssues) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-[#b4a7d6]/20">
          <CardHeader>
            <CardTitle className="flex items-center text-[#674ea7]">
              <BarChart3 className="h-5 w-5 mr-2" />
              Resolution Analytics
            </CardTitle>
            <CardDescription>Issue resolution performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Resolution Rate</span>
                <span className="font-medium">{resolutionRate}%</span>
              </div>
              <Progress value={resolutionRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Pending Issues</span>
                <span className="font-medium">{pendingRate}%</span>
              </div>
              <Progress value={pendingRate} className="h-2 bg-orange-100" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#b4a7d6]/20">
          <CardHeader>
            <CardTitle className="flex items-center text-[#674ea7]">
              <TrendingUp className="h-5 w-5 mr-2" />
              Community Growth
            </CardTitle>
            <CardDescription>User engagement and growth metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Active Users</span>
              <Badge className="bg-green-100 text-green-800">{totalUsers}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Reports</span>
              <Badge className="bg-blue-100 text-blue-800">{totalIssues}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Avg. Response Time</span>
              <Badge className="bg-purple-100 text-purple-800">2.3 days</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card className="border-[#b4a7d6]/20">
        <CardHeader>
          <CardTitle className="flex items-center text-[#674ea7]">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Recent Issues
          </CardTitle>
          <CardDescription>Latest reported issues requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentIssues.slice(0, 5).map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between p-3 border border-[#b4a7d6]/20 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-[#674ea7]">{issue.title}</h4>
                  <p className="text-sm text-gray-600">{issue.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs border-[#b4a7d6] text-[#674ea7]">
                      {issue.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{issue.reportedAt}</span>
                  </div>
                </div>
                <Badge
                  variant={issue.status === "resolved" ? "default" : "secondary"}
                  className={
                    issue.status === "resolved" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
                  }
                >
                  {issue.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="border-[#b4a7d6]/20">
        <CardHeader>
          <CardTitle className="text-[#674ea7]">Issue Categories</CardTitle>
          <CardDescription>Distribution of issues by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Road Maintenance", count: Math.floor(totalIssues * 0.3), color: "bg-red-100 text-red-800" },
              {
                name: "Street Lighting",
                count: Math.floor(totalIssues * 0.25),
                color: "bg-yellow-100 text-yellow-800",
              },
              { name: "Waste Management", count: Math.floor(totalIssues * 0.2), color: "bg-green-100 text-green-800" },
              { name: "Water Supply", count: Math.floor(totalIssues * 0.15), color: "bg-blue-100 text-blue-800" },
            ].map((category) => (
              <div key={category.name} className="text-center p-3 border border-[#b4a7d6]/20 rounded-lg">
                <div className="text-2xl font-bold text-[#674ea7] mb-1">{category.count}</div>
                <div className="text-sm font-medium mb-2">{category.name}</div>
                <Badge className={category.color}>{Math.round((category.count / totalIssues) * 100)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
