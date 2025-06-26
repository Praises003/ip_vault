"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { registerUser } from "@/lib/features/authSlice"
import { toast, ToastContainer } from "react-toastify"
import { gsap } from "gsap"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Eye, EyeOff, Mail, Lock, User } from "lucide-react"

export default function SignUpPage() {
  const router = useRouter()
  const formRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, message } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false
  })
  const [showPwd, setShowPwd] = useState(false)
  const [showCpwd, setShowCpwd] = useState(false)

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    )
    gsap.to(iconRef.current, {
      scale: 1.15,
      rotate: 5,
      yoyo: true,
      repeat: -1,
      duration: 0.8,
      ease: "power1.inOut"
    })
  }, [])

  useEffect(() => {
    if (error) toast.error(error)
      
    
    if (message) toast.success(message)
     
  }, [error, message])

  const onChange = (field: string, value: string | boolean) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match")
    }
    const action = await dispatch(
      registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
    )
    if (registerUser.rejected.match(action)) return
     localStorage.setItem("signupEmail", formData.email)
     router.push("/verifyOtp")
    // optionally redirect to OTP or login page:
    // router.push("/auth/verify")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      
      <div className="w-full max-w-md" ref={formRef}>
        <div className="text-center mb-8">
          <div ref={iconRef} className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">IP Vault</h1>
          <p className="text-gray-600">AI‑Powered IP Protection Platform</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Create your account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button variant="outline" className="w-full h-11 border-gray-200">
              Continue with Google
            </Button>

            <div className="relative">
              <Separator />
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <Label htmlFor="name">Full name</Label>
                <User className="absolute left-3 top-10 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={e => onChange("name", e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Label htmlFor="email">Email address</Label>
                <Mail className="absolute left-3 top-10 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => onChange("email", e.target.value)}
                  required
                  className="pl-10 h-11"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Lock className="absolute left-3 top-10 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={formData.password}
                  onChange={e => onChange("password", e.target.value)}
                  required
                  className="pl-10 pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-10 text-gray-400-hover:text-gray-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Confirm */}
              <div className="relative">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Lock className="absolute left-3 top-10 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showCpwd ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={e => onChange("confirmPassword", e.target.value)}
                  required
                  className="pl-10 pr-10 h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowCpwd(!showCpwd)}
                  className="absolute right-3 top-10 text-gray-400-hover:text-gray-600"
                >
                  {showCpwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start">
                <Checkbox
                  checked={formData.agree}
                  onCheckedChange={val => onChange("agree", val as boolean)}
                />
                <Label className="ml-2 text-sm text-gray-600">
                  I agree to the <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link> & <Link href="/privacy" className="text-blue-600 hover:underline">Privacy</Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.agree}
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {loading ? "Creating..." : "Create account"}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-600 pt-4 border-t mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
