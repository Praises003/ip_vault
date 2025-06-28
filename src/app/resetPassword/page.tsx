"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { resetPassword } from "@/lib/features/authSlice"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/store"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [form, setForm] = useState({ token: "", password: "", confirmPassword: "" })
  const [email, setEmail] = useState("")

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail")
    if (!storedEmail) {
      router.push("/auth/forgot")
    } else {
      setEmail(storedEmail)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const result = await dispatch(resetPassword({ token: form.token, email, password: form.password, confirmPassword: form.confirmPassword }))

  if (resetPassword.fulfilled.match(result)) {
    toast.success("Password reset successful")
    localStorage.removeItem("resetEmail")
    setTimeout(() => router.push("/login"), 1500)
  } else {
    toast.error(result.payload as string)
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <Input
          placeholder="Enter Reset Token"
          required
          value={form.token}
          onChange={(e) => setForm({ ...form, token: e.target.value })}
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="New password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-3"
        />
        <Input
          type="password"
          placeholder="Confirm password"
          required
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="mb-4"
        />
        <Button type="submit" className="w-full">Reset Password</Button>
      </form>
    </div>
  )
}
