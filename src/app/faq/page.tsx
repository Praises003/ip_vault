"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqData = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is IPChain Vault?",
        answer:
          "IPChain Vault is an AI-powered intellectual property protection platform that helps creators secure, timestamp, and license their creative works using blockchain technology.",
      },
      {
        question: "How do I upload my first asset?",
        answer:
          'Simply navigate to the "Upload Assets" page, drag and drop your files, add metadata and licensing terms, then click upload. Your assets will be automatically timestamped and protected.',
      },
      {
        question: "What file types are supported?",
        answer:
          "We support images (JPG, PNG, GIF), videos (MP4, MOV, AVI), audio files (MP3, WAV), documents (PDF, DOC), and 3D models (OBJ, FBX).",
      },
    ],
  },
  {
    category: "IP Protection",
    questions: [
      {
        question: "How does blockchain timestamping work?",
        answer:
          "When you upload an asset, we create a cryptographic hash and record it on the blockchain with a timestamp, providing immutable proof of creation and ownership.",
      },
      {
        question: "What is theft detection?",
        answer:
          "Our AI-powered system continuously scans the internet for unauthorized use of your protected assets, alerting you when potential infringement is detected.",
      },
      {
        question: "How effective is the takedown management?",
        answer:
          "Our automated takedown system has a 95% success rate, handling DMCA notices and platform-specific takedown requests on your behalf.",
      },
    ],
  },
  {
    category: "Licensing & Revenue",
    questions: [
      {
        question: "How do licensing fees work?",
        answer:
          "You set your own licensing prices. We take a small platform fee (5-10% depending on your plan) and handle all payment processing and license management.",
      },
      {
        question: "What types of licenses can I offer?",
        answer:
          "You can offer standard commercial licenses, extended licenses, exclusive licenses, or create custom licensing terms for specific use cases.",
      },
      {
        question: "When do I get paid?",
        answer:
          "Payments are processed weekly and deposited directly to your linked bank account or PayPal. You can track all earnings in your dashboard.",
      },
    ],
  },
  {
    category: "Technical Support",
    questions: [
      {
        question: "Is my data secure?",
        answer:
          "Yes, we use enterprise-grade encryption, secure cloud storage, and follow industry best practices for data protection and privacy.",
      },
      {
        question: "Do you offer API access?",
        answer:
          "API access is available on Professional and Enterprise plans, allowing you to integrate IPChain Vault with your existing workflows and tools.",
      },
      {
        question: "What support options are available?",
        answer:
          "We offer email support for all users, priority support for Professional users, and 24/7 dedicated support for Enterprise customers.",
      },
    ],
  },
]

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about IPChain Vault and intellectual property protection
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {faqData.map((category) => (
          <div key={category.category}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{category.category}</h2>
            <div className="space-y-4">
              {category.questions.map((item, index) => {
                const itemId = `${category.category}-${index}`
                const isOpen = openItems.includes(itemId)

                return (
                  <Card key={itemId} className="border border-gray-200">
                    <CardHeader
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => toggleItem(itemId)}
                    >
                      <CardTitle className="flex items-center justify-between text-lg font-medium text-gray-900">
                        {item.question}
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    {isOpen && (
                      <CardContent className="pt-0">
                        <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16 p-8 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
        <p className="text-gray-600 mb-4">
          Our support team is here to help you protect and monetize your intellectual property.
        </p>
        <a
          href="/support"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </div>
  )
}
