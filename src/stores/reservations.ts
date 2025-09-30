import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { reservationService } from '@/services/reservationService'
import type {
  Reservation,
  CreateReservationRequest,
  UpdateReservationRequest,
  PaginatedResponse,
  ReservationStatus
} from '@/types'

export const useReservationsStore = defineStore('reservations', () => {
  const reservations = ref<Reservation[]>([])
  const currentReservation = ref<Reservation | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  })

  const searchQuery = ref('')
  const statusFilter = ref<ReservationStatus | ''>('')

  const filteredReservations = computed(() => {
    let filtered = reservations.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(query) ||
        reservation.customerEmail.toLowerCase().includes(query) ||
        reservation.customerPhone.includes(query)
      )
    }

    if (statusFilter.value) {
      filtered = filtered.filter(reservation => reservation.status === statusFilter.value)
    }

    return filtered
  })

  const fetchReservations = async (page = 1, pageSize = 10, search = '') => {
    try {
      isLoading.value = true
      error.value = null

      const response: PaginatedResponse<Reservation> = await reservationService.getAllReservations(page, pageSize, search)

      reservations.value = response.data
      pagination.value = {
        total: response.total,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchReservationById = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null

      const reservation = await reservationService.getReservationById(id)
      currentReservation.value = reservation
      return reservation
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const createReservation = async (reservation: CreateReservationRequest) => {
    try {
      isLoading.value = true
      error.value = null

      const newReservation = await reservationService.createReservation(reservation)
      reservations.value.unshift(newReservation)
      return newReservation
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const updateReservation = async (id: number, reservation: UpdateReservationRequest) => {
    try {
      isLoading.value = true
      error.value = null

      const updatedReservation = await reservationService.updateReservation(id, reservation)

      const index = reservations.value.findIndex(r => r.id === id)
      if (index !== -1) {
        reservations.value[index] = updatedReservation
      }

      if (currentReservation.value?.id === id) {
        currentReservation.value = updatedReservation
      }

      return updatedReservation
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const deleteReservation = async (id: number) => {
    try {
      isLoading.value = true
      error.value = null

      await reservationService.deleteReservation(id)

      reservations.value = reservations.value.filter(r => r.id !== id)

      if (currentReservation.value?.id === id) {
        currentReservation.value = null
      }
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setStatusFilter = (status: ReservationStatus | '') => {
    statusFilter.value = status
  }

  const clearError = () => {
    error.value = null
  }

  const clearCurrentReservation = () => {
    currentReservation.value = null
  }

  return {
    reservations,
    currentReservation,
    isLoading,
    error,
    pagination,
    searchQuery,
    statusFilter,
    filteredReservations,
    fetchReservations,
    fetchReservationById,
    createReservation,
    updateReservation,
    deleteReservation,
    setSearchQuery,
    setStatusFilter,
    clearError,
    clearCurrentReservation
  }
})