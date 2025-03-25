import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getUserReservations } from "@/lib/reservation"
import { getCinemaById } from "@/lib/cinema"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export default async function MyReservationsPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const reservations = await getUserReservations(session.id)

  // Obtener información de las salas para cada reservación
  const reservationsWithCinema = await Promise.all(
    reservations.map(async (reservation) => {
      const cinema = await getCinemaById(reservation.cinemaId)
      return {
        ...reservation,
        cinema,
      }
    }),
  )

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Mis Reservaciones</h1>

        {reservationsWithCinema.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">No tienes reservaciones activas.</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/dashboard">Explorar salas de cine</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reservationsWithCinema.map((reservation) => (
              <Card key={reservation.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {reservation.cinema?.movie.title || "Película no disponible"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-2 text-slate-300">
                    <p>
                      <span className="font-semibold">Sala:</span> {reservation.cinema?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Fecha:</span>{" "}
                      {format(parseISO(reservation.date), "PPP", { locale: es })}
                    </p>
                    <p>
                      <span className="font-semibold">Asientos:</span>{" "}
                      {reservation.seats
                        .map((seat) => `${String.fromCharCode(65 + seat.row)}${seat.column + 1}`)
                        .join(", ")}
                    </p>
                    <p>
                      <span className="font-semibold">Reservado el:</span>{" "}
                      {format(parseISO(reservation.createdAt), "PPP", { locale: es })}
                    </p>
                  </div>
                  <Button asChild className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
                    <Link href={`/dashboard/my-reservations/${reservation.id}`}>Ver detalles</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

