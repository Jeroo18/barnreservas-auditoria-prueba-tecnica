import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import type { LoginCredentials, AuthResponse, User } from '@/types'

const API_BASE_URL = 'http://localhost:5000/api'

class AuthService {
  private tokenKey = 'authToken'
  private userKey = 'currentUser'

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials)
      const authData: AuthResponse = response.data

      this.setToken(authData.token)
      this.setUser(authData.user)

      return authData
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  }

  async loginWithParams(username: string, password: string): Promise<AuthResponse> {
    return this.login({ username, password })
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