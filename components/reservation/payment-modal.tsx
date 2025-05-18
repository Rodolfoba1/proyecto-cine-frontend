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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CreditCard } from "lucide-react"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (paymentDetails: unknown) => void
  totalAmount: number
  reservationDetails: {
    cinema: string
    movie: string
    date: string
    seats: number
  }
}

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "El número de tarjeta debe tener 16 dígitos" })
    .max(19, { message: "El número de tarjeta no debe exceder 19 caracteres" })
    .regex(/^[0-9\s-]+$/, { message: "Formato de tarjeta inválido" }),
  cardHolder: z.string().min(3, { message: "Ingrese el nombre del titular" }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, { message: "Formato debe ser MM/YY" }),
  cvv: z
    .string()
    .min(3, { message: "El CVV debe tener 3 dígitos" })
    .max(4, { message: "El CVV no debe exceder 4 dígitos" })
    .regex(/^[0-9]+$/, { message: "El CVV debe contener solo números" }),
})

type PaymentFormValues = z.infer<typeof paymentSchema>

export default function PaymentModal({
  isOpen,
  onClose,
  onComplete,
  totalAmount,
  reservationDetails,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const onSubmit = async (data: PaymentFormValues) => {
    setIsProcessing(true)

    // Simulamos un proceso de pago
    setTimeout(() => {
      onComplete({
        ...data,
        amount: totalAmount,
        timestamp: new Date().toISOString(),
      })
      setIsProcessing(false)
      form.reset()
    }, 1500)
  }

  // Formatear número de tarjeta con espacios
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Formatear fecha de expiración
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Pago de reservación
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Complete los datos de su tarjeta para finalizar la reservación
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-700 p-3 rounded-md mb-4">
          <h3 className="font-medium mb-2">Detalles de la reservación:</h3>
          <p className="text-sm text-slate-300">Película: {reservationDetails.movie}</p>
          <p className="text-sm text-slate-300">Sala: {reservationDetails.cinema}</p>
          <p className="text-sm text-slate-300">Fecha: {reservationDetails.date}</p>
          <p className="text-sm text-slate-300">Asientos: {reservationDetails.seats}</p>
          <p className="text-sm font-semibold mt-2">Total a pagar: ${totalAmount}.00</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de tarjeta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...field}
                      onChange={(e) => {
                        field.onChange(formatCardNumber(e.target.value))
                      }}
                      maxLength={19}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titular de la tarjeta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="NOMBRE APELLIDO"
                      className="bg-slate-700 border-slate-600 text-white"
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
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de expiración</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...field}
                        onChange={(e) => {
                          field.onChange(formatExpiryDate(e.target.value))
                        }}
                        maxLength={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="123"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...field}
                        maxLength={4}
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
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isProcessing}>
                {isProcessing ? "Procesando..." : "Pagar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

