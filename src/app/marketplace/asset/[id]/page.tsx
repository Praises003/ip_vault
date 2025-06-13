"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import {
  Shield,
  ArrowLeft,
  Star,
  Eye,
  Download,
  Heart,
  Share2,
  FileText,
  ImageIcon,
  Check,
  X,
  User,
  CreditCard,
} from "lucide-react"

// interface PageProps {
//   params: {
//     id: string;
//   };
// }

// export type paramsType = { id: string };

// type PageProps = {
//   params: paramsType;
// };

export default function AssetDetailPage({ params }: { params: Promise<{ id: string; }> }) {
  const [isLiked, setIsLiked] = useState(false)
  const [selectedLicense, setSelectedLicense] = useState("standard")
  const [id, setId] = useState(null);
  

  useEffect(() => {
            const getParams = async () => {
                const { id } = await params;
                setId(id);
            };
            getParams();
        }, [params]); //  Dependency array

        
  // Mock asset data - in real app, fetch based on params.id
  const asset = {
    id: Number.parseInt(id),
    title: "Modern Logo Design Kit",
    description:
      "Professional logo templates for startups and businesses. This comprehensive kit includes 50+ unique logo designs, vector files, and brand guidelines to help you create a strong brand identity.",
    longDescription: `This Modern Logo Design Kit is perfect for entrepreneurs, startups, and businesses looking to establish a professional brand identity. Each logo is carefully crafted with attention to detail and modern design principles.

The kit includes:
• 50+ unique logo designs
• Vector files (AI, EPS, SVG)
• High-resolution PNG files
• Brand color palettes
• Typography guidelines
• Usage instructions

All logos are fully customizable and can be easily modified to match your brand colors and preferences. The designs are suitable for various industries including technology, finance, healthcare, and creative services.`,
    category: "design",
    creator: {
      name: "Sarah Johnson",
      avatar: "SJ",
      rating: 4.9,
      totalSales: 1250,
      memberSince: "2022",
      verified: true,
    },
    rating: 4.8,
    reviews: 124,
    views: 2340,
    downloads: 89,
    tags: ["logo", "branding", "corporate", "modern", "startup", "business"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    licenses: [
      {
        type: "standard",
        name: "Standard License",
        price: 49,
        originalPrice: 79,
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
        type: "extended",
        name: "Extended License",
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
        type: "exclusive",
        name: "Exclusive License",
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
    ],
    files: [
      { name: "Logo_Designs.ai", size: "15.2 MB", type: "Adobe Illustrator" },
      { name: "Logo_Designs.eps", size: "12.8 MB", type: "EPS Vector" },
      { name: "PNG_Files.zip", size: "45.6 MB", type: "PNG Images" },
      { name: "Brand_Guidelines.pdf", size: "3.2 MB", type: "PDF Document" },
    ],
    uploadDate: "2024-01-15",
    lastUpdated: "2024-01-20",
    icon: ImageIcon,
  }

  const selectedLicenseData = asset.licenses.find((l) => l.type === selectedLicense) || asset.licenses[0]

  const handlePurchase = async () => {
    // In a real app, this would integrate with Stripe
    console.log("Initiating Stripe checkout for:", {
      assetId: asset.id,
      license: selectedLicense,
      price: selectedLicenseData.price,
    })

    // Simulate Stripe checkout
    alert(`Redirecting to Stripe checkout for ${selectedLicenseData.name} - $${selectedLicenseData.price}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/marketplace">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">IP Vault</span>
            </div>
          </div>
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Asset Images */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={asset.images[0] || "/placeholder.svg"}
                    alt={asset.title}
                    className="w-full h-96 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge className="bg-blue-600">{asset.category}</Badge>
                    {selectedLicenseData.originalPrice && (
                      <Badge variant="destructive">
                        Save ${selectedLicenseData.originalPrice - selectedLicenseData.price}
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? "text-red-500" : ""}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                <div className="p-4">
                  <div className="grid grid-cols-4 gap-2">
                    {asset.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Asset Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{asset.title}</CardTitle>
                    <CardDescription className="text-base">{asset.description}</CardDescription>
                  </div>
                  <asset.icon className="h-8 w-8 text-gray-400" />
                </div>

                <div className="flex items-center space-x-6 pt-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white text-sm">{asset.creator.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{asset.creator.name}</span>
                        {asset.creator.verified && <Check className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div className="text-sm text-gray-500">
                        {asset.creator.totalSales} sales • Member since {asset.creator.memberSince}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{asset.rating}</span>
                      <span className="text-gray-500">({asset.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {asset.views} views
                      </span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {asset.downloads} downloads
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="description" className="space-y-4">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="files">Files Included</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({asset.reviews})</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-line text-gray-700">{asset.longDescription}</p>
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h4 className="font-semibold mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {asset.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Upload Date:</span>
                        <span className="ml-2 text-gray-600">{asset.uploadDate}</span>
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>
                        <span className="ml-2 text-gray-600">{asset.lastUpdated}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="files">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {asset.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-gray-500">{file.type}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">{file.size}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Review Summary */}
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold">{asset.rating}</div>
                          <div className="flex items-center justify-center space-x-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.floor(asset.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">{asset.reviews} reviews</div>
                        </div>

                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center space-x-2">
                              <span className="text-sm w-8">{rating}★</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full"
                                  style={{
                                    width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 8 : rating === 2 ? 2 : 0}%`,
                                  }}
                                />
                              </div>
                              <span className="text-sm text-gray-500 w-8">
                                {rating === 5 ? 87 : rating === 4 ? 25 : rating === 3 ? 10 : rating === 2 ? 2 : 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Individual Reviews */}
                      <div className="space-y-4">
                        {[
                          {
                            user: "Mike Chen",
                            avatar: "MC",
                            rating: 5,
                            date: "2024-01-18",
                            comment:
                              "Excellent logo designs! Very professional and easy to customize. The vector files are clean and well-organized. Highly recommended!",
                          },
                          {
                            user: "Emma Davis",
                            avatar: "ED",
                            rating: 4,
                            date: "2024-01-15",
                            comment:
                              "Great variety of designs. Some logos are more unique than others, but overall a solid collection for the price.",
                          },
                          {
                            user: "Alex Rodriguez",
                            avatar: "AR",
                            rating: 5,
                            date: "2024-01-12",
                            comment:
                              "Perfect for my startup! Found the perfect logo and the brand guidelines were very helpful. Sarah was also responsive to questions.",
                          },
                        ].map((review, index) => (
                          <div key={index} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gray-600 text-white text-sm">
                                  {review.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium">{review.user}</span>
                                  <div className="flex items-center space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-3 w-3 ${
                                          star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">{review.date}</span>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* License Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose License</CardTitle>
                <CardDescription>Select the license that fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {asset.licenses.map((license) => (
                  <div
                    key={license.type}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedLicense === license.type
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedLicense(license.type)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            selectedLicense === license.type ? "border-blue-500 bg-blue-500" : "border-gray-300"
                          }`}
                        >
                          {selectedLicense === license.type && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        <span className="font-medium">{license.name}</span>
                      </div>
                      <div className="text-right">
                        {license.originalPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">${license.originalPrice}</span>
                        )}
                        <span className="text-lg font-bold text-green-600">${license.price}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      {license.features.slice(0, 3).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="h-3 w-3 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {license.features.length > 3 && (
                        <div className="text-sm text-gray-500">+{license.features.length - 3} more features</div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Purchase */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-medium">Total:</span>
                    <div>
                      {selectedLicenseData.originalPrice && (
                        <span className="text-gray-500 line-through mr-2">${selectedLicenseData.originalPrice}</span>
                      )}
                      <span className="text-2xl font-bold text-green-600">${selectedLicenseData.price}</span>
                    </div>
                  </div>

                  <Button onClick={handlePurchase} className="w-full" size="lg">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Purchase License
                  </Button>

                  <div className="text-center text-sm text-gray-500">Secure checkout powered by Stripe</div>
                </div>
              </CardContent>
            </Card>

            {/* License Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">License Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">What&apos;s Included:</h4>
                  <div className="space-y-1">
                    {selectedLicenseData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedLicenseData.restrictions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">Restrictions:</h4>
                    <div className="space-y-1">
                      {selectedLicenseData.restrictions.map((restriction, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <X className="h-3 w-3 text-red-600" />
                          <span>{restriction}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About the Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-600 text-white">{asset.creator.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-medium">{asset.creator.name}</span>
                      {asset.creator.verified && <Check className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{asset.creator.rating} rating</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Total Sales</span>
                    <div className="font-medium">{asset.creator.totalSales}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Member Since</span>
                    <div className="font-medium">{asset.creator.memberSince}</div>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  <User className="h-4 w-4 mr-2" />
                  View Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
