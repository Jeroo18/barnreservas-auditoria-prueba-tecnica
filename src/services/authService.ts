import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { getApiUrl, env } from '@/config/env'
import type { LoginCredentials, AuthResponse, User } from '@/types'

// Add request interceptor for debugging (only in non-test environment)
if (typeof import.meta === 'undefined' || !import.meta.env?.VITEST) {
  axios.interceptors.request.use(
    (config) => {
      console.log('Axios Request:', {
        url: config.url,
        method: config.method,
        data: config.data,
        headers: config.headers
      })
      return config
    },
    (error) => {
      console.error('Request interceptor error:', error)
      return Promise.reject(error)
    }
  )

  // Add response interceptor for debugging
  axios.interceptors.response.use(
    (response) => {
      console.log('Axios Response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      })
      return response
    },
    (error) => {
      console.error('Response interceptor error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      })
      return Promise.reject(error)
    }
  )
}

class AuthService {
  private readonly apiBaseUrl: string
  private readonly tokenKey: string
  private readonly userKey: string

  constructor() {
    this.apiBaseUrl = getApiUrl()
    this.tokenKey = env.JWT_STORAGE_KEY
    this.userKey = env.USER_STORAGE_KEY
  }

  // Test API connectivity
  async testApiConnectivity(): Promise<boolean> {
    try {
      console.log('Testing API connectivity to:', this.apiBaseUrl)

      // Try a simple GET request to see if the API is reachable
      const response = await axios.get(`${this.apiBaseUrl}`, {
        timeout: 5000,
        headers: {
          'Accept': 'application/json'
        }
      })

      console.log('API connectivity test successful:', response.status)
      return true
    } catch (error: any) {
      console.error('API connectivity test failed:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      })
      return false
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Login request payload:', credentials)
      console.log('API URL:', `${this.apiBaseUrl}/Account/authenticate`)

      // First, let's test if the API endpoint is reachable
      console.log('Testing API connectivity...')
      const isApiReachable = await this.testApiConnectivity()
      console.log('API reachable:', isApiReachable)

      // Ensure proper headers for JSON request
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      }

      console.log('Request config:', config)
      console.log('Stringified payload:', JSON.stringify(credentials))

      const response = await axios.post(`${this.apiBaseUrl}/Account/authenticate`, credentials, config)

      console.log('Login successful! Response status:', response.status)
      console.log('Response data:', response.data)

      const authData: AuthResponse = response.data

      this.setToken(authData.Token)
      this.setUser(authData)

      return authData
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      })

      // Better error message extraction
      let errorMessage = 'Login failed'

      if (error.response?.data) {
        const responseData = error.response.data

        if (typeof responseData === 'string') {
          errorMessage = responseData
        } else if (responseData.message) {
          errorMessage = responseData.message
        } else if (responseData.title) {
          errorMessage = responseData.title
        } else if (responseData.error) {
          errorMessage = responseData.error
        } else if (responseData.errors) {
          // Handle validation errors
          if (Array.isArray(responseData.errors)) {
            errorMessage = responseData.errors.join(', ')
          } else if (typeof responseData.errors === 'object') {
            errorMessage = Object.values(responseData.errors).flat().join(', ')
          }
        } else {
          errorMessage = `Login failed (${error.response.status}: ${error.response.statusText})`
        }
      } else if (error.message) {
        errorMessage = error.message
      }

      console.error('Extracted error message:', errorMessage)
      throw new Error(errorMessage)
    }
  }

  async loginWithParams(email: string, password: string): Promise<AuthResponse> {
    return this.login({ Email: email, Password: password })
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
    delete axios.defaults.headers.common['Authorization']
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  getUser(): User | null {
    const userStr = localStorage.getItem(this.userKey)
    return userStr ? JSON.parse(userStr) : null
  }

  setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    try {
      const decoded: any = jwtDecode(token)
      const currentTime = Date.now() / 1000

      if (decoded.exp < currentTime) {
        this.logout()
        return false
      }

      return true
    } catch (error) {
      this.logout()
      return false
    }
  }

  initializeAuth(): void {
    const token = this.getToken()
    if (token && this.isAuthenticated()) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      this.logout()
    }
  }

  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
}

export const authService = new AuthService()