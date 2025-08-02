"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Shield, Users, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">CIVIC TRACK</h1>
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          Report civic issues in your community and track their resolution. Together, we can make our cities better.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-[#674ea7] hover:bg-gray-100">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#674ea7] bg-transparent"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export function FeaturesSection() {
  const features = [
    {
      icon: MapPin,
      title: "Location-Based Reporting",
      description: "Report issues with precise location data and visual context for faster resolution.",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description: "Track the status of your reports from submission to resolution with live updates.",
    },
    {
      icon: Users,
      title: "Community Engagement",
      description: "Connect with your community and collaborate on improving local infrastructure.",
    },
    {
      icon: Shield,
      title: "Verified Reports",
      description: "All reports are verified and moderated to ensure quality and authenticity.",
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Why Choose Civic Track?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our platform makes it easy to report and track civic issues in your community
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-white/80 text-center">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Member",
      content:
        "Civic Track helped me report a broken streetlight that was fixed within a week. The tracking feature kept me informed throughout the process.",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Local Resident",
      content:
        "Great platform for community engagement. I've reported several potholes and they were all addressed promptly.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "Neighborhood Watch",
      content:
        "The admin panel gives us great insights into community issues. It's helping us prioritize our improvement efforts.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">What Our Community Says</h2>
          <p className="text-xl text-white/80">Real feedback from real community members</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-4 italic">"{testimonial.content}"</p>
                <div className="text-white">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-white/70">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="bg-black/20 backdrop-blur-sm py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">CIVIC TRACK</h3>
            <p className="text-white/80 mb-4">
              Empowering communities to report and track civic issues for a better tomorrow.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                Twitter
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                Facebook
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                LinkedIn
              </Button>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/80 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-white/80 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-white/80 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/report-bug" className="text-white/80 hover:text-white">
                  Report Bug
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-white/80 hover:text-white">
                  Feedback
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60">© 2024 Civic Track. All rights reserved. Built for better communities.</p>
        </div>
      </div>
    </footer>
  )
}
