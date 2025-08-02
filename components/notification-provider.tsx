"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { Socket } from "socket.io-client"
import { toast } from "sonner"

interface NotificationContextType {
  socket: Socket | null
  notifications: Array<{
    id: string
    message: string
    type: "info" | "success" | "warning" | "error"
    timestamp: Date
  }>
}

const NotificationContext = createContext<NotificationContextType>({
  socket: null,
  notifications: [],
})

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [notifications, setNotifications] = useState<NotificationContextType["notifications"]>([])

  useEffect(() => {
    // Initialize socket connection (mock for demo)
    const mockSocket = {
      on: (event: string, callback: Function) => {
        // Mock socket events
        if (event === "notification") {
          // Simulate receiving notifications
          setTimeout(() => {
            callback({
              id: Date.now().toString(),
              message: "Your issue status has been updated",
              type: "info",
              timestamp: new Date(),
            })
          }, 5000)
        }
      },
      emit: (event: string, data: any) => {
        console.log("Socket emit:", event, data)
      },
      disconnect: () => {
        console.log("Socket disconnected")
      },
    } as any

    setSocket(mockSocket)

    // Listen for notifications
    mockSocket.on("notification", (notification: any) => {
      setNotifications((prev) => [...prev, notification])
      toast(notification.message, {
        description: new Date(notification.timestamp).toLocaleString(),
      })
    })

    return () => {
      mockSocket.disconnect()
    }
  }, [])

  return <NotificationContext.Provider value={{ socket, notifications }}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => useContext(NotificationContext)
