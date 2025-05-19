import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getReservationById } from "@/lib/reservation"
import { getCinemaById } from "@/lib/cinema"
import DashboardLayout from "@/components/layouts/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import QRCode from "@/components/reservation/qr-code"

type Params = { id: string };

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  try {
    const session = await getSession()
    
    if (!session) {
      redirect("/")
    }

    const reservation = await getReservationById(id)
    
    if (!reservation) {
      redirect("/dashboard/my-reservations")
    }

    // Convert both to strings for comparison
    if (String(reservation.userId) !== String(session.id)) {
      redirect("/dashboard/my-reservations")
    }

    const cinema = await getCinemaById(reservation.cinemaId)

    if (!cinema) {
      redirect("/dashboard/my-reservations")
    }

    // Generar datos para el código QR
    const qrData = JSON.stringify({
      reservationId: reservation.id,
      cinemaId: reservation.cinemaId,
      date: reservation.date,
      seats: reservation.seats.map((s) => `${String.fromCharCode(65 + s.row)}${s.column + 1}`),
    })

    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="mb-4">
            <Button asChild variant="outline" className="border-slate-700 text-slate-300">
              <Link href="/dashboard/my-reservations">← Volver a mis reservaciones</Link>
            </Button>
          </div>

          <h1 className="text-2xl font-bold mb-6">Detalles de la Reservación</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>{cinema.movie.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 text-slate-300">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Información de la sala</h3>
                      <p>
                        <span className="font-semibold">Sala:</span> {cinema.name}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Detalles de la reservación</h3>
                      <p>
                        <span className="font-semibold">Fecha de la función:</span>{" "}
                        {format(parseISO(reservation.date), "PPP", { locale: es })}
                      </p>
                      <p>
                        <span className="font-semibold">Asientos:</span>{" "}
                        {reservation.seats
                          .map((seat) => `${String.fromCharCode(65 + seat.row)}${seat.column + 1}`)
                          .join(", ")}
                      </p>
                      <p>
                        <span className="font-semibold">Total pagado:</span> ${reservation.seats.length * 50}.00
                      </p>
                      <p>
                        <span className="font-semibold">Reservado el:</span>{" "}
                        {format(parseISO(reservation.createdAt), "PPP", { locale: es })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle>Código QR</CardTitle>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center">
                  <QRCode data={qrData} />
                  <p className="text-sm text-slate-400 text-center mt-4">
                    Presenta este código QR en la entrada del cine para acceder a tu función.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  } catch (error) {
    console.error("Error in ReservationDetailsPage:", error);
    redirect("/dashboard/my-reservations")
  }
}