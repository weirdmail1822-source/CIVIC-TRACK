"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock email sending
    if (email) {
      setEmailSent(true)
      toast.success("Password reset email sent!")
    } else {
      toast.error("Please enter a valid email address")
    }

    setIsLoading(false)
  }

  const handleTryAgain = () => {
    setEmailSent(false)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="flex items-center justify-center mb-6">
            <AlertCircle className="h-12 w-12 text-white mr-3" />
            <h1 className="text-3xl font-bold text-white">CIVIC TRACK</h1>
          </Link>
          <h2 className="text-2xl font-bold text-white">Reset your password</h2>
          <p className="mt-2 text-sm text-white/80">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-[#674ea7] flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              {emailSent ? "Check your email" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {emailSent
                ? "We've sent a password reset link to your email address"
                : "Enter your email address to receive a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
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
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-green-900 mb-2">Email sent!</h3>
                  <p className="text-sm text-green-700">
                    We've sent a password reset link to <strong>{email}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Check your inbox and click the link to reset your password
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="flex-1 border-[#674ea7] text-[#674ea7] hover:bg-[#674ea7]/10 bg-transparent"
                  >
                    Try Again
                  </Button>
                  <Button asChild className="flex-1 bg-[#674ea7] hover:bg-[#674ea7]/90">
                    <Link href="/login">Back to Login</Link>
                  </Button>
                </div>
              </div>
            )}

            {!emailSent && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link href="/login" className="font-medium text-[#674ea7] hover:text-[#674ea7]/80">
                    Sign in
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/login" className="text-sm text-white/80 hover:text-white flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
