import { useI18n } from 'vue-i18n'

// Validation rules type
export interface ValidationRule {
  test: (value: any, formData?: any) => boolean
  message: string
}

// Common validation functions
export const validationRules = {
  // Required field
  required: (message?: string): ValidationRule => ({
    test: (value: any) => {
      if (typeof value === 'string') return value.trim().length > 0
      if (Array.isArray(value)) return value.length > 0
      return value !== null && value !== undefined && value !== ''
    },
    message: message || 'common.validation.required'
  }),

  // Minimum length
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value: string) => !value || value.length >= min,
    message: message || 'common.validation.minLength'
  }),

  // Maximum length
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value: string) => !value || value.length <= max,
    message: message || 'common.validation.maxLength'
  }),

  // Email format
  email: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    message: message || 'common.validation.email'
  }),

  // Password strength
  password: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
      return passwordRegex.test(value)
    },
    message: message || 'common.validation.password'
  }),

  // Confirm password
  confirmPassword: (passwordField: string, message?: string): ValidationRule => ({
    test: (value: string, formData: any) => {
      if (!value) return true
      return value === formData[passwordField]
    },
    message: message || 'common.validation.confirmPassword'
  }),

  // Date in future (for reminders, events)
  futureDate: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      const selectedDate = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    },
    message: message || 'common.validation.futureDate'
  }),

  // Date in past (for memories, birthdays)
  pastDate: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      const selectedDate = new Date(value)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      return selectedDate <= today
    },
    message: message || 'common.validation.pastDate'
  }),

  // Valid date format
  validDate: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      const date = new Date(value)
      return date instanceof Date && !isNaN(date.getTime())
    },
    message: message || 'common.validation.validDate'
  }),

  // Valid time format (HH:MM)
  validTime: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
      return timeRegex.test(value)
    },
    message: message || 'common.validation.validTime'
  }),

  // Phone number
  phone: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      // Vietnamese phone number format
      const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/
      return phoneRegex.test(value.replace(/\s/g, ''))
    },
    message: message || 'common.validation.phone'
  }),

  // URL format
  url: (message?: string): ValidationRule => ({
    test: (value: string) => {
      if (!value) return true
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message: message || 'common.validation.url'
  }),

  // Numeric value
  numeric: (message?: string): ValidationRule => ({
    test: (value: any) => {
      if (!value && value !== 0) return true
      return !isNaN(Number(value))
    },
    message: message || 'common.validation.numeric'
  }),

  // Minimum value
  min: (minValue: number, message?: string): ValidationRule => ({
    test: (value: any) => {
      if (!value && value !== 0) return true
      return Number(value) >= minValue
    },
    message: message || 'common.validation.min'
  }),

  // Maximum value
  max: (maxValue: number, message?: string): ValidationRule => ({
    test: (value: any) => {
      if (!value && value !== 0) return true
      return Number(value) <= maxValue
    },
    message: message || 'common.validation.max'
  }),

  // File size validation (in MB)
  fileSize: (maxSizeMB: number, message?: string): ValidationRule => ({
    test: (file: File) => {
      if (!file) return true
      return file.size <= maxSizeMB * 1024 * 1024
    },
    message: message || 'common.validation.fileSize'
  }),

  // File type validation
  fileType: (allowedTypes: string[], message?: string): ValidationRule => ({
    test: (file: File) => {
      if (!file) return true
      return allowedTypes.includes(file.type)
    },
    message: message || 'common.validation.fileType'
  }),

  // Custom validation
  custom: (testFn: (value: any, formData?: any) => boolean, message: string): ValidationRule => ({
    test: testFn,
    message
  })
}

// Field validation configuration
export interface FieldValidation {
  rules: ValidationRule[]
  validateOn?: 'blur' | 'input' | 'submit'
}

// Form validation schema
export interface ValidationSchema {
  [fieldName: string]: FieldValidation
}

// Validation result
export interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

// Validate single field
export const validateField = (
  value: any,
  rules: ValidationRule[],
  formData?: any,
  t?: (key: string, params?: any) => string
): string | null => {
  for (const rule of rules) {
    if (!rule.test(value, formData)) {
      if (t) {
        // Try to translate with parameters
        if (rule.message.includes('minLength')) {
          const minMatch = rule.message.match(/minLength.*?(\d+)/)
          const min = minMatch ? parseInt(minMatch[1]) : 0
          return t('common.validation.minLength', { min })
        }
        if (rule.message.includes('maxLength')) {
          const maxMatch = rule.message.match(/maxLength.*?(\d+)/)
          const max = maxMatch ? parseInt(maxMatch[1]) : 0
          return t('common.validation.maxLength', { max })
        }
        if (rule.message.includes('min')) {
          const minMatch = rule.message.match(/min.*?(\d+)/)
          const min = minMatch ? parseInt(minMatch[1]) : 0
          return t('common.validation.min', { min })
        }
        if (rule.message.includes('max')) {
          const maxMatch = rule.message.match(/max.*?(\d+)/)
          const max = maxMatch ? parseInt(maxMatch[1]) : 0
          return t('common.validation.max', { max })
        }
        if (rule.message.includes('fileSize')) {
          const sizeMatch = rule.message.match(/fileSize.*?(\d+)/)
          const size = sizeMatch ? parseInt(sizeMatch[1]) : 0
          return t('common.validation.fileSize', { size })
        }
        return t(rule.message)
      }
      return rule.message
    }
  }
  return null
}

// Validate entire form
export const validateForm = (
  formData: Record<string, any>,
  schema: ValidationSchema,
  t?: (key: string, params?: any) => string
): ValidationResult => {
  const errors: Record<string, string> = {}

  for (const [fieldName, validation] of Object.entries(schema)) {
    const value = formData[fieldName]
    const error = validateField(value, validation.rules, formData, t)
    if (error) {
      errors[fieldName] = error
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Debounce function for input validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait) as unknown as number
  }
}
