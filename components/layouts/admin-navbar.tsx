"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { logout } from "@/lib/auth"

export default function AdminNavbar() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-800 shadow-md">
      <div className="px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-xl font-bold text-white">
              CinemaReserve <span className="text-blue-400">Admin</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:text-red-300 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Cerrar sesión
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 pb-4 px-4">
          <div className="flex flex-col space-y-3">
            <Link
              href="/admin"
              className="text-white hover:text-blue-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/cinemas"
              className="text-white hover:text-blue-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gestión de Salas
            </Link>
            <Link
              href="/admin/users"
              className="text-white hover:text-blue-300 py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Gestión de Usuarios
            </Link>
            <Button
              variant="ghost"
              className="text-white hover:text-red-300 flex items-center gap-2 justify-start px-0"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Cerrar sesión
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}

