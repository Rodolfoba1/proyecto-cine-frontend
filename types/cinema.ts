export interface Movie {
    title: string
    posterUrl: string
    description: string
  }
  
  export interface Cinema {
    id: string
    name: string
    movie: Movie
    rows: number
    columns: number
    totalSeats: number
    availableSeats: number
  }
  
  export interface Seat {
    id: string
    row: number
    column: number
    status: "available" | "reserved" | "selected"
  }
  
  export interface Reservation {
    id: string
    cinemaId: string
    userId: string
    seats: Seat[]
    date: string
    createdAt: string
  }
  
  