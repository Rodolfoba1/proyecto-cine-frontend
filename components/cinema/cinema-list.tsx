"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCinemas } from "@/lib/cinema"
import type { Cinema } from "@/types/cinema"

export default function CinemaList() {
  const router = useRouter()
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadCinemas() {
      try {
        const data = await getCinemas()
        setCinemas(data)
      } catch (error) {
        console.error("Error loading cinemas:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCinemas()
  }, [])

  const handleReservation = (cinemaId: string) => {
    router.push(`/dashboard/reservation/${cinemaId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-400">Cargando salas de cine...</p>
      </div>
    )
  }

  if (cinemas.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-400">No hay salas de cine disponibles.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cinemas.map((cinema) => (
        <Card
          key={cinema.id}
          className="bg-slate-800 border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="aspect-video relative overflow-hidden">
            <img
              src={cinema.movie.posterUrl || "/placeholder.svg"}
              alt={cinema.movie.title}
                width={400}
                height={600}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle className="text-xl text-white">{cinema.movie.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-slate-300">
              <p>
                <span className="font-semibold">Sala:</span> {cinema.name}
              </p>
              <p>
                <span className="font-semibold">Asientos disponibles:</span> {cinema.availableSeats} de{" "}
                {cinema.totalSeats}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => handleReservation(cinema.id)}>
              Reservar asientos
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

