import axios from 'axios'
import { getApiUrl } from '@/config/env'
import { authService } from './authService'
import type {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
  ApiResponse,
  PaginatedResponse
} from '@/types'

class ReservationService {
  private readonly apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = getApiUrl()
  }
  async getAllReservations(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Reservation>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search })
      })

      const response = await axios.get(`${this.apiBaseUrl}/reservations?${params}`)
      // Check if the response is wrapped in a data property like other endpoints
      return response.data.data || response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations')
    }
  }

  async getReservationById(id: number): Promise<Reservation> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/reservations/${id}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservation')
    }
  }

  async createReservation(reservation: CreateReservationRequest): Promise<Reservation> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/reservations`,
        reservation,
        { headers: authService.getAuthHeader() }
      )
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create reservation')
    }
  }

  async updateReservation(id: number, reservation: UpdateReservationRequest): Promise<Reservation> {
    try {
      const response = await axios.put(
        `${this.apiBaseUrl}/reservations/${id}`,
        reservation,
        { headers: authService.getAuthHeader() }
      )
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update reservation')
    }
  }

  async deleteReservation(id: number): Promise<void> {
    try {
      await axios.delete(
        `${this.apiBaseUrl}/reservations/${id}`,
        { headers: authService.getAuthHeader() }
      )
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete reservation')
    }
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/reservations/by-date/${date}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations by date')
    }
  }

  async getUpcomingReservations(): Promise<Reservation[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/reservations/upcoming`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming reservations')
    }
  }
}

export const reservationService = new ReservationService()