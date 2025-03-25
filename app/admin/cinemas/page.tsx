import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getCinemas } from "@/lib/cinema"
import AdminLayout from "@/components/layouts/admin-layout"
import CinemaManagement from "@/components/admin/cinema-management"

export default async function AdminCinemasPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  if (session.role !== "admin") {
    redirect("/dashboard")
  }

  const cinemas = await getCinemas()

  return (
    <AdminLayout>
      <CinemaManagement initialCinemas={cinemas} />
    </AdminLayout>
  )
}

