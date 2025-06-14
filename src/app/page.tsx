import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Clock, DollarSign, BarChart3, Upload, FileText, ImageIcon, Video, Code } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
     

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Secure Your Creative Works.
            <br />
            <span className="text-blue-600">Monetize Your IP.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload, timestamp, and license your creative works with blockchain-verified proof of creation. Turn your
            intellectual property into a revenue stream.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/dashboard">Start Protecting Your Work</Link>
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Protect & Monetize</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Upload className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Secure Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Upload any creative work - documents, designs, videos, code, and more. All files are encrypted and
                  stored securely.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Verifiable Timestamp</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Get blockchain-verified proof of creation with immutable timestamps that hold up in legal proceedings.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Flexible Licensing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Set fixed prices, subscription models, or custom licensing terms. Control how your work is used and
                  monetized.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-12 w-12 text-orange-600 mb-4" />
                <CardTitle>Earnings Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Monitor your revenue streams with detailed analytics and automated royalty distribution.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Supported File Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Support for All Creative Works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <FileText className="h-16 w-16 text-blue-600 mb-4" />
              <h3 className="font-semibold">Documents</h3>
              <p className="text-sm text-gray-600">PDFs, Word docs, presentations</p>
            </div>
            <div className="flex flex-col items-center">
              <ImageIcon className="h-16 w-16 text-green-600 mb-4" />
              <h3 className="font-semibold">Visual Art</h3>
              <p className="text-sm text-gray-600">Images, designs, illustrations</p>
            </div>
            <div className="flex flex-col items-center">
              <Video className="h-16 w-16 text-purple-600 mb-4" />
              <h3 className="font-semibold">Media</h3>
              <p className="text-sm text-gray-600">Videos, audio, animations</p>
            </div>
            <div className="flex flex-col items-center">
              <Code className="h-16 w-16 text-orange-600 mb-4" />
              <h3 className="font-semibold">Code</h3>
              <p className="text-sm text-gray-600">Software, scripts, algorithms</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Protect Your Creative Work?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of creators who trust IP Vault to secure and monetize their intellectual property.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">Start Your Free Trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">IP Vault</span>
              </div>
              <p className="text-gray-400">
                Secure, verify, and monetize your creative works with blockchain technology.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Legal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 IP Vault. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
