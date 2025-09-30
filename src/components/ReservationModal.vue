<template>
  <div
    class="modal fade"
    id="reservationModal"
    tabindex="-1"
    aria-labelledby="reservationModalLabel"
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content border-0 shadow">
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title fw-bold" id="reservationModalLabel">
            <i :class="isEditing ? 'bi bi-pencil' : 'bi bi-plus-circle'" class="me-2"></i>
            {{ isEditing ? 'Editar Reserva' : 'Crear Nueva Reserva' }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="row g-3">
              <!-- Customer Information -->
              <div class="col-12">
                <h6 class="text-primary fw-semibold mb-3">
                  <i class="bi bi-person me-2"></i>
                  Información del Cliente
                </h6>
              </div>

              <div class="col-md-6">
                <label for="customerName" class="form-label fw-semibold">
                  <i class="bi bi-person me-1"></i>
                  Nombre Completo *
                </label>
                <input
                  v-model="form.customerName"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.customerName }"
                  id="customerName"
                  placeholder="Ingresa el nombre completo del cliente"
                  required
                >
                <div v-if="errors.customerName" class="invalid-feedback">
                  {{ errors.customerName }}
                </div>
              </div>

              <div class="col-md-6">
                <label for="customerEmail" class="form-label fw-semibold">
                  <i class="bi bi-envelope me-1"></i>
                  Dirección de Email *
                </label>
                <input
                  v-model="form.customerEmail"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.customerEmail }"
                  id="customerEmail"
                  placeholder="Ingresa la dirección de email"
                  required
                >
                <div v-if="errors.customerEmail" class="invalid-feedback">
                  {{ errors.customerEmail }}
                </div>
              </div>

              <div class="col-md-6">
                <label for="customerPhone" class="form-label fw-semibold">
                  <i class="bi bi-telephone me-1"></i>
                  Número de Teléfono *
                </label>
                <input
                  v-model="form.customerPhone"
                  type="tel"
                  class="form-control"
                  :class="{ 'is-invalid': errors.customerPhone }"
                  id="customerPhone"
                  placeholder="Ingresa el número de teléfono"
                  required
                >
                <div v-if="errors.customerPhone" class="invalid-feedback">
                  {{ errors.customerPhone }}
                </div>
              </div>

              <!-- Reservation Details -->
              <div class="col-12 mt-4">
                <h6 class="text-primary fw-semibold mb-3">
                  <i class="bi bi-calendar3 me-2"></i>
                  Detalles de la Reserva
                </h6>
              </div>

              <div class="col-md-6">
                <label for="reservationDate" class="form-label fw-semibold">
                  <i class="bi bi-calendar-date me-1"></i>
                  Fecha *
                </label>
                <input
                  v-model="form.reservationDate"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': errors.reservationDate }"
                  id="reservationDate"
                  :min="minDate"
                  required
                >
                <div v-if="errors.reservationDate" class="invalid-feedback">
                  {{ errors.reservationDate }}
                </div>
              </div>

              <div class="col-md-6">
                <label for="reservationTime" class="form-label fw-semibold">
                  <i class="bi bi-clock me-1"></i>
                  Hora *
                </label>
                <input
                  v-model="form.reservationTime"
                  type="time"
                  class="form-control"
                  :class="{ 'is-invalid': errors.reservationTime }"
                  id="reservationTime"
                  required
                >
                <div v-if="errors.reservationTime" class="invalid-feedback">
                  {{ errors.reservationTime }}
                </div>
              </div>

              <div class="col-md-6">
                <label for="numberOfGuests" class="form-label fw-semibold">
                  <i class="bi bi-people me-1"></i>
                  Número de Huéspedes *
                </label>
                <select
                  v-model.number="form.numberOfGuests"
                  class="form-select"
                  :class="{ 'is-invalid': errors.numberOfGuests }"
                  id="numberOfGuests"
                  required
                >
                  <option value="">Selecciona el número de huéspedes</option>
                  <option v-for="n in 20" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Huésped' : 'Huéspedes' }}</option>
                </select>
                <div v-if="errors.numberOfGuests" class="invalid-feedback">
                  {{ errors.numberOfGuests }}
                </div>
              </div>

              <div v-if="isEditing" class="col-md-6">
                <label for="status" class="form-label fw-semibold">
                  <i class="bi bi-check-circle me-1"></i>
                  Estado
                </label>
                <select
                  v-model="form.status"
                  class="form-select"
                  id="status"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="CONFIRMED">Confirmada</option>
                  <option value="CANCELLED">Cancelada</option>
                  <option value="COMPLETED">Completada</option>
                </select>
              </div>

              <div class="col-12">
                <label for="notes" class="form-label fw-semibold">
                  <i class="bi bi-sticky me-1"></i>
                  Notas Adicionales
                </label>
                <textarea
                  v-model="form.notes"
                  class="form-control"
                  id="notes"
                  rows="3"
                  placeholder="Cualquier solicitud especial o notas..."
                ></textarea>
                <small class="form-text text-muted">Opcional: restricciones dietéticas, ocasiones especiales, etc.</small>
              </div>
            </div>

            <div v-if="submitError" class="alert alert-danger mt-3 d-flex align-items-center">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ submitError }}
            </div>
          </div>

          <div class="modal-footer bg-light">
            <button
              type="button"
              class="btn btn-outline-secondary"
              data-bs-dismiss="modal"
              :disabled="isSubmitting"
            >
              <i class="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting || !isFormValid"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else :class="isEditing ? 'bi bi-check-circle' : 'bi bi-plus-circle'" class="me-2"></i>
              {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Reserva' : 'Crear Reserva') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useReservationsStore } from '@/stores/reservations'
import type { Reservation, CreateReservationRequest, UpdateReservationRequest, ReservationStatus } from '@/types'

const emit = defineEmits<{
  reservationSaved: []
}>()

const reservationsStore = useReservationsStore()

const modalElement = ref<HTMLElement>()
let bootstrapModal: any = null

const isEditing = ref(false)
const isSubmitting = ref(false)
const submitError = ref('')
const editingReservation = ref<Reservation | null>(null)

const form = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  reservationDate: '',
  reservationTime: '',
  numberOfGuests: 0,
  status: 'PENDING' as ReservationStatus,
  notes: ''
})

const errors = ref({
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  reservationDate: '',
  reservationTime: '',
  numberOfGuests: ''
})

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const isFormValid = computed(() => {
  return (
    form.value.customerName &&
    form.value.customerEmail &&
    form.value.customerPhone &&
    form.value.reservationDate &&
    form.value.reservationTime &&
    form.value.numberOfGuests > 0 &&
    !Object.values(errors.value).some(error => error)
  )
})

const validateForm = () => {
  errors.value = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: ''
  }

  if (!form.value.customerName.trim()) {
    errors.value.customerName = 'Customer name is required'
  } else if (form.value.customerName.trim().length < 2) {
    errors.value.customerName = 'Customer name must be at least 2 characters'
  }

  if (!form.value.customerEmail.trim()) {
    errors.value.customerEmail = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.customerEmail)) {
    errors.value.customerEmail = 'Please enter a valid email address'
  }

  if (!form.value.customerPhone.trim()) {
    errors.value.customerPhone = 'Phone number is required'
  } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(form.value.customerPhone.replace(/\s/g, ''))) {
    errors.value.customerPhone = 'Please enter a valid phone number'
  }

  if (!form.value.reservationDate) {
    errors.value.reservationDate = 'Reservation date is required'
  } else {
    const selectedDate = new Date(form.value.reservationDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate < today) {
      errors.value.reservationDate = 'Reservation date cannot be in the past'
    }
  }

  if (!form.value.reservationTime) {
    errors.value.reservationTime = 'Reservation time is required'
  }

  if (!form.value.numberOfGuests || form.value.numberOfGuests < 1) {
    errors.value.numberOfGuests = 'Number of guests is required'
  } else if (form.value.numberOfGuests > 20) {
    errors.value.numberOfGuests = 'Maximum 20 guests allowed'
  }

  return !Object.values(errors.value).some(error => error)
}

const resetForm = () => {
  form.value = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: 0,
    status: 'PENDING',
    notes: ''
  }

  errors.value = {
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    reservationDate: '',
    reservationTime: '',
    numberOfGuests: ''
  }

  submitError.value = ''
  isEditing.value = false
  editingReservation.value = null
}

const openCreateModal = () => {
  resetForm()
  isEditing.value = false
  bootstrapModal?.show()
}

const openEditModal = (reservation: Reservation) => {
  resetForm()
  isEditing.value = true
  editingReservation.value = reservation

  form.value = {
    customerName: reservation.customerName,
    customerEmail: reservation.customerEmail,
    customerPhone: reservation.customerPhone,
    reservationDate: reservation.reservationDate,
    reservationTime: reservation.reservationTime,
    numberOfGuests: reservation.numberOfGuests,
    status: reservation.status,
    notes: reservation.notes || ''
  }

  bootstrapModal?.show()
}

const handleSubmit = async () => {
  if (!validateForm()) return

  try {
    isSubmitting.value = true
    submitError.value = ''

    if (isEditing.value && editingReservation.value) {
      const updateData: UpdateReservationRequest = {
        customerName: form.value.customerName.trim(),
        customerEmail: form.value.customerEmail.trim(),
        customerPhone: form.value.customerPhone.trim(),
        reservationDate: form.value.reservationDate,
        reservationTime: form.value.reservationTime,
        numberOfGuests: form.value.numberOfGuests,
        status: form.value.status,
        notes: form.value.notes.trim() || undefined
      }

      await reservationsStore.updateReservation(editingReservation.value.id, updateData)
    } else {
      const createData: CreateReservationRequest = {
        customerName: form.value.customerName.trim(),
        customerEmail: form.value.customerEmail.trim(),
        customerPhone: form.value.customerPhone.trim(),
        reservationDate: form.value.reservationDate,
        reservationTime: form.value.reservationTime,
        numberOfGuests: form.value.numberOfGuests,
        notes: form.value.notes.trim() || undefined
      }

      await reservationsStore.createReservation(createData)
    }

    bootstrapModal?.hide()
    emit('reservationSaved')
  } catch (error: any) {
    submitError.value = error.message || 'Failed to save reservation'
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await nextTick()

  if (modalElement.value) {
    const { Modal } = await import('bootstrap')
    bootstrapModal = new Modal(modalElement.value)

    modalElement.value.addEventListener('hidden.bs.modal', () => {
      resetForm()
    })
  }
})

defineExpose({
  openCreateModal,
  openEditModal
})
</script>

<style scoped>
.modal-content {
  border-radius: 1rem;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: none;
  padding: 1.5rem;
}

.modal-body {
  background-color: #fff;
}

.modal-footer {
  border-top: 1px solid #e9ecef;
  padding: 1.5rem;
}

.form-control:focus,
.form-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
}

.form-label {
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-label i {
  color: #667eea;
}

.invalid-feedback {
  display: block;
}

.alert {
  border: none;
  border-radius: 0.5rem;
  border-left: 4px solid #dc3545;
}

h6.text-primary {
  color: #667eea !important;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.row.g-3 > * {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem 1rem;
  }

  .modal-footer {
    padding: 1rem;
    gap: 0.5rem;
  }

  .modal-footer .btn {
    flex: 1;
  }
}
</style>