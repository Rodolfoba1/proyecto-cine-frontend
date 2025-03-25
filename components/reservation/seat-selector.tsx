"use client"

import type { Seat } from "@/types/cinema"
import { cn } from "@/lib/utils"

interface SeatSelectorProps {
  seats: Seat[]
  selectedSeats: Seat[]
  onSeatClick: (seat: Seat) => void
  isLoading: boolean
  rows: number
  columns: number
}

export default function SeatSelector({
  seats,
  selectedSeats,
  onSeatClick,
  isLoading,
  rows,
  columns,
}: SeatSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-400">Cargando asientos...</p>
      </div>
    )
  }

  // Organizar asientos por filas y columnas
  const seatMap: Seat[][] = Array.from({ length: rows }, () =>
    Array.from({ length: columns }, () => ({
      id: "",
      row: 0,
      column: 0,
      status: "available",
    })),
  )

  seats.forEach((seat) => {
    if (seat.row >= 0 && seat.row < rows && seat.column >= 0 && seat.column < columns) {
      seatMap[seat.row][seat.column] = seat
    }
  })

  // Verificar si un asiento está seleccionado
  const isSeatSelected = (seat: Seat) => {
    return selectedSeats.some((s) => s.row === seat.row && s.column === seat.column)
  }

  // Obtener el estado visual del asiento
  const getSeatStatus = (seat: Seat) => {
    if (seat.status === "reserved") return "reserved"
    if (isSeatSelected(seat)) return "selected"
    return "available"
  }

  return (
    <div className="mb-8">
      {/* Pantalla */}
      <div className="relative mb-8">
        <div className="h-6 bg-slate-600/50 rounded-t-full mx-auto w-3/4"></div>
        <p className="text-center text-slate-400 text-sm mt-2">PANTALLA</p>
      </div>

      {/* Asientos */}
      <div className="flex flex-col items-center space-y-2">
        {seatMap.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex space-x-2">
            <div className="w-6 flex items-center justify-center text-slate-400 text-sm">
              {String.fromCharCode(65 + rowIndex)}
            </div>
            {row.map((seat, colIndex) => (
              <button
                key={`seat-${rowIndex}-${colIndex}`}
                className={cn(
                  "w-8 h-8 rounded-t-md flex items-center justify-center text-xs font-medium transition-colors",
                  getSeatStatus(seat) === "available" && "bg-slate-600 hover:bg-slate-500 cursor-pointer",
                  getSeatStatus(seat) === "selected" && "bg-blue-600 hover:bg-blue-500 cursor-pointer",
                  getSeatStatus(seat) === "reserved" && "bg-red-600 cursor-not-allowed",
                )}
                onClick={() => onSeatClick(seat)}
                disabled={seat.status === "reserved"}
                aria-label={`Asiento ${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`}
              >
                {colIndex + 1}
              </button>
            ))}
            <div className="w-6 flex items-center justify-center text-slate-400 text-sm">
              {String.fromCharCode(65 + rowIndex)}
            </div>
          </div>
        ))}
      </div>

      {/* Numeración de columnas */}
      <div className="flex justify-center mt-4 px-8">
        <div className="w-6"></div>
        <div className="flex space-x-2">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={`col-${index}`} className="w-8 text-center text-slate-400 text-xs">
              {index + 1}
            </div>
          ))}
        </div>
        <div className="w-6"></div>
      </div>
    </div>
  )
}

