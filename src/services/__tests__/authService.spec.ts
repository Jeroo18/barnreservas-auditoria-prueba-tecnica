import { describe, it, expect, beforeEach, vi } from 'vitest'
import { authService } from '../authService'

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}))

// Mock jwt-decode
vi.mock('jwt-decode', () => ({
  jwtDecode: vi.fn()
}))

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage
})

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('Token Management', () => {
    it('should set and get token correctly', () => {
      const testToken = 'test-jwt-token'

      authService.setToken(testToken)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('authToken', testToken)
    })

    it('should return null when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const token = authService.getToken()

      expect(token).toBe(null)
    })

    it('should return token when it exists', () => {
      const testToken = 'test-jwt-token'
      mockLocalStorage.getItem.mockReturnValue(testToken)

      const token = authService.getToken()

      expect(token).toBe(testToken)
    })
  })

  describe('User Management', () => {
    it('should set and get user correctly', () => {
      const testUser = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'token' }

      authService.setUser(testUser)

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('currentUser', JSON.stringify(testUser))
    })

    it('should return null when no user exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const user = authService.getUser()

      expect(user).toBe(null)
    })

    it('should parse and return user when it exists', () => {
      const testUser = { Id: '123', UserName: 'testuser', Email: 'test@example.com', Token: 'token' }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testUser))

      const user = authService.getUser()

      expect(user).toEqual(testUser)
    })
  })

  describe('Authentication Check', () => {
    it('should return false when no token exists', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const isAuth = authService.isAuthenticated()

      expect(isAuth).toBe(false)
    })

    it('should logout when token is expired', async () => {
      const expiredToken = 'expired-token'
      mockLocalStorage.getItem.mockReturnValue(expiredToken)

      const { jwtDecode } = await import('jwt-decode')
      vi.mocked(jwtDecode).mockReturnValue({ exp: Math.floor(Date.now() / 1000) - 3600 }) // Expired 1 hour ago

      const isAuth = authService.isAuthenticated()

      expect(isAuth).toBe(false)
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser')
    })

    it('should return true when token is valid', async () => {
      const validToken = 'valid-token'
      mockLocalStorage.getItem.mockReturnValue(validToken)

      const { jwtDecode } = await import('jwt-decode')
      vi.mocked(jwtDecode).mockReturnValue({ exp: Math.floor(Date.now() / 1000) + 3600 }) // Expires in 1 hour

      const isAuth = authService.isAuthenticated()

      expect(isAuth).toBe(true)
    })
  })

  describe('Logout', () => {
    it('should clear token and user from localStorage', () => {
      authService.logout()

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('authToken')
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('currentUser')
    })
  })

  describe('Auth Header', () => {
    it('should return empty object when no token', () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const header = authService.getAuthHeader()

      expect(header).toEqual({})
    })

    it('should return authorization header when token exists', () => {
      const testToken = 'test-token'
      mockLocalStorage.getItem.mockReturnValue(testToken)

      const header = authService.getAuthHeader()

      expect(header).toEqual({ Authorization: `Bearer ${testToken}` })
    })
  })
})