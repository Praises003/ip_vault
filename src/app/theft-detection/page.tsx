"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Search,
  Upload,
  FileText,
  ImageIcon,
  Video,
  Code,
  Music,
  AlertTriangle,
  ExternalLink,
  Download,
  Eye,
  Brain,
  Zap,
  CheckCircle,
  X,
  Copy,
  Send,
  ArrowLeft,
  Filter,
  RefreshCw,
  Globe,
  Star,
} from "lucide-react"

interface DetectedMatch {
  id: string
  url: string
  platform: string
  title: string
  description: string
  thumbnail: string
  similarityScore: number
  confidence: "high" | "medium" | "low"
  detectedDate: string
  status: "new" | "investigating" | "takedown_sent" | "resolved" | "false_positive"
  assetType: "image" | "text" | "video" | "audio" | "code"
  metadata: {
    domain: string
    pageTitle: string
    lastModified?: string
    fileSize?: string
    dimensions?: string
  }
}

interface SearchAsset {
  id: string
  title: string
  type: "image" | "text" | "video" | "audio" | "code"
  thumbnail: string
  uploadDate: string
}

export default function TheftDetectionPage() {
  const [searchMethod, setSearchMethod] = useState<"upload" | "select" | "url">("select")
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [searchUrl, setSearchUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [searchResults, setSearchResults] = useState<DetectedMatch[]>([])
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterConfidence, setFilterConfidence] = useState("all")
  const [showTakedownForm, setShowTakedownForm] = useState(false)
  const [takedownData, setTakedownData] = useState({
    type: "dmca",
    reason: "",
    additionalInfo: "",
    contactEmail: "",
  })

  // Mock user assets
  const userAssets: SearchAsset[] = [
    {
      id: "1",
      title: "Modern Logo Design Kit",
      type: "image",
      thumbnail: "/placeholder.svg?height=100&width=100",
      uploadDate: "2024-01-15",
    },
    {
      id: "2",
      title: "React Dashboard Components",
      type: "code",
      thumbnail: "/placeholder.svg?height=100&width=100",
      uploadDate: "2024-01-12",
    },
    {
      id: "3",
      title: "Marketing Video Templates",
      type: "video",
      thumbnail: "/placeholder.svg?height=100&width=100",
      uploadDate: "2024-01-10",
    },
    {
      id: "4",
      title: "Business Plan Template",
      type: "text",
      thumbnail: "/placeholder.svg?height=100&width=100",
      uploadDate: "2024-01-08",
    },
    {
      id: "5",
      title: "Ambient Music Pack",
      type: "audio",
      thumbnail: "/placeholder.svg?height=100&width=100",
      uploadDate: "2024-01-05",
    },
  ]

  // Mock search results
  const mockResults: DetectedMatch[] = [
    {
      id: "1",
      url: "https://fake-design-site.com/stolen-logos",
      platform: "Design Portfolio Site",
      title: "Logo Collection - Free Download",
      description: "Collection of modern logos for commercial use",
      thumbnail: "/placeholder.svg?height=150&width=200",
      similarityScore: 98.5,
      confidence: "high",
      detectedDate: "2024-01-20",
      status: "new",
      assetType: "image",
      metadata: {
        domain: "fake-design-site.com",
        pageTitle: "Free Logo Downloads | Design Resources",
        lastModified: "2024-01-19",
        dimensions: "1920x1080",
      },
    },
    {
      id: "2",
      url: "https://pinterest.com/pin/stolen-design",
      platform: "Pinterest",
      title: "Modern Logo Design",
      description: "Beautiful logo design inspiration",
      thumbnail: "/placeholder.svg?height=150&width=200",
      similarityScore: 94.2,
      confidence: "high",
      detectedDate: "2024-01-19",
      status: "investigating",
      assetType: "image",
      metadata: {
        domain: "pinterest.com",
        pageTitle: "Modern Logo Design - Pinterest",
        lastModified: "2024-01-18",
      },
    },
    {
      id: "3",
      url: "https://dribbble.com/shots/copied-design",
      platform: "Dribbble",
      title: "Logo Design Concept",
      description: "Clean and modern logo design",
      thumbnail: "/placeholder.svg?height=150&width=200",
      similarityScore: 87.3,
      confidence: "medium",
      detectedDate: "2024-01-18",
      status: "takedown_sent",
      assetType: "image",
      metadata: {
        domain: "dribbble.com",
        pageTitle: "Logo Design Concept | Dribbble",
        lastModified: "2024-01-17",
      },
    },
    {
      id: "4",
      url: "https://freepik.com/similar-design",
      platform: "Freepik",
      title: "Corporate Logo Vector",
      description: "Free vector logo design",
      thumbnail: "/placeholder.svg?height=150&width=200",
      similarityScore: 76.8,
      confidence: "medium",
      detectedDate: "2024-01-17",
      status: "resolved",
      assetType: "image",
      metadata: {
        domain: "freepik.com",
        pageTitle: "Corporate Logo Vector - Freepik",
        lastModified: "2024-01-16",
      },
    },
    {
      id: "5",
      url: "https://unknown-site.net/logos",
      platform: "Unknown Website",
      title: "Logo Templates",
      description: "Professional logo templates",
      thumbnail: "/placeholder.svg?height=150&width=200",
      similarityScore: 65.4,
      confidence: "low",
      detectedDate: "2024-01-16",
      status: "false_positive",
      assetType: "image",
      metadata: {
        domain: "unknown-site.net",
        pageTitle: "Logo Templates - Download Free",
        lastModified: "2024-01-15",
      },
    },
  ]

  const simulateSearch = useCallback(async () => {
    setIsSearching(true)
    setSearchProgress(0)
    setSearchResults([])

    // Simulate search progress
    const stages = [
      "Analyzing asset...",
      "Searching Google Images...",
      "Scanning social media platforms...",
      "Checking design marketplaces...",
      "Running AI similarity analysis...",
      "Generating confidence scores...",
      "Compiling results...",
    ]

    for (let i = 0; i < stages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setSearchProgress(((i + 1) / stages.length) * 100)
    }

    // Set mock results
    setSearchResults(mockResults)
    setIsSearching(false)
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const getConfidenceBadge = (confidence: string) => {
    const variants = {
      high: "destructive",
      medium: "secondary",
      low: "outline",
    }
    return <Badge variant={variants[confidence] || "secondary"}>{confidence} confidence</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "destructive",
      investigating: "secondary",
      takedown_sent: "default",
      resolved: "default",
      false_positive: "outline",
    }
    const colors = {
      new: "text-red-600",
      investigating: "text-yellow-600",
      takedown_sent: "text-blue-600",
      resolved: "text-green-600",
      false_positive: "text-gray-600",
    }
    return (
      <Badge variant={variants[status] || "secondary"} className={colors[status]}>
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const getAssetIcon = (type: string) => {
    const icons = {
      image: ImageIcon,
      text: FileText,
      video: Video,
      audio: Music,
      code: Code,
    }
    const Icon = icons[type] || FileText
    return <Icon className="h-4 w-4" />
  }

  const filteredResults = searchResults.filter((result) => {
    const platformMatch = filterPlatform === "all" || result.platform.toLowerCase().includes(filterPlatform)
    const confidenceMatch = filterConfidence === "all" || result.confidence === filterConfidence
    return platformMatch && confidenceMatch
  })

  const generateTakedownNotice = () => {
    const selectedResults = searchResults.filter((result) => selectedMatches.includes(result.id))

    const notice = `DMCA TAKEDOWN NOTICE

To: Copyright Agent
Date: ${new Date().toLocaleDateString()}

I am writing to notify you of copyright infringement occurring on your platform.

COPYRIGHTED WORK:
- Title: ${userAssets.find((a) => a.id === selectedAsset)?.title || "My Creative Work"}
- Copyright Owner: [Your Name]
- Original Publication Date: ${userAssets.find((a) => a.id === selectedAsset)?.uploadDate || "N/A"}

INFRINGING MATERIAL:
${selectedResults
  .map(
    (result, index) => `
${index + 1}. URL: ${result.url}
   Platform: ${result.platform}
   Description: ${result.description}
   Similarity Score: ${result.similarityScore}%
`,
  )
  .join("")}

STATEMENT OF GOOD FAITH:
I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law.

STATEMENT OF ACCURACY:
I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the copyright owner.

CONTACT INFORMATION:
Email: ${takedownData.contactEmail}

ADDITIONAL INFORMATION:
${takedownData.additionalInfo}

Please remove or disable access to the infringing material immediately.

Sincerely,
[Your Name]
[Your Title]
[Date]`

    return notice
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
            <div className="text-sm text-gray-600 hidden sm:block">Theft Detection</div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Theft Detection</h1>
          <p className="text-gray-600">
            Search for unauthorized use of your creative works across the internet using AI-powered similarity
            detection.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Search Configuration */}
          <div className="xl:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Search Configuration
                </CardTitle>
                <CardDescription>Choose what to search for and how to search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search Method */}
                <div>
                  <Label className="text-base font-medium mb-3 block">Search Method</Label>
                  <Tabs value={searchMethod} onValueChange={(value) => setSearchMethod(value as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="select" className="text-xs">
                        My Assets
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="text-xs">
                        Upload
                      </TabsTrigger>
                      <TabsTrigger value="url" className="text-xs">
                        URL
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="select" className="mt-4">
                      <div className="space-y-3">
                        <Label>Select from your assets:</Label>
                        {userAssets.map((asset) => (
                          <Card
                            key={asset.id}
                            className={`cursor-pointer transition-colors ${
                              selectedAsset === asset.id ? "border-blue-500 bg-blue-50" : "hover:border-gray-300"
                            }`}
                            onClick={() => setSelectedAsset(asset.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                  {getAssetIcon(asset.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{asset.title}</div>
                                  <div className="text-sm text-gray-500 capitalize">{asset.type}</div>
                                </div>
                                <Checkbox checked={selectedAsset === asset.id} />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="upload" className="mt-4">
                      <div className="space-y-4">
                        <Label>Upload file to search:</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm font-medium mb-1">Drop file here or click to browse</div>
                          <div className="text-xs text-gray-500 mb-3">Images, videos, documents supported</div>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="search-file-upload"
                            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                          />
                          <Button size="sm" asChild>
                            <label htmlFor="search-file-upload" className="cursor-pointer">
                              Select File
                            </label>
                          </Button>
                        </div>
                        {uploadedFile && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">{uploadedFile.name}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="url" className="mt-4">
                      <div className="space-y-4">
                        <Label htmlFor="search-url">Enter URL to search:</Label>
                        <Input
                          id="search-url"
                          placeholder="https://example.com/image.jpg"
                          value={searchUrl}
                          onChange={(e) => setSearchUrl(e.target.value)}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Separator />

                {/* Search Options */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Search Scope</Label>
                  <div className="space-y-2">
                    {[
                      { id: "google", label: "Google Images", icon: Globe },
                      { id: "social", label: "Social Media", icon: Star },
                      { id: "marketplaces", label: "Design Marketplaces", icon: Search },
                      { id: "websites", label: "General Websites", icon: Globe },
                    ].map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox defaultChecked />
                        <option.icon className="h-4 w-4 text-gray-500" />
                        <Label className="text-sm">{option.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={simulateSearch}
                  disabled={
                    isSearching ||
                    (searchMethod === "select" && !selectedAsset) ||
                    (searchMethod === "upload" && !uploadedFile) ||
                    (searchMethod === "url" && !searchUrl)
                  }
                  className="w-full"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-pulse" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Start Theft Detection
                    </>
                  )}
                </Button>

                {isSearching && (
                  <div className="space-y-2">
                    <Progress value={searchProgress} className="h-2" />
                    <div className="text-xs text-center text-gray-600">{Math.round(searchProgress)}% complete</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detection Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-2xl font-bold text-red-600">{searchResults.length}</div>
                      <div className="text-gray-600">Total Matches</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {searchResults.filter((r) => r.confidence === "high").length}
                      </div>
                      <div className="text-gray-600">High Confidence</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">
                        {searchResults.filter((r) => r.status === "new").length}
                      </div>
                      <div className="text-gray-600">New Detections</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {searchResults.filter((r) => r.status === "resolved").length}
                      </div>
                      <div className="text-gray-600">Resolved</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Search Results */}
          <div className="xl:col-span-2 space-y-6">
            {searchResults.length > 0 && (
              <>
                {/* Filters and Actions */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-2">
                          <Filter className="h-4 w-4 text-gray-500" />
                          <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Platform" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Platforms</SelectItem>
                              <SelectItem value="pinterest">Pinterest</SelectItem>
                              <SelectItem value="dribbble">Dribbble</SelectItem>
                              <SelectItem value="freepik">Freepik</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Select value={filterConfidence} onValueChange={setFilterConfidence}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Confidence" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Confidence</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowTakedownForm(true)}
                          disabled={selectedMatches.length === 0}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Generate Takedown ({selectedMatches.length})
                        </Button>
                        <Button variant="outline" size="sm" onClick={simulateSearch}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results List */}
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <Card key={result.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Thumbnail */}
                          <div className="lg:w-48 h-32 lg:h-auto bg-gray-100 flex items-center justify-center">
                            <img
                              src={result.thumbnail || "/placeholder.svg"}
                              alt="Detected match"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 lg:p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Checkbox
                                    checked={selectedMatches.includes(result.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedMatches((prev) => [...prev, result.id])
                                      } else {
                                        setSelectedMatches((prev) => prev.filter((id) => id !== result.id))
                                      }
                                    }}
                                  />
                                  <h3 className="font-semibold truncate">{result.title}</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{result.description}</p>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>{result.platform}</span>
                                  <span>•</span>
                                  <span>{result.metadata.domain}</span>
                                  <span>•</span>
                                  <span>Detected {result.detectedDate}</span>
                                </div>
                              </div>

                              <div className="flex flex-col items-end space-y-2 ml-4">
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-red-600">{result.similarityScore}%</div>
                                  <div className="text-xs text-gray-500">Similarity</div>
                                </div>
                                {getConfidenceBadge(result.confidence)}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {getStatusBadge(result.status)}
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    View
                                  </a>
                                </Button>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Investigate
                                </Button>
                                {result.status === "new" && (
                                  <Button size="sm">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Report
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {!isSearching && searchResults.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Search Results</h3>
                  <p className="text-gray-600 mb-6">
                    Configure your search settings and click "Start Theft Detection" to begin scanning for unauthorized
                    use of your creative works.
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Brain className="h-4 w-4" />
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="h-4 w-4" />
                      <span>Real-time</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4" />
                      <span>Global Search</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Takedown Notice Modal */}
        {showTakedownForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generate Takedown Notice</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowTakedownForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>
                  Generate a professional DMCA takedown notice for the selected infringements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="takedown-type">Notice Type</Label>
                    <Select
                      value={takedownData.type}
                      onValueChange={(value) => setTakedownData((prev) => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dmca">DMCA Takedown</SelectItem>
                        <SelectItem value="platform">Platform Report</SelectItem>
                        <SelectItem value="cease">Cease & Desist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="your@email.com"
                      value={takedownData.contactEmail}
                      onChange={(e) => setTakedownData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="reason">Reason for Takedown</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe why this content should be removed..."
                    value={takedownData.reason}
                    onChange={(e) => setTakedownData((prev) => ({ ...prev, reason: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="Any additional context or evidence..."
                    value={takedownData.additionalInfo}
                    onChange={(e) => setTakedownData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                  />
                </div>

                <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Generated Notice Preview</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(generateTakedownNotice())}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="text-xs whitespace-pre-wrap font-mono">{generateTakedownNotice()}</pre>
                </div>

                <div className="flex justify-end space-x-4">
                  <Button variant="outline" onClick={() => setShowTakedownForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => navigator.clipboard.writeText(generateTakedownNotice())}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Notice
                  </Button>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
