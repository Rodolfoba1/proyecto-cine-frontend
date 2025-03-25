import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import AdminLayout from "@/components/layouts/admin-layout"
import AdminDashboard from "@/components/admin/admin-dashboard"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  if (session.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  )
}

