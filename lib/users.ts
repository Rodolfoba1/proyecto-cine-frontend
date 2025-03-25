"use server"

import { cookies } from "next/headers"
import type { User } from "@/types/user"

// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Función auxiliar para obtener el token
async function getAuthHeader() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export async function getUsers(): Promise<User[]> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/users`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch users")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error)
    return null
  }
}

export async function toggleUserStatus(id: string): Promise<User> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/users/${id}/toggle-status`, {
      method: 'PATCH',
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to toggle user status")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error toggling status for user ${id}:`, error)
    throw error
  }
}