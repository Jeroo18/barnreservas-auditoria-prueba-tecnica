<template>
  <div class="login-container">
    <div class="container-fluid">
      <div class="row justify-content-center min-vh-100 align-items-center">
        <div class="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
          <div class="card shadow-lg border-0">
            <div class="card-body p-3 p-sm-4 p-md-5">
              <div class="text-center mb-3 mb-md-4">
                <i class="bi bi-calendar-check text-primary display-4 d-none d-sm-block"></i>
                <i class="bi bi-calendar-check text-primary d-block d-sm-none" style="font-size: 3rem;"></i>
                <h2 class="card-title text-center mb-0 mt-2 mt-sm-3 h3 h-sm-2">Bienvenido de Vuelta</h2>
                <p class="text-muted small">Inicia sesión para gestionar reservas</p>
              </div>

              <form @submit.prevent="handleLogin">
                <div class="mb-3">
                  <label for="username" class="form-label fw-semibold">
                    <i class="bi bi-person me-1"></i>
                    Usuario
                  </label>
                  <input
                    v-model="form.username"
                    type="text"
                    class="form-control form-control-lg"
                    id="username"
                    placeholder="Ingresa tu nombre de usuario"
                    required
                    :disabled="authStore.isLoading"
                  >
                </div>

                <div class="mb-3 mb-md-4">
                  <label for="password" class="form-label fw-semibold">
                    <i class="bi bi-lock me-1"></i>
                    Contraseña
                  </label>
                  <div class="input-group">
                    <input
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-control form-control-lg"
                      id="password"
                      placeholder="Ingresa tu contraseña"
                      required
                      :disabled="authStore.isLoading"
                    >
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="togglePasswordVisibility"
                      :disabled="authStore.isLoading"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>

                <div v-if="authStore.error" class="alert alert-danger d-flex align-items-center mb-3" role="alert">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  <span class="small">{{ authStore.error }}</span>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-lg w-100 mb-3"
                  :disabled="authStore.isLoading || !form.username || !form.password"
                >
                  <span v-if="authStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                  <span class="d-none d-sm-inline">{{ authStore.isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}</span>
                  <span class="d-inline d-sm-none">{{ authStore.isLoading ? 'Iniciando...' : 'Entrar' }}</span>
                </button>
              </form>

              <div class="text-center">
                <small class="text-muted d-block">
                  <i class="bi bi-info-circle me-1"></i>
                  <span class="d-none d-md-inline">Para pruebas, también puedes autenticarte vía parámetros de URL</span>
                  <span class="d-inline d-md-none">Usa parámetros URL para pruebas</span>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const showPassword = ref(false)

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    await authStore.login(form.value)

    const redirectTo = route.query.redirect as string || '/reservations'
    router.push(redirectTo)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

onMounted(async () => {
  authStore.clearError()

  if (authStore.isAuthenticated) {
    router.push('/reservations')
    return
  }

  const username = route.query.username as string
  const password = route.query.password as string

  if (username && password) {
    form.value.username = username
    form.value.password = password

    try {
      await authStore.loginWithParams(username, password)
      const redirectTo = route.query.redirect as string || '/reservations'
      router.push(redirectTo)
    } catch (error) {
      console.error('Auto-login failed:', error)
    }
  }
})
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  margin: -1rem;
  padding: 0;
  min-height: 100vh;
}

.row {
  margin: 0;
  padding: 1rem 0.5rem;
}

.card {
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.98);
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  overflow: hidden;
}

.card-body {
  position: relative;
}

.form-control {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
  transform: translateY(-1px);
}

.form-control-lg {
  padding: 0.75rem 1rem;
  font-size: 1.1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  transform: none;
}

.input-group .btn {
  border-radius: 0 0.5rem 0.5rem 0;
  border: 2px solid #e9ecef;
  border-left: none;
}

.input-group .form-control {
  border-radius: 0.5rem 0 0 0.5rem;
}

.alert {
  border: none;
  border-radius: 0.5rem;
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  border-left: 4px solid #dc3545;
  padding: 0.75rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-label i {
  color: #667eea;
}

/* Mobile Optimizations */
@media (max-width: 575.98px) {
  .login-container {
    margin: -1rem -1rem -1rem -1rem;
    padding: 0;
  }

  .row {
    padding: 0.5rem;
    min-height: 100vh;
  }

  .card {
    border-radius: 0.75rem;
    margin: 0;
  }

  .card-body {
    padding: 1.5rem 1rem;
  }

  .form-control-lg {
    padding: 0.625rem 0.875rem;
    font-size: 1rem;
  }

  .btn-primary {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }

  .display-4 {
    font-size: 2.5rem;
  }

  .card-title {
    font-size: 1.5rem;
  }
}

/* Tablet Optimizations */
@media (min-width: 576px) and (max-width: 767.98px) {
  .row {
    padding: 1rem;
  }

  .card-body {
    padding: 2rem 1.5rem;
  }
}

/* Desktop Optimizations */
@media (min-width: 768px) {
  .login-container {
    padding: 2rem 1rem;
  }

  .row {
    padding: 1rem;
  }
}

/* Large Desktop */
@media (min-width: 1200px) {
  .card {
    max-width: 400px;
    margin: 0 auto;
  }
}

/* Landscape Mobile */
@media (max-height: 500px) and (orientation: landscape) {
  .login-container {
    padding: 0.5rem 0;
  }

  .row {
    padding: 0.5rem;
  }

  .card-body {
    padding: 1rem;
  }

  .display-4 {
    font-size: 2rem;
  }

  .mb-3, .mb-md-4 {
    margin-bottom: 0.75rem !important;
  }
}

/* Enhanced touch targets for mobile */
@media (max-width: 767.98px) {
  .btn, .form-control {
    min-height: 48px;
  }

  .input-group .btn {
    min-width: 48px;
  }
}

/* Animation for better UX */
.card {
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus improvements for accessibility */
.form-control:focus-visible,
.btn:focus-visible {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
</style>