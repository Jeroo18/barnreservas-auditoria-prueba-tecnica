import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  validateName,
  validateDate,
  validateTime,
  validateGuestCount,
  getEmailError,
  getPhoneError,
  getNameError,
  getDateError,
  getTimeError,
  getGuestCountError
} from '../validationUtils'

describe('ValidationUtils', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test..test@example.com')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate phone numbers with at least 10 digits', () => {
      expect(validatePhone('1234567890')).toBe(true)
      expect(validatePhone('+1 (234) 567-8900')).toBe(true)
      expect(validatePhone('123-456-7890')).toBe(true)
      expect(validatePhone('123 456 7890 ext 123')).toBe(true)
    })

    it('should reject phone numbers with less than 10 digits', () => {
      expect(validatePhone('12345')).toBe(false)
      expect(validatePhone('123-456-789')).toBe(false)
      expect(validatePhone('abc')).toBe(false)
    })
  })

  describe('validateName', () => {
    it('should validate names with at least 2 characters', () => {
      expect(validateName('John')).toBe(true)
      expect(validateName('John Doe')).toBe(true)
      expect(validateName('Jo')).toBe(true)
    })

    it('should reject names with less than 2 characters', () => {
      expect(validateName('J')).toBe(false)
      expect(validateName('')).toBe(false)
      expect(validateName('   ')).toBe(false)
    })
  })

  describe('validateDate', () => {
    it('should validate future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      expect(validateDate(tomorrowStr)).toBe(true)
    })

    it('should reject past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      expect(validateDate(yesterdayStr)).toBe(false)
    })

    it('should accept today\'s date', () => {
      const today = new Date().toISOString().split('T')[0]
      expect(validateDate(today)).toBe(true)
    })

    it('should reject empty dates', () => {
      expect(validateDate('')).toBe(false)
    })
  })

  describe('validateTime', () => {
    it('should validate correct time formats', () => {
      expect(validateTime('09:00')).toBe(true)
      expect(validateTime('12:30')).toBe(true)
      expect(validateTime('23:59')).toBe(true)
      expect(validateTime('00:00')).toBe(true)
    })

    it('should reject invalid time formats', () => {
      expect(validateTime('25:00')).toBe(false)
      expect(validateTime('12:60')).toBe(false)
      expect(validateTime('9:00')).toBe(false) // Should be 09:00
      expect(validateTime('12:5')).toBe(false) // Should be 12:05
      expect(validateTime('')).toBe(false)
    })
  })

  describe('validateGuestCount', () => {
    it('should validate guest counts within range', () => {
      expect(validateGuestCount(1)).toBe(true)
      expect(validateGuestCount(10)).toBe(true)
      expect(validateGuestCount(20)).toBe(true) // Assuming max is 20
    })

    it('should reject invalid guest counts', () => {
      expect(validateGuestCount(0)).toBe(false)
      expect(validateGuestCount(-1)).toBe(false)
      expect(validateGuestCount(25)).toBe(false) // Assuming max is 20
    })
  })

  describe('Error message functions', () => {
    it('should return appropriate email error messages', () => {
      expect(getEmailError('')).toBe('Email is required')
      expect(getEmailError('invalid')).toBe('Please enter a valid email address')
      expect(getEmailError('test@example.com')).toBe('')
    })

    it('should return appropriate phone error messages', () => {
      expect(getPhoneError('')).toBe('Phone number is required')
      expect(getPhoneError('123')).toBe('Please enter a valid phone number (at least 10 digits)')
      expect(getPhoneError('1234567890')).toBe('')
    })

    it('should return appropriate name error messages', () => {
      expect(getNameError('')).toBe('Name is required')
      expect(getNameError('J')).toBe('Name must be at least 2 characters long')
      expect(getNameError('John')).toBe('')
    })

    it('should return appropriate date error messages', () => {
      expect(getDateError('')).toBe('Date is required')

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]
      expect(getDateError(yesterdayStr)).toBe('Date cannot be in the past')

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]
      expect(getDateError(tomorrowStr)).toBe('')
    })

    it('should return appropriate time error messages', () => {
      expect(getTimeError('')).toBe('Time is required')
      expect(getTimeError('25:00')).toBe('Please enter a valid time')
      expect(getTimeError('12:30')).toBe('')
    })

    it('should return appropriate guest count error messages', () => {
      expect(getGuestCountError(0)).toBe('Number of guests is required')
      expect(getGuestCountError(25)).toContain('Number of guests must be between 1 and')
      expect(getGuestCountError(5)).toBe('')
    })
  })
})