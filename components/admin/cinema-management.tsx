"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2 } from "lucide-react"
import type { Cinema } from "@/types/cinema"
import CinemaForm from "@/components/admin/cinema-form"
import DeleteCinemaDialog from "@/components/admin/delete-cinema-dialog"
import { deleteCinema } from "@/lib/cinema"

interface CinemaManagementProps {
  initialCinemas: Cinema[]
}

export default function CinemaManagement({ initialCinemas }: CinemaManagementProps) {
  const router = useRouter()
  const [cinemas, setCinemas] = useState<Cinema[]>(initialCinemas)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingCinema, setEditingCinema] = useState<Cinema | null>(null)
  const [deletingCinema, setDeletingCinema] = useState<Cinema | null>(null)

  const handleCreateSuccess = (newCinema: Cinema) => {
    setCinemas([...cinemas, newCinema])
    setIsCreateModalOpen(false)
  }

  const handleEditSuccess = (updatedCinema: Cinema) => {
    setCinemas(cinemas.map((cinema) => (cinema.id === updatedCinema.id ? updatedCinema : cinema)))
    setEditingCinema(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCinema) return

    try {
      await deleteCinema(deletingCinema.id)
      setCinemas(cinemas.filter((cinema) => cinema.id !== deletingCinema.id))
      setDeletingCinema(null)
      router.refresh()
    } catch (error) {
      console.error("Error deleting cinema:", error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Salas de Cine</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={16} />
          Nueva Sala
        </Button>
      </div>

      {cinemas.length === 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">No hay salas de cine registradas.</p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                Crear primera sala
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cinemas.map((cinema) => (
            <Card key={cinema.id} className="bg-slate-800 border-slate-700 overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={cinema.movie.posterUrl || "/placeholder.svg"}
                  alt={cinema.movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{cinema.movie.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-slate-300 mb-4">
                  <p>
                    <span className="font-semibold">Sala:</span> {cinema.name}
                  </p>
                  <p>
                    <span className="font-semibold">Capacidad:</span> {cinema.totalSeats} asientos ({cinema.rows} filas
                    x {cinema.columns} columnas)
                  </p>
                  <p>
                    <span className="font-semibold">Asientos disponibles:</span> {cinema.availableSeats}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-slate-600 hover:bg-sky-500"
                    onClick={() => setEditingCinema(cinema)}
                  >
                    <Edit size={16} className="mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-red-800 text-red-500 hover:bg-red-500"
                    onClick={() => setDeletingCinema(cinema)}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal para crear sala */}
      <CinemaForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Modal para editar sala */}
      {editingCinema && (
        <CinemaForm
          isOpen={!!editingCinema}
          onClose={() => setEditingCinema(null)}
          onSuccess={handleEditSuccess}
          cinema={editingCinema}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      {deletingCinema && (
        <DeleteCinemaDialog
          isOpen={!!deletingCinema}
          onClose={() => setDeletingCinema(null)}
          onConfirm={handleDeleteConfirm}
          cinema={deletingCinema}
        />
      )}
    </div>
  )
}

