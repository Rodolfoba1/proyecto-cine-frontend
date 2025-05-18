"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { toast } from "sonner"
import { register } from "@/lib/auth"

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    email: z.string().email({ message: "Ingrese un correo electrónico válido" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      toast.success("Tu cuenta ha sido creada exitosamente. Ahora puedes iniciar sesión.")
      setTimeout(() => router.push("/"), 2000)
    } catch {
      toast.error("Error al crear la cuenta. Inténtalo nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-slate-700 bg-slate-800/50 text-white">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription className="text-slate-400">Ingrese sus datos para crear una nueva cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Rodolfo Chivalan" {...field} className="bg-slate-700 border-slate-600 text-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="rodolfo@gmail.com"
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="******"
                      {...field}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-slate-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/" className="text-blue-400 hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
