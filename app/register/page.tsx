"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { appStore } from "@/lib/store"
import { toast } from "sonner"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = appStore.getUser(formData.username)
    if (existingUser) {
      toast.error("Username already exists")
      setIsLoading(false)
      return
    }

    // Create new user
    const newUser = {
      username: formData.username,
      email: formData.email,
      role: "user" as const,
      isBanned: false,
    }

    appStore.addUser(newUser)

    // Auto login
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("username", formData.username)
    localStorage.setItem("userRole", "user")
    localStorage.setItem("userEmail", formData.email)

    toast.success("Account created successfully!")
    router.push("/dashboard")

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">CIVIC TRACK</h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary-700">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account to start reporting civic issues</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary-700 text-white" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
