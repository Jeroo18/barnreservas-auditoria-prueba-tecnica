import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

// Mock authService
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    initializeAuth: vi.fn(),
    isAuthenticated: vi.fn(),
    getUser: vi.fn()
  }
}))

// Import after mocking
const { useAuthStore } = await import('../auth')
const { authService } = await import('@/services/authService')

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const authStore = useAuthStore()

      expect(authStore.user).toBe(null)
      expect(authStore.isLoading).toBe(false)
      expect(authStore.error).toBe(null)
    })
  })

  describe('Authentication Status', () => {
    it('should return false when user is null', () => {
      vi.mocked(authService).isAuthenticated.mockReturnValue(false)
      const authStore = useAuthStore()

      expect(authStore.isAuthenticated).toBe(false)
    })

    it('should return true when user exists and service confirms authentication', () => {
      vi.mocked(authService).isAuthenticated.mockReturnValue(true)
      const authStore = useAuthStore()
      authStore.user = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'token' }

      expect(authStore.isAuthenticated).toBe(true)
    })

    it('should return false when user exists but service denies authentication', () => {
      vi.mocked(authService).isAuthenticated.mockReturnValue(false)
      const authStore = useAuthStore()
      authStore.user = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'token' }

      expect(authStore.isAuthenticated).toBe(false)
    })
  })

  describe('CRUD Permissions', () => {
    it('should allow all CRUD operations when authenticated', () => {
      vi.mocked(authService).isAuthenticated.mockReturnValue(true)
      const authStore = useAuthStore()
      authStore.user = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'token' }

      expect(authStore.canCreateReservations).toBe(true)
      expect(authStore.canEditReservations).toBe(true)
      expect(authStore.canDeleteReservations).toBe(true)
      expect(authStore.canViewReservations).toBe(true)
    })

    it('should deny CUD operations when not authenticated but allow viewing', () => {
      vi.mocked(authService).isAuthenticated.mockReturnValue(false)
      const authStore = useAuthStore()

      expect(authStore.canCreateReservations).toBe(false)
      expect(authStore.canEditReservations).toBe(false)
      expect(authStore.canDeleteReservations).toBe(false)
      expect(authStore.canViewReservations).toBe(true) // Anyone can view
    })
  })

  describe('Login', () => {
    it('should login successfully', async () => {
      const mockResponse = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'test-token' }
      vi.mocked(authService).login.mockResolvedValue(mockResponse)

      const authStore = useAuthStore()
      const credentials = { username: 'testuser', password: 'password' }

      const result = await authStore.login(credentials)

      expect(vi.mocked(authService).login).toHaveBeenCalledWith(credentials)
      expect(authStore.user).toEqual(mockResponse)
      expect(authStore.error).toBe(null)
      expect(authStore.isLoading).toBe(false)
      expect(result).toEqual(mockResponse)
    })

    it('should handle login errors', async () => {
      const errorMessage = 'Invalid credentials'
      vi.mocked(authService).login.mockRejectedValue(new Error(errorMessage))

      const authStore = useAuthStore()
      const credentials = { username: 'testuser', password: 'wrong' }

      await expect(authStore.login(credentials)).rejects.toThrow(errorMessage)

      expect(authStore.user).toBe(null)
      expect(authStore.error).toBe(errorMessage)
      expect(authStore.isLoading).toBe(false)
    })

    it('should set loading state during login', async () => {
      let resolveLogin: (value: any) => void
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve
      })
      vi.mocked(authService).login.mockReturnValue(loginPromise)

      const authStore = useAuthStore()
      const credentials = { username: 'testuser', password: 'password' }

      const loginCall = authStore.login(credentials)

      expect(authStore.isLoading).toBe(true)

      resolveLogin!({ Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'test-token' })
      await loginCall

      expect(authStore.isLoading).toBe(false)
    })
  })

  describe('Logout', () => {
    it('should logout and clear state', () => {
      const authStore = useAuthStore()
      authStore.user = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'token' }
      authStore.error = 'Some error'

      authStore.logout()

      expect(vi.mocked(authService).logout).toHaveBeenCalled()
      expect(authStore.user).toBe(null)
      expect(authStore.error).toBe(null)
    })
  })

  describe('Initialize Auth', () => {
    it('should initialize with existing user when authenticated', () => {
      const mockUser = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'token' }
      vi.mocked(authService).isAuthenticated.mockReturnValue(true)
      vi.mocked(authService).getUser.mockReturnValue(mockUser)

      const authStore = useAuthStore()
      authStore.initializeAuth()

      expect(vi.mocked(authService).initializeAuth).toHaveBeenCalled()
      expect(authStore.user).toEqual(mockUser)
    })

    it('should not set user when not authenticated', () => {
      vi.mocked(authService).isAuthenticated.mockReturnValue(false)

      const authStore = useAuthStore()
      authStore.initializeAuth()

      expect(vi.mocked(authService).initializeAuth).toHaveBeenCalled()
      expect(authStore.user).toBe(null)
    })
  })

  describe('Clear Error', () => {
    it('should clear error state', () => {
      const authStore = useAuthStore()
      authStore.error = 'Some error'

      authStore.clearError()

      expect(authStore.error).toBe(null)
    })
  })
})