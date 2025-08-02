"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MapPin, Clock, Shield, Heart } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Make Your Community Better</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Report issues, track progress, and work together to improve your neighborhood
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-[#674ea7] hover:bg-gray-100">
            <Link href="/report">Report an Issue</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-[#674ea7] bg-transparent"
          >
            <Link href="/register">Join Community</Link>
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
      description: "Report issues with precise location data and help authorities respond faster",
    },
    {
      icon: Users,
      title: "Community Collaboration",
      description: "Work together with neighbors to identify and solve local problems",
    },
    {
      icon: Clock,
      title: "Real-Time Updates",
      description: "Get instant notifications about issue status and resolution progress",
    },
    {
      icon: Shield,
      title: "Verified Reports",
      description: "All reports are verified and categorized for efficient processing",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">How Civic Track Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our platform makes it easy to report, track, and resolve community issues
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{feature.description}</CardDescription>
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
      role: "Community Leader",
      content:
        "Civic Track has transformed how our neighborhood addresses local issues. Response times have improved dramatically!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Local Resident",
      content:
        "Finally, a platform where my voice is heard. I've reported three issues and all were resolved within a week.",
      rating: 5,
    },
    {
      name: "Emma Davis",
      role: "City Council Member",
      content:
        "This tool has made our job so much easier. We can prioritize issues based on community feedback and data.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
          <p className="text-xl text-gray-600">Real feedback from real people making a difference</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <CardDescription>{testimonial.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
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
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Civic Track</h3>
            <p className="text-gray-400 mb-4">
              Empowering communities to create positive change through collaborative problem-solving.
            </p>
            <div className="flex gap-4">
              <Badge variant="secondary" className="bg-gradient-to-r from-[#b4a7d6] to-[#674ea7] text-white">
                <Heart className="w-4 h-4 mr-1" />
                Community First
              </Badge>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:text-white transition-colors">
                  Report Issue
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Local Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Volunteer
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Civic Track. All rights reserved. Made with ❤️ for communities everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
