import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Core authentication state
  const isAuthenticated = computed(() => !!user.value && authService.isAuthenticated())

  // CRUD permissions for reservations
  const canCreateReservations = computed(() => isAuthenticated.value)
  const canEditReservations = computed(() => isAuthenticated.value)
  const canDeleteReservations = computed(() => isAuthenticated.value)
  const canViewReservations = computed(() => true) // Anyone can view

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.login(credentials)
      user.value = response

      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    error.value = null
  }

  const initializeAuth = () => {
    authService.initializeAuth()
    if (authService.isAuthenticated()) {
      user.value = authService.getUser()
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    canCreateReservations,
    canEditReservations,
    canDeleteReservations,
    canViewReservations,
    login,
    logout,
    initializeAuth,
    clearError
  }
})