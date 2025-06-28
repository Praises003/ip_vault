import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const pricingPlans = [
  {
    name: "Starter",
    price: "₦2000",
    period: "/month",
    description: "Perfect for individual creators and small projects",
    features: ["Up to 50 assets", "Basic IP protection", "Standard licensing", "Email support", "1GB storage"],
    popular: false,
  },
  {
    name: "Professional",
    price: "₦4500",
    period: "/month",
    description: "Ideal for growing businesses and content creators",
    features: [
      "Up to 500 assets",
      "Advanced IP protection",
      "Custom licensing terms",
      "Priority support",
      "10GB storage",
      "Theft detection alerts",
      "Takedown management",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₦7500",
    period: "/month",
    description: "For large organizations with extensive IP portfolios",
    features: [
      "Unlimited assets",
      "Enterprise IP protection",
      "White-label licensing",
      "24/7 dedicated support",
      "100GB storage",
      "Advanced analytics",
      "API access",
      "Custom integrations",
    ],
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the perfect plan to protect and monetize your intellectual property
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? "border-blue-500 shadow-lg scale-105" : ""}`}>
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
              <CardDescription className="text-gray-600">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <p className="text-gray-600 mb-4">All plans include a 14-day free trial. No credit card required.</p>
        <p className="text-sm text-gray-500">
          Need a custom solution?{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact our sales team
          </a>
        </p>
      </div>
    </div>
  )
}
