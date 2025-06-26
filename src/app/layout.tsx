import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import "react-toastify/dist/ReactToastify.css"
import {ToastContainer} from "react-toastify"
import { Navbar } from "@/components/navbar"
import { Providers } from "@/lib/features/provider"

const inter = Inter({ subsets: ["latin"], display: 'swap', adjustFontFallback: false })

export const metadata: Metadata = {
  title: "IP Vault - Secure Your Creative Works",
  description: "Upload, timestamp, and license your creative works with blockchain-verified proof of creation.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">{children}</main>
          
          <ToastContainer />
        </Providers>
        
      </body>
    </html>
  )
}
