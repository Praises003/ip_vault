// marketplace/page.tsx (or similar)
"use client"

import { useEffect, useState } from "react"
import api from "@/lib/axios"
import AssetCard from "@/components/AssetCard"

export default function MarketplacePage() {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get("/api/marketplace")
      .then(res => setAssets(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map(asset => (
        <AssetCard key={asset.id} asset={asset} />
      ))}
    </div>
  )
}
