"use client"

import { ReactNode } from 'react'

interface AdminAuthWrapperProps {
  children: React.ReactNode
}

export function AdminAuthWrapper({ children }: AdminAuthWrapperProps) {
  // For now, allow access without login
  // In production, implement proper authentication
  return <>{children}</>
}

