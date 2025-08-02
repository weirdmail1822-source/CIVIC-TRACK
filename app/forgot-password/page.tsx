"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (email) {
      setIsSubmitted(true)
      toast.success("Password reset instructions sent to your email!")
    } else {
      toast.error("Please enter a valid email address")
    }

    setIsLoading(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link href="/" className="flex items-center justify-center mb-6">
              <AlertCircle className="h-12 w-12 text-white mr-3" />
              <h1 className="text-3xl font-bold text-white">CIVIC TRACK</h1>
            </Link>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border-white/20">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-[#674ea7]">Check Your Email</CardTitle>
              <CardDescription>We've sent password reset instructions to {email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  If you don't see the email in your inbox, please check your spam folder.
                </AlertDescription>
              </Alert>

              <div className="flex flex-col gap-2">
                <Button asChild className="bg-[#674ea7] hover:bg-[#674ea7]/90">
                  <Link href="/login">Back to Login</Link>
                </Button>
                <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                  Try Different Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">CIVIC TRACK</h1>
          </Link>
          <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
          <p className="mt-2 text-sm text-white/80">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-[#674ea7]">Forgot Password</CardTitle>
            <CardDescription>We'll send you a link to reset your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 border-[#b4a7d6]/20 focus:border-[#674ea7]"
                  placeholder="Enter your email address"
                />
              </div>

              <Button type="submit" className="w-full bg-[#674ea7] hover:bg-[#674ea7]/90" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset Instructions"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="flex items-center justify-center text-sm text-[#674ea7] hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
