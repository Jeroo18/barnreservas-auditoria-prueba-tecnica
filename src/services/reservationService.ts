import axios from 'axios'
import { getApiUrl } from '@/config/env'
import { authService } from './authService'
import type {
  Reservation,
  ReservationApiResponse,
  CreateReservationRequest,
  UpdateReservationRequest,
  ApiResponse,
  PaginatedResponse,
  ReservationStatus
} from '@/types'

class ReservationService {
  private readonly apiBaseUrl: string

  constructor() {
    this.apiBaseUrl = getApiUrl()
    console.log('ReservationService initialized with API URL:', this.apiBaseUrl)
  }

  // Transform API response to frontend format
  private transformReservation(apiReservation: ReservationApiResponse): Reservation {
    return {
      id: apiReservation.Id,
      customerName: apiReservation.CustomerName,
      customerEmail: apiReservation.CustomerEmail,
      customerPhone: apiReservation.CustomerPhone,
      reservationDate: apiReservation.ReservationDate,
      reservationTime: apiReservation.ReservationTime,
      numberOfGuests: apiReservation.NumberOfGuests,
      status: apiReservation.Status as ReservationStatus,
      notes: apiReservation.SpecialRequests,
      createdAt: apiReservation.CreatedDate,
      updatedAt: apiReservation.CreatedDate // Using CreatedDate as fallback
    }
  }

  // Transform array of API responses
  private transformReservations(apiReservations: ReservationApiResponse[]): Reservation[] {
    return apiReservations.map(reservation => this.transformReservation(reservation))
  }

  // Diagnostic method to test API connectivity and endpoint availability
  async testApiEndpoints(): Promise<void> {
    const endpointsToTest = [
      '/Reservations',
      '/reservations',
      '/api/Reservations',
      '/api/reservations'
    ]

    console.log('Testing API endpoints for connectivity...')

    for (const endpoint of endpointsToTest) {
      try {
        const testUrl = `${this.apiBaseUrl.replace('/api', '')}${endpoint}`
        console.log(`Testing: ${testUrl}`)

        const response = await axios.get(testUrl, {
          headers: authService.getAuthHeader(),
          timeout: 5000
        })

        console.log(`✓ ${endpoint} - Status: ${response.status}`)
      } catch (error: any) {
        console.log(`✗ ${endpoint} - Error: ${error.response?.status || error.message}`)
      }
    }
  }
  async getAllReservations(page = 1, pageSize = 10, search = ''): Promise<PaginatedResponse<Reservation>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        ...(search && { search })
      })

      const response = await axios.get(`${this.apiBaseUrl}/Reservations?${params}`, {
        headers: authService.getAuthHeader()
      })

      // Debug the response
      console.log('Reservations API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      })

      // Handle different response formats and transform data
      if (Array.isArray(response.data)) {
        // Direct array response
        const transformedData = this.transformReservations(response.data as ReservationApiResponse[])
        return {
          data: transformedData,
          total: transformedData.length,
          page: page,
          pageSize: pageSize,
          totalPages: Math.ceil(transformedData.length / pageSize)
        }
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Wrapped response with data array
        const transformedData = this.transformReservations(response.data.data as ReservationApiResponse[])
        return {
          ...response.data,
          data: transformedData
        }
      } else {
        // Assume response.data is the paginated response with data array
        const transformedData = response.data.data ?
          this.transformReservations(response.data.data as ReservationApiResponse[]) : []
        return {
          ...response.data,
          data: transformedData
        }
      }
    } catch (error: any) {
      console.error('Failed to fetch reservations. Full error details:', {
        url: `${this.apiBaseUrl}/Reservations`,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestHeaders: error.config?.headers,
        message: error.message
      })

      // If it's a 404, suggest testing endpoints
      if (error.response?.status === 404) {
        console.warn('404 Error detected. Running endpoint diagnostics...')
        try {
          await this.testApiEndpoints()
        } catch (diagError) {
          console.error('Diagnostic test failed:', diagError)
        }
      }

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.title ||
                          error.response?.statusText ||
                          error.message ||
                          'Failed to fetch reservations'

      throw new Error(`${errorMessage} (Status: ${error.response?.status || 'Unknown'})`)
    }
  }

  async getReservationById(id: number): Promise<Reservation> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/Reservations/${id}`, {
        headers: authService.getAuthHeader()
      })
      console.log('Get Reservation By ID Response:', response.data)
      const apiReservation = response.data.data || response.data
      return this.transformReservation(apiReservation as ReservationApiResponse)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservation')
    }
  }

  async createReservation(reservation: CreateReservationRequest): Promise<Reservation> {
    try {
      const response = await axios.post(
        `${this.apiBaseUrl}/Reservations`,
        reservation,
        { headers: authService.getAuthHeader() }
      )
      console.log('Create Reservation Response:', response.data)
      const apiReservation = response.data.data || response.data
      return this.transformReservation(apiReservation as ReservationApiResponse)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create reservation')
    }
  }

  async updateReservation(id: number, reservation: UpdateReservationRequest): Promise<Reservation> {
    try {
      const response = await axios.put(
        `${this.apiBaseUrl}/Reservations/${id}`,
        reservation,
        { headers: authService.getAuthHeader() }
      )
      console.log('Update Reservation Response:', response.data)
      const apiReservation = response.data.data || response.data
      return this.transformReservation(apiReservation as ReservationApiResponse)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update reservation')
    }
  }

  async deleteReservation(id: number): Promise<void> {
    try {
      await axios.delete(
        `${this.apiBaseUrl}/Reservations/${id}`,
        { headers: authService.getAuthHeader() }
      )
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete reservation')
    }
  }

  async getReservationsByDate(date: string): Promise<Reservation[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/Reservations/by-date/${date}`, {
        headers: authService.getAuthHeader()
      })
      console.log('Get Reservations By Date Response:', response.data)
      const apiReservations = response.data.data || response.data
      return this.transformReservations(apiReservations as ReservationApiResponse[])
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reservations by date')
    }
  }

  async getUpcomingReservations(): Promise<Reservation[]> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/Reservations/upcoming`, {
        headers: authService.getAuthHeader()
      })
      console.log('Get Upcoming Reservations Response:', response.data)
      const apiReservations = response.data.data || response.data
      return this.transformReservations(apiReservations as ReservationApiResponse[])
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming reservations')
    }
  }
}

export const reservationService = new ReservationService()