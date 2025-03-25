"use server"

import { cookies } from "next/headers"
import type { Cinema } from "@/types/cinema"

// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Función auxiliar para obtener el token
async function getAuthHeader() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

export async function getCinemas(): Promise<Cinema[]> {
  try {
    const headers = await getAuthHeader() as Record<string, string>
    const response = await fetch(`${API_URL}/cinemas`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch cinemas")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching cinemas:", error)
    return []
  }
}

export async function getCinemaById(id: string): Promise<Cinema | null> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/cinemas/${id}`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching cinema ${id}:`, error)
    return null
  }
}

export async function createCinema(cinemaData: {
  name: string
  movie: {
    title: string
    posterUrl: string
    description: string
  }
  rows: number
  columns: number
}): Promise<Cinema> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/cinemas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(cinemaData),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create cinema")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error creating cinema:", error)
    throw error
  }
}

export async function updateCinema(
  id: string,
  cinemaData: {
    name: string
    movie: {
      title: string
      posterUrl: string
      description: string
    }
    rows?: number
    columns?: number
  },
): Promise<Cinema> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/cinemas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(cinemaData),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update cinema")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error updating cinema ${id}:`, error)
    throw error
  }
}

export async function deleteCinema(id: string): Promise<void> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/cinemas/${id}`, {
      method: 'DELETE',
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete cinema")
    }
  } catch (error) {
    console.error(`Error deleting cinema ${id}:`, error)
    throw error
  }
}