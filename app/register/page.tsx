import { redirect } from "next/navigation"
import RegisterForm from "@/components/auth/register-form"
import { getSession } from "@/lib/auth"
import CinemaLogo from "@/components/ui/cinema-logo"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center">
          <CinemaLogo width={180} height={180} className="mb-2" />
          <p className="mt-2 text-slate-400">Crea tu cuenta para reservar asientos</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

