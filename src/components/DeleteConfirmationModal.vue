<template>
  <div
    class="modal fade"
    id="deleteConfirmationModal"
    tabindex="-1"
    aria-labelledby="deleteConfirmationModalLabel"
    aria-hidden="true"
    ref="modalElement"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg">
        <div class="modal-header bg-danger text-white border-0">
          <h5 class="modal-title fw-bold" id="deleteConfirmationModalLabel">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ title }}
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body text-center p-4">
          <div class="mb-4">
            <i class="bi bi-trash3 text-danger display-1"></i>
          </div>

          <h5 class="fw-semibold text-dark mb-3">{{ message }}</h5>

          <p v-if="description" class="text-muted mb-0">
            {{ description }}
          </p>

          <div class="alert alert-warning d-flex align-items-center mt-3" role="alert">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <small class="mb-0">Esta acción no se puede deshacer.</small>
          </div>
        </div>

        <div class="modal-footer bg-light border-0 justify-content-center gap-3">
          <button
            type="button"
            class="btn btn-outline-secondary px-4"
            data-bs-dismiss="modal"
            :disabled="isProcessing"
          >
            <i class="bi bi-x-circle me-2"></i>
            Cancelar
          </button>
          <button
            type="button"
            class="btn btn-danger px-4"
            @click="handleConfirm"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-trash me-2"></i>
            {{ isProcessing ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'

const emit = defineEmits<{
  confirmed: []
}>()

const modalElement = ref<HTMLElement>()
let bootstrapModal: any = null

const title = ref('Confirm Delete')
const message = ref('Are you sure you want to delete this item?')
const description = ref('')
const isProcessing = ref(false)

const show = (modalTitle: string, modalMessage: string, modalDescription = '') => {
  title.value = modalTitle
  message.value = modalMessage
  description.value = modalDescription
  isProcessing.value = false

  bootstrapModal?.show()
}

const hide = () => {
  bootstrapModal?.hide()
}

const handleConfirm = async () => {
  try {
    isProcessing.value = true
    emit('confirmed')

    // Keep the modal open with loading state until the parent handles the deletion
    // The parent should call hide() after successful deletion
    setTimeout(() => {
      if (isProcessing.value) {
        hide()
        isProcessing.value = false
      }
    }, 5000) // Fallback timeout
  } catch (error) {
    isProcessing.value = false
    console.error('Delete confirmation error:', error)
  }
}

onMounted(async () => {
  await nextTick()

  if (modalElement.value) {
    const { Modal } = await import('bootstrap')
    bootstrapModal = new Modal(modalElement.value)

    modalElement.value.addEventListener('hidden.bs.modal', () => {
      isProcessing.value = false
    })
  }
})

defineExpose({
  show,
  hide
})
</script>

<style scoped>
.modal-content {
  border-radius: 1rem;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
}

.modal-body {
  padding: 2rem 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  transition: all 0.3s ease;
}

.btn-danger:hover:not(:disabled) {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-danger:disabled {
  opacity: 0.6;
}

.btn-outline-secondary {
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  transform: translateY(-1px);
}

.alert-warning {
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 0.5rem;
  color: #856404;
}

.display-1 {
  font-size: 4rem;
  opacity: 0.8;
}

.modal-dialog-centered {
  display: flex;
  align-items: center;
  min-height: calc(100% - 1rem);
}

@media (max-width: 576px) {
  .modal-dialog {
    margin: 0.5rem;
  }

  .modal-body {
    padding: 1.5rem 1rem;
  }

  .modal-footer {
    padding: 1rem;
    flex-direction: column;
  }

  .modal-footer .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .modal-footer .btn:last-child {
    margin-bottom: 0;
  }

  .display-1 {
    font-size: 3rem;
  }
}

/* Animation for the trash icon */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  75% { transform: translateX(2px); }
}

.modal.show .bi-trash3 {
  animation: shake 0.5s ease-in-out;
}

/* Pulse animation for the danger button when processing */
.btn-danger .spinner-border {
  width: 1rem;
  height: 1rem;
}
</style>