import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { User, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value && authService.isAuthenticated())

  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await authService.login(credentials)
      user.value = response.user

      return response
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const loginWithParams = async (username: string, password: string) => {
    return login({ username, password })
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
    login,
    loginWithParams,
    logout,
    initializeAuth,
    clearError
  }
})