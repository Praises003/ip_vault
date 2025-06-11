"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, CheckCircle, Download, FileText, Mail, ArrowRight } from "lucide-react"

export default function PurchaseSuccessPage() {
  const [purchaseDetails, setPurchaseDetails] = useState(null)

  useEffect(() => {
    // In a real app, you'd get the session ID from URL params
    // and fetch the purchase details from your API
    const mockPurchaseDetails = {
      assetTitle: "Modern Logo Design Kit",
      license: "Standard License",
      price: 49,
      transactionId: "txn_1234567890",
      downloadUrl: "/download/mock-asset-id",
      licenseKey: "IPVAULT-LOGO-STD-2024-001",
      purchaseDate: new Date().toLocaleDateString(),
    }

    setPurchaseDetails(mockPurchaseDetails)
  }, [])

  if (!purchaseDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Processing your purchase...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">IP Vault</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/marketplace">Browse More</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">My Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Purchase Successful!</h1>
          <p className="text-lg text-gray-600">Thank you for your purchase. Your asset is ready for download.</p>
        </div>

        {/* Purchase Details */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Purchase Details</CardTitle>
            <CardDescription>Your transaction has been completed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Asset</span>
                <div className="font-medium">{purchaseDetails.assetTitle}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">License</span>
                <div className="font-medium">{purchaseDetails.license}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Amount Paid</span>
                <div className="font-medium text-green-600">${purchaseDetails.price}</div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Purchase Date</span>
                <div className="font-medium">{purchaseDetails.purchaseDate}</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <span className="text-sm text-gray-500">Transaction ID</span>
              <div className="font-mono text-sm bg-gray-100 p-2 rounded">{purchaseDetails.transactionId}</div>
            </div>

            <div>
              <span className="text-sm text-gray-500">License Key</span>
              <div className="font-mono text-sm bg-blue-50 p-2 rounded border border-blue-200">
                {purchaseDetails.licenseKey}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Download Your Asset
            </CardTitle>
            <CardDescription>
              Your files are ready for download. The download link will remain active for 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full mb-4">
              <Download className="h-4 w-4 mr-2" />
              Download Files
            </Button>

            <div className="text-center text-sm text-gray-500">
              Files included: Vector files, PNG exports, Brand guidelines
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium">Check Your Email</div>
                <div className="text-sm text-gray-600">
                  We've sent a confirmation email with your receipt and download links.
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium">Review License Terms</div>
                <div className="text-sm text-gray-600">
                  Make sure you understand the usage rights for your purchased license.
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium">Keep Your License Key</div>
                <div className="text-sm text-gray-600">
                  Save your license key for future reference and proof of purchase.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button asChild className="flex-1">
            <Link href="/marketplace">
              Browse More Assets
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/dashboard">View My Purchases</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
