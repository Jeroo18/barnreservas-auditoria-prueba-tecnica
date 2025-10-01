import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { getApiUrl, env } from '@/config/env'
import type { LoginCredentials, AuthResponse, User } from '@/types'

class AuthService {
  private readonly apiBaseUrl: string
  private readonly tokenKey: string
  private readonly userKey: string

  constructor() {
    this.apiBaseUrl = getApiUrl()
    this.tokenKey = env.JWT_STORAGE_KEY
    this.userKey = env.USER_STORAGE_KEY
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Login request payload:', credentials)
      console.log('API URL:', `${this.apiBaseUrl}/Account/authenticate`)

      const response = await axios.post(`${this.apiBaseUrl}/Account/authenticate`, credentials)
      const authData: AuthResponse = response.data

      this.setToken(authData.Token)
      this.setUser(authData)

      return authData
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      })

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.title ||
                          error.response?.data ||
                          `Login failed (${error.response?.status})`

      throw new Error(errorMessage)
    }
  }

  async loginWithParams(username: string, password: string): Promise<AuthResponse> {
    return this.login({ Username: username, Password: password })
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