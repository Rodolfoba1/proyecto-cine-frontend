import type { ReactNode } from "react"
import Navbar from "@/components/layouts/navbar"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Navbar />
      <main className="container mx-auto pt-16">{children}</main>
    </div>
  )
}

