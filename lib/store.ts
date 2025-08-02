import { create } from "zustand"

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

interface StoreState {
  issues: Issue[]
  users: User[]
  notifications: Array<{
    id: string
    message: string
    type: "info" | "success" | "warning" | "error"
    timestamp: Date
    userId: string
  }>
  currentUser: string | null
  getIssues: () => Issue[]
  getAllIssues: () => Issue[]
  getIssueById: (id: number) => Issue | undefined
  getUserIssues: (username: string) => Issue[]
  addIssue: (issue: Omit<Issue, "id" | "spamReports" | "isHidden">) => Issue
  updateIssue: (id: number, updates: Partial<Issue>) => boolean
  deleteIssue: (id: number) => boolean
  reportSpam: (issueId: number, reportedBy: string) => void
  getUser: (username: string) => User | undefined
  getAllUsers: () => User[]
  addUser: (user: User) => void
  banUser: (username: string) => void
  unbanUser: (username: string) => void
  setCurrentUser: (username: string | null) => void
  addNotification: (notification: Omit<StoreState["notifications"][0], "id" | "timestamp">) => void
  getNotifications: (userId: string) => StoreState["notifications"]
  updateIssueStatus: (issueId: number, status: string) => void
  unhideIssue: (issueId: number) => void
}

export const useStore = create<StoreState>((set, get) => ({
  issues: [
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
  ],
  users: [
    {
      username: "admin",
      email: "admin@civictrack.com",
      role: "admin",
      isBanned: false,
    },
  ],
  notifications: [],
  currentUser: null,

  getIssues: () => get().issues.filter((issue) => !issue.isHidden),
  getAllIssues: () => get().issues,
  getIssueById: (id: number) => get().issues.find((issue) => issue.id === id),
  getUserIssues: (username: string) => get().issues.filter((issue) => issue.reportedBy === username && !issue.isHidden),

  addIssue: (issue) => {
    const state = get()
    const newIssue: Issue = {
      ...issue,
      id: Math.max(...state.issues.map((i) => i.id), 0) + 1,
      spamReports: [],
      isHidden: false,
    }
    set({ issues: [...state.issues, newIssue] })
    return newIssue
  },

  updateIssue: (id: number, updates: Partial<Issue>) => {
    const state = get()
    const issueIndex = state.issues.findIndex((issue) => issue.id === id)
    if (issueIndex === -1) return false

    const updatedIssues = [...state.issues]
    updatedIssues[issueIndex] = { ...updatedIssues[issueIndex], ...updates }
    set({ issues: updatedIssues })
    return true
  },

  deleteIssue: (id: number) => {
    const state = get()
    const issueIndex = state.issues.findIndex((issue) => issue.id === id)
    if (issueIndex === -1) return false

    const updatedIssues = state.issues.filter((issue) => issue.id !== id)
    set({ issues: updatedIssues })
    return true
  },

  reportSpam: (issueId: number, reportedBy: string) => {
    const state = get()
    const issue = state.issues.find((i) => i.id === issueId)
    if (issue && !issue.spamReports.includes(reportedBy)) {
      const updatedIssues = state.issues.map((i) => {
        if (i.id === issueId) {
          const updatedSpamReports = [...i.spamReports, reportedBy]
          return {
            ...i,
            spamReports: updatedSpamReports,
            isHidden: updatedSpamReports.length >= 3,
          }
        }
        return i
      })

      set({ issues: updatedIssues })

      if (issue.spamReports.length + 1 >= 3) {
        get().addNotification({
          message: `Issue "${issue.title}" has been auto-hidden due to multiple spam reports`,
          type: "warning",
          userId: "admin",
        })
      }
    }
  },

  getUser: (username: string) => get().users.find((user) => user.username === username),
  getAllUsers: () => get().users,

  addUser: (user: User) => {
    const state = get()
    set({ users: [...state.users, user] })
  },

  banUser: (username: string) => {
    const state = get()
    const updatedUsers = state.users.map((user) => (user.username === username ? { ...user, isBanned: true } : user))
    set({ users: updatedUsers })
  },

  unbanUser: (username: string) => {
    const state = get()
    const updatedUsers = state.users.map((user) => (user.username === username ? { ...user, isBanned: false } : user))
    set({ users: updatedUsers })
  },

  setCurrentUser: (username: string | null) => set({ currentUser: username }),

  addNotification: (notification) => {
    const state = get()
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    set({ notifications: [...state.notifications, newNotification] })
  },

  getNotifications: (userId: string) => {
    const state = get()
    return state.notifications.filter((n) => n.userId === userId || n.userId === "all")
  },

  updateIssueStatus: (issueId: number, status: string) => {
    const state = get()
    const updatedIssues = state.issues.map((issue) => (issue.id === issueId ? { ...issue, status } : issue))
    set({ issues: updatedIssues })
  },

  unhideIssue: (issueId: number) => {
    const state = get()
    const updatedIssues = state.issues.map((issue) =>
      issue.id === issueId ? { ...issue, isHidden: false, spamReports: [] } : issue,
    )
    set({ issues: updatedIssues })
  },
}))

// Legacy compatibility - keeping the old appStore for existing code
class AppStore {
  getIssues() {
    return useStore.getState().getIssues()
  }

  getAllIssues() {
    return useStore.getState().getAllIssues()
  }

  getIssueById(id: number) {
    return useStore.getState().getIssueById(id)
  }

  getUserIssues(username: string) {
    return useStore.getState().getUserIssues(username)
  }

  addIssue(issue: Omit<Issue, "id" | "spamReports" | "isHidden">) {
    return useStore.getState().addIssue(issue)
  }

  updateIssue(id: number, updates: Partial<Issue>) {
    return useStore.getState().updateIssue(id, updates)
  }

  deleteIssue(id: number) {
    return useStore.getState().deleteIssue(id)
  }

  reportSpam(issueId: number, reportedBy: string) {
    return useStore.getState().reportSpam(issueId, reportedBy)
  }

  getUser(username: string) {
    return useStore.getState().getUser(username)
  }

  getAllUsers() {
    return useStore.getState().getAllUsers()
  }

  addUser(user: User) {
    return useStore.getState().addUser(user)
  }

  banUser(username: string) {
    return useStore.getState().banUser(username)
  }

  unbanUser(username: string) {
    return useStore.getState().unbanUser(username)
  }

  getAnalytics() {
    const issues = useStore.getState().getAllIssues()
    const totalIssues = issues.length
    const categoryStats = issues.reduce(
      (acc, issue) => {
        acc[issue.category] = (acc[issue.category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const statusStats = issues.reduce(
      (acc, issue) => {
        acc[issue.status] = (acc[issue.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const spamReports = issues.filter((issue) => issue.spamReports.length > 0)
    const hiddenIssues = issues.filter((issue) => issue.isHidden)

    return {
      totalIssues,
      categoryStats,
      statusStats,
      spamReports: spamReports.length,
      hiddenIssues: hiddenIssues.length,
      mostReportedCategory: Object.entries(categoryStats).sort(([, a], [, b]) => b - a)[0]?.[0] || "None",
    }
  }

  addNotification(notification: Parameters<typeof useStore.getState.addNotification>[0]) {
    return useStore.getState().addNotification(notification)
  }

  getNotifications(userId: string) {
    return useStore.getState().getNotifications(userId)
  }

  updateIssueStatus(issueId: number, status: string) {
    return useStore.getState().updateIssueStatus(issueId, status)
  }

  unhideIssue(issueId: number) {
    return useStore.getState().unhideIssue(issueId)
  }
}

export const appStore = new AppStore()
