"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Shield,
  Star,
  Users,
  TrendingUp,
  Calendar,
  Mail,
  MessageSquare,
  Award,
  CheckCircle,
  Quote,
} from "lucide-react"
import Link from "next/link"

interface WhistleblowerProfile {
  id: string
  name: string
  avatar: string
  expertise: string[]
  status: "Verified" | "Trusted" | "Expert"
  description: string
  fullBio: string
  credentials: string[]
  reportedCases: number
  successRate: number
  trustScore: number
  joinedDate: string
  location: string
  languages: string[]
  specializations: string[]
  achievements: string[]
  testimonials: {
    id: string
    author: string
    role: string
    content: string
    rating: number
  }[]
  caseCategories: {
    category: string
    count: number
    successRate: number
  }[]
}

// Mock data - in real app, this would come from API
const whistleblowerProfiles: { [key: string]: WhistleblowerProfile } = {
  "1": {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=120&width=120",
    expertise: ["Digital Art", "NFTs", "Photography"],
    status: "Expert",
    description: "Specialized in digital art theft detection with 5+ years experience",
    fullBio:
      "Sarah Chen is a renowned digital forensics expert with over 8 years of experience in intellectual property protection. She holds a Masters degree in Computer Science from MIT and has worked with major art galleries and digital platforms to combat art theft. Her innovative techniques in reverse image searching and blockchain verification have helped recover millions of dollars in stolen digital assets.",
    credentials: [
      "Certified Digital Forensics Examiner (CDFE)",
      "Masters in Computer Science - MIT",
      "Blockchain Technology Specialist",
      "Former Senior Investigator at ArtGuard Inc.",
    ],
    reportedCases: 247,
    successRate: 94,
    trustScore: 4.9,
    joinedDate: "2021-03-15",
    location: "San Francisco, CA",
    languages: ["English", "Mandarin", "Spanish"],
    specializations: ["Reverse Image Search", "NFT Verification", "Digital Watermarking"],
    achievements: [
      "Recovered $2.3M in stolen digital art (2023)",
      "Testified as expert witness in 15+ IP cases",
      "Published researcher in digital forensics",
      "Speaker at DefCon and Black Hat conferences",
    ],
    testimonials: [
      {
        id: "1",
        author: "Michael Torres",
        role: "Digital Artist",
        content:
          "Sarah helped me recover my stolen artwork that was being sold as NFTs without permission. Her expertise and dedication were incredible.",
        rating: 5,
      },
      {
        id: "2",
        author: "Emma Wilson",
        role: "Photography Studio Owner",
        content:
          "Professional, thorough, and results-driven. Sarah found multiple instances of our copyrighted photos being used illegally.",
        rating: 5,
      },
      {
        id: "3",
        author: "David Kim",
        role: "NFT Creator",
        content:
          "Thanks to Sarah investigation, we were able to take down counterfeit versions of our NFT collection and recover significant damages.",
        rating: 5,
      },
    ],
    caseCategories: [
      { category: "Digital Art Theft", count: 156, successRate: 96 },
      { category: "NFT Counterfeiting", count: 67, successRate: 91 },
      { category: "Photography Infringement", count: 24, successRate: 100 },
    ],
  },
  "2": {
    id: "2",
    name: "Marcus Rodriguez",
    avatar: "/placeholder.svg?height=120&width=120",
    expertise: ["Music", "Audio", "Podcasts"],
    status: "Verified",
    description: "Music industry veteran helping artists protect their intellectual property",
    fullBio:
      "Marcus Rodriguez brings 12 years of music industry experience to IP protection. As a former A&R executive and current music rights advocate, he has helped hundreds of independent artists and major labels protect their musical works from unauthorized use and distribution.",
    credentials: [
      "Music Business Certificate - Berklee College",
      "Former A&R Executive at Universal Music",
      "Certified Audio Forensics Specialist",
      "Music Rights Management Expert",
    ],
    reportedCases: 189,
    successRate: 87,
    trustScore: 4.7,
    joinedDate: "2020-11-22",
    location: "Nashville, TN",
    languages: ["English", "Spanish"],
    specializations: ["Audio Fingerprinting", "Music Licensing", "Copyright Enforcement"],
    achievements: [
      "Helped secure $1.8M in music royalties",
      "Worked with 200+ independent artists",
      "Expert witness in landmark music IP case",
      "Featured speaker at MIDEM and SXSW",
    ],
    testimonials: [
      {
        id: "1",
        author: "Luna Martinez",
        role: "Singer-Songwriter",
        content:
          "Marcus helped me discover my song was being used in commercials without permission. He guided me through the entire process.",
        rating: 5,
      },
      {
        id: "2",
        author: "The Midnight Collective",
        role: "Indie Band",
        content:
          "Professional and knowledgeable. Marcus found several streaming platforms using our music illegally and helped us get proper compensation.",
        rating: 4,
      },
    ],
    caseCategories: [
      { category: "Music Piracy", count: 98, successRate: 89 },
      { category: "Unauthorized Sampling", count: 45, successRate: 84 },
      { category: "Streaming Violations", count: 46, successRate: 87 },
    ],
  },
  // Add more profiles as needed
}

export default function WhistleblowerProfilePage() {
  const params = useParams()
  //const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  const whistleblower = whistleblowerProfiles[params.id as string]

  if (!whistleblower) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Whistleblower Not Found</h1>
          <p className="text-gray-600 mb-6">The whistleblower profile youre looking for doesnt exist.</p>
          <Link href="/whistleblower-network">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Network
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Expert":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Verified":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Trusted":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link
            href="/whistleblower-network"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Whistleblower Network
          </Link>
        </div>

        {/* Profile Header */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={whistleblower.avatar || "/placeholder.svg"} alt={whistleblower.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                    {whistleblower.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{whistleblower.name}</h1>
                    <Badge className={`${getStatusColor(whistleblower.status)} text-sm font-medium mb-3`}>
                      <Shield className="w-4 h-4 mr-1" />
                      {whistleblower.status} Whistleblower
                    </Badge>
                    <p className="text-gray-600 mb-4 max-w-2xl">{whistleblower.fullBio}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {whistleblower.expertise.map((exp, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {exp}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined{" "}
                        {new Date(whistleblower.joinedDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                        })}
                      </span>
                      <span>{whistleblower.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Request Investigation
                    </Button>
                    <Button variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{whistleblower.reportedCases}</div>
              <div className="text-sm text-gray-600">Cases Reported</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{whistleblower.successRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <span className="text-3xl font-bold text-yellow-600">{whistleblower.trustScore}</span>
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
              </div>
              <div className="text-sm text-gray-600">Trust Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{whistleblower.languages.length}</div>
              <div className="text-sm text-gray-600">Languages</div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview" },
                { id: "credentials", label: "Credentials" },
                { id: "cases", label: "Case History" },
                { id: "testimonials", label: "Testimonials" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Specializations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {whistleblower.specializations.map((spec, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Key Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {whistleblower.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "credentials" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Professional Credentials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {whistleblower.credentials.map((credential, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium">{credential}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "cases" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Case Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {whistleblower.caseCategories.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{category.category}</span>
                          <span className="text-sm text-gray-600">{category.count} cases</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={category.successRate} className="flex-1" />
                          <span className="text-sm font-medium text-green-600">{category.successRate}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "testimonials" && (
              <div className="space-y-4">
                {whistleblower.testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Quote className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{testimonial.author}</p>
                              <p className="text-sm text-gray-600">{testimonial.role}</p>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Languages</p>
                  <p className="text-sm text-gray-600">{whistleblower.languages.join(", ")}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Location</p>
                  <p className="text-sm text-gray-600">{whistleblower.location}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Trust Score</p>
                  <div className="flex items-center gap-2">
                    <Progress value={whistleblower.trustScore * 20} className="flex-1" />
                    <span className="text-sm font-medium">{whistleblower.trustScore}/5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Investigation
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Schedule Consultation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
