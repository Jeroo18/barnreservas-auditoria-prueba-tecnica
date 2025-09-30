<template>
  <div class="reservations-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h2 mb-0 text-dark fw-bold">
          <i class="bi bi-calendar3 me-2 text-primary"></i>
          Gestión de Reservas
        </h1>
        <p class="text-muted mb-0">Gestiona todas las reservas del restaurante</p>
      </div>

      <!--button
        v-if="authStore.isAuthenticated"
        class="btn btn-primary btn-lg"
        @click="openCreateModal"
      -->
      <button class="btn btn-primary btn-lg" @click="openCreateModal">
        <i class="bi bi-plus-circle me-2"></i>
        Nueva Reserva
      </button>
    </div>

    <div class="row mb-4">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text bg-white">
            <i class="bi bi-search"></i>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Buscar por nombre, email o teléfono del cliente..."
            @input="handleSearch"
          />
          <button
            v-if="searchQuery"
            class="btn btn-outline-secondary"
            type="button"
            @click="clearSearch"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>

      <div class="col-md-3">
        <select v-model="statusFilter" class="form-select" @change="handleStatusFilter">
          <option value="">Todos los Estados</option>
          <option value="PENDING">Pendiente</option>
          <option value="CONFIRMED">Confirmada</option>
          <option value="CANCELLED">Cancelada</option>
          <option value="COMPLETED">Completada</option>
        </select>
      </div>

      <div class="col-md-3">
        <button
          class="btn btn-outline-primary w-100"
          @click="refreshReservations"
          :disabled="reservationsStore.isLoading"
        >
          <span
            v-if="reservationsStore.isLoading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          <i v-else class="bi bi-arrow-clockwise me-2"></i>
          Actualizar
        </button>
      </div>
    </div>

    <div
      v-if="reservationsStore.error"
      class="alert alert-danger d-flex align-items-center"
      role="alert"
    >
      <i class="bi bi-exclamation-triangle-fill me-2"></i>
      {{ reservationsStore.error }}
      <button
        type="button"
        class="btn-close ms-auto"
        @click="reservationsStore.clearError"
      ></button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div v-if="reservationsStore.isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-3 text-muted">Cargando reservas...</p>
        </div>

        <div v-else-if="filteredReservations.length === 0" class="text-center py-5">
          <i class="bi bi-calendar-x text-muted display-1"></i>
          <h5 class="mt-3 text-muted">No se encontraron reservas</h5>
          <p class="text-muted">
            {{
              searchQuery || statusFilter
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Crea tu primera reserva para comenzar'
            }}
          </p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th class="border-0 fw-semibold">Cliente</th>
                <th class="border-0 fw-semibold">Contacto</th>
                <th class="border-0 fw-semibold">Fecha y Hora</th>
                <th class="border-0 fw-semibold">Huéspedes</th>
                <th class="border-0 fw-semibold">Estado</th>
                <th class="border-0 fw-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="reservation in filteredReservations"
                :key="reservation.id"
                class="align-middle"
              >
                <td>
                  <div>
                    <div class="fw-semibold">{{ reservation.customerName }}</div>
                    <small v-if="reservation.notes" class="text-muted">
                      <i class="bi bi-sticky me-1"></i>
                      {{ reservation.notes }}
                    </small>
                  </div>
                </td>
                <td>
                  <div class="small">
                    <div>
                      <i class="bi bi-envelope me-1"></i>
                      {{ reservation.customerEmail }}
                    </div>
                    <div class="text-muted">
                      <i class="bi bi-telephone me-1"></i>
                      {{ reservation.customerPhone }}
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div class="fw-semibold">
                      <i class="bi bi-calendar-date me-1"></i>
                      {{ formatDate(reservation.reservationDate) }}
                    </div>
                    <small class="text-muted">
                      <i class="bi bi-clock me-1"></i>
                      {{ reservation.reservationTime }}
                    </small>
                  </div>
                </td>
                <td>
                  <span class="badge bg-info text-dark">
                    <i class="bi bi-people me-1"></i>
                    {{ reservation.numberOfGuests }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(reservation.status)">
                    <i :class="getStatusIcon(reservation.status)" class="me-1"></i>
                    {{ reservation.status }}
                  </span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      v-if="authStore.isAuthenticated"
                      class="btn btn-outline-primary btn-sm"
                      @click="openEditModal(reservation)"
                      title="Editar Reserva"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>
                    <button
                      v-if="authStore.isAuthenticated"
                      class="btn btn-outline-danger btn-sm"
                      @click="confirmDelete(reservation)"
                      title="Eliminar Reserva"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <nav v-if="reservationsStore.pagination.totalPages > 1" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: reservationsStore.pagination.page === 1 }">
          <button
            class="page-link"
            @click="goToPage(reservationsStore.pagination.page - 1)"
            :disabled="reservationsStore.pagination.page === 1"
          >
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>

        <li
          v-for="page in visiblePages"
          :key="page"
          class="page-item"
          :class="{ active: page === reservationsStore.pagination.page, disabled: page === '...' }"
        >
          <span v-if="page === '...'" class="page-link">...</span>
          <button v-else class="page-link" @click="goToPage(page as number)">
            {{ page }}
          </button>
        </li>

        <li
          class="page-item"
          :class="{
            disabled: reservationsStore.pagination.page === reservationsStore.pagination.totalPages,
          }"
        >
          <button
            class="page-link"
            @click="goToPage(reservationsStore.pagination.page + 1)"
            :disabled="
              reservationsStore.pagination.page === reservationsStore.pagination.totalPages
            "
          >
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Modals -->
    <ReservationModal ref="reservationModal" @reservation-saved="handleReservationSaved" />

    <DeleteConfirmationModal ref="deleteModal" @confirmed="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReservationsStore } from '@/stores/reservations'
import type { Reservation, ReservationStatus } from '@/types'
import ReservationModal from '@/components/ReservationModal.vue'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.vue'

const authStore = useAuthStore()
const reservationsStore = useReservationsStore()

const reservationModal = ref<InstanceType<typeof ReservationModal>>()
const deleteModal = ref<InstanceType<typeof DeleteConfirmationModal>>()

const searchQuery = ref('')
const statusFilter = ref<ReservationStatus | ''>('')
const selectedReservation = ref<Reservation | null>(null)

const filteredReservations = computed(() => {
  let filtered = reservationsStore.reservations ?? []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (reservation) =>
        reservation.customerName.toLowerCase().includes(query) ||
        reservation.customerEmail.toLowerCase().includes(query) ||
        reservation.customerPhone.includes(query),
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((reservation) => reservation.status === statusFilter.value)
  }

  return filtered
})

const visiblePages = computed(() => {
  const current = reservationsStore.pagination.page
  const total = reservationsStore.pagination.totalPages
  const delta = 2
  const range = []
  const rangeWithDots = []

  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }

  if (current - delta > 2) {
    rangeWithDots.push(1, '...')
  } else {
    rangeWithDots.push(1)
  }

  rangeWithDots.push(...range)

  if (current + delta < total - 1) {
    rangeWithDots.push('...', total)
  } else {
    rangeWithDots.push(total)
  }

  return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index)
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusBadgeClass = (status: ReservationStatus) => {
  const baseClass = 'badge '
  switch (status) {
    case 'PENDING':
      return baseClass + 'bg-warning text-dark'
    case 'CONFIRMED':
      return baseClass + 'bg-success'
    case 'CANCELLED':
      return baseClass + 'bg-danger'
    case 'COMPLETED':
      return baseClass + 'bg-secondary'
    default:
      return baseClass + 'bg-secondary'
  }
}

const getStatusIcon = (status: ReservationStatus) => {
  switch (status) {
    case 'PENDING':
      return 'bi bi-clock'
    case 'CONFIRMED':
      return 'bi bi-check-circle'
    case 'CANCELLED':
      return 'bi bi-x-circle'
    case 'COMPLETED':
      return 'bi bi-check-circle-fill'
    default:
      return 'bi bi-question-circle'
  }
}

const handleSearch = () => {
  // Search is reactive through computed property
}

const clearSearch = () => {
  searchQuery.value = ''
}

const handleStatusFilter = () => {
  // Filter is reactive through computed property
}

const refreshReservations = async () => {
  await reservationsStore.fetchReservations()
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= reservationsStore.pagination.totalPages) {
    await reservationsStore.fetchReservations(page)
  }
}

const openCreateModal = () => {
  reservationModal.value?.openCreateModal()
}

const openEditModal = (reservation: Reservation) => {
  reservationModal.value?.openEditModal(reservation)
}

const confirmDelete = (reservation: Reservation) => {
  selectedReservation.value = reservation
  deleteModal.value?.show(
    'Delete Reservation',
    `Are you sure you want to delete the reservation for ${reservation.customerName}?`,
    'This action cannot be undone.',
  )
}

const handleReservationSaved = () => {
  refreshReservations()
}

const handleDelete = async () => {
  if (selectedReservation.value) {
    try {
      await reservationsStore.deleteReservation(selectedReservation.value.id)
      selectedReservation.value = null
    } catch (error) {
      console.error('Failed to delete reservation:', error)
    }
  }
}

onMounted(() => {
  refreshReservations()
})
</script>

<style scoped>
.reservations-container {
  max-width: 1400px;
  margin: 0 auto;
}

.table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  padding: 1rem 0.75rem;
}

.table td {
  padding: 1rem 0.75rem;
  vertical-align: middle;
}

.table-hover tbody tr:hover {
  background-color: rgba(102, 126, 234, 0.05);
}

.btn-group .btn {
  border-radius: 0.375rem;
  margin-right: 0.25rem;
}

.btn-group .btn:last-child {
  margin-right: 0;
}

.input-group .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.pagination .page-link {
  border-radius: 0.375rem;
  margin: 0 0.125rem;
  border: 1px solid #dee2e6;
  color: #667eea;
}

.pagination .page-item.active .page-link {
  background-color: #667eea;
  border-color: #667eea;
}

.pagination .page-link:hover {
  background-color: #f8f9fa;
  border-color: #667eea;
  color: #667eea;
}

.card {
  border-radius: 1rem;
  overflow: hidden;
}

.badge {
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.875rem;
  }

  .btn-group .btn {
    padding: 0.375rem 0.5rem;
  }

  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }

  .col-md-6,
  .col-md-3 {
    margin-bottom: 1rem;
  }
}
</style>
