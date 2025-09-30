import axios from 'axios'
import { authService } from './authService'
import type {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
  ApiResponse,
  PaginatedResponse
} from '@/types'

const API_BASE_URL = 'http://localhost:5000/api'

class ReservationService {
  async getAllReservations(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Reservation>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search })
      })

      const response = await axios.get(`${API_BASE_URL}/reservations?${params}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations')
    }
  }

  async getReservationById(id: number): Promise<Reservation> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/${id}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservation')
    }
  }

  async createReservation(reservation: CreateReservationRequest): Promise<Reservation> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/reservations`,
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
        `${API_BASE_URL}/reservations/${id}`,
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
        `${API_BASE_URL}/reservations/${id}`,
        { headers: authService.getAuthHeader() }
      )
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete reservation')
    }
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/by-date/${date}`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations by date')
    }
  }

  async getUpcomingReservations(): Promise<Reservation[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/reservations/upcoming`)
      return response.data.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming reservations')
    }
  }
}

export const reservationService = new ReservationService()