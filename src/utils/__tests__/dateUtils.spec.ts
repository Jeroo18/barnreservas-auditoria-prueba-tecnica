import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatTime,
  isDateInPast,
  isDateToday,
  getDateDifferenceInDays,
  getMinimumDate,
  addDays
} from '../dateUtils'

describe('DateUtils', () => {
  describe('formatDate', () => {
    it('should format date string correctly', () => {
      const result = formatDate('2024-01-15')
      expect(result).toMatch(/Jan 15, 2024/)
    })

    it('should format Date object correctly', () => {
      const date = new Date('2024-01-15')
      const result = formatDate(date)
      expect(result).toMatch(/Jan 15, 2024/)
    })
  })

  describe('formatDateTime', () => {
    it('should format date without time', () => {
      const result = formatDateTime('2024-01-15')
      expect(result).toMatch(/Jan 15, 2024/)
    })

    it('should format date with time', () => {
      const result = formatDateTime('2024-01-15', '14:30')
      expect(result).toMatch(/Jan 15, 2024/)
      expect(result).toMatch(/2:30/)
    })

    it('should handle Date object with time', () => {
      const date = new Date('2024-01-15')
      const result = formatDateTime(date, '09:00')
      expect(result).toMatch(/Jan 15, 2024/)
      expect(result).toMatch(/9:00/)
    })
  })

  describe('formatTime', () => {
    it('should format time in 12-hour format', () => {
      expect(formatTime('09:00')).toMatch(/9:00 AM/)
      expect(formatTime('14:30')).toMatch(/2:30 PM/)
      expect(formatTime('00:00')).toMatch(/12:00 AM/)
      expect(formatTime('12:00')).toMatch(/12:00 PM/)
    })

    it('should handle edge cases', () => {
      expect(formatTime('23:59')).toMatch(/11:59 PM/)
      expect(formatTime('12:30')).toMatch(/12:30 PM/)
    })
  })

  describe('isDateInPast', () => {
    it('should return true for past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      expect(isDateInPast(yesterdayStr)).toBe(true)
    })

    it('should return false for today', () => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayStr = today.toISOString().split('T')[0]
      expect(isDateInPast(todayStr)).toBe(false)
    })

    it('should return false for future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowStr = tomorrow.toISOString().split('T')[0]

      expect(isDateInPast(tomorrowStr)).toBe(false)
    })
  })

  describe('isDateToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date()
      const todayStr = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0')
      expect(isDateToday(todayStr)).toBe(true)
    })

    it('should return false for other dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      expect(isDateToday(yesterdayStr)).toBe(false)
    })
  })

  describe('getDateDifferenceInDays', () => {
    it('should calculate difference between dates', () => {
      const date1 = '2024-01-15'
      const date2 = '2024-01-20'

      expect(getDateDifferenceInDays(date1, date2)).toBe(5)
      expect(getDateDifferenceInDays(date2, date1)).toBe(5)
    })

    it('should handle Date objects', () => {
      const date1 = new Date('2024-01-15')
      const date2 = new Date('2024-01-20')

      expect(getDateDifferenceInDays(date1, date2)).toBe(5)
    })

    it('should handle same dates', () => {
      const date = '2024-01-15'
      expect(getDateDifferenceInDays(date, date)).toBe(0)
    })
  })

  describe('getMinimumDate', () => {
    it('should return today\'s date in YYYY-MM-DD format', () => {
      const result = getMinimumDate()
      const today = new Date().toISOString().split('T')[0]

      expect(result).toBe(today)
    })
  })

  describe('addDays', () => {
    it('should add days to date string', () => {
      const result = addDays('2024-01-15', 5)
      const expected = new Date('2024-01-20')

      expect(result.toDateString()).toBe(expected.toDateString())
    })

    it('should add days to Date object', () => {
      const date = new Date('2024-01-15')
      const result = addDays(date, 5)
      const expected = new Date('2024-01-20')

      expect(result.toDateString()).toBe(expected.toDateString())
    })

    it('should handle negative days (subtract)', () => {
      const result = addDays('2024-01-15', -5)
      const expected = new Date('2024-01-10')

      expect(result.toDateString()).toBe(expected.toDateString())
    })

    it('should handle zero days', () => {
      const date = '2024-01-15'
      const result = addDays(date, 0)
      const expected = new Date('2024-01-15')

      expect(result.toDateString()).toBe(expected.toDateString())
    })
  })
})