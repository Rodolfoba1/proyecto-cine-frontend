"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import type { Cinema } from "@/types/cinema"
import { createCinema, updateCinema } from "@/lib/cinema"
import { toast } from "sonner"

interface CinemaFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (cinema: Cinema) => void
  cinema?: Cinema
}

const cinemaSchema = z.object({
  name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  movieTitle: z.string().min(3, { message: "El título debe tener al menos 3 caracteres" }),
  moviePosterUrl: z.string().url({ message: "Debe ser una URL válida" }).optional().or(z.literal("")),
  movieDescription: z.string().min(10, { message: "La descripción debe tener al menos 10 caracteres" }),
  rows: z.coerce
    .number()
    .int()
    .min(1, { message: "Debe tener al menos 1 fila" })
    .max(20, { message: "No puede exceder 20 filas" }),
  columns: z.coerce
    .number()
    .int()
    .min(1, { message: "Debe tener al menos 1 columna" })
    .max(20, { message: "No puede exceder 20 columnas" }),
})

type CinemaFormValues = z.infer<typeof cinemaSchema>

export default function CinemaForm({ isOpen, onClose, onSuccess, cinema }: CinemaFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!cinema

  const form = useForm<CinemaFormValues>({
    resolver: zodResolver(cinemaSchema),
    defaultValues: {
      name: cinema?.name || "",
      movieTitle: cinema?.movie.title || "",
      moviePosterUrl: cinema?.movie.posterUrl || "",
      movieDescription: cinema?.movie.description || "",
      rows: cinema?.rows || 8,
      columns: cinema?.columns || 10,
    },
  })

  const onSubmit = async (data: CinemaFormValues) => {
    setIsSubmitting(true)
    try {
      if (isEditing && cinema) {
        // Actualizar sala existente
        const updatedCinema = await updateCinema(cinema.id, {
          name: data.name,
          movie: {
            title: data.movieTitle,
            posterUrl: data.moviePosterUrl || "/placeholder.svg",
            description: data.movieDescription,
          },
          rows: data.rows,
          columns: data.columns,
        })
        onSuccess(updatedCinema)
        toast.success("Actualizado exitosamente.")
      } else {
        // Crear nueva sala
        const newCinema = await createCinema({
          name: data.name,
          movie: {
            title: data.movieTitle,
            posterUrl: data.moviePosterUrl || "/placeholder.svg",
            description: data.movieDescription,
          },
          rows: data.rows,
          columns: data.columns,
        })
        onSuccess(newCinema)
        toast.success("Creado exitosamente.")
      }
    } catch (error) {
      console.error("Error saving cinema:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Sala de Cine" : "Crear Nueva Sala de Cine"}</DialogTitle>
          <DialogDescription className="text-slate-400">
            {isEditing
              ? "Modifica los datos de la sala de cine"
              : "Completa el formulario para crear una nueva sala de cine"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Sala</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sala Premium 1"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="movieTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la Película</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Avengers: Endgame"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="moviePosterUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Póster (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://ejemplo.com/poster.jpg"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="movieDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de la Película</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Breve descripción de la película..."
                      className="bg-slate-700 border-slate-600 text-white resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rows"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Filas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        className="bg-slate-700 border-slate-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="columns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Columnas</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={20}
                        className="bg-slate-700 border-slate-600 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-slate-600 text-slate-300"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Crear sala"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

