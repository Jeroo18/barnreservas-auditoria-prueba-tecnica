import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import { createPinia } from 'pinia'
import ReservationModal from '../ReservationModal.vue'
import type { Reservation } from '@/types'

// Mock Bootstrap Modal
const mockBootstrapModal = {
  show: vi.fn(),
  hide: vi.fn()
}

vi.mock('bootstrap', () => ({
  Modal: vi.fn(() => mockBootstrapModal)
}))

// Mock the reservations store
const mockReservationsStore = {
  createReservation: vi.fn(),
  updateReservation: vi.fn()
}

vi.mock('@/stores/reservations', () => ({
  useReservationsStore: () => mockReservationsStore
}))

describe('ReservationModal', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(ReservationModal, {
      global: {
        plugins: [createPinia()]
      }
    })
  })

  describe('Component Mounting', () => {
    it('should render modal structure correctly', () => {
      expect(wrapper.find('.modal').exists()).toBe(true)
      expect(wrapper.find('.modal-header').exists()).toBe(true)
      expect(wrapper.find('.modal-body').exists()).toBe(true)
      expect(wrapper.find('.modal-footer').exists()).toBe(true)
    })

    it('should have correct form fields', () => {
      expect(wrapper.find('#customerName').exists()).toBe(true)
      expect(wrapper.find('#customerEmail').exists()).toBe(true)
      expect(wrapper.find('#customerPhone').exists()).toBe(true)
      expect(wrapper.find('#reservationDate').exists()).toBe(true)
      expect(wrapper.find('#reservationTime').exists()).toBe(true)
      expect(wrapper.find('#numberOfGuests').exists()).toBe(true)
      expect(wrapper.find('#notes').exists()).toBe(true)
    })
  })

  describe('Form Validation', () => {
    it('should validate required fields', async () => {
      // Form should be invalid when empty
      expect(wrapper.vm.isFormValid).toBe(false)

      // Check individual validation
      const isValid = wrapper.vm.validateForm()
      expect(isValid).toBe(false)
    })

    it('should validate email format', async () => {
      await wrapper.find('#customerEmail').setValue('invalid-email')
      await wrapper.vm.validateForm()

      expect(wrapper.vm.errors.customerEmail).toBeTruthy()
    })

    it('should validate phone number', async () => {
      await wrapper.find('#customerPhone').setValue('123')
      await wrapper.vm.validateForm()

      expect(wrapper.vm.errors.customerPhone).toBeTruthy()
    })

    it('should validate customer name length', async () => {
      await wrapper.find('#customerName').setValue('J')
      await wrapper.vm.validateForm()

      expect(wrapper.vm.errors.customerName).toBeTruthy()
    })

    it('should validate guest count', async () => {
      await wrapper.find('#numberOfGuests').setValue(0)
      await wrapper.vm.validateForm()

      expect(wrapper.vm.errors.numberOfGuests).toBeTruthy()
    })
  })

  describe('Form States', () => {
    it('should show create mode by default', () => {
      expect(wrapper.vm.isEditing).toBe(false)
      expect(wrapper.find('.modal-title').text()).toContain('Crear Nueva Reserva')
    })

    it('should show edit mode when editing', async () => {
      const mockReservation: Reservation = {
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567890',
        reservationDate: '2024-01-15',
        reservationTime: '19:00',
        numberOfGuests: 4,
        status: 'PENDING' as any,
        notes: 'Test reservation',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      wrapper.vm.openEditModal(mockReservation)
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.isEditing).toBe(true)
      expect(wrapper.find('.modal-title').text()).toContain('Editar Reserva')
      expect(wrapper.vm.form.customerName).toBe('John Doe')
    })
  })

  describe('Form Submission', () => {
    beforeEach(async () => {
      // Fill out valid form data
      await wrapper.find('#customerName').setValue('John Doe')
      await wrapper.find('#customerEmail').setValue('john@example.com')
      await wrapper.find('#customerPhone').setValue('1234567890')
      await wrapper.find('#reservationDate').setValue('2024-12-31')
      await wrapper.find('#reservationTime').setValue('19:00')
      await wrapper.find('#numberOfGuests').setValue(4)
      await wrapper.find('#notes').setValue('Test reservation')
    })

    it('should submit create form successfully', async () => {
      mockReservationsStore.createReservation.mockResolvedValue({
        id: 1,
        customerName: 'John Doe'
      })

      await wrapper.vm.handleSubmit()

      expect(mockReservationsStore.createReservation).toHaveBeenCalledWith(
        expect.objectContaining({
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '1234567890',
          reservationDate: '2024-12-31',
          reservationTime: '19:00',
          numberOfGuests: 4,
          notes: 'Test reservation'
        })
      )
    })

    it('should submit update form successfully', async () => {
      const mockReservation: Reservation = {
        id: 1,
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        customerPhone: '1234567890',
        reservationDate: '2024-01-15',
        reservationTime: '19:00',
        numberOfGuests: 4,
        status: 'PENDING' as any,
        notes: '',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      wrapper.vm.openEditModal(mockReservation)
      await wrapper.vm.$nextTick()

      mockReservationsStore.updateReservation.mockResolvedValue(mockReservation)

      await wrapper.vm.handleSubmit()

      expect(mockReservationsStore.updateReservation).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          customerName: 'John Doe',
          status: 'PENDING'
        })
      )
    })

    it('should handle submission errors', async () => {
      mockReservationsStore.createReservation.mockRejectedValue(
        new Error('Server error')
      )

      await wrapper.vm.handleSubmit()

      expect(wrapper.vm.submitError).toBe('Server error')
    })
  })

  describe('Form Reset', () => {
    it('should reset form when opening create modal', () => {
      // Set some form data first
      wrapper.vm.form.customerName = 'John Doe'
      wrapper.vm.errors.customerName = 'Some error'

      wrapper.vm.openCreateModal()

      expect(wrapper.vm.form.customerName).toBe('')
      expect(wrapper.vm.errors.customerName).toBe('')
      expect(wrapper.vm.isEditing).toBe(false)
    })

    it('should populate form when opening edit modal', () => {
      const mockReservation: Reservation = {
        id: 1,
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        customerPhone: '0987654321',
        reservationDate: '2024-02-15',
        reservationTime: '20:00',
        numberOfGuests: 6,
        status: 'CONFIRMED' as any,
        notes: 'Birthday celebration',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }

      wrapper.vm.openEditModal(mockReservation)

      expect(wrapper.vm.form.customerName).toBe('Jane Doe')
      expect(wrapper.vm.form.customerEmail).toBe('jane@example.com')
      expect(wrapper.vm.form.status).toBe('CONFIRMED')
      expect(wrapper.vm.isEditing).toBe(true)
    })
  })
})