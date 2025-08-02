interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: "Reported" | "In Progress" | "Resolved"
  reportedDate: string
  address: string
  coordinates?: { lat: number; lng: number }
  distance: string
  reportedBy: string
  priority: "Low" | "Medium" | "High"
  images?: string[]
  updates?: Array<{
    date: string
    status: string
    comment: string
    updatedBy: string
  }>
}

interface User {
  username: string
  email: string
  role: "admin" | "user"
  isBanned: boolean
}

class AppStore {
  private issues: Issue[] = [
    {
      id: "1",
      title: "Broken Street Light on Main Street",
      description:
        "The street light near the bus stop has been flickering for weeks and now it's completely out. This creates a safety hazard for pedestrians at night.",
      category: "Lighting",
      status: "Reported",
      reportedDate: "2024-01-15",
      address: "123 Main Street, Downtown",
      coordinates: { lat: 40.7128, lng: -74.006 },
      distance: "0.5",
      reportedBy: "john_doe",
      priority: "High",
      images: ["/placeholder.svg?height=300&width=400&text=Broken+Street+Light"],
      updates: [
        {
          date: "2024-01-15",
          status: "Reported",
          comment: "Issue reported by citizen",
          updatedBy: "system",
        },
      ],
    },
    {
      id: "2",
      title: "Pothole on Oak Avenue",
      description:
        "Large pothole causing damage to vehicles. Multiple cars have reported tire damage from this location.",
      category: "Roads",
      status: "In Progress",
      reportedDate: "2024-01-12",
      address: "456 Oak Avenue, Midtown",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      distance: "1.2",
      reportedBy: "jane_smith",
      priority: "Medium",
      images: ["/placeholder.svg?height=300&width=400&text=Pothole"],
      updates: [
        {
          date: "2024-01-12",
          status: "Reported",
          comment: "Issue reported by citizen",
          updatedBy: "system",
        },
        {
          date: "2024-01-14",
          status: "In Progress",
          comment: "Work crew assigned to repair",
          updatedBy: "admin",
        },
      ],
    },
    {
      id: "3",
      title: "Water Leak at Park Fountain",
      description:
        "The fountain in Central Park has been leaking water continuously, creating muddy conditions around the area.",
      category: "Water Supply",
      status: "Resolved",
      reportedDate: "2024-01-10",
      address: "789 Park Drive, Central Park",
      coordinates: { lat: 40.7829, lng: -73.9654 },
      distance: "2.1",
      reportedBy: "mike_wilson",
      priority: "Low",
      images: ["/placeholder.svg?height=300&width=400&text=Water+Leak"],
      updates: [
        {
          date: "2024-01-10",
          status: "Reported",
          comment: "Issue reported by citizen",
          updatedBy: "system",
        },
        {
          date: "2024-01-11",
          status: "In Progress",
          comment: "Maintenance team dispatched",
          updatedBy: "admin",
        },
        {
          date: "2024-01-13",
          status: "Resolved",
          comment: "Fountain repaired and tested",
          updatedBy: "admin",
        },
      ],
    },
    {
      id: "4",
      title: "Overflowing Garbage Bins",
      description:
        "The garbage bins at the corner of 5th and Broadway are consistently overflowing, attracting pests and creating unsanitary conditions.",
      category: "Cleanliness",
      status: "Reported",
      reportedDate: "2024-01-14",
      address: "Corner of 5th Street and Broadway",
      coordinates: { lat: 40.7505, lng: -73.9934 },
      distance: "0.8",
      reportedBy: "sarah_jones",
      priority: "Medium",
      images: ["/placeholder.svg?height=300&width=400&text=Overflowing+Garbage"],
      updates: [
        {
          date: "2024-01-14",
          status: "Reported",
          comment: "Issue reported by citizen",
          updatedBy: "system",
        },
      ],
    },
    {
      id: "5",
      title: "Dangerous Tree Branch",
      description:
        "A large tree branch is hanging dangerously low over the sidewalk after the recent storm. It poses a risk to pedestrians.",
      category: "Public Safety",
      status: "In Progress",
      reportedDate: "2024-01-13",
      address: "321 Elm Street, Riverside",
      coordinates: { lat: 40.7282, lng: -74.0776 },
      distance: "3.2",
      reportedBy: "robert_brown",
      priority: "High",
      images: ["/placeholder.svg?height=300&width=400&text=Dangerous+Tree+Branch"],
      updates: [
        {
          date: "2024-01-13",
          status: "Reported",
          comment: "Issue reported by citizen",
          updatedBy: "system",
        },
        {
          date: "2024-01-15",
          status: "In Progress",
          comment: "Tree service company contacted",
          updatedBy: "admin",
        },
      ],
    },
    {
      id: "6",
      title: "Blocked Storm Drain",
      description:
        "The storm drain on Maple Street is completely blocked with debris, causing water to pool during rain.",
      category: "Obstructions",
      status: "Reported",
      reportedDate: "2024-01-16",
      address: "654 Maple Street, Westside",
      coordinates: { lat: 40.7614, lng: -73.9776 },
      distance: "1.7",
      reportedBy: "lisa_davis",
      priority: "Medium",
      images: ["/placeholder.svg?height=300&width=400&text=Blocked+Storm+Drain"],
      updates: [
        {
          date: "2024-01-16",
          status: "Reported",
          comment: "Issue reported by citizen",
          updatedBy: "system",
        },
      ],
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
    return this.issues
  }

  getIssue(id: string): Issue | undefined {
    return this.issues.find((issue) => issue.id === id)
  }

  addIssue(issue: Issue): void {
    this.issues.push(issue)
  }

  updateIssue(id: string, updates: Partial<Issue>): void {
    const index = this.issues.findIndex((issue) => issue.id === id)
    if (index !== -1) {
      this.issues[index] = { ...this.issues[index], ...updates }
    }
  }

  deleteIssue(id: string): void {
    this.issues = this.issues.filter((issue) => issue.id !== id)
  }

  getUsers(): User[] {
    return this.users
  }

  getUser(username: string): User | undefined {
    return this.users.find((user) => user.username === username)
  }

  addUser(user: User): void {
    this.users.push(user)
  }

  updateUser(username: string, updates: Partial<User>): void {
    const index = this.users.findIndex((user) => user.username === username)
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates }
    }
  }

  banUser(username: string): void {
    this.updateUser(username, { isBanned: true })
  }

  unbanUser(username: string): void {
    this.updateUser(username, { isBanned: false })
  }
}

export const appStore = new AppStore()
