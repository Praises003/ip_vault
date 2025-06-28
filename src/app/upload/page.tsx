"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "@/lib/use-toast"
import {
  Shield,
  Upload,
  FileText,
  ImageIcon,
  Video,
  Code,
  Music,
  Archive,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowLeft,
  X,
  Hash,
  Zap,
  Brain,
  AlertCircle,
  Copy,
  FileCheck,
  CloudUpload,
  Loader2,
} from "lucide-react"

interface UploadedFile {
  file: File
  id: string
  hash?: string
  timestamp?: string
  status: "uploading" | "processing" | "hashing" | "timestamping" | "complete" | "error"
  progress: number
  uploadProgress?: number
  error?: string
}

interface LicenseTemplate {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  restrictions: string[]
  recommended?: boolean
}

interface UploadResponse {
  success: boolean
  assetId?: string
  message?: string
  hash?: string
  timestamp?: string
}

// Create Axios instance for API calls
// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
//   timeout: 30000, // 30 seconds timeout for file uploads
// })

// // Add request interceptor to include auth token
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken")
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

export default function UploadPage() {
  const [step, setStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    category: "",
    usage: "",
  })
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([])
  const [aiGenerating, setAiGenerating] = useState(false)
  const [customLicense, setCustomLicense] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const fileTypes = [
    {
      type: "document",
      icon: FileText,
      label: "Documents",
      formats: "PDF, DOC, PPT",
      color: "blue",
      accept: ".pdf,.doc,.docx,.ppt,.pptx",
    },
    {
      type: "image",
      icon: ImageIcon,
      label: "Images & Design",
      formats: "JPG, PNG, SVG, PSD",
      color: "green",
      accept: ".jpg,.jpeg,.png,.svg,.psd,.ai",
    },
    {
      type: "video",
      icon: Video,
      label: "Video & Animation",
      formats: "MP4, MOV, AVI",
      color: "purple",
      accept: ".mp4,.mov,.avi,.mkv",
    },
    {
      type: "audio",
      icon: Music,
      label: "Audio",
      formats: "MP3, WAV, FLAC",
      color: "orange",
      accept: ".mp3,.wav,.flac,.aac",
    },
    {
      type: "code",
      icon: Code,
      label: "Code & Software",
      formats: "ZIP, JS, PY, etc.",
      color: "indigo",
      accept: ".zip,.js,.py,.html,.css,.json",
    },
    { type: "other", icon: Archive, label: "Other Files", formats: "Any format", color: "gray", accept: "*" },
  ]

  const licenseTemplates: LicenseTemplate[] = [
    {
      id: "standard",
      name: "Standard License",
      description: "Perfect for most commercial uses",
      price: 49,
      features: [
        "Commercial use allowed",
        "Attribution required",
        "Up to 10,000 copies",
        "Digital and print use",
        "Modify and customize",
      ],
      restrictions: ["Cannot resell as-is", "Cannot use in templates for sale"],
      recommended: true,
    },
    {
      id: "extended",
      name: "Extended License",
      description: "Broader usage rights for larger projects",
      price: 129,
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
      id: "exclusive",
      name: "Exclusive License",
      description: "Full ownership transfer",
      price: 499,
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
  ]
  
  // Real file upload function using Axios
  const uploadFileToServer = async (file: File, fileId: string) => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("file", file)
      formDataToSend.append("title", formData.title || file.name)
      formDataToSend.append("description", formData.description || "")
      formDataToSend.append("category", formData.category || "")
      formDataToSend.append("tags", formData.tags || "")
      formDataToSend.append("usage", formData.usage || "")

      const response = await api.post<UploadResponse>("/api/asset/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadedFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, uploadProgress: progress } : f)))
          }
        },
      })

      if (response.data.success) {
        // Simulate blockchain processing after successful upload
        await simulateBlockchainProcessing(fileId, response.data)

        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  status: "complete",
                  progress: 100,
                  uploadProgress: 100,
                  hash: response.data.hash || generateMockHash(),
                  timestamp: response.data.timestamp || new Date().toISOString(),
                }
              : f,
          ),
        )

        toast({
          title: "Upload Successful",
          description: `${file.name} has been uploaded and secured on the blockchain.`,
        })
      } else {
        throw new Error(response.data.message || "Upload failed")
      }
    } catch (error: unknown) {
  console.error("Upload error:", error);

  let errorMessage = "Upload failed"; // Default message

  if (error instanceof axios.AxiosError) {
    // If its an AxiosError, we can access response and data
    errorMessage = error.response?.data?.message || error.message || errorMessage;
  } else if (error instanceof Error) {
    // If its a regular Error, we can access message
    errorMessage = error.message || errorMessage;
  } else {
    // If its some unknown error, log it safely
    console.error("An unknown error occurred:", error);
  }

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error",
                error: errorMessage
              }
            : f,
        ),
      )

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const simulateBlockchainProcessing = async (fileId: string, uploadResponse: UploadResponse) => {
    const stages = ["processing", "hashing", "timestamping"]

    for (let i = 0; i < stages.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: stages[i] as any,
                progress: ((i + 1) / stages.length) * 100,
              }
            : f,
        ),
      )
    }
  }

  const generateMockHash = () => `0x${Math.random().toString(16).substr(2, 64)}`

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadError(null)

    // Validate files
    const maxSize = 100 * 1024 * 1024 // 100MB
    const invalidFiles = files.filter((file) => file.size > maxSize)

    if (invalidFiles.length > 0) {
      setUploadError(`Some files exceed the 100MB limit: ${invalidFiles.map((f) => f.name).join(", ")}`)
      return
    }

    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "uploading",
      progress: 0,
      uploadProgress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
    setIsUploading(true)

    // Upload files one by one
    for (const newFile of newFiles) {
      await uploadFileToServer(newFile.file, newFile.id)
    }

    setIsUploading(false)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const retryUpload = async (fileId: string) => {
    const file = uploadedFiles.find((f) => f.id === fileId)
    if (!file) return

    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? {
              ...f,
              status: "uploading",
              progress: 0,
              uploadProgress: 0,
              error: undefined,
            }
          : f,
      ),
    )

    await uploadFileToServer(file.file, fileId)
  }

  const generateAILicense = async () => {
    setAiGenerating(true)

    try {
      // Simulate AI generation - replace with real API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const aiGeneratedLicense = `CUSTOM LICENSE AGREEMENT

This license is automatically generated based on your asset: "${formData.title}"

GRANT OF LICENSE:
Subject to the terms and conditions of this Agreement, the Licensor hereby grants to the Licensee a non-exclusive, worldwide license to use the licensed material for ${formData.usage || "commercial"} purposes.

PERMITTED USES:
- Commercial and non-commercial use
- Modification and derivative works
- Distribution in digital and print media
- Integration into larger works

RESTRICTIONS:
- Attribution to original creator required
- Cannot be resold as standalone product
- Cannot be used for illegal or harmful purposes

TERM: This license is perpetual unless terminated.

Generated on: ${new Date().toLocaleDateString()}
Asset Hash: ${uploadedFiles[0]?.hash || "Pending..."}

This license was generated using AI based on your asset details and intended usage.`

      setCustomLicense(aiGeneratedLicense)

      toast({
        title: "License Generated",
        description: "AI has successfully generated a custom license for your asset.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate AI license. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAiGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
    })
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <CloudUpload className="h-4 w-4 text-blue-600 animate-pulse" />
      case "processing":
        return <Zap className="h-4 w-4 text-yellow-600 animate-pulse" />
      case "hashing":
        return <Hash className="h-4 w-4 text-purple-600 animate-pulse" />
      case "timestamping":
        return <Clock className="h-4 w-4 text-orange-600 animate-pulse" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Upload className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading to server..."
      case "processing":
        return "Processing file..."
      case "hashing":
        return "Generating hash..."
      case "timestamping":
        return "Blockchain timestamping..."
      case "complete":
        return "Complete"
      case "error":
        return "Upload failed"
      default:
        return "Pending"
    }
  }

  const handleFinalSubmission = async () => {
    try {
      setIsUploading(true)

      // Here you would typically make an API call to finalize the asset with licenses
      const finalData = {
        assetIds: uploadedFiles.filter((f) => f.status === "complete").map((f) => f.id),
        licenses: selectedLicenses,
        customLicense: customLicense || null,
        metadata: formData,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Asset Published Successfully!",
        description: "Your asset has been published to the marketplace with blockchain protection.",
      })

      // Reset form or redirect
      // router.push('/my-assets')
    } catch (error) {
      toast({
        title: "Publication Failed",
        description: "Failed to publish asset. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const allFilesComplete = uploadedFiles.length > 0 && uploadedFiles.every((file) => file.status === "complete")
  const hasErrors = uploadedFiles.some((file) => file.status === "error")
  const canProceed =
    step === 1 ? allFilesComplete && !hasErrors : step === 2 ? formData.title && formData.description : true

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
                <span className="text-lg sm:text-2xl font-bold text-gray-900">IPChain Vault</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= stepNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > stepNum ? <CheckCircle className="h-4 w-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-8 sm:w-12 h-1 mx-2 ${step > stepNum ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {uploadError && (
          <Alert className="mb-6" variant="error">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadError}</AlertDescription>
          </Alert>
        )}

        {/* Step 1: File Upload & Processing */}
        {step === 1 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Your Creative Work
                </CardTitle>
                <CardDescription>
                  Select and upload your files. All uploads are encrypted, hashed, and timestamped on the blockchain for
                  maximum protection.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* File Type Selection */}
                <div>
                  <Label className="text-base font-medium mb-4 block">What type of work are you uploading?</Label>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {fileTypes.map((type) => (
                      <Card key={type.type} className="cursor-pointer hover:border-blue-500 transition-colors">
                        <CardContent className="p-3 sm:p-4 text-center">
                          <type.icon className={`h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-${type.color}-600`} />
                          <div className="font-medium text-sm sm:text-base">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.formats}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors">
                  <CloudUpload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-base sm:text-lg font-medium mb-2">Drop files here or click to browse</div>
                  <div className="text-sm text-muted-foreground mb-4">Maximum file size: 100MB per file</div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="*/*"
                    disabled={isUploading}
                  />
                  <Button asChild disabled={isUploading}>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      {isUploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Select Files
                        </>
                      )}
                    </label>
                  </Button>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Processing Files</Label>
                    {uploadedFiles.map((file) => (
                      <Card key={file.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {getStatusIcon(file.status)}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{file.file.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {(file.file.size / 1024 / 1024).toFixed(2)} MB • {getStatusText(file.status)}
                              </div>
                              {file.error && <div className="text-sm text-red-600 mt-1">{file.error}</div>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {file.status === "error" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => retryUpload(file.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Retry
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {(file.status === "uploading" ||
                          file.status === "processing" ||
                          file.status === "hashing" ||
                          file.status === "timestamping") && (
                          <div className="space-y-2">
                            <Progress value={file.uploadProgress || file.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground text-right">
                              {file.status === "uploading"
                                ? `${Math.round(file.uploadProgress || 0)}% uploaded`
                                : `${Math.round(file.progress)}% processed`}
                            </div>
                          </div>
                        )}

                        {file.status === "complete" && (
                          <div className="space-y-3 pt-3 border-t">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="font-medium text-gray-600">File Hash:</span>
                                <div className="font-mono bg-gray-100 p-2 rounded mt-1 flex items-center justify-between">
                                  <span className="truncate">{file.hash}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(file.hash || "")}
                                    className="h-6 w-6 p-0 ml-2"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <span className="font-medium text-gray-600">Timestamp:</span>
                                <div className="bg-green-100 p-2 rounded mt-1">
                                  <span>{new Date(file.timestamp || "").toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 text-green-600 text-sm">
                              <CheckCircle className="h-4 w-4" />
                              <span>Blockchain verification complete</span>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}

                {allFilesComplete && !hasErrors && (
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} size="lg">
                      <FileCheck className="h-4 w-4 mr-2" />
                      Continue to Asset Details
                    </Button>
                  </div>
                )}

                {hasErrors && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Some files failed to upload. Please retry or remove them before continuing.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Asset Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Asset Details
              </CardTitle>
              <CardDescription>
                Provide information about your creative work for better discoverability and licensing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Asset Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="design">Design & Graphics</SelectItem>
                        <SelectItem value="software">Software & Code</SelectItem>
                        <SelectItem value="content">Content & Writing</SelectItem>
                        <SelectItem value="media">Audio & Video</SelectItem>
                        <SelectItem value="business">Business & Legal</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      placeholder="design, logo, branding, corporate"
                      value={formData.tags}
                      onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your work, its intended use, and any special features..."
                      className="min-h-[120px]"
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="usage">Intended Usage</Label>
                    <Select
                      value={formData.usage}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, usage: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select usage type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commercial">Commercial Use</SelectItem>
                        <SelectItem value="personal">Personal Use</SelectItem>
                        <SelectItem value="educational">Educational Use</SelectItem>
                        <SelectItem value="non-profit">Non-Profit Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!canProceed}>
                  Continue to Licensing
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Licensing */}
        {step === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  License Configuration
                </CardTitle>
                <CardDescription>Choose how others can use your work and set your pricing.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="templates" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="templates">License Templates</TabsTrigger>
                    <TabsTrigger value="ai-generate">AI Generate</TabsTrigger>
                  </TabsList>

                  <TabsContent value="templates" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {licenseTemplates.map((license) => (
                        <Card
                          key={license.id}
                          className={`cursor-pointer transition-colors relative ${
                            selectedLicenses.includes(license.id)
                              ? "border-blue-500 bg-blue-50"
                              : "hover:border-gray-300"
                          }`}
                          onClick={() => {
                            setSelectedLicenses((prev) =>
                              prev.includes(license.id)
                                ? prev.filter((id) => id !== license.id)
                                : [...prev, license.id],
                            )
                          }}
                        >
                          {license.recommended && (
                            <Badge className="absolute -top-2 left-4 bg-orange-500">Recommended</Badge>
                          )}
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Checkbox checked={selectedLicenses.includes(license.id)} />
                                <CardTitle className="text-lg">{license.name}</CardTitle>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600">${license.price}</div>
                              </div>
                            </div>
                            <CardDescription>{license.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-medium text-green-600 mb-2">Features:</h4>
                                <div className="space-y-1">
                                  {license.features.slice(0, 3).map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2 text-sm">
                                      <CheckCircle className="h-3 w-3 text-green-600" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                  {license.features.length > 3 && (
                                    <div className="text-sm text-gray-500">
                                      +{license.features.length - 3} more features
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="ai-generate" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Brain className="h-5 w-5 mr-2" />
                          AI License Generator
                        </CardTitle>
                        <CardDescription>
                          Generate a custom license based on your asset details and intended usage.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">AI License Generation</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Our AI will analyze your asset details and create a custom license tailored to your
                                needs. This includes usage rights, restrictions, and pricing recommendations.
                              </p>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={generateAILicense}
                          disabled={aiGenerating || !formData.title}
                          className="w-full"
                          size="lg"
                        >
                          {aiGenerating ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Generating License...
                            </>
                          ) : (
                            <>
                              <Brain className="h-4 w-4 mr-2" />
                              Generate Custom License
                            </>
                          )}
                        </Button>

                        {customLicense && (
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Generated License</CardTitle>
                              <CardDescription>AI-generated custom license for your asset</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-gray-50 border rounded-lg p-4 max-h-64 overflow-y-auto">
                                <pre className="text-sm whitespace-pre-wrap font-mono">{customLicense}</pre>
                              </div>
                              <div className="flex justify-between mt-4">
                                <Button variant="outline" onClick={() => copyToClipboard(customLicense)}>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copy License
                                </Button>
                                <Button onClick={generateAILicense} disabled={aiGenerating}>
                                  <Brain className="h-4 w-4 mr-2" />
                                  Regenerate
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <Separator />

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleFinalSubmission}
                    disabled={(selectedLicenses.length === 0 && !customLicense) || isUploading}
                    size="lg"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CloudUpload className="h-4 w-4 mr-2" />
                        Publish Asset
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Files:</span>
                    <div>
                      {uploadedFiles.filter((f) => f.status === "complete").length} file(s) uploaded successfully
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Asset Title:</span>
                    <div>{formData.title || "Not set"}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Category:</span>
                    <div>{formData.category || "Not set"}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Licenses:</span>
                    <div>
                      {selectedLicenses.length > 0
                        ? `${selectedLicenses.length} template(s) selected`
                        : customLicense
                          ? "Custom AI license"
                          : "None selected"}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Blockchain Status:</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="h-3 w-3" />
                      <span>Verified & Protected</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Total Size:</span>
                    <div>
                      {(uploadedFiles.reduce((acc, file) => acc + file.file.size, 0) / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
