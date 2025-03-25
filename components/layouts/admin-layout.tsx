import type { ReactNode } from "react"
import AdminNavbar from "@/components/layouts/admin-navbar"
import AdminSidebar from "@/components/layouts/admin-sidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <AdminNavbar />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 p-6 ml-0 md:ml-64 transition-all">{children}</main>
      </div>
    </div>
  )
}

