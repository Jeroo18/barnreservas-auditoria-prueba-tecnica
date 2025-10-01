export interface User {
  Id: string
  UserName: string
  Email: string
  Token: string
}

export interface LoginCredentials {
  Username: string
  Password: string
}

export interface AuthResponse {
  Id: string
  UserName: string
  Email: string
  Token: string
}

export interface Reservation {
  id: number
  customerName: string
  customerEmail: string
  customerPhone: string
  reservationDate: string
  reservationTime: string
  numberOfGuests: number
  status: ReservationStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateReservationRequest {
  customerName: string
  customerEmail: string
  customerPhone: string
  reservationDate: string
  reservationTime: string
  numberOfGuests: number
  notes?: string
}

export interface UpdateReservationRequest extends CreateReservationRequest {
  status: ReservationStatus
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}