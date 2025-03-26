import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import CinemaList from "@/components/cinema/cinema-list"

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  // Redirigir administradores al panel de administración
  if (session.role === "admin") {
    redirect("/admin")
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Salas de Cine Disponibles</h1>
        <CinemaList />
      </div>
    </DashboardLayout>
  )
}

