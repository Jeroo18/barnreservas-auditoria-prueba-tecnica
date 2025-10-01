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
            {
              Id: 1,
              CustomerName: 'John Doe',
              CustomerEmail: 'john@example.com',
              CustomerPhone: '123-456-7890',
              ReservationDate: '2024-01-15',
              ReservationTime: '19:00',
              NumberOfGuests: 2,
              Status: 'Pending',
              SpecialRequests: 'Test notes',
              CreatedDate: '2024-01-01T10:00:00Z'
            }
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
        expect.stringContaining('/Reservations?page=1&pageSize=10&search=search'),
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toEqual({
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '123-456-7890',
        reservationDate: '2024-01-15',
        reservationTime: '19:00',
        numberOfGuests: 2,
        status: 'Pending',
        notes: 'Test notes',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      })
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
      const mockApiReservation = {
        Id: 1,
        CustomerName: 'John Doe',
        CustomerEmail: 'john@example.com',
        CustomerPhone: '123-456-7890',
        ReservationDate: '2024-01-15',
        ReservationTime: '19:00',
        NumberOfGuests: 2,
        Status: 'Pending',
        SpecialRequests: 'Test notes',
        CreatedDate: '2024-01-01T10:00:00Z'
      }
      const mockResponse = {
        data: { data: mockApiReservation }
      }
      vi.mocked(axios).get.mockResolvedValue(mockResponse)

      const result = await reservationService.getReservationById(1)

      expect(vi.mocked(axios).get).toHaveBeenCalledWith(
        expect.stringContaining('/Reservations/1'),
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result).toEqual({
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '123-456-7890',
        reservationDate: '2024-01-15',
        reservationTime: '19:00',
        numberOfGuests: 2,
        status: 'Pending',
        notes: 'Test notes',
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      })
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

      const mockApiResponse = {
        Id: 2,
        CustomerName: newReservation.customerName,
        CustomerEmail: newReservation.customerEmail,
        CustomerPhone: newReservation.customerPhone,
        ReservationDate: newReservation.reservationDate,
        ReservationTime: newReservation.reservationTime,
        NumberOfGuests: newReservation.numberOfGuests,
        Status: 'Pending',
        CreatedDate: '2024-01-01T10:00:00Z'
      }
      const mockResponse = {
        data: { data: mockApiResponse }
      }
      vi.mocked(axios).post.mockResolvedValue(mockResponse)

      const result = await reservationService.createReservation(newReservation)

      expect(vi.mocked(axios).post).toHaveBeenCalledWith(
        expect.stringContaining('/Reservations'),
        newReservation,
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result).toEqual({
        id: 2,
        customerName: newReservation.customerName,
        customerEmail: newReservation.customerEmail,
        customerPhone: newReservation.customerPhone,
        reservationDate: newReservation.reservationDate,
        reservationTime: newReservation.reservationTime,
        numberOfGuests: newReservation.numberOfGuests,
        status: 'Pending',
        notes: undefined,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      })
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

      const mockApiResponse = {
        Id: 1,
        CustomerName: updateData.customerName,
        CustomerEmail: updateData.customerEmail,
        CustomerPhone: updateData.customerPhone,
        ReservationDate: updateData.reservationDate,
        ReservationTime: updateData.reservationTime,
        NumberOfGuests: updateData.numberOfGuests,
        Status: 'Confirmed',
        CreatedDate: '2024-01-01T10:00:00Z'
      }
      const mockResponse = {
        data: { data: mockApiResponse }
      }
      vi.mocked(axios).put.mockResolvedValue(mockResponse)

      const result = await reservationService.updateReservation(1, updateData)

      expect(vi.mocked(axios).put).toHaveBeenCalledWith(
        expect.stringContaining('/Reservations/1'),
        updateData,
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result).toEqual({
        id: 1,
        customerName: updateData.customerName,
        customerEmail: updateData.customerEmail,
        customerPhone: updateData.customerPhone,
        reservationDate: updateData.reservationDate,
        reservationTime: updateData.reservationTime,
        numberOfGuests: updateData.numberOfGuests,
        status: 'Confirmed',
        notes: undefined,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      })
    })
  })

  describe('deleteReservation', () => {
    it('should delete reservation', async () => {
      vi.mocked(axios).delete.mockResolvedValue({})

      await reservationService.deleteReservation(1)

      expect(vi.mocked(axios).delete).toHaveBeenCalledWith(
        expect.stringContaining('/Reservations/1'),
        { headers: { Authorization: 'Bearer test-token' } }
      )
    })
  })

  describe('getReservationsByDate', () => {
    it('should fetch reservations by date', async () => {
      const mockApiReservations = [
        {
          Id: 1,
          CustomerName: 'John Doe',
          CustomerEmail: 'john@example.com',
          CustomerPhone: '123-456-7890',
          ReservationDate: '2024-01-15',
          ReservationTime: '19:00',
          NumberOfGuests: 2,
          Status: 'Pending',
          CreatedDate: '2024-01-01T10:00:00Z'
        }
      ]
      const mockResponse = {
        data: { data: mockApiReservations }
      }
      vi.mocked(axios).get.mockResolvedValue(mockResponse)

      const result = await reservationService.getReservationsByDate('2024-01-15')

      expect(vi.mocked(axios).get).toHaveBeenCalledWith(
        expect.stringContaining('/Reservations/by-date/2024-01-15'),
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result).toEqual([{
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '123-456-7890',
        reservationDate: '2024-01-15',
        reservationTime: '19:00',
        numberOfGuests: 2,
        status: 'Pending',
        notes: undefined,
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-01T10:00:00Z'
      }])
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
        expect.stringContaining('/Reservations/upcoming'),
        { headers: { Authorization: 'Bearer test-token' } }
      )
      expect(result).toEqual(mockReservations)
    })
  })
})