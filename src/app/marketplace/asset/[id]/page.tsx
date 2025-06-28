// app/marketplace/asset/[id]/page.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/axios"
import AssetDetailLayout from "@/components/AssetDetailLayout"
import { Skeleton } from "@/components/ui/skeleton"

interface Asset {
  id: string
  name: string
  description: string
  price: number
  // Add any other properties you expect in the API response
}

export default function AssetDetailPage() {
  const { id } = useParams()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/marketplace/${id}`)
      .then(res => setAsset(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <Skeleton className="h-screen" />
  if (!asset) return <p>Asset not found.</p>

  return <AssetDetailLayout asset={asset} />
}
