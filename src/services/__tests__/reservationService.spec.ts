import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CreateReservationRequest, UpdateReservationRequest } from '@/types'

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

// Mock authService
vi.mock('../authService', () => ({
  authService: {
    getAuthHeader: vi.fn(() => ({ Authorization: 'Bearer test-token' }))
  }
}))

// Import after mocking
const { default: axios } = await import('axios')
const { reservationService } = await import('../reservationService')

describe('ReservationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllReservations', () => {
    it('should fetch reservations with pagination', async () => {
      const mockResponse = {
        data: {
          data: [
            { id: 1, customerName: 'John Doe', customerEmail: 'john@example.com' }
          ],
          total: 1,
          page: 1,
          pageSize: 10,
          totalPages: 1
        }
      }
      vi.mocked(axios).get.mockResolvedValue(mockResponse)

      const result = await reservationService.getAllReservations(1, 10, 'search')

      expect(vi.mocked(axios).get).toHaveBeenCalledWith(
        expect.stringContaining('/reservations?page=1&pageSize=10&search=search')
      )
      expect(result).toEqual(mockResponse.data.data)
    })

    it('should handle API errors', async () => {
      const errorResponse = {
        response: {
          data: { message: 'Server error' }
        }
      }
      vi.mocked(axios).get.mockRejectedValue(errorResponse)

      await expect(reservationService.getAllReservations()).rejects.toThrow('Server error')
    })
  })

  describe('getReservationById', () => {
    it('should fetch single reservation', async () => {
      const mockReservation = {
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com'
      }
      const mockResponse = {
        data: { data: mockReservation }
      }
      vi.mocked(axios).get.mockResolvedValue(mockResponse)

      const result = await reservationService.getReservationById(1)

      expect(vi.mocked(axios).get).toHaveBeenCalledWith(
        expect.stringContaining('/reservations/1')
      )
      expect(result).toEqual(mockReservation)
    })
  })

  describe('createReservation', () => {
    it('should create new reservation', async () => {
      const newReservation: CreateReservationRequest = {
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        customerPhone: '1234567890',
        reservationDate: '2024-01-15',
        reservationTime: '19:00',
        numberOfGuests: 4
      }

      const mockResponse = {
        data: { data: { id: 2, ...newReservation } }
      }
      vi.mocked(axios).post.mockResolvedValue(mockResponse)

      const result = await reservationService.createReservation(newReservation)

      expect(vi.mocked(axios).post).toHaveBeenCalledWith(
        expect.stringContaining('/reservations'),
        newReservation,
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result).toEqual(mockResponse.data.data)
    })
  })

  describe('updateReservation', () => {
    it('should update existing reservation', async () => {
      const updateData: UpdateReservationRequest = {
        customerName: 'Jane Doe Updated',
        customerEmail: 'jane.updated@example.com',
        customerPhone: '1234567890',
        reservationDate: '2024-01-15',
        reservationTime: '19:00',
        numberOfGuests: 4,
        status: 'CONFIRMED' as any
      }

      const mockResponse = {
        data: { data: { id: 1, ...updateData } }
      }
      vi.mocked(axios).put.mockResolvedValue(mockResponse)

      const result = await reservationService.updateReservation(1, updateData)

      expect(vi.mocked(axios).put).toHaveBeenCalledWith(
        expect.stringContaining('/reservations/1'),
        updateData,
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result).toEqual(mockResponse.data.data)
    })
  })

  describe('deleteReservation', () => {
    it('should delete reservation', async () => {
      vi.mocked(axios).delete.mockResolvedValue({})

      await reservationService.deleteReservation(1)

      expect(vi.mocked(axios).delete).toHaveBeenCalledWith(
        expect.stringContaining('/reservations/1'),
        { headers: { Authorization: 'Bearer test-token' } }
      )
    })
  })

  describe('getReservationsByDate', () => {
    it('should fetch reservations by date', async () => {
      const mockReservations = [
        { id: 1, customerName: 'John Doe', reservationDate: '2024-01-15' }
      ]
      const mockResponse = {
        data: { data: mockReservations }
      }
      vi.mocked(axios).get.mockResolvedValue(mockResponse)

      const result = await reservationService.getReservationsByDate('2024-01-15')

      expect(vi.mocked(axios).get).toHaveBeenCalledWith(
        expect.stringContaining('/reservations/by-date/2024-01-15')
      )
      expect(result).toEqual(mockReservations)
    })
  })

  describe('getUpcomingReservations', () => {
    it('should fetch upcoming reservations', async () => {
      const mockReservations = [
        { id: 1, customerName: 'John Doe', reservationDate: '2024-01-20' }
      ]
      const mockResponse = {
        data: { data: mockReservations }
      }
      vi.mocked(axios).get.mockResolvedValue(mockResponse)

      const result = await reservationService.getUpcomingReservations()

      expect(vi.mocked(axios).get).toHaveBeenCalledWith(
        expect.stringContaining('/reservations/upcoming')
      )
      expect(result).toEqual(mockReservations)
    })
  })
})