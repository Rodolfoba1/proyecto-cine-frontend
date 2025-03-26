import { redirect } from "next/navigation"
import LoginForm from "@/components/auth/login-form"
import { getSession } from "@/lib/auth"

export default async function Home() {
  const session = await getSession()

  if (session) {
    // Redirigir según el rol del usuario
    if (session.role === "admin") {
      redirect("/admin")
    } else {
      redirect("/dashboard")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">CinemaReserve</h1>
          <p className="mt-2 text-slate-400">Reserva tus asientos favoritos en nuestras salas de cine</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

