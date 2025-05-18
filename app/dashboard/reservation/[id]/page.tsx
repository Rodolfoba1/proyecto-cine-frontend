import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getCinemaById } from "@/lib/cinema"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import ReservationInterface from "@/components/reservation/reservation-interface"
import Image from "next/image"

export default async function ReservationPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const { id } = params // ya no lleva await
  const cinema = await getCinemaById(id)

  if (!cinema) {
    redirect("/dashboard")
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">{cinema.movie.title}</h1>
        <p className="text-slate-400 mb-6">Sala: {cinema.name}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ReservationInterface cinema={cinema} userId={session.id} />
          </div>
          <div className="bg-slate-800 rounded-lg p-4 h-fit">
            <h2 className="text-xl font-semibold mb-4">Información de la película</h2>
            <div className="aspect-[2/3] mb-4 overflow-hidden rounded-md">
              <Image
                src={cinema.movie.posterUrl || "/placeholder.svg"}
                alt={cinema.movie.title}
                width={400}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-slate-300">{cinema.movie.description}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
