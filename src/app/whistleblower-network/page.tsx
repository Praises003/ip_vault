"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Shield, Star, Users, TrendingUp, Filter } from "lucide-react"
import Link from "next/link"

interface Whistleblower {
  id: string
  name: string
  avatar: string
  expertise: string[]
  status: "Verified" | "Trusted" | "Expert"
  description: string
  reportedCases: number
  successRate: number
  trustScore: number
  joinedDate: string
}

const whistleblowers: Whistleblower[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["Digital Art", "NFTs", "Photography"],
    status: "Expert",
    description: "Specialized in digital art theft detection with 5+ years experience",
    reportedCases: 247,
    successRate: 94,
    trustScore: 4.9,
    joinedDate: "2021-03-15",
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["Music", "Audio", "Podcasts"],
    status: "Verified",
    description: "Music industry veteran helping artists protect their intellectual property",
    reportedCases: 189,
    successRate: 87,
    trustScore: 4.7,
    joinedDate: "2020-11-22",
  },
  {
    id: "3",
    name: "Dr. Emily Watson",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["Software", "Code", "Patents"],
    status: "Expert",
    description: "Former patent attorney specializing in software IP protection",
    reportedCases: 156,
    successRate: 91,
    trustScore: 4.8,
    joinedDate: "2019-07-08",
  },
  {
    id: "4",
    name: "James Park",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["Video Content", "Streaming", "Media"],
    status: "Trusted",
    description: "Content creator advocate with expertise in video platform violations",
    reportedCases: 203,
    successRate: 83,
    trustScore: 4.6,
    joinedDate: "2022-01-12",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["Fashion", "Design", "Trademarks"],
    status: "Verified",
    description: "Fashion industry insider fighting counterfeit and design theft",
    reportedCases: 134,
    successRate: 89,
    trustScore: 4.5,
    joinedDate: "2021-09-03",
  },
  {
    id: "6",
    name: "Alex Kumar",
    avatar: "/placeholder.svg?height=80&width=80",
    expertise: ["Gaming", "Apps", "Mobile"],
    status: "Trusted",
    description: "Mobile app developer helping protect against app cloning and theft",
    reportedCases: 98,
    successRate: 85,
    trustScore: 4.4,
    joinedDate: "2022-05-18",
  },
]

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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Expert":
      return <Star className="w-3 h-3" />
    case "Verified":
      return <Shield className="w-3 h-3" />
    case "Trusted":
      return <Users className="w-3 h-3" />
    default:
      return null
  }
}

export default function WhistleblowerNetworkPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expertiseFilter, setExpertiseFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredWhistleblowers = whistleblowers.filter((wb) => {
    const matchesSearch =
      wb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wb.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesExpertise =
      expertiseFilter === "all" || wb.expertise.some((exp) => exp.toLowerCase().includes(expertiseFilter.toLowerCase()))
    const matchesStatus = statusFilter === "all" || wb.status === statusFilter

    return matchesSearch && matchesExpertise && matchesStatus
  })

  const totalCases = whistleblowers.reduce((sum, wb) => sum + wb.reportedCases, 0)
  const avgSuccessRate = Math.round(whistleblowers.reduce((sum, wb) => sum + wb.successRate, 0) / whistleblowers.length)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Whistleblower Network</h1>
              <p className="text-gray-600">Connect with verified experts who help protect intellectual property</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{whistleblowers.length}</p>
                    <p className="text-sm text-gray-600">Active Whistleblowers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalCases.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Cases Reported</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{avgSuccessRate}%</p>
                    <p className="text-sm text-gray-600">Average Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search whistleblowers by name or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={expertiseFilter} onValueChange={setExpertiseFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Expertise</SelectItem>
                  <SelectItem value="digital art">Digital Art</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="video">Video Content</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Trusted">Trusted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Whistleblower Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWhistleblowers.map((whistleblower) => (
            <Card key={whistleblower.id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={whistleblower.avatar || "/placeholder.svg"} alt={whistleblower.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                      {whistleblower.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{whistleblower.name}</h3>
                    <Badge className={`${getStatusColor(whistleblower.status)} text-xs font-medium mt-1`}>
                      {getStatusIcon(whistleblower.status)}
                      <span className="ml-1">{whistleblower.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Areas of Expertise</p>
                    <div className="flex flex-wrap gap-1">
                      {whistleblower.expertise.slice(0, 2).map((exp, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {exp}
                        </Badge>
                      ))}
                      {whistleblower.expertise.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{whistleblower.expertise.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">{whistleblower.description}</p>

                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{whistleblower.reportedCases} cases</span>
                    <span>{whistleblower.successRate}% success rate</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(whistleblower.trustScore) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">{whistleblower.trustScore}/5.0</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4">
                <Link href={`/whistleblower-network/${whistleblower.id}`} className="w-full">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    View More Details
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredWhistleblowers.length === 0 && (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No whistleblowers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
