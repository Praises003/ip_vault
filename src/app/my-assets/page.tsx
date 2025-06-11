"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Shield,
  ArrowLeft,
  Search,
  Upload,
  FileText,
  ImageIcon,
  Video,
  Code,
  Music,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  DollarSign,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Grid,
  List,
  Plus,
  Star,
  Lock,
  Unlock,
  Share2,
  X,
  Archive,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

interface Asset {
  id: string
  title: string
  description: string
  type: "image" | "text" | "video" | "audio" | "code" | "document"
  thumbnail: string
  uploadDate: string
  lastUpdated: string
  status: "active" | "pending" | "draft" | "archived"
  verified: boolean
  featured: boolean
  size: string
  tags: string[]
  licenses: License[]
  sales: {
    total: number
    thisMonth: number
    lastMonth: number
    revenue: number
    revenueThisMonth: number
    revenueLastMonth: number
    history: { month: string; revenue: number; sales: number }[]
  }
  views: number
  downloads: number
  infringements: number
  takedowns: number
  collaborators?: string[]
  versions?: number
}

interface License {
  id: string
  name: string
  price: number
  type: "standard" | "extended" | "exclusive" | "custom"
  active: boolean
  sales: number
  revenue: number
  features: string[]
  restrictions: string[]
}

export default function MyAssetsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Mock assets data
  const [assets] = useState<Asset[]>([
    {
      id: "1",
      title: "Modern Logo Design Kit",
      description: "Professional logo templates for startups and businesses",
      type: "image",
      thumbnail: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-15",
      lastUpdated: "2024-01-20",
      status: "active",
      verified: true,
      featured: true,
      size: "45.6 MB",
      tags: ["logo", "branding", "corporate", "modern"],
      licenses: [
        {
          id: "l1",
          name: "Standard License",
          price: 49,
          type: "standard",
          active: true,
          sales: 24,
          revenue: 1176,
          features: [
            "Commercial use allowed",
            "Attribution required",
            "Up to 10,000 copies",
            "Digital and print use",
            "Modify and customize",
          ],
          restrictions: ["Cannot resell as-is", "Cannot use in templates for sale"],
        },
        {
          id: "l2",
          name: "Extended License",
          price: 129,
          type: "extended",
          active: true,
          sales: 8,
          revenue: 1032,
          features: [
            "All Standard License features",
            "No attribution required",
            "Unlimited copies",
            "Resale rights included",
            "Use in templates for sale",
            "Priority support",
          ],
          restrictions: ["Cannot claim original authorship"],
        },
        {
          id: "l3",
          name: "Exclusive License",
          price: 499,
          type: "exclusive",
          active: false,
          sales: 0,
          revenue: 0,
          features: [
            "All Extended License features",
            "Exclusive ownership",
            "Asset removed from marketplace",
            "Full commercial rights",
            "Source files included",
            "Custom modifications available",
          ],
          restrictions: [],
        },
      ],
      sales: {
        total: 32,
        thisMonth: 12,
        lastMonth: 8,
        revenue: 2208,
        revenueThisMonth: 828,
        revenueLastMonth: 588,
        history: [
          { month: "Aug", revenue: 196, sales: 4 },
          { month: "Sep", revenue: 294, sales: 6 },
          { month: "Oct", revenue: 392, sales: 8 },
          { month: "Nov", revenue: 588, sales: 8 },
          { month: "Dec", revenue: 686, sales: 10 },
          { month: "Jan", revenue: 828, sales: 12 },
        ],
      },
      views: 1240,
      downloads: 32,
      infringements: 3,
      takedowns: 2,
      collaborators: ["Jane Smith", "Mike Johnson"],
      versions: 3,
    },
    {
      id: "2",
      title: "React Dashboard Components",
      description: "Complete set of dashboard components built with React and TypeScript",
      type: "code",
      thumbnail: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-12",
      lastUpdated: "2024-01-18",
      status: "active",
      verified: true,
      featured: false,
      size: "12.8 MB",
      tags: ["react", "dashboard", "components", "typescript"],
      licenses: [
        {
          id: "l4",
          name: "Standard License",
          price: 79,
          type: "standard",
          active: true,
          sales: 18,
          revenue: 1422,
          features: ["Commercial use allowed", "Attribution required", "Use in one project", "Updates for 6 months"],
          restrictions: ["Cannot resell as-is", "Cannot use in templates for sale"],
        },
        {
          id: "l5",
          name: "Extended License",
          price: 199,
          type: "extended",
          active: true,
          sales: 5,
          revenue: 995,
          features: [
            "All Standard License features",
            "No attribution required",
            "Use in multiple projects",
            "Updates for 12 months",
            "Priority support",
          ],
          restrictions: ["Cannot claim original authorship"],
        },
      ],
      sales: {
        total: 23,
        thisMonth: 8,
        lastMonth: 6,
        revenue: 2417,
        revenueThisMonth: 832,
        revenueLastMonth: 674,
        history: [
          { month: "Aug", revenue: 158, sales: 2 },
          { month: "Sep", revenue: 237, sales: 3 },
          { month: "Oct", revenue: 316, sales: 4 },
          { month: "Nov", revenue: 674, sales: 6 },
          { month: "Dec", revenue: 753, sales: 7 },
          { month: "Jan", revenue: 832, sales: 8 },
        ],
      },
      views: 980,
      downloads: 23,
      infringements: 1,
      takedowns: 1,
      versions: 5,
    },
    {
      id: "3",
      title: "Marketing Video Templates",
      description: "Animated video templates for social media marketing",
      type: "video",
      thumbnail: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-10",
      lastUpdated: "2024-01-15",
      status: "active",
      verified: true,
      featured: true,
      size: "256 MB",
      tags: ["video", "marketing", "social media", "animation"],
      licenses: [
        {
          id: "l6",
          name: "Standard License",
          price: 89,
          type: "standard",
          active: true,
          sales: 32,
          revenue: 2848,
          features: ["Commercial use allowed", "Attribution required", "Use in one campaign", "Digital use only"],
          restrictions: ["Cannot resell as-is", "Cannot use in templates for sale"],
        },
        {
          id: "l7",
          name: "Extended License",
          price: 249,
          type: "extended",
          active: true,
          sales: 12,
          revenue: 2988,
          features: [
            "All Standard License features",
            "No attribution required",
            "Use in multiple campaigns",
            "Broadcast rights",
            "Priority support",
          ],
          restrictions: ["Cannot claim original authorship"],
        },
      ],
      sales: {
        total: 44,
        thisMonth: 14,
        lastMonth: 12,
        revenue: 5836,
        revenueThisMonth: 1782,
        revenueLastMonth: 1604,
        history: [
          { month: "Aug", revenue: 534, sales: 6 },
          { month: "Sep", revenue: 712, sales: 8 },
          { month: "Oct", revenue: 890, sales: 10 },
          { month: "Nov", revenue: 1604, sales: 12 },
          { month: "Dec", revenue: 1604, sales: 12 },
          { month: "Jan", revenue: 1782, sales: 14 },
        ],
      },
      views: 1860,
      downloads: 44,
      infringements: 5,
      takedowns: 3,
      collaborators: ["Alex Chen"],
      versions: 2,
    },
    {
      id: "4",
      title: "Business Plan Template",
      description: "Comprehensive business plan template with financial projections",
      type: "document",
      thumbnail: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-08",
      lastUpdated: "2024-01-10",
      status: "active",
      verified: true,
      featured: false,
      size: "3.2 MB",
      tags: ["business", "plan", "template", "finance"],
      licenses: [
        {
          id: "l8",
          name: "Standard License",
          price: 29,
          type: "standard",
          active: true,
          sales: 56,
          revenue: 1624,
          features: ["Commercial use allowed", "Attribution required", "Use for one business", "Modify and customize"],
          restrictions: ["Cannot resell as-is", "Cannot use in templates for sale"],
        },
      ],
      sales: {
        total: 56,
        thisMonth: 18,
        lastMonth: 14,
        revenue: 1624,
        revenueThisMonth: 522,
        revenueLastMonth: 406,
        history: [
          { month: "Aug", revenue: 116, sales: 4 },
          { month: "Sep", revenue: 174, sales: 6 },
          { month: "Oct", revenue: 232, sales: 8 },
          { month: "Nov", revenue: 348, sales: 12 },
          { month: "Dec", revenue: 406, sales: 14 },
          { month: "Jan", revenue: 522, sales: 18 },
        ],
      },
      views: 2450,
      downloads: 56,
      infringements: 2,
      takedowns: 1,
      versions: 1,
    },
    {
      id: "5",
      title: "Ambient Music Pack",
      description: "Royalty-free ambient music tracks for content creators",
      type: "audio",
      thumbnail: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-05",
      lastUpdated: "2024-01-08",
      status: "active",
      verified: true,
      featured: false,
      size: "128 MB",
      tags: ["music", "ambient", "royalty-free", "background"],
      licenses: [
        {
          id: "l9",
          name: "Standard License",
          price: 39,
          type: "standard",
          active: true,
          sales: 42,
          revenue: 1638,
          features: ["Commercial use allowed", "Attribution required", "Use in one project", "Digital use only"],
          restrictions: ["Cannot resell as-is", "Cannot use in music libraries"],
        },
        {
          id: "l10",
          name: "Extended License",
          price: 99,
          type: "extended",
          active: true,
          sales: 16,
          revenue: 1584,
          features: [
            "All Standard License features",
            "No attribution required",
            "Use in multiple projects",
            "Broadcast rights",
            "Priority support",
          ],
          restrictions: ["Cannot claim original authorship"],
        },
      ],
      sales: {
        total: 58,
        thisMonth: 16,
        lastMonth: 14,
        revenue: 3222,
        revenueThisMonth: 858,
        revenueLastMonth: 780,
        history: [
          { month: "Aug", revenue: 312, sales: 8 },
          { month: "Sep", revenue: 468, sales: 12 },
          { month: "Oct", revenue: 546, sales: 14 },
          { month: "Nov", revenue: 702, sales: 18 },
          { month: "Dec", revenue: 780, sales: 14 },
          { month: "Jan", revenue: 858, sales: 16 },
        ],
      },
      views: 1680,
      downloads: 58,
      infringements: 4,
      takedowns: 2,
      collaborators: ["David Kim", "Emma Wilson"],
      versions: 2,
    },
    {
      id: "6",
      title: "UI Design System",
      description: "Complete design system with components, colors, and typography",
      type: "image",
      thumbnail: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-02",
      lastUpdated: "2024-01-15",
      status: "draft",
      verified: false,
      featured: false,
      size: "86.4 MB",
      tags: ["ui", "design system", "figma", "components"],
      licenses: [
        {
          id: "l11",
          name: "Standard License",
          price: 149,
          type: "standard",
          active: false,
          sales: 0,
          revenue: 0,
          features: ["Commercial use allowed", "Attribution required", "Use in one project", "Modify and customize"],
          restrictions: ["Cannot resell as-is", "Cannot use in templates for sale"],
        },
        {
          id: "l12",
          name: "Extended License",
          price: 349,
          type: "extended",
          active: false,
          sales: 0,
          revenue: 0,
          features: [
            "All Standard License features",
            "No attribution required",
            "Use in multiple projects",
            "Resale rights included",
            "Priority support",
          ],
          restrictions: ["Cannot claim original authorship"],
        },
      ],
      sales: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        revenue: 0,
        revenueThisMonth: 0,
        revenueLastMonth: 0,
        history: [
          { month: "Aug", revenue: 0, sales: 0 },
          { month: "Sep", revenue: 0, sales: 0 },
          { month: "Oct", revenue: 0, sales: 0 },
          { month: "Nov", revenue: 0, sales: 0 },
          { month: "Dec", revenue: 0, sales: 0 },
          { month: "Jan", revenue: 0, sales: 0 },
        ],
      },
      views: 0,
      downloads: 0,
      infringements: 0,
      takedowns: 0,
      versions: 1,
    },
    {
      id: "7",
      title: "E-commerce Website Template",
      description: "Responsive e-commerce website template with shopping cart functionality",
      type: "code",
      thumbnail: "/placeholder.svg?height=200&width=300",
      uploadDate: "2024-01-20",
      lastUpdated: "2024-01-20",
      status: "pending",
      verified: false,
      featured: false,
      size: "24.8 MB",
      tags: ["e-commerce", "website", "template", "responsive"],
      licenses: [
        {
          id: "l13",
          name: "Standard License",
          price: 59,
          type: "standard",
          active: false,
          sales: 0,
          revenue: 0,
          features: ["Commercial use allowed", "Attribution required", "Use in one project", "Updates for 6 months"],
          restrictions: ["Cannot resell as-is", "Cannot use in templates for sale"],
        },
      ],
      sales: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
        revenue: 0,
        revenueThisMonth: 0,
        revenueLastMonth: 0,
        history: [
          { month: "Aug", revenue: 0, sales: 0 },
          { month: "Sep", revenue: 0, sales: 0 },
          { month: "Oct", revenue: 0, sales: 0 },
          { month: "Nov", revenue: 0, sales: 0 },
          { month: "Dec", revenue: 0, sales: 0 },
          { month: "Jan", revenue: 0, sales: 0 },
        ],
      },
      views: 0,
      downloads: 0,
      infringements: 0,
      takedowns: 0,
      versions: 1,
    },
  ])

  // Filter assets based on current filters and search
  const filteredAssets = assets.filter((asset) => {
    const typeMatch = filterType === "all" || asset.type === filterType
    const statusMatch = filterStatus === "all" || asset.status === filterStatus
    const tabMatch =
      activeTab === "all" ||
      (activeTab === "featured" && asset.featured) ||
      (activeTab === "verified" && asset.verified) ||
      (activeTab === "drafts" && asset.status === "draft") ||
      (activeTab === "pending" && asset.status === "pending")
    const searchMatch =
      searchQuery === "" ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return typeMatch && statusMatch && tabMatch && searchMatch
  })

  // Sort assets based on current sort option
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      case "oldest":
        return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime()
      case "title_asc":
        return a.title.localeCompare(b.title)
      case "title_desc":
        return b.title.localeCompare(a.title)
      case "most_sales":
        return b.sales.total - a.sales.total
      case "most_revenue":
        return b.sales.revenue - a.sales.revenue
      case "most_views":
        return b.views - a.views
      default:
        return 0
    }
  })

  // Get asset type icon
  const getAssetTypeIcon = (type: string) => {
    const icons = {
      image: ImageIcon,
      text: FileText,
      document: FileText,
      video: Video,
      audio: Music,
      code: Code,
    }
    const Icon = icons[type] || FileText
    return <Icon className="h-4 w-4" />
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      active: { variant: "default" as const, color: "text-green-600", icon: CheckCircle },
      pending: { variant: "secondary" as const, color: "text-yellow-600", icon: Clock },
      draft: { variant: "outline" as const, color: "text-gray-600", icon: Edit },
      archived: { variant: "outline" as const, color: "text-red-600", icon: Archive },
    }
    const config = variants[status] || variants.active
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    )
  }

  // Calculate total stats
  const totalStats = {
    assets: assets.length,
    sales: assets.reduce((sum, asset) => sum + asset.sales.total, 0),
    revenue: assets.reduce((sum, asset) => sum + asset.sales.revenue, 0),
    views: assets.reduce((sum, asset) => sum + asset.views, 0),
    downloads: assets.reduce((sum, asset) => sum + asset.downloads, 0),
    infringements: assets.reduce((sum, asset) => sum + asset.infringements, 0),
    takedowns: assets.reduce((sum, asset) => sum + asset.takedowns, 0),
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for assets:`, selectedAssets)
    // Implement bulk actions
    setSelectedAssets([])
  }

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    console.log(`Deleting asset: ${assetToDelete}`)
    // Implement delete logic
    setShowDeleteConfirm(false)
    setAssetToDelete(null)
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAssets(sortedAssets.map((asset) => asset.id))
    } else {
      setSelectedAssets([])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                <span className="text-lg sm:text-2xl font-bold text-gray-900">IP Vault</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/upload">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Upload New</span>
                  <span className="sm:hidden">Upload</span>
                </Link>
              </Button>
              <div className="text-sm text-gray-600 hidden sm:block">My Assets</div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Assets</h1>
          <p className="text-gray-600">
            Manage your creative works, track sales performance, and update licensing options.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assets</p>
                  <p className="text-2xl font-bold">{totalStats.assets}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-green-600">{totalStats.sales}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${totalStats.revenue}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-blue-600">{totalStats.views}</p>
                </div>
                <Eye className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="all" className="text-xs">
                    All Assets
                  </TabsTrigger>
                  <TabsTrigger value="featured" className="text-xs">
                    Featured
                  </TabsTrigger>
                  <TabsTrigger value="verified" className="text-xs">
                    Verified
                  </TabsTrigger>
                  <TabsTrigger value="drafts" className="text-xs">
                    Drafts
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-xs">
                    Pending
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search assets by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Asset Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="code">Code</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                      <SelectItem value="most_sales">Most Sales</SelectItem>
                      <SelectItem value="most_revenue">Most Revenue</SelectItem>
                      <SelectItem value="most_views">Most Views</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedAssets.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">{selectedAssets.length} asset(s) selected</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("download")}>
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("archive")}>
                        <Archive className="h-3 w-3 mr-1" />
                        Archive
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("delete")}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedAssets([])}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assets Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedAssets.map((asset) => (
              <Card key={asset.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={asset.thumbnail || "/placeholder.svg"}
                    alt={asset.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex space-x-2">
                    {asset.verified && (
                      <Badge className="bg-blue-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {asset.featured && (
                      <Badge className="bg-orange-500">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Checkbox
                      checked={selectedAssets.includes(asset.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedAssets((prev) => [...prev, asset.id])
                        } else {
                          setSelectedAssets((prev) => prev.filter((id) => id !== asset.id))
                        }
                      }}
                    />
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 bg-blue-100 rounded-lg">{getAssetTypeIcon(asset.type)}</div>
                      <CardTitle className="text-base truncate">{asset.title}</CardTitle>
                    </div>
                    {getStatusBadge(asset.status)}
                  </div>
                  <CardDescription className="line-clamp-2 text-sm">{asset.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-500">Sales</div>
                      <div className="font-medium">{asset.sales.total}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Revenue</div>
                      <div className="font-medium text-green-600">${asset.sales.revenue}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Views</div>
                      <div className="font-medium">{asset.views}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Licenses</div>
                      <div className="font-medium">{asset.licenses.length}</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between">
                  <div className="text-xs text-gray-500">Uploaded {asset.uploadDate}</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setSelectedAsset(asset.id)}>
                        <Eye className="h-3 w-3 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-3 w-3 mr-2" />
                        Edit Asset
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-3 w-3 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Share2 className="h-3 w-3 mr-2" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="h-3 w-3 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => {
                          setAssetToDelete(asset.id)
                          setShowDeleteConfirm(true)
                        }}
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left w-12">
                        <Checkbox
                          checked={selectedAssets.length === sortedAssets.length && sortedAssets.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="p-3 text-left">Asset</th>
                      <th className="p-3 text-left hidden md:table-cell">Type</th>
                      <th className="p-3 text-left hidden lg:table-cell">Status</th>
                      <th className="p-3 text-left">Sales</th>
                      <th className="p-3 text-left">Revenue</th>
                      <th className="p-3 text-left hidden lg:table-cell">Views</th>
                      <th className="p-3 text-left hidden xl:table-cell">Uploaded</th>
                      <th className="p-3 text-left w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAssets.map((asset) => (
                      <tr key={asset.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <Checkbox
                            checked={selectedAssets.includes(asset.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedAssets((prev) => [...prev, asset.id])
                              } else {
                                setSelectedAssets((prev) => prev.filter((id) => id !== asset.id))
                              }
                            }}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <img
                                src={asset.thumbnail || "/placeholder.svg"}
                                alt={asset.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="max-w-[200px]">
                              <div className="font-medium truncate">{asset.title}</div>
                              <div className="text-xs text-gray-500 truncate">{asset.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <div className="flex items-center space-x-1">
                            {getAssetTypeIcon(asset.type)}
                            <span className="capitalize">{asset.type}</span>
                          </div>
                        </td>
                        <td className="p-3 hidden lg:table-cell">{getStatusBadge(asset.status)}</td>
                        <td className="p-3">
                          <div className="font-medium">{asset.sales.total}</div>
                          <div className="text-xs text-green-600">+{asset.sales.thisMonth} this month</div>
                        </td>
                        <td className="p-3">
                          <div className="font-medium text-green-600">${asset.sales.revenue}</div>
                          <div className="text-xs text-green-600">+${asset.sales.revenueThisMonth} this month</div>
                        </td>
                        <td className="p-3 hidden lg:table-cell">{asset.views}</td>
                        <td className="p-3 hidden xl:table-cell">{asset.uploadDate}</td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setSelectedAsset(asset.id)}>
                                <Eye className="h-3 w-3 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-3 w-3 mr-2" />
                                Edit Asset
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-3 w-3 mr-2" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Share2 className="h-3 w-3 mr-2" />
                                Share
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="h-3 w-3 mr-2" />
                                Archive
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                  setAssetToDelete(asset.id)
                                  setShowDeleteConfirm(true)
                                }}
                              >
                                <Trash2 className="h-3 w-3 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {sortedAssets.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No assets found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery || filterType !== "all" || filterStatus !== "all"
                      ? "Try adjusting your search criteria or filters"
                      : "Start by uploading your first creative work"}
                  </p>
                  <Button asChild>
                    <Link href="/upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload First Asset
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Asset Details Modal */}
        {selectedAsset && (
          <Dialog open={!!selectedAsset} onOpenChange={() => setSelectedAsset(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {(() => {
                const asset = assets.find((a) => a.id === selectedAsset)
                if (!asset) return null

                return (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>{asset.title}</span>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(asset.status)}
                          {asset.verified && (
                            <Badge className="bg-blue-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1">
                            {getAssetTypeIcon(asset.type)}
                            <span className="capitalize">{asset.type}</span>
                          </div>
                          <span>•</span>
                          <span>Uploaded on {asset.uploadDate}</span>
                          <span>•</span>
                          <span>{asset.size}</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Asset Preview */}
                      <Card>
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={asset.thumbnail || "/placeholder.svg"}
                              alt={asset.title}
                              className="w-full h-64 object-cover"
                            />
                            {asset.featured && (
                              <Badge className="absolute top-2 right-2 bg-orange-500">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Description */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{asset.description}</p>

                          {asset.tags.length > 0 && (
                            <div className="mt-4">
                              <div className="text-sm font-medium text-gray-600 mb-2">Tags</div>
                              <div className="flex flex-wrap gap-2">
                                {asset.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Sales Performance */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Sales Performance</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <div className="text-sm text-gray-500">Total Sales</div>
                              <div className="text-xl font-bold">{asset.sales.total}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">Total Revenue</div>
                              <div className="text-xl font-bold text-green-600">${asset.sales.revenue}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">This Month</div>
                              <div className="text-xl font-bold">{asset.sales.thisMonth} sales</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500">This Month Revenue</div>
                              <div className="text-xl font-bold text-green-600">${asset.sales.revenueThisMonth}</div>
                            </div>
                          </div>

                          <div className="h-64">
                            <ChartContainer
                              config={{
                                revenue: {
                                  label: "Revenue",
                                  color: "hsl(var(--chart-1))",
                                },
                                sales: {
                                  label: "Sales",
                                  color: "hsl(var(--chart-2))",
                                },
                              }}
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={asset.sales.history} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="month" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                                  <ChartTooltip content={<ChartTooltipContent />} />
                                  <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="var(--color-revenue)"
                                    fill="var(--color-revenue)"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="var(--color-sales)"
                                    fill="var(--color-sales)"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </ChartContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* License Details */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">License Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {asset.licenses.map((license) => (
                              <div
                                key={license.id}
                                className={`border rounded-lg p-4 ${
                                  license.active ? "border-green-500 bg-green-50" : "border-gray-200"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <div className="font-medium">{license.name}</div>
                                    <Badge variant={license.active ? "default" : "outline"}>
                                      {license.active ? (
                                        <>
                                          <Unlock className="h-3 w-3 mr-1" />
                                          Active
                                        </>
                                      ) : (
                                        <>
                                          <Lock className="h-3 w-3 mr-1" />
                                          Inactive
                                        </>
                                      )}
                                    </Badge>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-xl font-bold text-green-600">${license.price}</div>
                                    <div className="text-sm text-gray-500">
                                      {license.sales} sales • ${license.revenue} revenue
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <div className="text-sm font-medium text-green-600 mb-2">Features:</div>
                                    <div className="space-y-1">
                                      {license.features.map((feature, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-sm">
                                          <CheckCircle className="h-3 w-3 text-green-600" />
                                          <span>{feature}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {license.restrictions.length > 0 && (
                                    <div>
                                      <div className="text-sm font-medium text-red-600 mb-2">Restrictions:</div>
                                      <div className="space-y-1">
                                        {license.restrictions.map((restriction, index) => (
                                          <div key={index} className="flex items-center space-x-2 text-sm">
                                            <AlertTriangle className="h-3 w-3 text-red-600" />
                                            <span>{restriction}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="flex justify-end mt-4">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-3 w-3 mr-1" />
                                    Edit License
                                  </Button>
                                </div>
                              </div>
                            ))}

                            <Button variant="outline" className="w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              Add New License
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Additional Info */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                              <div className="text-gray-500">Views</div>
                              <div className="font-medium">{asset.views}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Downloads</div>
                              <div className="font-medium">{asset.downloads}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Infringements</div>
                              <div className="font-medium">{asset.infringements}</div>
                            </div>
                            <div>
                              <div className="text-gray-500">Takedowns</div>
                              <div className="font-medium">{asset.takedowns}</div>
                            </div>
                            {asset.collaborators && (
                              <div className="col-span-2">
                                <div className="text-gray-500">Collaborators</div>
                                <div className="font-medium">{asset.collaborators.join(", ")}</div>
                              </div>
                            )}
                            {asset.versions && (
                              <div>
                                <div className="text-gray-500">Versions</div>
                                <div className="font-medium">{asset.versions}</div>
                              </div>
                            )}
                            <div>
                              <div className="text-gray-500">Last Updated</div>
                              <div className="font-medium">{asset.lastUpdated}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Actions */}
                      <div className="flex justify-end space-x-4 pt-4 border-t">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline">
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Asset
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setAssetToDelete(asset.id)
                            setShowDeleteConfirm(true)
                            setSelectedAsset(null)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </>
                )
              })()}
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Asset</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this asset? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirm}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Asset
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
