"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { User } from "@/types/user"

interface DisableUserDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  user: User
}

export default function DisableUserDialog({ isOpen, onClose, onConfirm, user }: DisableUserDialogProps) {
  const isDisabling = user.active

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">
            {isDisabling
              ? `Esta acción deshabilitará al usuario "${user.name}" (${user.email}). El usuario no podrá acceder al sistema.`
              : `Esta acción habilitará al usuario "${user.name}" (${user.email}). El usuario podrá acceder nuevamente al sistema.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-slate-600 text-slate-300">Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={
              isDisabling ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }
            onClick={onConfirm}
          >
            {isDisabling ? "Deshabilitar" : "Habilitar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

