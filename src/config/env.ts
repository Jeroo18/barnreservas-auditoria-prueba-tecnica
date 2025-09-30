interface EnvConfig {
  API_BASE_URL: string
  API_BASE_URL_HTTP: string
  APP_TITLE: string
  APP_VERSION: string
  JWT_STORAGE_KEY: string
  USER_STORAGE_KEY: string
  ITEMS_PER_PAGE: number
  MAX_GUESTS_PER_RESERVATION: number
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key]
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not defined`)
  }
  return value || defaultValue || ''
}

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key]
  return value ? parseInt(value, 10) : defaultValue
}

export const env: EnvConfig = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'https://localhost:7001/api'),
  API_BASE_URL_HTTP: getEnvVar('VITE_API_BASE_URL_HTTP', 'http://localhost:5001/api'),
  APP_TITLE: getEnvVar('VITE_APP_TITLE', 'Reservations Happiness'),
  APP_VERSION: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  JWT_STORAGE_KEY: getEnvVar('VITE_JWT_STORAGE_KEY', 'authToken'),
  USER_STORAGE_KEY: getEnvVar('VITE_USER_STORAGE_KEY', 'currentUser'),
  ITEMS_PER_PAGE: getEnvNumber('VITE_ITEMS_PER_PAGE', 10),
  MAX_GUESTS_PER_RESERVATION: getEnvNumber('VITE_MAX_GUESTS_PER_RESERVATION', 20)
}

// API URL selector with fallback
export const getApiUrl = (useHttps = true): string => {
  try {
    return useHttps ? env.API_BASE_URL : env.API_BASE_URL_HTTP
  } catch (error) {
    console.warn('Environment configuration error, using fallback URL:', error)
    return useHttps ? 'https://localhost:7001/api' : 'http://localhost:5001/api'
  }
}

// Development helpers
export const isDevelopment = import.meta.env.DEV
export const isProduction = import.meta.env.PROD

// App configuration
export const appConfig = {
  title: env.APP_TITLE,
  version: env.APP_VERSION,
  isDev: isDevelopment,
  isProd: isProduction
}