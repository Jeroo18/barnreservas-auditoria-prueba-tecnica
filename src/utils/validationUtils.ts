export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '')

  // Check if it has at least 10 digits (minimum for most phone numbers)
  return digitsOnly.length >= 10
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2
}

export const validateDate = (date: string): boolean => {
  if (!date) return false

  const selectedDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return selectedDate >= today
}

export const validateTime = (time: string): boolean => {
  if (!time) return false

  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

export const validateGuestCount = (count: number): boolean => {
  return count > 0 && count <= 20
}

export const getEmailError = (email: string): string => {
  if (!email.trim()) return 'Email is required'
  if (!validateEmail(email)) return 'Please enter a valid email address'
  return ''
}

export const getPhoneError = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required'
  if (!validatePhone(phone)) return 'Please enter a valid phone number (at least 10 digits)'
  return ''
}

export const getNameError = (name: string): string => {
  if (!name.trim()) return 'Name is required'
  if (!validateName(name)) return 'Name must be at least 2 characters long'
  return ''
}

export const getDateError = (date: string): string => {
  if (!date) return 'Date is required'
  if (!validateDate(date)) return 'Date cannot be in the past'
  return ''
}

export const getTimeError = (time: string): string => {
  if (!time) return 'Time is required'
  if (!validateTime(time)) return 'Please enter a valid time'
  return ''
}

export const getGuestCountError = (count: number): string => {
  if (!count || count <= 0) return 'Number of guests is required'
  if (!validateGuestCount(count)) return 'Number of guests must be between 1 and 20'
  return ''
}