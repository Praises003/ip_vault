// components/ProtectedRoute.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import {Skeleton} from "@/components/ui/skeleton"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, checkedUser, isLoading } = useSelector((state: RootState) => state.auth)
  const isAuthenticated = !!(user || checkedUser)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) return <Skeleton />


  if (!isAuthenticated) return null

  return <>{children}</>
}
