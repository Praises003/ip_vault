"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import axios from "axios"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  Loader2,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface DetectionResult {
  id?: string
  userId: string
  assetId: string | null
  imageUrl: string
  matchedUrl: string | null
  source: string | null
  sourceIcon: string | null
  similarity: number
  detectionType: "image" | "text" | "video" | "audio" | "code"
  status: "match" | "no-match" | "pending" | "investigating" | "takedown_sent" | "resolved" | "false_positive"
  notes: string
  screenshotUrl: string | null
  createdAt?: string
  updatedAt?: string
}

interface SearchAsset {
  id: string
  title: string
  type: "image" | "text" | "video" | "audio" | "code"
  thumbnail: string
  uploadDate: string
}


// interface ApiDetectionResponse {
//   success?: boolean
//   data?: DetectionResult[]
//   detections?: DetectionResult[]
//   totalCount?: number
//   total?: number
//   page?: number
//   limit?: number
//   message?: string
//   error?: string
// }

// Define the type of the status key (we're using keyof to restrict it to the keys of statusConfig)
type Status = "match" | "no-match" | "pending" | "investigating" | "takedown_sent" | "resolved" | "false_positive";

// Define the structure of each status configuration (this allows TypeScript to infer the types)
interface StatusConfig {
  variant: "destructive" | "outline" | "secondary" | "default";
  color: string;
  label: string;
}

type IconType = "image" | "text" | "video" | "audio" | "code"; // Define the valid types for the icons
type SearchMethod = "upload" | "select" | "url";
// const icons: Record<IconType, React.ComponentType<{ className: string }>> = {
//   image: ImageIcon,
//   text: FileText,
//   video: Video,
//   audio: Music,
//   code: Code,
// };


// Axios instance for API calls
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Add request interceptor to include auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

export default function TheftDetectionPage() {
  const [searchMethod, setSearchMethod] = useState<SearchMethod>("url")
  const [selectedAsset, setSelectedAsset] = useState<string>("")
  const [searchUrl, setSearchUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [searchResults, setSearchResults] = useState<DetectionResult[]>([])
  const [selectedMatches, setSelectedMatches] = useState<string[]>([])
  const [filterSource, setFilterSource] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showTakedownForm, setShowTakedownForm] = useState(false)
  const [error, setError] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [limit] = useState(10)
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

  // API call to detection endpoint using Axios
  const runDetectionAPI = async (imageUrl: string, assetId?: string, page = 1): Promise<DetectionResult[]> => {
    try {
      const response = await api.post("/api/detection/check", {
        imageUrl,
        assetId: assetId || "677480b3-0690-4fad-ad3d-d74cec37e891",
        saveResult: false,
        page,
        limit
      })

      const data = response.data
      console.log(data)

      // Handle different response formats
      let detections: DetectionResult[] = []
      let total = 0

      if (data.success !== false) {
        // Handle array response or nested data
        if (Array.isArray(data)) {
          detections = data
          total = data.length
        } else if (data.data && Array.isArray(data.data)) {
          detections = data.data
          total = data.totalCount || data.total || data.data.length
        } else if (data.detections && Array.isArray(data.detections)) {
          detections = data.detections
          total = data.totalCount || data.total || data.detections.length
        } else if (data.data && !Array.isArray(data.data)) {
          // Single result
          detections = [data.data]
          total = 1
        } else {
          // Single result at root level
          detections = [data as DetectionResult]
          total = 1
        }

        setTotalCount(total)
        return detections
      } else {
        throw new Error(data.message || data.error || "Detection failed")
      }
    } catch (error) {
      console.error("Detection API Error:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error("Authentication required. Please log in.")
        } else if (error.response?.status === 400) {
          throw new Error(error.response.data?.message || "Invalid request. Please check your input.")
        } else if (error.response?.status === 500) {
          throw new Error("Server error. Please try again later.")
        } else {
          throw new Error(error.response?.data?.message || "Network error. Please check your connection.")
        }
      }
      throw error
    }
  }

  const runDetection = useCallback(
    async (page = 1) => {
      setIsSearching(true)
      setSearchProgress(0)
      if (page === 1) {
        setSearchResults([])
      }
      setError("")

      try {
        // Validate input based on search method
        let imageUrl = ""
        let assetId = ""

        if (searchMethod === "url") {
          if (!searchUrl.trim()) {
            throw new Error("Please enter a valid URL")
          }
          imageUrl = searchUrl.trim()
        } else if (searchMethod === "select") {
          if (!selectedAsset) {
            throw new Error("Please select an asset to search for")
          }
          assetId = selectedAsset
          // For selected assets, we might need to get the image URL from the asset
          const asset = userAssets.find((a) => a.id === selectedAsset)
          imageUrl = asset?.thumbnail || ""
        } else if (searchMethod === "upload") {
          if (!uploadedFile) {
            throw new Error("Please upload a file to search for")
          }
          // Handle file upload - you might need to upload the file first and get a URL
          // For now, well use a placeholder
          imageUrl = URL.createObjectURL(uploadedFile)
        }
        


  

        // Simulate search progress
        const progressSteps = [
          "Validating image...",
          "Connecting to detection service...",
          "Analyzing image content...",
          "Searching across platforms...",
          "Running similarity analysis...",
          "Generating confidence scores...",
          "Compiling results...",
        ]

        for (let i = 0; i < progressSteps.length; i++) {
          setSearchProgress(((i + 1) / progressSteps.length) * 90) // Go up to 90%
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        // Make actual API call
        const detections: DetectionResult[] = await runDetectionAPI(imageUrl, assetId, page)

        setSearchProgress(100)
        setSearchResults(detections)
        setCurrentPage(page)
      } catch (err: any) {
        console.error("Detection error:", err)
        setError(err.message || "An error occurred during detection. Please try again.")
        setSearchResults([])
        setTotalCount(0)
      } finally {
        setIsSearching(false)
        // Reset progress after a short delay
        setTimeout(() => setSearchProgress(0), 1000)
      }
    },
    [searchMethod, searchUrl, selectedAsset, uploadedFile, limit],
  )

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalCount / limit)) {
      runDetection(newPage)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
      if (!validTypes.includes(file.type)) {
        setError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)")
        return
      }

      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB")
        return
      }

      setUploadedFile(file)
      setError("")
    }
  }

  

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setSearchUrl(url)

    if (url && !validateUrl(url)) {
      setError("Please enter a valid URL")
    } else {
      setError("")
    }
  }

  const getStatusBadge = (status: Status) => {
    const statusConfig: Record<Status, StatusConfig>  = {
      match: { variant: "destructive", color: "text-red-600", label: "Match Found" },
      "no-match": { variant: "outline", color: "text-gray-600", label: "No Match" },
      pending: { variant: "secondary", color: "text-yellow-600", label: "Pending" },
      investigating: { variant: "secondary", color: "text-blue-600", label: "Investigating" },
      takedown_sent: { variant: "default", color: "text-purple-600", label: "Takedown Sent" },
      resolved: { variant: "default", color: "text-green-600", label: "Resolved" },
      false_positive: { variant: "outline", color: "text-gray-600", label: "False Positive" },
    }

    const config = statusConfig[status] || statusConfig["no-match"]
    return (
      <Badge variant={config.variant as any} className={config.color}>
        {config.label}
      </Badge>
    )
  }

  const getSimilarityBadge = (similarity: number) => {
    if (similarity >= 90) {
      return <Badge variant="destructive">High ({similarity}%)</Badge>
    } else if (similarity >= 70) {
      return <Badge variant="secondary">Medium ({similarity}%)</Badge>
    } else if (similarity > 0) {
      return <Badge variant="outline">Low ({similarity}%)</Badge>
    } else {
      return <Badge variant="outline">No Match</Badge>
    }
  }

  const getAssetIcon = (type: IconType) => {
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

  const getSourceIcon = (sourceIcon: string | null) => {
    // You can map source icons to actual icons here
    if (sourceIcon) {
      return <img src={sourceIcon || "/placeholder.svg"} alt="Source" className="h-4 w-4" />
    }
    return <Globe className="h-4 w-4" />
  }

  const filteredResults = searchResults.filter((result) => {
    const sourceMatch = filterSource === "all" || (result.source && result.source.toLowerCase().includes(filterSource))
    const statusMatch = filterStatus === "all" || result.status === filterStatus
    return sourceMatch && statusMatch
  })

  const totalPages = Math.ceil(totalCount / limit)

  const generateTakedownNotice = () => {
    const selectedResults = searchResults.filter((result) =>
      selectedMatches.includes(result.id || `${result.userId}-${result.assetId}`),
    )

    const notice = `DMCA TAKEDOWN NOTICE

To: Copyright Agent
Date: ${new Date().toLocaleDateString()}

I am writing to notify you of copyright infringement occurring on your platform.

COPYRIGHTED WORK:
- Original Image URL: ${selectedResults[0]?.imageUrl || "N/A"}
- Copyright Owner: [Your Name]
- Asset ID: ${selectedResults[0]?.assetId || "N/A"}

INFRINGING MATERIAL:
${selectedResults
  .filter((result) => result.matchedUrl) // Only include results with matches
  .map(
    (result, index) => `
${index + 1}. URL: ${result.matchedUrl}
   Source: ${result.source || "Unknown"}
   Similarity Score: ${result.similarity}%
   Detection Type: ${result.detectionType}
   Notes: ${result.notes}
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

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

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
                      <TabsTrigger value="url" className="text-xs">
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="select" className="text-xs">
                        My Assets
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="text-xs">
                        Upload
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="url" className="mt-4">
                      <div className="space-y-4">
                        <Label htmlFor="search-url">Enter image URL to search:</Label>
                        <Input
                          id="search-url"
                          placeholder="https://example.com/image.jpg"
                          value={searchUrl}
                          onChange={handleUrlChange}
                          className={error && searchUrl ? "border-red-300" : ""}
                        />
                        <p className="text-xs text-gray-500">
                          Enter the URL of an image you want to search for across the internet
                        </p>
                      </div>
                    </TabsContent>

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
                        <Label>Upload image file to search:</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <div className="text-sm font-medium mb-1">Drop image here or click to browse</div>
                          <div className="text-xs text-gray-500 mb-3">JPEG, PNG, GIF, WebP (max 10MB)</div>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="search-file-upload"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                          />
                          <Button size="sm" asChild>
                            <label htmlFor="search-file-upload" className="cursor-pointer">
                              Select Image
                            </label>
                          </Button>
                        </div>
                        {uploadedFile && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium">{uploadedFile.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                          </div>
                        )}
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
                  onClick={() => runDetection(1)}
                  disabled={
                    isSearching ||
                    (searchMethod === "select" && !selectedAsset) ||
                    (searchMethod === "upload" && !uploadedFile) ||
                    (searchMethod === "url" && (!searchUrl || !!error))
                  }
                  className="w-full"
                  size="lg"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                      <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
                      <div className="text-gray-600">Total Results</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {searchResults.filter((r) => r.status === "match").length}
                      </div>
                      <div className="text-gray-600">Matches Found</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">
                        {searchResults.filter((r) => r.similarity >= 70).length}
                      </div>
                      <div className="text-gray-600">High Similarity</div>
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
                          <Select value={filterSource} onValueChange={setFilterSource}>
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Source" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Sources</SelectItem>
                              {Array.from(new Set(searchResults.map((r) => r.source).filter(Boolean))).map((source) => (
                                <SelectItem key={source} value={source!.toLowerCase()}>
                                  {source}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="match">Match</SelectItem>
                            <SelectItem value="no-match">No Match</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="investigating">Investigating</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => runDetection(currentPage)}
                          disabled={isSearching}
                        >
                          <RefreshCw className={`h-4 w-4 ${isSearching ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results List */}
                <div className="space-y-4">
                  {filteredResults.map((result, index) => {
                    const resultId = result.id || `${result.userId}-${result.assetId}-${index}`
                    return (
                      <Card key={resultId} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col lg:flex-row">
                            {/* Screenshot/Image */}
                            <div className="lg:w-48 h-32 lg:h-auto bg-gray-100 flex items-center justify-center">
                              {result.screenshotUrl || result.imageUrl ? (
                                <img
                                  src={result.screenshotUrl || result.imageUrl}
                                  alt="Detection result"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg?height=150&width=200"
                                  }}
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                  {result.status === "no-match" ? (
                                    <Ban className="h-8 w-8 mb-2" />
                                  ) : (
                                    <Clock className="h-8 w-8 mb-2" />
                                  )}
                                  <span className="text-xs">No Image</span>
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 lg:p-6">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Checkbox
                                      checked={selectedMatches.includes(resultId)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedMatches((prev) => [...prev, resultId])
                                        } else {
                                          setSelectedMatches((prev) => prev.filter((id) => id !== resultId))
                                        }
                                      }}
                                    />
                                    <h3 className="font-semibold truncate">
                                      {result.matchedUrl ? "Match Found" : "Detection Result"}
                                    </h3>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{result.notes}</p>
                                  <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                                    {result.source && (
                                      <>
                                        <div className="flex items-center space-x-1">
                                          {getSourceIcon(result.sourceIcon)}
                                          <span>{result.source}</span>
                                        </div>
                                        <span>•</span>
                                      </>
                                    )}
                                    <span className="capitalize">{result.detectionType}</span>
                                    {result.matchedUrl && (
                                      <>
                                        <span>•</span>
                                        <a
                                          href={result.matchedUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:underline flex items-center"
                                        >
                                          View Match <ExternalLink className="h-3 w-3 ml-1" />
                                        </a>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Asset ID: {result.assetId || "N/A"} | User ID: {result.userId}
                                  </div>
                                </div>

                                <div className="flex flex-col items-end space-y-2 ml-4">
                                  <div className="text-right">{getSimilarityBadge(result.similarity)}</div>
                                  {getStatusBadge(result.status)}
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  {result.matchedUrl && (
                                    <Button variant="ghost" size="sm" asChild>
                                      <a href={result.matchedUrl} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        View Match
                                      </a>
                                    </Button>
                                  )}
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={result.imageUrl} target="_blank" rel="noopener noreferrer">
                                      <Eye className="h-3 w-3 mr-1" />
                                      View Original
                                    </a>
                                  </Button>
                                </div>

                                <div className="flex items-center space-x-2">
                                  {result.status === "match" && (
                                    <Button size="sm">
                                      <AlertTriangle className="h-3 w-3 mr-1" />
                                      Report Infringement
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalCount)} of{" "}
                          {totalCount} results
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || isSearching}
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <span className="text-sm font-medium">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || isSearching}
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Empty State */}
            {!isSearching && searchResults.length === 0 && !error && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Search Results</h3>
                  <p className="text-gray-600 mb-6">
                    Configure your search settings and click Start Theft Detection to begin scanning for unauthorized
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

            {/* Loading State */}
            {isSearching && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Searching for Matches</h3>
                  <p className="text-gray-600 mb-6">
                    Our AI is scanning the internet for potential copyright infringements...
                  </p>
                  <Progress value={searchProgress} className="max-w-md mx-auto" />
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
