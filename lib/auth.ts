"use server"

import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "client"
}

type LoginData = {
  email: string
  password: string
}

type RegisterData = {
  name: string
  email: string
  password: string
}

// Clave secreta para verificar tokens (debe coincidir con la del backend)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

// URL base de la API
const API_URL = process.env.API_URL || 'http://localhost:3001/api'

export async function login({ email, password }: LoginData) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Invalid credentials")
    }

    const data = await response.json()

    // Guardar el token en cookies
    const cookieStore = await cookies()
    await cookieStore.set("auth-token", data.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 día
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    throw new Error("Invalid credentials")
  }
}

export async function register({ name, email, password }: RegisterData) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Error registering user")
    }

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    // Verificar el token localmente
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as User
  } catch (error) {
    console.error("Session verification error:", error)
    return null
  }
}