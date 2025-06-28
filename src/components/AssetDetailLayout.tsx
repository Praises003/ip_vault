// components/AssetDetailLayout.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import api from "@/lib/axios"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Shield, ArrowLeft, Star, Eye, Download, Heart, Share2,
  FileText, Check, X, User, CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AssetDetailLayoutProps {
  asset: any
}

export default function AssetDetailLayout({ asset }: AssetDetailLayoutProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [selectedLicenseType, setSelectedLicenseType] = useState(asset.licensePlans?.[0]?.name.toLowerCase() || "")
  const plan = asset.licensePlans?.find((lp: any) => lp.name.toLowerCase() === selectedLicenseType) || asset.licensePlans?.[0] || {}
  const price = plan.price ?? 0

  const handlePurchase = async () => {
    const res = await api.post("/api/marketplace/create-checkout-session", {
      licensePlanId: plan.id
    })
    window.location.href = res.data.url
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild>
          <Link href="/marketplace">
            <ArrowLeft className="mr-2" /> Back
          </Link>
        </Button>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => setIsLiked(!isLiked)}>
            <Heart className={isLiked ? "fill-red-500" : ""} />
          </Button>
          <Button variant="secondary"><Share2 /></Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <img src={asset.fileUrl || "/placeholder.svg"} alt={asset.title}
               className="w-full h-96 object-cover rounded-t-lg" />
          <div className="p-4 space-y-2">
            <Badge>{asset.category ?? "Uncategorized"}</Badge>
            <CardTitle>{asset.title}</CardTitle>
            <CardDescription>{asset.description}</CardDescription>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <Avatar className="h-8 w-8"><AvatarFallback>{asset.user?.name?.[0]}</AvatarFallback></Avatar>
              <span>{asset.user?.name}</span>
              <span><Star className="h-4 w-4 fill-yellow-400" /> {asset.avgRating ?? 0}</span>
              <span><Eye className="h-4 w-4" /> {asset.views ?? 0}</span>
              <span><Download className="h-4 w-4" /> {asset.downloads ?? 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="description" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card><CardContent>{asset.description}</CardContent></Card>
        </TabsContent>
        <TabsContent value="files">
          <Card><CardContent>
            {plan.licenseTerms?.split("\n").map((line: string, i: number) => <p key={i}>{line}</p>)}
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card><CardContent>
            <p>No reviews yet</p>
          </CardContent></Card>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>License Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {asset.licensePlans?.map((lp: any) => (
              <div
                key={lp.id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  lp.id === plan.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                }`}
                onClick={() => setSelectedLicenseType(lp.name.toLowerCase())}
              >
                <div className="flex justify-between">
                  <span>{lp.name}</span>
                  <span className="font-bold">${10000}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between mb-4">
              <span>Total:</span>
              <span className="text-xl font-bold">${10000}</span>
            </div>
            <Button size="lg" className="w-full" onClick={handlePurchase}>
              <CreditCard className="mr-2" /> Purchase
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
