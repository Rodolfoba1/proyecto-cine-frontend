"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Ban, CheckCircle, AlertTriangle } from "lucide-react"
import type { User } from "@/types/user"
import { toggleUserStatus } from "@/lib/users"
import DisableUserDialog from "@/components/admin/disable-user-dialog"

interface UserManagementProps {
  initialUsers: User[]
  currentUserId: string
}

export default function UserManagement({ initialUsers, currentUserId }: UserManagementProps) {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [disablingUser, setDisablingUser] = useState<User | null>(null)

  const handleToggleStatus = async (userId: string) => {
    if (userId === currentUserId) {
      alert("No puedes deshabilitar tu propia cuenta")
      return
    }

    try {
      const updatedUser = await toggleUserStatus(userId)
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)))
      setDisablingUser(null)
      router.refresh()
    } catch (error) {
      console.error("Error toggling user status:", error)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestión de Usuarios</h1>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-slate-400">No hay usuarios registrados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">ID</TableHead>
                    <TableHead className="text-slate-300">Nombre</TableHead>
                    <TableHead className="text-slate-300">Email</TableHead>
                    <TableHead className="text-slate-300">Rol</TableHead>
                    <TableHead className="text-slate-300">Estado</TableHead>
                    <TableHead className="text-slate-300">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="border-slate-700">
                      <TableCell className="text-slate-300">{user.id}</TableCell>
                      <TableCell className="text-slate-300">{user.name}</TableCell>
                      <TableCell className="text-slate-300">{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            user.role === "admin" ? "bg-blue-600 hover:bg-blue-700" : "bg-slate-600 hover:bg-slate-700"
                          }
                        >
                          {user.role === "admin" ? "Administrador" : "Cliente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.active ? (
                          <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                            <CheckCircle size={12} />
                            Activo
                          </Badge>
                        ) : (
                          <Badge className="bg-red-600 hover:bg-red-700 flex items-center gap-1">
                            <Ban size={12} />
                            Deshabilitado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.id === currentUserId ? (
                          <Badge className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Usuario actual
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className={
                              user.active
                                ? "border-red-800 text-red-400 hover:bg-red-900/30"
                                : "border-green-800 text-green-400 hover:bg-green-900/30"
                            }
                            onClick={() => setDisablingUser(user)}
                          >
                            {user.active ? "Deshabilitar" : "Habilitar"}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para deshabilitar usuario */}
      {disablingUser && (
        <DisableUserDialog
          isOpen={!!disablingUser}
          onClose={() => setDisablingUser(null)}
          onConfirm={() => handleToggleStatus(disablingUser.id)}
          user={disablingUser}
        />
      )}
    </div>
  )
}

