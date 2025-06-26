"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  Search,
  Filter,
  FileText,
  ImageIcon,
  Video,
  Code,
  Music,
  Archive,
  Eye,
  Download,
  Star,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/axios" // Axios instance

// Define the type for an asset
interface Asset {
  id: number
  title: string
  description: string
  price: number
  category: string
  license: string
  rating: number
  views: number
  tags: string[]
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLicense, setSelectedLicense] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [assets, setAssets] = useState<Asset[]>([])  // Specify the type of assets array
  const [loading, setLoading] = useState(true)  // Loading state

  const categories = [
    { value: "all", label: "All Categories", icon: Archive },
    { value: "design", label: "Design & Graphics", icon: ImageIcon },
    { value: "code", label: "Code & Software", icon: Code },
    { value: "video", label: "Video & Animation", icon: Video },
    { value: "audio", label: "Audio & Music", icon: Music },
    { value: "document", label: "Documents", icon: FileText },
  ]

  // Fetch assets from API using Axios
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await api.get("/api/marketplace")
        setAssets(response.data)  // Set fetched data
        setLoading(false)  // Set loading to false when data is fetched
      } catch (error) {
        console.error("Error fetching assets:", error)
        setLoading(false)
      }
    }

    fetchAssets()
  }, []) // Empty array means the effect runs only once on mount

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory
    const matchesLicense = selectedLicense === "all" || asset.license === selectedLicense

    let matchesPrice = true
    if (priceRange === "under-50") matchesPrice = asset.price < 50
    else if (priceRange === "50-100") matchesPrice = asset.price >= 50 && asset.price <= 100
    else if (priceRange === "over-100") matchesPrice = asset.price > 100

    return matchesSearch && matchesCategory && matchesLicense && matchesPrice
  })

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return b.id - a.id
      case "popular":
      default:
        return b.views - a.views
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">IP Vault</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/marketplace" className="text-blue-600 font-medium">
              Marketplace
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Dashboard
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Sell Your Work</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Creative Marketplace</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and license high-quality creative works from talented creators worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search assets, creators, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLicense} onValueChange={setSelectedLicense}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="License" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Licenses</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="extended">Extended</SelectItem>
                  <SelectItem value="exclusive">Exclusive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="over-100">Over $100</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Marketplace Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <Skeleton className="h-72 w-full rounded-lg" />
              <Skeleton className="h-72 w-full rounded-lg mt-4" />
              <Skeleton className="h-72 w-full rounded-lg mt-4" />
            </>
          ) : (
            sortedAssets.map((asset) => (
              <Card key={asset.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle>{asset.title}</CardTitle>
                  <CardDescription>{asset.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge>{asset.category}</Badge>
                    <span>${asset.price}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-gray-400" />
                    <span>{asset.views}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
