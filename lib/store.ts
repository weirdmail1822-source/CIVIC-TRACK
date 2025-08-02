// Simple store for managing application state
interface Issue {
  id: number
  title: string
  description: string
  category: string
  status: string
  address: string
  reportedDate: string
  reportedTime: string
  reportedBy: string
  distance: string
  image: string
  coordinates?: { lat: number; lng: number }
  spamReports: string[]
  isHidden: boolean
}

interface User {
  username: string
  email: string
  role: "user" | "admin"
  isBanned: boolean
}

class AppStore {
  private issues: Issue[] = [
    {
      id: 1,
      title: "Broken Street Light",
      description: "Street light has been out for 3 days, making the area unsafe at night",
      category: "Lighting",
      status: "In Progress",
      address: "123 Main St, Downtown",
      reportedDate: "2024-01-15",
      reportedTime: "14:30",
      reportedBy: "system",
      distance: "0.5",
      image: "/placeholder.svg?height=200&width=300&text=Broken+Street+Light",
      coordinates: { lat: 40.7128, lng: -74.006 },
      spamReports: [],
      isHidden: false,
    },
    {
      id: 2,
      title: "Large Pothole",
      description: "Deep pothole causing damage to vehicles on main road",
      category: "Roads",
      status: "Reported",
      address: "Highway 101, Mile 15",
      reportedDate: "2024-01-14",
      reportedTime: "16:45",
      reportedBy: "system",
      distance: "2.1",
      image: "/placeholder.svg?height=200&width=300&text=Large+Pothole",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      spamReports: [],
      isHidden: false,
    },
  ]

  private users: User[] = [
    {
      username: "admin",
      email: "admin@civictrack.com",
      role: "admin",
      isBanned: false,
    },
  ]

  private notifications: Array<{
    id: string
    message: string
    type: "info" | "success" | "warning" | "error"
    timestamp: Date
    userId: string
  }> = []

  getIssues() {
    return this.issues.filter((issue) => !issue.isHidden)
  }

  getAllIssues() {
    return this.issues
  }

  getIssueById(id: number) {
    return this.issues.find((issue) => issue.id === id)
  }

  getUserIssues(username: string) {
    return this.issues.filter((issue) => issue.reportedBy === username && !issue.isHidden)
  }

  addIssue(issue: Omit<Issue, "id" | "spamReports" | "isHidden">) {
    const newIssue: Issue = {
      ...issue,
      id: Math.max(...this.issues.map((i) => i.id), 0) + 1,
      spamReports: [],
      isHidden: false,
    }
    this.issues.push(newIssue)
    return newIssue
  }

  reportSpam(issueId: number, reportedBy: string) {
    const issue = this.issues.find((i) => i.id === issueId)
    if (issue && !issue.spamReports.includes(reportedBy)) {
      issue.spamReports.push(reportedBy)

      // Auto-hide if reported by 3 or more users
      if (issue.spamReports.length >= 3) {
        issue.isHidden = true
        this.addNotification({
          message: `Issue "${issue.title}" has been auto-hidden due to multiple spam reports`,
          type: "warning",
          userId: "admin",
        })
      }
    }
  }

  getUser(username: string) {
    return this.users.find((user) => user.username === username)
  }

  addUser(user: User) {
    this.users.push(user)
  }

  banUser(username: string) {
    const user = this.users.find((u) => u.username === username)
    if (user) {
      user.isBanned = true
    }
  }

  unbanUser(username: string) {
    const user = this.users.find((u) => u.username === username)
    if (user) {
      user.isBanned = false
    }
  }

  getAnalytics() {
    const totalIssues = this.issues.length
    const categoryStats = this.issues.reduce(
      (acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const statusStats = this.issues.reduce(
      (acc, issue) => {
        acc[issue.status] = (acc[issue.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const spamReports = this.issues.filter((issue) => issue.spamReports.length > 0)
    const hiddenIssues = this.issues.filter((issue) => issue.isHidden)

    return {
      totalIssues,
      categoryStats,
      statusStats,
      spamReports: spamReports.length,
      hiddenIssues: hiddenIssues.length,
      mostReportedCategory: Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "None",
    }
  }

  addNotification(notification: Omit<(typeof this.notifications)[0], "id" | "timestamp">) {
    this.notifications.push({
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    })
  }

  getNotifications(userId: string) {
    return this.notifications.filter((n) => n.userId === userId || n.userId === "all")
  }

  updateIssueStatus(issueId: number, status: string) {
    const issue = this.issues.find((i) => i.id === issueId)
    if (issue) {
      issue.status = status
    }
  }

  unhideIssue(issueId: number) {
    const issue = this.issues.find((i) => i.id === issueId)
    if (issue) {
      issue.isHidden = false
      issue.spamReports = []
    }
  }
}

export const appStore = new AppStore()
