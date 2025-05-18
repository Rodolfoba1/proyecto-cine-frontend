"use server"

import { cookies } from "next/headers"
import type { Seat, Reservation } from "@/types/cinema"

// URL base de la API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Función auxiliar para obtener el token
async function getAuthHeader() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value
  return token ? { Authorization: `Bearer ${token}` } : undefined
}

export async function getSeatsForDate(cinemaId: string, date: string): Promise<Seat[]> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/reservations/seats/${cinemaId}/${date}`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch seats")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching seats for cinema ${cinemaId} on ${date}:`, error)
    return []
  }
}

export async function createReservation({
  cinemaId,
  // userId,
  seats,
  date,
  paymentDetails,
}: {
  cinemaId: string
  userId: string
  seats: Seat[]
  date: string
  paymentDetails: any
}): Promise<{ id: string; qrCode: string }> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/reservations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify({
        cinemaId,
        seats,
        date,
        paymentDetails,
      }),
      cache: 'no-store'
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to create reservation")
    }

    const data = await response.json()
    return {
      id: data.data.id,
      qrCode: data.data.qrCode,
    }
  } catch (error) {
    console.error("Error creating reservation:", error)
    throw error
  }
}

export async function getReservationById(id: string): Promise<Reservation | null> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/reservations/${id}`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching reservation ${id}:`, error)
    return null
  }
}

export async function getUserReservations(userId: string): Promise<Reservation[]> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/reservations/user`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user reservations")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error(`Error fetching reservations for user ${userId}:`, error)
    return []
  }
}

export async function getAllReservations(): Promise<Reservation[]> {
  try {
    const headers = await getAuthHeader()
    const response = await fetch(`${API_URL}/reservations`, {
      headers,
      cache: 'no-store'
    })

    if (!response.ok) {
      throw new Error("Failed to fetch all reservations")
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching all reservations:", error)
    return []
  }
}