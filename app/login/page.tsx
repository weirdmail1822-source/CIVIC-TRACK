"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { appStore } from "@/lib/store"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Check for admin credentials
    if (email === "admin@civictrack.com" && password === "admin123") {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", "admin")
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userEmail", email)
      router.push("/admin")
      return
    }

    // Mock user authentication
    setTimeout(() => {
      if (email && password) {
        const username = email.split("@")[0]
        const user = appStore.getUser(username)

        if (user && user.isBanned) {
          setError("Your account has been banned. Please contact support.")
          setIsLoading(false)
          return
        }

        // Store auth state
        localStorage.setItem("isAuthenticated", "true")
        localStorage.setItem("username", username)
        localStorage.setItem("userRole", "user")
        localStorage.setItem("userEmail", email)

        // Add user if doesn't exist
        if (!user) {
          appStore.addUser({
            username,
            email,
            role: "user",
            isBanned: false,
          })
        }

        router.push("/dashboard")
      } else {
        setError("Please enter valid credentials")
      }
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-secondary-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <AlertCircle className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">CIVIC TRACK</h1>
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to your CIVIC TRACK account</CardDescription>
            <div className="mt-4 p-3 bg-secondary-100 rounded-lg text-sm">
              <p className="font-medium text-primary">Admin Login:</p>
              <p>Email: admin@civictrack.com</p>
              <p>Password: admin123</p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <Button type="submit" className="w-full bg-primary hover:bg-primary-700 text-white" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/register" className="text-primary hover:text-primary-700 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
