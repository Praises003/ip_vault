"use client"

import { useState } from "react"
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

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLicense, setSelectedLicense] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [sortBy, setSortBy] = useState("popular")

  // Mock marketplace data
  const [assets] = useState([
    {
      id: 1,
      title: "Modern Logo Design Kit",
      description: "Professional logo templates for startups and businesses",
      category: "design",
      price: 49,
      originalPrice: 79,
      license: "standard",
      creator: "Sarah Johnson",
      creatorAvatar: "SJ",
      rating: 4.8,
      reviews: 124,
      views: 2340,
      downloads: 89,
      tags: ["logo", "branding", "corporate", "modern"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: true,
      icon: ImageIcon,
    },
    {
      id: 2,
      title: "React Dashboard Components",
      description: "Complete set of dashboard components built with React and TypeScript",
      category: "code",
      price: 129,
      license: "extended",
      creator: "Alex Chen",
      creatorAvatar: "AC",
      rating: 4.9,
      reviews: 67,
      views: 1890,
      downloads: 45,
      tags: ["react", "dashboard", "components", "typescript"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: false,
      icon: Code,
    },
    {
      id: 3,
      title: "Marketing Video Templates",
      description: "Animated video templates for social media marketing",
      category: "video",
      price: 89,
      license: "standard",
      creator: "Mike Rodriguez",
      creatorAvatar: "MR",
      rating: 4.7,
      reviews: 203,
      views: 3450,
      downloads: 156,
      tags: ["video", "marketing", "social media", "animation"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: true,
      icon: Video,
    },
    {
      id: 4,
      title: "Business Plan Template",
      description: "Comprehensive business plan template with financial projections",
      category: "document",
      price: 29,
      license: "standard",
      creator: "Emma Wilson",
      creatorAvatar: "EW",
      rating: 4.6,
      reviews: 89,
      views: 1560,
      downloads: 78,
      tags: ["business", "plan", "template", "finance"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: false,
      icon: FileText,
    },
    {
      id: 5,
      title: "Ambient Music Pack",
      description: "Royalty-free ambient music tracks for content creators",
      category: "audio",
      price: 39,
      license: "extended",
      creator: "David Kim",
      creatorAvatar: "DK",
      rating: 4.9,
      reviews: 156,
      views: 2890,
      downloads: 234,
      tags: ["music", "ambient", "royalty-free", "background"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: false,
      icon: Music,
    },
    {
      id: 6,
      title: "UI Design System",
      description: "Complete design system with components, colors, and typography",
      category: "design",
      price: 199,
      license: "exclusive",
      creator: "Lisa Park",
      creatorAvatar: "LP",
      rating: 5.0,
      reviews: 34,
      views: 890,
      downloads: 12,
      tags: ["ui", "design system", "figma", "components"],
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: true,
      icon: ImageIcon,
    },
  ])

  const categories = [
    { value: "all", label: "All Categories", icon: Archive },
    { value: "design", label: "Design & Graphics", icon: ImageIcon },
    { value: "code", label: "Code & Software", icon: Code },
    { value: "video", label: "Video & Animation", icon: Video },
    { value: "audio", label: "Audio & Music", icon: Music },
    { value: "document", label: "Documents", icon: FileText },
  ]

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

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {sortedAssets.length} of {assets.length} assets
          </p>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Filters applied</span>
          </div>
        </div>

        {/* Featured Assets */}
        {sortedAssets.some((asset) => asset.featured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Featured Assets</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedAssets
                .filter((asset) => asset.featured)
                .slice(0, 3)
                .map((asset) => (
                  <Card key={asset.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                    <Link href={`/marketplace/asset/${asset.id}`}>
                      <div className="relative">
                        <img
                          src={asset.thumbnail || "/placeholder.svg"}
                          alt={asset.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 left-2 bg-orange-500">Featured</Badge>
                        {asset.originalPrice && (
                          <Badge variant="destructive" className="absolute top-2 right-2">
                            Save ${asset.originalPrice - asset.price}
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {asset.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">{asset.description}</CardDescription>
                          </div>
                          <asset.icon className="h-5 w-5 text-gray-400 ml-2" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                              {asset.creatorAvatar}
                            </div>
                            <span className="text-sm text-gray-600">{asset.creator}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{asset.rating}</span>
                            <span className="text-sm text-gray-500">({asset.reviews})</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {asset.views}
                            </span>
                            <span className="flex items-center">
                              <Download className="h-3 w-3 mr-1" />
                              {asset.downloads}
                            </span>
                          </div>
                          <div className="text-right">
                            {asset.originalPrice && (
                              <span className="text-sm text-gray-500 line-through mr-2">${asset.originalPrice}</span>
                            )}
                            <span className="text-xl font-bold text-green-600">${asset.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Assets Grid */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-6">All Assets</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAssets.map((asset) => (
              <Card key={asset.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
                <Link href={`/marketplace/asset/${asset.id}`}>
                  <div className="relative">
                    <img
                      src={asset.thumbnail || "/placeholder.svg"}
                      alt={asset.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <Badge
                      variant={asset.license === "exclusive" ? "destructive" : "secondary"}
                      className="absolute top-2 left-2"
                    >
                      {asset.license}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                      {asset.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-sm">{asset.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                          {asset.creatorAvatar}
                        </div>
                        <span className="text-xs text-gray-600 truncate">{asset.creator}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{asset.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{asset.views} views</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">${asset.price}</span>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {sortedAssets.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("all")
                setSelectedLicense("all")
                setPriceRange("all")
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
