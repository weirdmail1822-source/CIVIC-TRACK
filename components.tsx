import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Star, CheckCircle, Shield, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 px-4 text-center bg-gradient-to-br from-[#b4a7d6] to-[#674ea7]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Make Your Community Better</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Report civic issues, track progress, and work together to improve your neighborhood
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-white text-[#674ea7] hover:bg-white/90">
            <Link href="/report">Report an Issue</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white/10 bg-transparent"
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
      icon: <MapPin className="h-8 w-8 text-[#674ea7]" />,
      title: "Location-Based Reporting",
      description: "Report issues with precise location data and help authorities respond faster",
    },
    {
      icon: <Clock className="h-8 w-8 text-[#674ea7]" />,
      title: "Real-Time Tracking",
      description: "Track the progress of reported issues from submission to resolution",
    },
    {
      icon: <Users className="h-8 w-8 text-[#674ea7]" />,
      title: "Community Engagement",
      description: "Connect with neighbors and work together on local improvements",
    },
    {
      icon: <Shield className="h-8 w-8 text-[#674ea7]" />,
      title: "Verified Reports",
      description: "Anti-spam measures ensure only legitimate issues are reported",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-[#674ea7]" />,
      title: "Analytics Dashboard",
      description: "View trends and statistics about your community's civic health",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-[#674ea7]" />,
      title: "Quick Resolution",
      description: "Streamlined process helps authorities address issues efficiently",
    },
  ]

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Better Communities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to report, track, and resolve civic issues in your neighborhood
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
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
        "CivicTrack has transformed how our neighborhood addresses local issues. The response time has improved dramatically!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Local Resident",
      content:
        "Finally, a platform where I can report problems and actually see them get fixed. The tracking feature is amazing.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "City Council Member",
      content:
        "This tool has made our job so much easier. We can prioritize issues based on community feedback and track our progress.",
      rating: 5,
    },
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Community Says</h2>
          <p className="text-xl text-gray-600">Real feedback from real people making a difference</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#b4a7d6] to-[#674ea7] rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
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
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-[#b4a7d6]">CivicTrack</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering communities to report, track, and resolve civic issues together. Making neighborhoods better,
              one report at a time.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Privacy Policy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Terms of Service
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#b4a7d6]">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
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
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-[#b4a7d6]">Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Roads & Infrastructure</li>
              <li>Lighting</li>
              <li>Waste Management</li>
              <li>Public Safety</li>
              <li>Parks & Recreation</li>
              <li>Water & Utilities</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 CivicTrack. All rights reserved. Built for better communities.</p>
        </div>
      </div>
    </footer>
  )
}
