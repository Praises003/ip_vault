"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error"
  children: React.ReactNode
}

function Alert({
  variant = "info",
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border p-4",
        variant === "info" && "bg-blue-50 border-blue-400 text-blue-700",
        variant === "success" && "bg-green-50 border-green-400 text-green-700",
        variant === "warning" && "bg-yellow-50 border-yellow-400 text-yellow-700",
        variant === "error" && "bg-red-50 border-red-400 text-red-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

function AlertDescription({ className, children, ...props }: AlertDescriptionProps) {
  return (
    <p
      className={cn("text-sm", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { Alert, AlertDescription }
