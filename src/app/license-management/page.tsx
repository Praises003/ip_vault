"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Shield,
  ArrowLeft,
  Search,
  FileText,
  DollarSign,
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Download,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Clock,
  ImportIcon as Export,
  RefreshCw,
  Ban,
  Star,
  TrendingUp,
  Copy,
  ExternalLink,
  MessageSquare,
  Globe,
  BarChart3,
  X,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface License {
  id: string
  licenseNumber: string
  assetId: string
  assetTitle: string
  assetThumbnail: string
  assetType: "image" | "video" | "audio" | "code" | "document"
  buyer: {
    id: string
    name: string
    email: string
    company?: string
    avatar?: string
    phone?: string
    address?: string
    country: string
    verified: boolean
    totalPurchases: number
    memberSince: string
  }
  licenseType: "standard" | "extended" | "exclusive" | "custom"
  licenseName: string
  price: number
  currency: string
  purchaseDate: string
  expiryDate?: string
  status: "active" | "expired" | "revoked" | "pending"
  paymentStatus: "completed" | "pending" | "failed" | "refunded"
  paymentMethod: string
  transactionId: string
  terms: {
    commercialUse: boolean
    attribution: boolean
    resale: boolean
    modification: boolean
    distribution: boolean
    exclusivity: boolean
    territory: string
    duration: string
    copies: string
    usage: string[]
  }
  usage: {
    downloads: number
    lastAccessed?: string
    projects?: string[]
    violations?: number
  }
  revenue: {
    gross: number
    fees: number
    net: number
    tax?: number
  }
  notes?: string
  renewals: number
  originalLicenseId?: string
}

type Status = "active" | "expired" | "revoked" | "pending";

type LicenseType = "standard" | "extended" | "exclusive" | "custom";


export default function LicenseManagementPage() {
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([])
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPayment, setFilterPayment] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [/*showBulkActions*/, setShowBulkActions] = useState(false)

  // Mock licenses data
  const [licenses] = useState<License[]>([
    {
      id: "lic_001",
      licenseNumber: "LIC-2024-001234",
      assetId: "1",
      assetTitle: "Modern Logo Design Kit",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "image",
      buyer: {
        id: "buyer_001",
        name: "Sarah Johnson",
        email: "sarah.johnson@techcorp.com",
        company: "TechCorp Solutions",
        avatar: "/placeholder.svg?height=40&width=40",
        phone: "+1 (555) 123-4567",
        address: "123 Business Ave, San Francisco, CA 94105",
        country: "United States",
        verified: true,
        totalPurchases: 12,
        memberSince: "2022-03-15",
      },
      licenseType: "extended",
      licenseName: "Extended Commercial License",
      price: 129,
      currency: "USD",
      purchaseDate: "2024-01-20",
      expiryDate: "2025-01-20",
      status: "active",
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      transactionId: "txn_1234567890",
      terms: {
        commercialUse: true,
        attribution: false,
        resale: true,
        modification: true,
        distribution: true,
        exclusivity: false,
        territory: "Worldwide",
        duration: "1 year",
        copies: "Unlimited",
        usage: ["Digital", "Print", "Web", "Mobile Apps", "Templates"],
      },
      usage: {
        downloads: 3,
        lastAccessed: "2024-01-22",
        projects: ["Website Redesign", "Mobile App", "Marketing Materials"],
        violations: 0,
      },
      revenue: {
        gross: 129,
        fees: 12.9,
        net: 116.1,
        tax: 10.32,
      },
      notes: "Premium customer with multiple purchases",
      renewals: 0,
    },
    {
      id: "lic_002",
      licenseNumber: "LIC-2024-001235",
      assetId: "2",
      assetTitle: "React Dashboard Components",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "code",
      buyer: {
        id: "buyer_002",
        name: "Michael Chen",
        email: "m.chen@startup.io",
        company: "InnovateLab",
        avatar: "/placeholder.svg?height=40&width=40",
        phone: "+1 (555) 987-6543",
        address: "456 Innovation Dr, Austin, TX 78701",
        country: "United States",
        verified: true,
        totalPurchases: 5,
        memberSince: "2023-07-22",
      },
      licenseType: "standard",
      licenseName: "Standard Developer License",
      price: 79,
      currency: "USD",
      purchaseDate: "2024-01-18",
      status: "active",
      paymentStatus: "completed",
      paymentMethod: "PayPal",
      transactionId: "txn_1234567891",
      terms: {
        commercialUse: true,
        attribution: true,
        resale: false,
        modification: true,
        distribution: false,
        exclusivity: false,
        territory: "Worldwide",
        duration: "Perpetual",
        copies: "Single Project",
        usage: ["Web Applications", "Desktop Apps"],
      },
      usage: {
        downloads: 1,
        lastAccessed: "2024-01-18",
        projects: ["SaaS Dashboard"],
        violations: 0,
      },
      revenue: {
        gross: 79,
        fees: 7.9,
        net: 71.1,
      },
      renewals: 0,
    },
    {
      id: "lic_003",
      licenseNumber: "LIC-2024-001236",
      assetId: "3",
      assetTitle: "Marketing Video Templates",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "video",
      buyer: {
        id: "buyer_003",
        name: "Emma Rodriguez",
        email: "emma@creativestudio.com",
        company: "Creative Studio Pro",
        avatar: "/placeholder.svg?height=40&width=40",
        phone: "+1 (555) 456-7890",
        address: "789 Creative Blvd, Los Angeles, CA 90210",
        country: "United States",
        verified: true,
        totalPurchases: 8,
        memberSince: "2023-01-10",
      },
      licenseType: "extended",
      licenseName: "Extended Broadcast License",
      price: 249,
      currency: "USD",
      purchaseDate: "2024-01-15",
      expiryDate: "2025-01-15",
      status: "active",
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      transactionId: "txn_1234567892",
      terms: {
        commercialUse: true,
        attribution: false,
        resale: false,
        modification: true,
        distribution: true,
        exclusivity: false,
        territory: "Worldwide",
        duration: "1 year",
        copies: "Unlimited",
        usage: ["Social Media", "TV Commercials", "Online Ads", "Presentations"],
      },
      usage: {
        downloads: 5,
        lastAccessed: "2024-01-21",
        projects: ["Brand Campaign", "Product Launch", "Social Media Series"],
        violations: 0,
      },
      revenue: {
        gross: 249,
        fees: 24.9,
        net: 224.1,
        tax: 19.92,
      },
      notes: "Premium customer with multiple purchases",
      renewals: 0,
    },
    {
      id: "lic_004",
      licenseNumber: "LIC-2024-001237",
      assetId: "1",
      assetTitle: "Modern Logo Design Kit",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "image",
      buyer: {
        id: "buyer_004",
        name: "David Kim",
        email: "david.kim@freelancer.com",
        company: "Freelance Designer",
        avatar: "/placeholder.svg?height=40&width=40",
        country: "South Korea",
        verified: false,
        totalPurchases: 2,
        memberSince: "2023-11-05",
      },
      licenseType: "standard",
      licenseName: "Standard Commercial License",
      price: 49,
      currency: "USD",
      purchaseDate: "2024-01-12",
      status: "active",
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      transactionId: "txn_1234567893",
      terms: {
        commercialUse: true,
        attribution: true,
        resale: false,
        modification: true,
        distribution: false,
        exclusivity: false,
        territory: "Worldwide",
        duration: "Perpetual",
        copies: "Up to 10,000",
        usage: ["Digital", "Print"],
      },
      usage: {
        downloads: 2,
        lastAccessed: "2024-01-14",
        projects: ["Client Branding"],
        violations: 0,
      },
      revenue: {
        gross: 49,
        fees: 4.9,
        net: 44.1,
      },
      renewals: 0,
    },
    {
      id: "lic_005",
      licenseNumber: "LIC-2024-001238",
      assetId: "5",
      assetTitle: "Ambient Music Pack",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "audio",
      buyer: {
        id: "buyer_005",
        name: "Alex Thompson",
        email: "alex@contentcreator.com",
        company: "Content Creator",
        avatar: "/placeholder.svg?height=40&width=40",
        country: "Canada",
        verified: true,
        totalPurchases: 15,
        memberSince: "2022-08-20",
      },
      licenseType: "extended",
      licenseName: "Extended Broadcast License",
      price: 99,
      currency: "USD",
      purchaseDate: "2024-01-10",
      status: "active",
      paymentStatus: "completed",
      paymentMethod: "PayPal",
      transactionId: "txn_1234567894",
      terms: {
        commercialUse: true,
        attribution: false,
        resale: false,
        modification: true,
        distribution: true,
        exclusivity: false,
        territory: "Worldwide",
        duration: "Perpetual",
        copies: "Unlimited",
        usage: ["YouTube", "Podcasts", "Streaming", "Commercial Videos"],
      },
      usage: {
        downloads: 8,
        lastAccessed: "2024-01-20",
        projects: ["YouTube Series", "Podcast Intro", "Commercial Background"],
        violations: 0,
      },
      revenue: {
        gross: 99,
        fees: 9.9,
        net: 89.1,
      },
      renewals: 1,
    },
    {
      id: "lic_006",
      licenseNumber: "LIC-2024-001239",
      assetId: "4",
      assetTitle: "Business Plan Template",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "document",
      buyer: {
        id: "buyer_006",
        name: "Lisa Wang",
        email: "lisa.wang@startup.com",
        company: "NextGen Startup",
        avatar: "/placeholder.svg?height=40&width=40",
        country: "Singapore",
        verified: true,
        totalPurchases: 3,
        memberSince: "2023-12-01",
      },
      licenseType: "standard",
      licenseName: "Standard Business License",
      price: 29,
      currency: "USD",
      purchaseDate: "2024-01-08",
      status: "active",
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      transactionId: "txn_1234567895",
      terms: {
        commercialUse: true,
        attribution: true,
        resale: false,
        modification: true,
        distribution: false,
        exclusivity: false,
        territory: "Worldwide",
        duration: "Perpetual",
        copies: "Single Business",
        usage: ["Business Planning", "Investor Presentations"],
      },
      usage: {
        downloads: 1,
        lastAccessed: "2024-01-08",
        projects: ["Startup Business Plan"],
        violations: 0,
      },
      revenue: {
        gross: 29,
        fees: 2.9,
        net: 26.1,
      },
      renewals: 0,
    },
    {
      id: "lic_007",
      licenseNumber: "LIC-2024-001240",
      assetId: "2",
      assetTitle: "React Dashboard Components",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "code",
      buyer: {
        id: "buyer_007",
        name: "James Wilson",
        email: "james@enterprise.com",
        company: "Enterprise Solutions Ltd",
        avatar: "/placeholder.svg?height=40&width=40",
        country: "United Kingdom",
        verified: true,
        totalPurchases: 25,
        memberSince: "2021-05-15",
      },
      licenseType: "exclusive",
      licenseName: "Exclusive Enterprise License",
      price: 499,
      currency: "USD",
      purchaseDate: "2024-01-05",
      status: "active",
      paymentStatus: "completed",
      paymentMethod: "Bank Transfer",
      transactionId: "txn_1234567896",
      terms: {
        commercialUse: true,
        attribution: false,
        resale: true,
        modification: true,
        distribution: true,
        exclusivity: true,
        territory: "Worldwide",
        duration: "Perpetual",
        copies: "Unlimited",
        usage: ["Enterprise Software", "Client Projects", "Resale"],
      },
      usage: {
        downloads: 1,
        lastAccessed: "2024-01-05",
        projects: ["Enterprise Dashboard"],
        violations: 0,
      },
      revenue: {
        gross: 499,
        fees: 49.9,
        net: 449.1,
        tax: 39.92,
      },
      renewals: 0,
    },
    {
      id: "lic_008",
      licenseNumber: "LIC-2024-001241",
      assetId: "3",
      assetTitle: "Marketing Video Templates",
      assetThumbnail: "/placeholder.svg?height=60&width=60",
      assetType: "video",
      buyer: {
        id: "buyer_008",
        name: "Maria Garcia",
        email: "maria@agency.com",
        company: "Digital Marketing Agency",
        avatar: "/placeholder.svg?height=40&width=40",
        country: "Spain",
        verified: true,
        totalPurchases: 18,
        memberSince: "2022-11-30",
      },
      licenseType: "standard",
      licenseName: "Standard Commercial License",
      price: 89,
      currency: "USD",
      purchaseDate: "2024-01-03",
      status: "expired",
      paymentStatus: "completed",
      paymentMethod: "Credit Card",
      transactionId: "txn_1234567897",
      terms: {
        commercialUse: true,
        attribution: true,
        resale: false,
        modification: true,
        distribution: false,
        exclusivity: false,
        territory: "Europe",
        duration: "6 months",
        copies: "Up to 1,000",
        usage: ["Social Media", "Client Campaigns"],
      },
      usage: {
        downloads: 12,
        lastAccessed: "2024-01-02",
        projects: ["Client Campaign A", "Client Campaign B", "Social Media Posts"],
        violations: 0,
      },
      revenue: {
        gross: 89,
        fees: 8.9,
        net: 80.1,
      },
      renewals: 0,
      expiryDate: "2024-07-03",
    },
  ])

  // Filter licenses based on current filters and search
  const filteredLicenses = licenses.filter((license) => {
    const typeMatch = filterType === "all" || license.licenseType === filterType
    const statusMatch = filterStatus === "all" || license.status === filterStatus
    const paymentMatch = filterPayment === "all" || license.paymentStatus === filterPayment
    const tabMatch =
      activeTab === "all" ||
      (activeTab === "active" && license.status === "active") ||
      (activeTab === "expired" && license.status === "expired") ||
      (activeTab === "exclusive" && license.licenseType === "exclusive") ||
      (activeTab === "high_value" && license.price >= 200)
    const searchMatch =
      searchQuery === "" ||
      license.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.assetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.buyer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.buyer.company?.toLowerCase().includes(searchQuery.toLowerCase())

    return typeMatch && statusMatch && paymentMatch && tabMatch && searchMatch
  })

  // Sort licenses based on current sort option
  const sortedLicenses = [...filteredLicenses].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      case "oldest":
        return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
      case "highest_value":
        return b.price - a.price
      case "lowest_value":
        return a.price - b.price
      case "buyer_name":
        return a.buyer.name.localeCompare(b.buyer.name)
      case "asset_name":
        return a.assetTitle.localeCompare(b.assetTitle)
      default:
        return 0
    }
  })

  // Calculate total stats
  const totalStats = {
    licenses: licenses.length,
    activeLicenses: licenses.filter((l) => l.status === "active").length,
    totalRevenue: licenses.reduce((sum, license) => sum + license.revenue.net, 0),
    thisMonthRevenue: licenses
      .filter((l) => new Date(l.purchaseDate).getMonth() === new Date().getMonth())
      .reduce((sum, license) => sum + license.revenue.net, 0),
    averageValue: licenses.reduce((sum, license) => sum + license.price, 0) / licenses.length,
    uniqueBuyers: new Set(licenses.map((l) => l.buyer.id)).size,
  }

  // License type distribution for chart
  const licenseTypeData = [
    {
      name: "Standard",
      value: licenses.filter((l) => l.licenseType === "standard").length,
      color: "#3b82f6",
    },
    {
      name: "Extended",
      value: licenses.filter((l) => l.licenseType === "extended").length,
      color: "#10b981",
    },
    {
      name: "Exclusive",
      value: licenses.filter((l) => l.licenseType === "exclusive").length,
      color: "#f59e0b",
    },
    {
      name: "Custom",
      value: licenses.filter((l) => l.licenseType === "custom").length,
      color: "#8b5cf6",
    },
  ]

  // Revenue over time data
  const revenueData = [
    { month: "Aug", revenue: 245 },
    { month: "Sep", revenue: 389 },
    { month: "Oct", revenue: 567 },
    { month: "Nov", revenue: 723 },
    { month: "Dec", revenue: 891 },
    { month: "Jan", revenue: 1156 },
  ]

  // Get status badge
  const getStatusBadge = (status: Status) => {
  const variants: Record<
    Status,
    { variant: "default" | "secondary" | "destructive" | "outline"; color: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }
  > = {
    active: { variant: "default", color: "text-green-600", icon: CheckCircle },
    expired: { variant: "secondary", color: "text-red-600", icon: XCircle },
    revoked: { variant: "destructive", color: "text-red-600", icon: Ban },
    pending: { variant: "outline", color: "text-yellow-600", icon: Clock },
  };

  const config = variants[status] || variants.active;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.color}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  );
};

  // Get license type badge
  const getLicenseTypeBadge = (type: LicenseType) => {
  const variants: Record<
    LicenseType,
    { variant: "default" | "secondary" | "outline"; color: string }
  > = {
    standard: { variant: "outline", color: "text-blue-600" },
    extended: { variant: "default", color: "text-green-600" },
    exclusive: { variant: "default", color: "text-orange-600" },
    custom: { variant: "secondary", color: "text-purple-600" },
  };

  const config = variants[type] || variants.standard;

  return (
    <Badge variant={config.variant} className={config.color}>
      {type}
    </Badge>
  );
};

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for licenses:`, selectedLicenses)
    setSelectedLicenses([])
    setShowBulkActions(false)
  }

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLicenses(sortedLicenses.map((license) => license.id))
    } else {
      setSelectedLicenses([])
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
              <Button variant="outline" size="sm">
                <Export className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              <div className="text-sm text-gray-600 hidden sm:block">License Management</div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">License Management</h1>
          <p className="text-gray-600">
            View and manage all licenses issued for your assets, track buyer information, and monitor revenue.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Licenses</p>
                  <p className="text-2xl font-bold">{totalStats.licenses}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Licenses</p>
                  <p className="text-2xl font-bold text-green-600">{totalStats.activeLicenses}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">${totalStats.totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-green-600">${totalStats.thisMonthRevenue.toFixed(0)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Value</p>
                  <p className="text-2xl font-bold text-blue-600">${totalStats.averageValue.toFixed(0)}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Unique Buyers</p>
                  <p className="text-2xl font-bold text-purple-600">{totalStats.uniqueBuyers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly license revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>License Type Distribution</CardTitle>
              <CardDescription>Breakdown of license types issued</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ChartContainer
                  config={{
                    standard: { label: "Standard", color: "#3b82f6" },
                    extended: { label: "Extended", color: "#10b981" },
                    exclusive: { label: "Exclusive", color: "#f59e0b" },
                    custom: { label: "Custom", color: "#8b5cf6" },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={licenseTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {licenseTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {licenseTypeData.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
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
                    All Licenses
                  </TabsTrigger>
                  <TabsTrigger value="active" className="text-xs">
                    Active
                  </TabsTrigger>
                  <TabsTrigger value="expired" className="text-xs">
                    Expired
                  </TabsTrigger>
                  <TabsTrigger value="exclusive" className="text-xs">
                    Exclusive
                  </TabsTrigger>
                  <TabsTrigger value="high_value" className="text-xs">
                    High Value
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by license number, asset, buyer name, or company..."
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
                      <SelectValue placeholder="License Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="extended">Extended</SelectItem>
                      <SelectItem value="exclusive">Exclusive</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="revoked">Revoked</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPayment} onValueChange={setFilterPayment}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Payments</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="highest_value">Highest Value</SelectItem>
                      <SelectItem value="lowest_value">Lowest Value</SelectItem>
                      <SelectItem value="buyer_name">Buyer Name</SelectItem>
                      <SelectItem value="asset_name">Asset Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Bulk Actions */}
              {selectedLicenses.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedLicenses.length} license(s) selected
                    </span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("export")}>
                        <Export className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("renew")}>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Renew
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleBulkAction("revoke")}>
                        <Ban className="h-3 w-3 mr-1" />
                        Revoke
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLicenses([])}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Licenses Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left w-12">
                      <Checkbox
                        checked={selectedLicenses.length === sortedLicenses.length && sortedLicenses.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left">License</th>
                    <th className="p-3 text-left">Asset</th>
                    <th className="p-3 text-left">Buyer</th>
                    <th className="p-3 text-left hidden lg:table-cell">Type</th>
                    <th className="p-3 text-left hidden xl:table-cell">Status</th>
                    <th className="p-3 text-left">Revenue</th>
                    <th className="p-3 text-left hidden lg:table-cell">Purchase Date</th>
                    <th className="p-3 text-left w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLicenses.map((license) => (
                    <tr key={license.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedLicenses.includes(license.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedLicenses((prev) => [...prev, license.id])
                            } else {
                              setSelectedLicenses((prev) => prev.filter((id) => id !== license.id))
                            }
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <div className="max-w-[150px]">
                          <div className="font-medium text-sm truncate">{license.licenseNumber}</div>
                          <div className="text-xs text-gray-500">{license.licenseName}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                            <img
                              src={license.assetThumbnail || "/placeholder.svg"}
                              alt={license.assetTitle}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="max-w-[150px]">
                            <div className="font-medium text-sm truncate">{license.assetTitle}</div>
                            <div className="text-xs text-gray-500 capitalize">{license.assetType}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={license.buyer.avatar || "/placeholder.svg"} alt={license.buyer.name} />
                            <AvatarFallback>{license.buyer.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="max-w-[150px]">
                            <div className="font-medium text-sm truncate flex items-center">
                              {license.buyer.name}
                              {license.buyer.verified && <CheckCircle className="h-3 w-3 ml-1 text-blue-600" />}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {license.buyer.company || license.buyer.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">{getLicenseTypeBadge(license.licenseType)}</td>
                      <td className="p-3 hidden xl:table-cell">{getStatusBadge(license.status)}</td>
                      <td className="p-3">
                        <div className="font-medium text-green-600">${license.revenue.net.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">${license.price} gross</div>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="text-sm">{license.purchaseDate}</div>
                        {license.expiryDate && (
                          <div className="text-xs text-gray-500">Expires: {license.expiryDate}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedLicense(license.id)}>
                              <Eye className="h-3 w-3 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-3 w-3 mr-2" />
                              Download Certificate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-3 w-3 mr-2" />
                              Contact Buyer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <RefreshCw className="h-3 w-3 mr-2" />
                              Renew License
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-3 w-3 mr-2" />
                              Copy License Number
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Ban className="h-3 w-3 mr-2" />
                              Revoke License
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {sortedLicenses.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No licenses found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterType !== "all" || filterStatus !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "No licenses have been issued yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* License Details Modal */}
        {selectedLicense && (
          <Dialog open={!!selectedLicense} onOpenChange={() => setSelectedLicense(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {(() => {
                const license = licenses.find((l) => l.id === selectedLicense)
                if (!license) return null

                return (
                  <>
                    <DialogHeader>
                      <DialogTitle className="flex items-center justify-between">
                        <span>License Details</span>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(license.status)}
                          {getLicenseTypeBadge(license.licenseType)}
                        </div>
                      </DialogTitle>
                      <DialogDescription>
                        <div className="flex items-center space-x-2">
                          <span>License Number: {license.licenseNumber}</span>
                          <span>•</span>
                          <span>Purchased on {license.purchaseDate}</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Asset and Buyer Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Asset Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={license.assetThumbnail || "/placeholder.svg"}
                                alt={license.assetTitle}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <div className="font-medium">{license.assetTitle}</div>
                                <div className="text-sm text-gray-500 capitalize">{license.assetType}</div>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/my-assets`}>
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Asset
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Buyer Information</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-12 w-12">
                                <AvatarImage
                                  src={license.buyer.avatar || "/placeholder.svg"}
                                  alt={license.buyer.name}
                                />
                                <AvatarFallback>{license.buyer.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium flex items-center">
                                  {license.buyer.name}
                                  {license.buyer.verified && <CheckCircle className="h-4 w-4 ml-1 text-blue-600" />}
                                </div>
                                <div className="text-sm text-gray-500">{license.buyer.company}</div>
                              </div>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span>{license.buyer.email}</span>
                              </div>
                              {license.buyer.phone && (
                                <div className="flex items-center space-x-2">
                                  <Phone className="h-4 w-4 text-gray-400" />
                                  <span>{license.buyer.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-gray-400" />
                                <span>{license.buyer.country}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span>Member since {license.buyer.memberSince}</span>
                              </div>
                            </div>

                            <div className="pt-2 border-t">
                              <div className="text-sm text-gray-600">
                                Total Purchases: <span className="font-medium">{license.buyer.totalPurchases}</span>
                              </div>
                            </div>

                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                <Mail className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="h-3 w-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* License Terms */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">License Terms & Conditions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-green-600 mb-3">Permissions</h4>
                              <div className="space-y-2">
                                {license.terms.commercialUse && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Commercial use allowed</span>
                                  </div>
                                )}
                                {!license.terms.attribution && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>No attribution required</span>
                                  </div>
                                )}
                                {license.terms.modification && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Modification allowed</span>
                                  </div>
                                )}
                                {license.terms.distribution && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Distribution allowed</span>
                                  </div>
                                )}
                                {license.terms.resale && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Resale rights included</span>
                                  </div>
                                )}
                                {license.terms.exclusivity && (
                                  <div className="flex items-center space-x-2 text-sm">
                                    <Star className="h-4 w-4 text-orange-600" />
                                    <span>Exclusive license</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-blue-600 mb-3">License Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Territory:</span>
                                  <span className="font-medium">{license.terms.territory}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Duration:</span>
                                  <span className="font-medium">{license.terms.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Copies:</span>
                                  <span className="font-medium">{license.terms.copies}</span>
                                </div>
                                {license.expiryDate && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Expires:</span>
                                    <span className="font-medium">{license.expiryDate}</span>
                                  </div>
                                )}
                              </div>

                              {license.terms.usage.length > 0 && (
                                <div className="mt-4">
                                  <div className="text-gray-600 text-sm mb-2">Allowed Usage:</div>
                                  <div className="flex flex-wrap gap-1">
                                    {license.terms.usage.map((usage, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {usage}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment & Revenue */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Payment & Revenue Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-green-600 mb-3">Revenue Breakdown</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Gross Revenue:</span>
                                  <span className="font-medium">${license.revenue.gross.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Platform Fees:</span>
                                  <span className="font-medium text-red-600">-${license.revenue.fees.toFixed(2)}</span>
                                </div>
                                {license.revenue.tax && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium text-red-600">-${license.revenue.tax.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between border-t pt-2">
                                  <span className="font-medium">Net Revenue:</span>
                                  <span className="font-bold text-green-600">${license.revenue.net.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-blue-600 mb-3">Payment Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Payment Status:</span>
                                  <Badge variant={license.paymentStatus === "completed" ? "default" : "secondary"}>
                                    {license.paymentStatus}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Payment Method:</span>
                                  <span className="font-medium">{license.paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Transaction ID:</span>
                                  <span className="font-medium font-mono text-xs">{license.transactionId}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Purchase Date:</span>
                                  <span className="font-medium">{license.purchaseDate}</span>
                                </div>
                                {license.renewals > 0 && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Renewals:</span>
                                    <span className="font-medium">{license.renewals}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Usage Statistics */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Usage Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{license.usage.downloads}</div>
                              <div className="text-sm text-gray-600">Downloads</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {license.usage.projects?.length || 0}
                              </div>
                              <div className="text-sm text-gray-600">Projects</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{license.usage.violations || 0}</div>
                              <div className="text-sm text-gray-600">Violations</div>
                            </div>
                          </div>

                          {license.usage.projects && license.usage.projects.length > 0 && (
                            <div className="mt-4">
                              <div className="text-sm font-medium text-gray-600 mb-2">Projects Using This License:</div>
                              <div className="flex flex-wrap gap-2">
                                {license.usage.projects.map((project, index) => (
                                  <Badge key={index} variant="outline">
                                    {project}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {license.usage.lastAccessed && (
                            <div className="mt-4 text-sm text-gray-600">
                              Last accessed: {license.usage.lastAccessed}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Notes */}
                      {license.notes && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Notes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{license.notes}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Actions */}
                      <div className="flex justify-end space-x-4 pt-4 border-t">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Certificate
                        </Button>
                        <Button variant="outline">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy License Number
                        </Button>
                        <Button variant="outline">
                          <Mail className="h-4 w-4 mr-2" />
                          Contact Buyer
                        </Button>
                        <Button variant="outline">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew License
                        </Button>
                        <Button variant="destructive">
                          <Ban className="h-4 w-4 mr-2" />
                          Revoke License
                        </Button>
                      </div>
                    </div>
                  </>
                )
              })()}
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
