import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getUsers } from "@/lib/users"
import AdminLayout from "@/components/layouts/admin-layout"
import UserManagement from "@/components/admin/user-management"

export default async function AdminUsersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  if (session.role !== "admin") {
    redirect("/dashboard")
  }

  const users = await getUsers()

  return (
    <AdminLayout>
      <UserManagement initialUsers={users} currentUserId={session.id} />
    </AdminLayout>
  )
}

