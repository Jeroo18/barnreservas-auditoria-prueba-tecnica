export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (date: string | Date, time?: string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (time) {
    const [hours, minutes] = time.split(':')
    dateObj.setHours(parseInt(hours || '0'), parseInt(minutes || '0'))
  }

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours || '0')
  const minute = parseInt(minutes || '0')

  const date = new Date()
  date.setHours(hour, minute)

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export const isDateInPast = (date: string): boolean => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  return checkDate < today
}

export const isDateToday = (date: string): boolean => {
  const today = new Date()
  const checkDate = new Date(date)

  return today.toDateString() === checkDate.toDateString()
}

export const getDateDifferenceInDays = (date1: string | Date, date2: string | Date): number => {
  const firstDate = typeof date1 === 'string' ? new Date(date1) : date1
  const secondDate = typeof date2 === 'string' ? new Date(date2) : date2

  const timeDifference = Math.abs(secondDate.getTime() - firstDate.getTime())
  return Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
}

export const getMinimumDate = (): string => {
  const today = new Date()
  return today.toISOString().split('T')[0] || ''
}

export const addDays = (date: string | Date, days: number): Date => {
  const result = typeof date === 'string' ? new Date(date) : new Date(date)
  result.setDate(result.getDate() + days)
  return result
}