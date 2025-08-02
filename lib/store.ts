// Simple store for managing application state
interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  reportedDate: string
  address: string
  coordinates: [number, number]
  distance: string
  reportedBy?: string
  image?: string
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
      id: "1",
      title: "Broken Street Light",
      description:
        "Street light on Main Street has been flickering and now completely out. Creates safety hazard for pedestrians and drivers at night.",
      category: "Lighting",
      status: "Reported",
      reportedDate: "2024-01-15",
      address: "123 Main Street, Downtown",
      coordinates: [40.7128, -74.006],
      distance: "0.5",
      reportedBy: "john_doe",
      image: "/brokenstreetlight.webp",
      spamReports: [],
      isHidden: false,
    },
    {
      id: "2",
      title: "Large Pothole",
      description:
        "Deep pothole on Oak Avenue causing damage to vehicles. Multiple cars have reported tire damage from this hazard.",
      category: "Roads",
      status: "In Progress",
      reportedDate: "2024-01-12",
      address: "456 Oak Avenue, Midtown",
      coordinates: [40.7589, -73.9851],
      distance: "1.2",
      reportedBy: "jane_smith",
      image: "/largepothole.jpg",
      spamReports: [],
      isHidden: false,
    },
    {
      id: "3",
      title: "Water Leak",
      description:
        "Continuous water leak from underground pipe flooding the sidewalk and creating slippery conditions.",
      category: "Water Supply",
      status: "Resolved",
      reportedDate: "2024-01-10",
      address: "789 Pine Street, Uptown",
      coordinates: [40.7831, -73.9712],
      distance: "2.1",
      reportedBy: "mike_wilson",
      image: "/waterleak.jpg",
      spamReports: [],
      isHidden: false,
    },
    {
      id: "4",
      title: "Overflowing Garbage Bin",
      description:
        "Public garbage bin has been overflowing for days, attracting pests and creating unsanitary conditions.",
      category: "Cleanliness",
      status: "Reported",
      reportedDate: "2024-01-14",
      address: "321 Elm Street, Southside",
      coordinates: [40.7282, -74.0776],
      distance: "0.8",
      reportedBy: "sarah_jones",
      image: "/overflowinggarbagebin.webp",
      spamReports: [],
      isHidden: false,
    },
    {
      id: "5",
      title: "Damaged Sidewalk",
      description:
        "Cracked and uneven sidewalk creating tripping hazards for pedestrians, especially dangerous for elderly residents.",
      category: "Public Safety",
      status: "In Progress",
      reportedDate: "2024-01-11",
      address: "654 Maple Drive, Westside",
      coordinates: [40.7505, -73.9934],
      distance: "1.8",
      reportedBy: "robert_brown",
      image: "/damagedsidewalk.webp",
      spamReports: [],
      isHidden: false,
    },
    {
      id: "6",
      title: "Fallen Tree Branch",
      description:
        "Large tree branch has fallen and is blocking part of the sidewalk and bike lane after recent storm.",
      category: "Obstructions",
      status: "Reported",
      reportedDate: "2024-01-13",
      address: "987 Cedar Lane, Eastside",
      coordinates: [40.7614, -73.9776],
      distance: "3.2",
      reportedBy: "lisa_davis",
      image: "/fallentreebranch.jpeg",
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
    {
      username: "john_doe",
      email: "john@example.com",
      role: "user",
      isBanned: false,
    },
    {
      username: "jane_smith",
      email: "jane@example.com",
      role: "user",
      isBanned: false,
    },
    {
      username: "mike_wilson",
      email: "mike@example.com",
      role: "user",
      isBanned: false,
    },
  ]

  getIssues(): Issue[] {
    return this.issues.filter((issue) => !issue.isHidden)
  }

  getAllIssues(): Issue[] {
    return this.issues
  }

  getIssue(id: string): Issue | undefined {
    return this.issues.find((issue) => issue.id === id)
  }

  getIssuesByUser(username: string): Issue[] {
    return this.issues.filter((issue) => issue.reportedBy === username)
  }

  getUserIssues(username: string): Issue[] {
    return this.issues.filter((issue) => issue.reportedBy === username && !issue.isHidden)
  }

  getAllUsers(): User[] {
    return this.users
  }

  addIssue(issue: Omit<Issue, "id" | "spamReports" | "isHidden">): Issue {
    const newIssue: Issue = {
      ...issue,
      id: (this.issues.length + 1).toString(),
      spamReports: [],
      isHidden: false,
    }
    this.issues.push(newIssue)
    return newIssue
  }

  updateIssueStatus(id: string | number, status: string): boolean {
    const issueId = typeof id === "number" ? id.toString() : id
    const issue = this.issues.find((issue) => issue.id === issueId)
    if (issue) {
      issue.status = status
      return true
    }
    return false
  }

  banUser(username: string): void {
    const user = this.users.find((u) => u.username === username)
    if (user) {
      user.isBanned = true
    }
  }

  unbanUser(username: string): void {
    const user = this.users.find((u) => u.username === username)
    if (user) {
      user.isBanned = false
    }
  }

  unhideIssue(id: string | number): void {
    const issueId = typeof id === "number" ? id.toString() : id
    const issue = this.issues.find((i) => i.id === issueId)
    if (issue) {
      issue.isHidden = false
      issue.spamReports = []
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
}

export const appStore = new AppStore()
