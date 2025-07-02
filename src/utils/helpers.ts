/**
 * Utility functions for the Love App
 */

// Generate unique IDs for form elements
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

// Format date for display
export function formatDate(date: Date | string | null | undefined, format = 'DD/MM/YYYY'): string {
  if (!date) return 'N/A'
  
  const d = new Date(date)
  
  // Check if date is valid
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }
  
  if (format === 'relative') {
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Hôm nay'
    if (diffDays === 1) return 'Hôm qua'
    if (diffDays < 7) return `${diffDays} ngày trước`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`
    return `${Math.floor(diffDays / 30)} tháng trước`
  }
  
  if (format === 'date') {
    return d.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  
  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year.toString())
}

// Format date with time
export function formatDateTime(date: string, time?: string): string {
  const formattedDate = formatDate(date, 'DD/MM/YYYY')
  if (time) {
    return `${formattedDate} at ${time}`
  }
  return formattedDate
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number (Vietnamese format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+84|0)(3|5|7|8|9)([0-9]{8})$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('84')) {
    return `+84 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  return phone
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Get days between two dates
export function getDaysBetween(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Get days until a future date
export function getDaysUntil(targetDate: Date | string): number {
  const target = new Date(targetDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)
  
  const diffTime = target.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Copy to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Check if file is image
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

// Create image preview URL
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Random romantic quote
export function getRandomRomanticQuote(): string {
  const quotes = [
    "Tình yêu không phải là nhìn vào mắt nhau, mà là cùng nhau nhìn về một hướng.",
    "Yêu nhau không chỉ là nói 'Anh yêu em', mà là mỗi ngày đều chứng minh điều đó.",
    "Hạnh phúc không phải là đích đến, mà là hành trình mà hai người cùng đi.",
    "Tình yêu đích thực là khi bạn vẫn yêu người đó ngay cả khi họ quên mang theo vẻ đẹp.",
    "Một ngày không có anh/em là một ngày bị mất.",
    "Tình yêu là ngôn ngữ mà mọi trái tim đều hiểu."
  ]
  return quotes[Math.floor(Math.random() * quotes.length)]
}

// Calculate days together
export function calculateDaysTogether(startDate: Date | string): number {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Format countdown
export function formatCountdown(targetDate: Date | string): string {
  const target = new Date(targetDate)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  
  if (diff <= 0) return 'Đã đến!'
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (days > 0) return `${days} ngày ${hours} giờ`
  if (hours > 0) return `${hours} giờ ${minutes} phút`
  return `${minutes} phút`
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Format relative date for memories
export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffMinutes < 1) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`
  if (diffHours < 24) return `${diffHours} giờ trước`
  if (diffDays < 7) return `${diffDays} ngày trước`
  if (diffWeeks < 4) return `${diffWeeks} tuần trước`
  if (diffMonths < 12) return `${diffMonths} tháng trước`
  return `${diffYears} năm trước`
}

// Generate couple invitation code
export function generateInvitationCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Format anniversary message
export function formatAnniversaryMessage(years: number, months: number, days: number): string {
  if (years > 0) {
    return `${years} năm ${months} tháng ${days} ngày bên nhau`
  } else if (months > 0) {
    return `${months} tháng ${days} ngày bên nhau`
  } else {
    return `${days} ngày bên nhau`
  }
}

// Calculate next anniversary
export function calculateNextAnniversary(startDate: Date | string): Date {
  const start = new Date(startDate)
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // Create anniversary date for current year
  let anniversary = new Date(currentYear, start.getMonth(), start.getDate())
  
  // If anniversary has passed this year, get next year's anniversary
  if (anniversary < now) {
    anniversary = new Date(currentYear + 1, start.getMonth(), start.getDate())
  }
  
  return anniversary
}

// Validate image file
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check if it's an image
  if (!isImageFile(file)) {
    return { isValid: false, error: 'File must be an image' }
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' }
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }
  }
  
  return { isValid: true }
}

// Compress image
export function compressImage(file: File, quality = 0.8, maxWidth = 1200): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: file.type,
          lastModified: Date.now()
        })
        resolve(compressedFile)
      }, file.type, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

// Get time of day greeting
export function getTimeGreeting(): string {
  const hour = new Date().getHours()
  
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

// Generate color from string (for avatars)
export function generateColorFromString(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ]
  
  return colors[Math.abs(hash) % colors.length]
}

// Local storage helpers
export const storage = {
  set(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  },
  
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue || null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue || null
    }
  },
  
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('Error removing from localStorage:', error)
    }
  },
  
  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// URL helpers
export function createShareUrl(type: 'memory' | 'anniversary', id: string): string {
  const baseUrl = window.location.origin
  return `${baseUrl}/share/${type}/${id}`
}

// Heart emoji variants
export function getRandomHeartEmoji(): string {
  const hearts = ['💖', '💕', '💗', '💓', '💝', '💘', '💌', '💒', '💞', '💟']
  return hearts[Math.floor(Math.random() * hearts.length)]
}

// Format memory content preview
export function formatMemoryPreview(content: string, maxLength = 100): string {
  const cleanContent = content.replace(/<[^>]*>/g, '') // Remove HTML tags
  return truncateText(cleanContent, maxLength)
}

// Check if date is special (anniversary, valentine's day, etc.)
export function isSpecialDate(date: Date, relationshipStart: Date): { isSpecial: boolean; reason?: string } {
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  // Valentine's Day
  if (month === 2 && day === 14) {
    return { isSpecial: true, reason: 'Valentine\'s Day' }
  }
  
  // Monthly anniversary
  if (day === relationshipStart.getDate()) {
    return { isSpecial: true, reason: 'Monthly Anniversary' }
  }
  
  // New Year
  if (month === 1 && day === 1) {
    return { isSpecial: true, reason: 'New Year' }
  }
  
  // Christmas
  if (month === 12 && day === 25) {
    return { isSpecial: true, reason: 'Christmas' }
  }
  
  return { isSpecial: false }
}

// Convert Vietnamese text for search
export function normalizeVietnameseText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

// Search function for Vietnamese text
export function vietnameseSearch(searchTerm: string, text: string): boolean {
  const normalizedSearch = normalizeVietnameseText(searchTerm)
  const normalizedText = normalizeVietnameseText(text)
  return normalizedText.includes(normalizedSearch)
}
