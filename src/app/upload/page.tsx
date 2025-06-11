"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Link from "next/link"
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
} from "lucide-react"

interface UploadedFile {
  file: File
  id: string
  hash?: string
  timestamp?: string
  status: "uploading" | "processing" | "hashing" | "timestamping" | "complete"
  progress: number
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

  const fileTypes = [
    { type: "document", icon: FileText, label: "Documents", formats: "PDF, DOC, PPT", color: "blue" },
    { type: "image", icon: ImageIcon, label: "Images & Design", formats: "JPG, PNG, SVG, PSD", color: "green" },
    { type: "video", icon: Video, label: "Video & Animation", formats: "MP4, MOV, AVI", color: "purple" },
    { type: "audio", icon: Music, label: "Audio", formats: "MP3, WAV, FLAC", color: "orange" },
    { type: "code", icon: Code, label: "Code & Software", formats: "ZIP, JS, PY, etc.", color: "indigo" },
    { type: "other", icon: Archive, label: "Other Files", formats: "Any format", color: "gray" },
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

  const simulateFileProcessing = useCallback((fileId: string) => {
    const stages = ["uploading", "processing", "hashing", "timestamping", "complete"]
    let currentStage = 0
    let progress = 0

    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5

      if (progress >= 100) {
        progress = 100
        currentStage = Math.min(currentStage + 1, stages.length - 1)

        if (currentStage === stages.length - 1) {
          // Generate mock hash and timestamp
          const mockHash = `0x${Math.random().toString(16).substr(2, 64)}`
          const mockTimestamp = new Date().toISOString()

          setUploadedFiles((prev) =>
            prev.map((file) =>
              file.id === fileId
                ? {
                    ...file,
                    status: "complete" as const,
                    progress: 100,
                    hash: mockHash,
                    timestamp: mockTimestamp,
                  }
                : file,
            ),
          )
          clearInterval(interval)
          return
        }
        progress = 0
      }

      setUploadedFiles((prev) =>
        prev.map((file) => (file.id === fileId ? { ...file, status: stages[currentStage] as any, progress } : file)),
      )
    }, 300)

    return interval
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    const newFiles: UploadedFile[] = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: "uploading",
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Start processing each file
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id)
    })
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const generateAILicense = async () => {
    setAiGenerating(true)

    // Simulate AI generation
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
    setAiGenerating(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Upload className="h-4 w-4 text-blue-600 animate-pulse" />
      case "processing":
        return <Zap className="h-4 w-4 text-yellow-600 animate-pulse" />
      case "hashing":
        return <Hash className="h-4 w-4 text-purple-600 animate-pulse" />
      case "timestamping":
        return <Clock className="h-4 w-4 text-orange-600 animate-pulse" />
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <Upload className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing..."
      case "hashing":
        return "Generating hash..."
      case "timestamping":
        return "Blockchain timestamping..."
      case "complete":
        return "Complete"
      default:
        return "Pending"
    }
  }

  const allFilesComplete = uploadedFiles.length > 0 && uploadedFiles.every((file) => file.status === "complete")
  const canProceed = step === 1 ? allFilesComplete : step === 2 ? formData.title && formData.description : true

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
                  Select and upload your files. All uploads are encrypted, hashed, and timestamped on the blockchain.
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
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-400" />
                  <div className="text-base sm:text-lg font-medium mb-2">Drop files here or click to browse</div>
                  <div className="text-sm text-muted-foreground mb-4">Maximum file size: 100MB per file</div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept="*/*"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload" className="cursor-pointer">
                      Select Files
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
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>

                        {file.status !== "complete" && (
                          <div className="space-y-2">
                            <Progress value={file.progress} className="h-2" />
                            <div className="text-xs text-muted-foreground text-right">{Math.round(file.progress)}%</div>
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

                {allFilesComplete && (
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} size="lg">
                      Continue to Asset Details
                    </Button>
                  </div>
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
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!canProceed}>
                  Continue to Licensing
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
                              <Brain className="h-4 w-4 mr-2 animate-pulse" />
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
                                <Button onClick={generateAILicense}>
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
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      // Handle final submission
                      alert("Asset uploaded successfully!")
                    }}
                    disabled={selectedLicenses.length === 0 && !customLicense}
                    size="lg"
                  >
                    Publish Asset
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
                    <div>{uploadedFiles.length} file(s) uploaded</div>
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
                      <span>Verified</span>
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
