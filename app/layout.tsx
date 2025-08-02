import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NotificationProvider } from "@/components/notification-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CIVIC TRACK - Report and Track Civic Issues",
  description: "A platform for reporting and tracking civic issues in your community",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          {children}
          <Toaster />
        </NotificationProvider>
      </body>
    </html>
  )
}
