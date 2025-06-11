"use client"

import type React from "react"

import { useState } from "react"
import { Send, Phone, Mail, MessageCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const supportOptions = [
  {
    title: "Live Chat",
    description: "Get instant help from our support team",
    icon: MessageCircle,
    availability: "Available 24/7",
    action: "Start Chat",
  },
  {
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Mail,
    availability: "Response within 4 hours",
    action: "Send Email",
  },
  {
    title: "Phone Support",
    description: "Speak directly with our experts",
    icon: Phone,
    availability: "Mon-Fri, 9AM-6PM EST",
    action: "Call Now",
  },
]

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Support request submitted:", formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Support</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          We're here to help you protect and monetize your intellectual property. Choose your preferred way to get in
          touch.
        </p>
      </div>

      {/* Support Options */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {supportOptions.map((option) => (
          <Card key={option.title} className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <option.icon className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center text-sm text-gray-600 mb-4">
                <Clock className="h-4 w-4 mr-2" />
                {option.availability}
              </div>
              <Button className="w-full">{option.action}</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Send us a message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing & Payments</SelectItem>
                    <SelectItem value="licensing">Licensing Questions</SelectItem>
                    <SelectItem value="ip-protection">IP Protection</SelectItem>
                    <SelectItem value="takedown">Takedown Requests</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Please provide as much detail as possible about your issue or question..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Additional Resources */}
      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking for quick answers?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/faq" className="text-blue-600 hover:text-blue-700 font-medium">
            Check our FAQ →
          </a>
          <a href="/docs" className="text-blue-600 hover:text-blue-700 font-medium">
            Browse Documentation →
          </a>
          <a href="/community" className="text-blue-600 hover:text-blue-700 font-medium">
            Join Community Forum →
          </a>
        </div>
      </div>
    </div>
  )
}
