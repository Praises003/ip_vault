// components/AssetCard.tsx
"use client"

import Link from "next/link"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Eye, Download } from "lucide-react"

interface LicensePlan {
  price: number;
  name: string;
}

interface User {
  name: string;
}

interface Asset {
  id: string;
  fileUrl: string;
  title: string;
  description: string;
  licensePlans?: LicensePlan[];
  avgRating?: number;
  reviewCount?: number;
  views?: number;
  downloads?: number;
  user: User;
}

interface AssetCardProps {
  asset: Asset;
}

export default function AssetCard({ asset }: AssetCardProps) {
   const plan: LicensePlan = asset.licensePlans?.[0] ?? { price: 0, name: "Standard" };
  const price = plan.price ?? 0
  const licenseName = plan.name || "Standard"
  const rating = asset.avgRating ?? 0
  const reviews = asset.reviewCount ?? 0
  const views = asset.views ?? 0
  const downloads = asset.downloads ?? 0

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer relative w-full m-5 p-2.5">
      <Link href={`/marketplace/asset/${asset.id}`}>
        <img
          src={asset.fileUrl || "/placeholder.svg"}
          alt={asset.title}
          className="w-full h-60 object-cover rounded-t-lg mb-5"
        />
        <Badge className="absolute top-3 left-4 bg-blue-600 text-white">{licenseName}</Badge>
        <CardHeader>
          <CardTitle className="text-base group-hover:text-blue-600 transition">{asset.title}</CardTitle>
          <CardDescription className="line-clamp-2 text-sm">{asset.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                {asset.user.name.slice(0, 2)}
              </div>
              <span className="text-sm text-gray-600">{asset.user.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              <span>({reviews})</span>
            </div>
            <div></div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {views}
            </span>
            <span className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              {downloads}
            </span>
            <span className="text-lg font-bold text-green-600">${price}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
