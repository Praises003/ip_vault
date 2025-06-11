"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Shield,
  ArrowLeft,
  Send,
  Archive,
  MoreHorizontal,
  Eye,
  Download,
  Copy,
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Search,
  Plus,
  FileText,
  ExternalLink,
  Trash2,
  Edit,
  MessageSquare,
} from "lucide-react"

interface TakedownNotice {
  id: string
  title: string
  assetTitle: string
  assetType: "image" | "text" | "video" | "audio" | "code"
  platform: string
  infringingUrl: string
  noticeType: "dmca" | "platform" | "cease_desist"
  status: "draft" | "pending" | "submitted" | "acknowledged" | "resolved" | "rejected" | "expired"
  priority: "low" | "medium" | "high" | "urgent"
  createdDate: string
  submittedDate?: string
  responseDate?: string
  resolvedDate?: string
  expiryDate?: string
  contactEmail: string
  description: string
  responseMessage?: string
  followUpCount: number
  attachments: string[]
  tags: string[]
  estimatedDamages?: number
  legalAction: boolean
}

export default function TakedownManagementPage() {
  const [selectedNotices, setSelectedNotices] = useState<string[]>([])
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPlatform, setFilterPlatform] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("created_desc")
  const [showDetails, setShowDetails] = useState<string | null>(null)
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Mock takedown notices data
  const [takedownNotices] = useState<TakedownNotice[]>([
    {
      id: "1",
      title: "DMCA Notice - Logo Design Theft",
      assetTitle: "Modern Logo Design Kit",
      assetType: "image",
      platform: "Pinterest",
      infringingUrl: "https://pinterest.com/pin/stolen-design",
      noticeType: "dmca",
      status: "submitted",
      priority: "high",
      createdDate: "2024-01-20",
      submittedDate: "2024-01-20",
      responseDate: "2024-01-22",
      contactEmail: "copyright@pinterest.com",
      description: "Unauthorized use of copyrighted logo design without permission or attribution.",
      responseMessage: "We have received your DMCA notice and are reviewing the content.",
      followUpCount: 1,
      attachments: ["dmca_notice.pdf", "evidence_screenshot.png"],
      tags: ["copyright", "logo", "commercial"],
      estimatedDamages: 500,
      legalAction: false,
    },
    {
      id: "2",
      title: "Platform Report - Code Repository",
      assetTitle: "React Dashboard Components",
      assetType: "code",
      platform: "GitHub",
      infringingUrl: "https://github.com/user/stolen-components",
      noticeType: "platform",
      status: "resolved",
      priority: "medium",
      createdDate: "2024-01-18",
      submittedDate: "2024-01-18",
      responseDate: "2024-01-19",
      resolvedDate: "2024-01-20",
      contactEmail: "support@github.com",
      description: "Complete copy of proprietary React components published without license.",
      responseMessage: "Repository has been taken down due to copyright violation.",
      followUpCount: 0,
      attachments: ["platform_report.pdf", "code_comparison.pdf"],
      tags: ["code", "repository", "open-source"],
      legalAction: false,
    },
    {
      id: "3",
      title: "Cease & Desist - Video Content",
      assetTitle: "Marketing Video Templates",
      assetType: "video",
      platform: "YouTube",
      infringingUrl: "https://youtube.com/watch?v=stolen-video",
      noticeType: "cease_desist",
      status: "pending",
      priority: "urgent",
      createdDate: "2024-01-19",
      submittedDate: "2024-01-19",
      expiryDate: "2024-02-02",
      contactEmail: "legal@youtube.com",
      description: "Commercial use of video templates in violation of licensing terms.",
      followUpCount: 2,
      attachments: ["cease_desist.pdf", "license_agreement.pdf", "usage_evidence.mp4"],
      tags: ["video", "commercial", "license-violation"],
      estimatedDamages: 2500,
      legalAction: true,
    },
    {
      id: "4",
      title: "DMCA Notice - Business Template",
      assetTitle: "Business Plan Template",
      assetType: "text",
      platform: "SlideShare",
      infringingUrl: "https://slideshare.net/stolen-template",
      noticeType: "dmca",
      status: "acknowledged",
      priority: "medium",
      createdDate: "2024-01-17",
      submittedDate: "2024-01-17",
      responseDate: "2024-01-18",
      contactEmail: "dmca@slideshare.net",
      description: "Unauthorized distribution of proprietary business plan template.",
      responseMessage: "Your DMCA notice has been acknowledged. Content will be reviewed within 5 business days.",
      followUpCount: 0,
      attachments: ["dmca_notice.pdf"],
      tags: ["document", "template", "business"],
      legalAction: false,
    },
    {
      id: "5",
      title: "Platform Report - Music Theft",
      assetTitle: "Ambient Music Pack",
      assetType: "audio",
      platform: "SoundCloud",
      infringingUrl: "https://soundcloud.com/user/stolen-music",
      noticeType: "platform",
      status: "rejected",
      priority: "high",
      createdDate: "2024-01-15",
      submittedDate: "2024-01-16",
      responseDate: "2024-01-18",
      contactEmail: "copyright@soundcloud.com",
      description: "Unauthorized upload and distribution of copyrighted ambient music tracks.",
      responseMessage: "After review, we determined the content does not violate our terms of service.",
      followUpCount: 3,
      attachments: ["platform_report.pdf", "audio_fingerprint.pdf"],
      tags: ["audio", "music", "streaming"],
      estimatedDamages: 1200,
      legalAction: true,
    },
    {
      id: "6",
      title: "DMCA Notice - Design Portfolio",
      assetTitle: "UI Design System",
      assetType: "image",
      platform: "Dribbble",
      infringingUrl: "https://dribbble.com/shots/copied-design",
      noticeType: "dmca",
      status: "expired",
      priority: "low",
      createdDate: "2024-01-10",
      submittedDate: "2024-01-12",
      expiryDate: "2024-01-19",
      contactEmail: "legal@dribbble.com",
      description: "Portfolio showcasing stolen UI design elements without attribution.",
      followUpCount: 1,
      attachments: ["dmca_notice.pdf", "design_comparison.png"],
      tags: ["design", "ui", "portfolio"],
      legalAction: false,
    },
    {
      id: "7",
      title: "Platform Report - Document Sharing",
      assetTitle: "Financial Model Spreadsheet",
      assetType: "text",
      platform: "Scribd",
      infringingUrl: "https://scribd.com/document/stolen-model",
      noticeType: "platform",
      status: "draft",
      priority: "medium",
      createdDate: "2024-01-22",
      contactEmail: "support@scribd.com",
      description: "Unauthorized sharing of proprietary financial modeling spreadsheet.",
      followUpCount: 0,
      attachments: [],
      tags: ["document", "financial", "spreadsheet"],
      legalAction: false,
    },
  ])

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: { variant: "outline" as const, color: "text-gray-600", icon: Edit },
      pending: { variant: "secondary" as const, color: "text-yellow-600", icon: Clock },
      submitted: { variant: "default" as const, color: "text-blue-600", icon: Send },
      acknowledged: { variant: "default" as const, color: "text-purple-600", icon: MessageSquare },
      resolved: { variant: "default" as const, color: "text-green-600", icon: CheckCircle },
      rejected: { variant: "destructive" as const, color: "text-red-600", icon: XCircle },
      expired: { variant: "outline" as const, color: "text-orange-600", icon: AlertTriangle },
    }
    const config = variants[status] || variants.draft
    const Icon = config.icon
    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace("_", " ")}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: { variant: "outline" as const, color: "text-gray-600" },
      medium: { variant: "secondary" as const, color: "text-blue-600" },
      high: { variant: "default" as const, color: "text-orange-600" },
      urgent: { variant: "destructive" as const, color: "text-red-600" },
    }
    const config = variants[priority] || variants.medium
    return (
      <Badge variant={config.variant} className={config.color}>
        {priority}
      </Badge>
    )
  }

  const getNoticeTypeBadge = (type: string) => {
    const variants = {
      dmca: { variant: "default" as const, color: "text-blue-600" },
      platform: { variant: "secondary" as const, color: "text-green-600" },
      cease_desist: { variant: "destructive" as const, color: "text-red-600" },
    }
    const config = variants[type] || variants.dmca
    return (
      <Badge variant={config.variant} className={config.color}>
        {type.replace("_", " & ").toUpperCase()}
      </Badge>
    )
  }

  const filteredNotices = takedownNotices.filter((notice) => {
    const statusMatch = filterStatus === "all" || notice.status === filterStatus
    const platformMatch = filterPlatform === "all" || notice.platform.toLowerCase().includes(filterPlatform)
    const priorityMatch = filterPriority === "all" || notice.priority === filterPriority
    const searchMatch =
      searchQuery === "" ||
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.assetTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.platform.toLowerCase().includes(searchQuery.toLowerCase())

    return statusMatch && platformMatch && priorityMatch && searchMatch
  })

  const sortedNotices = [...filteredNotices].sort((a, b) => {
    switch (sortBy) {
      case "created_desc":
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      case "created_asc":
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      case "priority":
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case "status":
        return a.status.localeCompare(b.status)
      case "platform":
        return a.platform.localeCompare(b.platform)
      default:
        return 0
    }
  })

  const statusCounts = {
    all: takedownNotices.length,
    draft: takedownNotices.filter((n) => n.status === "draft").length,
    pending: takedownNotices.filter((n) => n.status === "pending").length,
    submitted: takedownNotices.filter((n) => n.status === "submitted").length,
    acknowledged: takedownNotices.filter((n) => n.status === "acknowledged").length,
    resolved: takedownNotices.filter((n) => n.status === "resolved").length,
    rejected: takedownNotices.filter((n) => n.status === "rejected").length,
    expired: takedownNotices.filter((n) => n.status === "expired").length,
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for notices:`, selectedNotices)
    // Implement bulk actions
    setSelectedNotices([])
    setShowBulkActions(false)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotices(sortedNotices.map((notice) => notice.id))
    } else {
      setSelectedNotices([])
    }
  }

  const selectedNotice = showDetails ? takedownNotices.find((n) => n.id === showDetails) : null

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
                <Link href="/theft-detection">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">New Detection</span>
                  <span className="sm:hidden">New</span>
                </Link>
              </Button>
              <div className="text-sm text-gray-600 hidden sm:block">Takedown Management</div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Takedown Management</h1>
          <p className="text-gray-600">
            Track and manage all your takedown notices, DMCA requests, and legal actions in one place.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notices</p>
                  <p className="text-2xl font-bold">{takedownNotices.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Cases</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {statusCounts.pending + statusCounts.submitted + statusCounts.acknowledged}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{statusCounts.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round((statusCounts.resolved / (statusCounts.resolved + statusCounts.rejected)) * 100) || 0}%
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search notices, assets, or platforms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                    <SelectItem value="draft">Draft ({statusCounts.draft})</SelectItem>
                    <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                    <SelectItem value="submitted">Submitted ({statusCounts.submitted})</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged ({statusCounts.acknowledged})</SelectItem>
                    <SelectItem value="resolved">Resolved ({statusCounts.resolved})</SelectItem>
                    <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
                    <SelectItem value="expired">Expired ({statusCounts.expired})</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="pinterest">Pinterest</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="dribbble">Dribbble</SelectItem>
                    <SelectItem value="soundcloud">SoundCloud</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_desc">Newest First</SelectItem>
                    <SelectItem value="created_asc">Oldest First</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="platform">Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotices.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">{selectedNotices.length} notice(s) selected</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("resend")}>
                      <Send className="h-3 w-3 mr-1" />
                      Re-send
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("archive")}>
                      <Archive className="h-3 w-3 mr-1" />
                      Archive
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleBulkAction("delete")}>
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedNotices([])}>
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notices Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedNotices.length === sortedNotices.length && sortedNotices.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Notice</TableHead>
                    <TableHead className="hidden sm:table-cell">Asset</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead className="hidden lg:table-cell">Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Priority</TableHead>
                    <TableHead className="hidden xl:table-cell">Created</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedNotices.map((notice) => (
                    <TableRow key={notice.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedNotices.includes(notice.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedNotices((prev) => [...prev, notice.id])
                            } else {
                              setSelectedNotices((prev) => prev.filter((id) => id !== notice.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <div className="font-medium truncate">{notice.title}</div>
                          <div className="text-sm text-gray-500 truncate">{notice.description}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="max-w-[150px]">
                          <div className="font-medium truncate">{notice.assetTitle}</div>
                          <div className="text-sm text-gray-500 capitalize">{notice.assetType}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{notice.platform}</div>
                        {notice.followUpCount > 0 && (
                          <div className="text-xs text-orange-600">{notice.followUpCount} follow-ups</div>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{getNoticeTypeBadge(notice.noticeType)}</TableCell>
                      <TableCell>{getStatusBadge(notice.status)}</TableCell>
                      <TableCell className="hidden lg:table-cell">{getPriorityBadge(notice.priority)}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="text-sm">{notice.createdDate}</div>
                        {notice.expiryDate && <div className="text-xs text-red-600">Expires: {notice.expiryDate}</div>}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setShowDetails(notice.id)}>
                              <Eye className="h-3 w-3 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-3 w-3 mr-2" />
                              Edit Notice
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Send className="h-3 w-3 mr-2" />
                              Re-send Notice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="h-3 w-3 mr-2" />
                              Copy Notice
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-3 w-3 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <ExternalLink className="h-3 w-3 mr-2" />
                              View Infringing Content
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-3 w-3 mr-2" />
                              Contact Platform
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="h-3 w-3 mr-2" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="h-3 w-3 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {sortedNotices.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No takedown notices found</h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterStatus !== "all" || filterPlatform !== "all" || filterPriority !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Start by detecting theft and generating your first takedown notice"}
                </p>
                <Button asChild>
                  <Link href="/theft-detection">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Notice
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notice Details Modal */}
        {selectedNotice && (
          <Dialog open={!!showDetails} onOpenChange={() => setShowDetails(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedNotice.title}</span>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(selectedNotice.status)}
                    {getPriorityBadge(selectedNotice.priority)}
                  </div>
                </DialogTitle>
                <DialogDescription>
                  {getNoticeTypeBadge(selectedNotice.noticeType)} • Created on {selectedNotice.createdDate}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Asset Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Asset Title</Label>
                        <div className="font-medium">{selectedNotice.assetTitle}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Asset Type</Label>
                        <div className="capitalize">{selectedNotice.assetType}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Infringing URL</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-mono bg-gray-100 p-1 rounded truncate flex-1">
                            {selectedNotice.infringingUrl}
                          </span>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={selectedNotice.infringingUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Notice Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Platform</Label>
                        <div className="font-medium">{selectedNotice.platform}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Contact Email</Label>
                        <div className="font-medium">{selectedNotice.contactEmail}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-600">Follow-up Count</Label>
                        <div className="font-medium">{selectedNotice.followUpCount}</div>
                      </div>
                      {selectedNotice.estimatedDamages && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Estimated Damages</Label>
                          <div className="font-medium text-red-600">${selectedNotice.estimatedDamages}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <div>
                          <div className="font-medium">Notice Created</div>
                          <div className="text-sm text-gray-600">{selectedNotice.createdDate}</div>
                        </div>
                      </div>
                      {selectedNotice.submittedDate && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <div>
                            <div className="font-medium">Notice Submitted</div>
                            <div className="text-sm text-gray-600">{selectedNotice.submittedDate}</div>
                          </div>
                        </div>
                      )}
                      {selectedNotice.responseDate && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                          <div>
                            <div className="font-medium">Response Received</div>
                            <div className="text-sm text-gray-600">{selectedNotice.responseDate}</div>
                          </div>
                        </div>
                      )}
                      {selectedNotice.resolvedDate && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                          <div>
                            <div className="font-medium">Case Resolved</div>
                            <div className="text-sm text-gray-600">{selectedNotice.resolvedDate}</div>
                          </div>
                        </div>
                      )}
                      {selectedNotice.expiryDate && (
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                          <div>
                            <div className="font-medium">Expiry Date</div>
                            <div className="text-sm text-gray-600">{selectedNotice.expiryDate}</div>
                          </div>
                        </div>
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
                    <p className="text-gray-700">{selectedNotice.description}</p>
                  </CardContent>
                </Card>

                {/* Response Message */}
                {selectedNotice.responseMessage && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Platform Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 border rounded-lg p-4">
                        <p className="text-gray-700">{selectedNotice.responseMessage}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attachments */}
                {selectedNotice.attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Attachments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedNotice.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center space-x-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium">{attachment}</span>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tags */}
                {selectedNotice.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedNotice.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Notice
                  </Button>
                  <Button variant="outline">
                    <Send className="h-4 w-4 mr-2" />
                    Re-send
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Platform
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
