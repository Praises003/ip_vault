"use client"

import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"
import { verifyOtp } from "@/lib/features/authSlice"
import { toast } from "react-toastify"

import axios from "axios"
import { gsap } from "gsap"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"

export default function VerifyOtpPage() {
  const iconRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, message } = useSelector((s: RootState) => s.auth)

  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Optional: Pass email through router or state
    const stored = localStorage.getItem("signupEmail")
    if (stored) setEmail(stored)
  }, [])

  useEffect(() => {
    gsap.fromTo(
      iconRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1.1, opacity: 1, duration: 1, ease: "elastic.out(1,0.3)" }
    )
    gsap.fromTo(
      formRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.4 }
    )
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp || !email) return toast.error("Invalid request")

    const action = await dispatch(verifyOtp({ email, otp }))
    if (verifyOtp.rejected.match(action)) return
    // Redirect on success
    // router.push("/dashboard")
  }

  const resendOtp = async () => {
  const email = localStorage.getItem("signupEmail")

  if (!email) {
    toast.error("Email not found. Please register again.")
    return
  }

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`, { email })
    toast.success("OTP has been resent to your email.")
  } catch (error: Error | any) {
    const msg = error.response?.data?.message || "Failed to resend OTP"
    toast.error(msg)
  }
}

  useEffect(() => {
    if (error) toast.error(error)
    if (message) toast.success(message)
  }, [error, message])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
     
      <div ref={iconRef} className="mb-6 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
        <Shield className="w-10 h-10 text-white animate-pulse" />
      </div>

      <Card ref={formRef} className="w-full max-w-sm bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Verify OTP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <p className="text-center text-gray-600">
            Enter the 4‑digit code sent to <span className="font-medium">{email}</span>.
          </p>
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-widest text-xl font-mono letter-spacing-widest"
                placeholder="••••"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600">
  Didn’t get the code?{" "}
  <button
    type="button"
    onClick={resendOtp}
    className="text-blue-600 font-medium hover:underline"
  >
    Resend OTP
  </button>
</p>
        </CardContent>
      </Card>
    </div>
  )
}
