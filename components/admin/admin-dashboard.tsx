"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Film, Users, Calendar } from "lucide-react"
import { getCinemas } from "@/lib/cinema"
import { getUsers } from "@/lib/users"
import { getAllReservations } from "@/lib/reservation"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCinemas: 0,
    totalUsers: 0,
    totalReservations: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [cinemas, users, reservations] = await Promise.all([getCinemas(), getUsers(), getAllReservations()])

        setStats({
          totalCinemas: cinemas.length,
          totalUsers: users.length,
          totalReservations: reservations.length,
        })
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-slate-400">Cargando estadísticas...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Salas de Cine</CardTitle>
            <Film className="h-5 w-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCinemas}</div>
            <p className="text-sm text-slate-400 mt-1">Salas activas</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Usuarios</CardTitle>
            <Users className="h-5 w-5 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <p className="text-sm text-slate-400 mt-1">Usuarios registrados</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Reservaciones</CardTitle>
            <Calendar className="h-5 w-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReservations}</div>
            <p className="text-sm text-slate-400 mt-1">Reservaciones realizadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Gestión de Salas</CardTitle>
            <CardDescription className="text-slate-400">Administra las salas de cine y sus películas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-300">
                Crea nuevas salas, modifica las existentes o actualiza la información de las películas.
              </p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/cinemas">Administrar Salas</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription className="text-slate-400">Administra los usuarios del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-slate-300">Visualiza la lista de usuarios y gestiona su estado en el sistema.</p>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/admin/users">Administrar Usuarios</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

