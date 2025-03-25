import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"
import { getSession } from "@/lib/auth"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">CinemaReserve</h1>
          <p className="mt-2 text-slate-400">Crea tu cuenta para reservar asientos</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

