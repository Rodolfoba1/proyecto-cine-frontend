"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Film, Users } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Gestión de Salas",
      href: "/admin/cinemas",
      icon: <Film size={20} />,
    },
    {
      name: "Gestión de Usuarios",
      href: "/admin/users",
      icon: <Users size={20} />,
    },
  ]

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-800 border-r border-slate-700 hidden md:block">
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:bg-slate-700 hover:text-white",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}

