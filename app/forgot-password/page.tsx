"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (email) {
      setIsEmailSent(true)
      toast.success("Password reset email sent! Check your inbox.")
    } else {
      toast.error("Please enter a valid email address")
    }

    setIsLoading(false)
  }

  if (isEmailSent) {
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
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-[#674ea7]">Check your email</CardTitle>
              <CardDescription>
                We've sent a password reset link to <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Button
                onClick={() => setIsEmailSent(false)}
                variant="outline"
                className="w-full border-[#674ea7] text-[#674ea7] hover:bg-[#674ea7] hover:text-white"
              >
                Try again
              </Button>
              <Link href="/login">
                <Button className="w-full bg-[#674ea7] hover:bg-[#674ea7]/90">Back to Login</Button>
              </Link>
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
          <h2 className="text-2xl font-bold text-white">Forgot your password?</h2>
          <p className="mt-2 text-sm text-white/80">No worries, we'll send you reset instructions.</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-[#674ea7]">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a link to reset your password.
            </CardDescription>
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
                  placeholder="Enter your email"
                />
              </div>

              <Button type="submit" className="w-full bg-[#674ea7] hover:bg-[#674ea7]/90" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset email"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
