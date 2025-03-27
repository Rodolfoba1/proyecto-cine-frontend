"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { logout, getSession } from "@/lib/auth"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function checkAdmin() {
      const session = await getSession()
      setIsAdmin(session?.role === "admin")

      // Redirigir si un administrador intenta acceder a rutas de cliente
      if (session?.role === "admin" && pathname.startsWith("/dashboard")) {
        router.push("/admin")
      }

      // Redirigir si un cliente intenta acceder a rutas de administrador
      if (session?.role === "client" && pathname.startsWith("/admin")) {
        router.push("/dashboard")
      }
    }
    checkAdmin()
  }, [pathname, router])

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-xl font-bold text-white">
              CineTicket {isAdmin && <span className="text-blue-400">Admin</span>}
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {isAdmin ? (
                // Opciones para administradores
                <>
                  <Link href="/admin" className="text-white hover:text-blue-300">
                    Dashboard
                  </Link>
                  <Link href="/admin/cinemas" className="text-white hover:text-blue-300">
                    Gestión de Salas
                  </Link>
                  <Link href="/admin/users" className="text-white hover:text-blue-300">
                    Gestión de Usuarios
                  </Link>
                </>
              ) : (
                // Opciones para clientes
                <>
                  <Link href="/dashboard" className="text-white hover:text-blue-300">
                    Inicio
                  </Link>
                  <Link href="/dashboard/my-reservations" className="text-white hover:text-blue-300">
                    Mis Reservaciones
                  </Link>
                </>
              )}
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
            <Button variant="ghost" className="text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 pb-4 px-4">
          <div className="flex flex-col space-y-3">
            {isAdmin ? (
              // Opciones para administradores
              <>
                <Link
                  href="/admin"
                  className="text-white hover:text-blue-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/cinemas"
                  className="text-white hover:text-blue-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gestión de Salas
                </Link>
                <Link
                  href="/admin/users"
                  className="text-white hover:text-blue-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gestión de Usuarios
                </Link>
              </>
            ) : (
              // Opciones para clientes
              <>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-blue-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/dashboard/my-reservations"
                  className="text-white hover:text-blue-300 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mis Reservaciones
                </Link>
              </>
            )}
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

