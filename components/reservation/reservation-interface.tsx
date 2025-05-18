"use client"

import { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import type { Cinema, Seat } from "@/types/cinema"
import SeatSelector from "@/components/reservation/seat-selector"
import PaymentModal from "@/components/reservation/payment-modal"
import { getSeatsForDate, createReservation } from "@/lib/reservation"

interface ReservationInterfaceProps {
  cinema: Cinema
  userId: string
}

export default function ReservationInterface({ cinema, userId }: ReservationInterfaceProps) {
  const today = new Date()
  const [date, setDate] = useState<Date>(today)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [reservationComplete, setReservationComplete] = useState(false)
  const [reservationId, setReservationId] = useState<string | null>(null)

  // Generar fechas disponibles (próximos 8 días)
  // const availableDates = Array.from({ length: 8 }, (_, i) => addDays(today, i))

  useEffect(() => {
    async function loadSeats() {
      setIsLoading(true)
      try {
        const formattedDate = format(date, "yyyy-MM-dd")
        const seatsData = await getSeatsForDate(cinema.id, formattedDate)
        setSeats(seatsData)
      } catch (error) {
        console.error("Error loading seats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSeats()
  }, [cinema.id, date])

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "reserved") return

    const isSelected = selectedSeats.some((s) => s.row === seat.row && s.column === seat.column)

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter((s) => !(s.row === seat.row && s.column === seat.column)))
    } else {
      setSelectedSeats([...selectedSeats, seat])
    }
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate)
      setSelectedSeats([])
    }
  }

  const handleProceedToPayment = () => {
    if (selectedSeats.length > 0) {
      setIsPaymentModalOpen(true)
    }
  }

const handlePaymentComplete = async (paymentDetails: unknown) => {
    try {
      const formattedDate = format(date, "yyyy-MM-dd")
      const result = await createReservation({
        cinemaId: cinema.id,
        userId,
        seats: selectedSeats,
        date: formattedDate,
        paymentDetails,
      })

      setReservationId(result.id)
      setReservationComplete(true)
      setIsPaymentModalOpen(false)
    } catch (error) {
      console.error("Error creating reservation:", error)
    }
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4  text-white">Selecciona una fecha</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 text-white"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP", { locale: es })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  // Solo permitir fechas en los próximos 8 días
                  return date < today || date > addDays(today, 7)
                }}
                className="bg-slate-800 text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4  text-white">Selecciona tus asientos</h2>
          <SeatSelector
            seats={seats}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            isLoading={isLoading}
            rows={cinema.rows}
            columns={cinema.columns}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-slate-600 rounded-sm mr-2"></div>
                <span className="text-sm text-slate-300">Disponible</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-sm mr-2"></div>
                <span className="text-sm text-slate-300">Seleccionado</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-600 rounded-sm mr-2"></div>
                <span className="text-sm text-slate-300">Reservado</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-300">
                Asientos seleccionados: <span className="font-semibold">{selectedSeats.length}</span>
              </p>
              <p className="text-slate-300">
                Total: <span className="font-semibold">${selectedSeats.length * 50}.00</span>
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              disabled={selectedSeats.length === 0 || reservationComplete}
              onClick={handleProceedToPayment}
            >
              Proceder al pago
            </Button>
          </div>
        </div>

        {reservationComplete && reservationId && (
          <div className="mt-6 p-4 bg-green-900/30 border border-green-700 rounded-md">
            <h3 className="text-lg font-semibold text-green-400 mb-2">¡Reservación completada!</h3>
            <p className="text-slate-300 mb-2">
              Tu reservación ha sido confirmada. Puedes ver los detalles en la sección en &quot;Mis Reservacionese&quot;.
            </p>
            <Button
              variant="outline"
              className="mt-2 border-green-600 text-green-400 hover:bg-green-900/50"
              onClick={() => (window.location.href = `/dashboard/my-reservations/${reservationId}`)}
            >
              Ver detalles de la reservación
            </Button>
          </div>
        )}
      </CardContent>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onComplete={handlePaymentComplete}
        totalAmount={selectedSeats.length * 50}
        reservationDetails={{
          cinema: cinema.name,
          movie: cinema.movie.title,
          date: format(date, "PPP", { locale: es }),
          seats: selectedSeats.length,
        }}
      />
    </Card>
  )
}

