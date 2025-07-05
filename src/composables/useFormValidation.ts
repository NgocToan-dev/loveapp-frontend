import { ref, reactive, computed, watch, readonly } from 'vue'
import { useI18n } from 'vue-i18n'
import type { 
  ValidationSchema, 
  ValidationResult, 
  FieldValidation 
} from '@/utils/validation'
import { validateField, validateForm, debounce } from '@/utils/validation'

export interface UseFormValidationOptions {
  validateOnBlur?: boolean
  validateOnInput?: boolean
  validateOnSubmit?: boolean
  debounceMs?: number
}

export const useFormValidation = (
  schema: ValidationSchema,
  options: UseFormValidationOptions = {}
) => {
  const { t } = useI18n()
  
  const {
    validateOnBlur = true,
    validateOnInput = false,
    validateOnSubmit = true,
    debounceMs = 300
  } = options

  // Form state
  const errors = ref<Record<string, string>>({})
  const touched = ref<Record<string, boolean>>({})
  const isValidating = ref(false)
  const isValid = ref(true)

  // Computed validation state
  const hasErrors = computed(() => Object.keys(errors.value).length > 0)
  const touchedFields = computed(() => Object.keys(touched.value))
  
  // Get error for specific field
  const getFieldError = (fieldName: string) => {
    return errors.value[fieldName] || null
  }

  // Check if field has been touched
  const isFieldTouched = (fieldName: string) => {
    return touched.value[fieldName] || false
  }

  // Check if field is valid
  const isFieldValid = (fieldName: string) => {
    return !errors.value[fieldName]
  }

  // Mark field as touched
  const touchField = (fieldName: string) => {
    touched.value[fieldName] = true
  }

  // Clear errors for specific field
  const clearFieldError = (fieldName: string) => {
    const newErrors = { ...errors.value }
    delete newErrors[fieldName]
    errors.value = newErrors
  }

  // Clear all errors
  const clearErrors = () => {
    errors.value = {}
  }

  // Clear touched state
  const clearTouched = () => {
    touched.value = {}
  }

  // Reset validation state
  const resetValidation = () => {
    clearErrors()
    clearTouched()
    isValid.value = true
  }

  // Validate single field
  const validateSingleField = (fieldName: string, value: any, formData?: any) => {
    const fieldValidation = schema[fieldName]
    if (!fieldValidation) return

    const error = validateField(value, fieldValidation.rules, formData, t)
    
    if (error) {
      errors.value[fieldName] = error
    } else {
      clearFieldError(fieldName)
    }
  }

  // Debounced field validation for input events
  const debouncedValidateField = debounce(validateSingleField, debounceMs)

  // Validate all fields
  const validateAllFields = (formData: Record<string, any>): ValidationResult => {
    isValidating.value = true
    
    const result = validateForm(formData, schema, t)
    errors.value = result.errors
    isValid.value = result.isValid
    
    isValidating.value = false
    return result
  }

  // Handle field blur event
  const handleFieldBlur = (fieldName: string, value: any, formData?: any) => {
    touchField(fieldName)
    
    if (validateOnBlur) {
      validateSingleField(fieldName, value, formData)
    }
  }

  // Handle field input event
  const handleFieldInput = (fieldName: string, value: any, formData?: any) => {
    // Clear error immediately when user starts typing
    if (errors.value[fieldName]) {
      clearFieldError(fieldName)
    }

    if (validateOnInput) {
      debouncedValidateField(fieldName, value, formData)
    }
  }

  // Handle form submit
  const handleFormSubmit = (formData: Record<string, any>): boolean => {
    // Mark all fields as touched
    Object.keys(schema).forEach(field => touchField(field))
    
    if (validateOnSubmit) {
      const result = validateAllFields(formData)
      return result.isValid
    }
    
    return true
  }

  // Add custom validation rule for a field
  const addFieldValidation = (fieldName: string, validation: FieldValidation) => {
    schema[fieldName] = validation
  }

  // Remove field validation
  const removeFieldValidation = (fieldName: string) => {
    delete schema[fieldName]
    clearFieldError(fieldName)
    delete touched.value[fieldName]
  }

  // Get validation props for Input component
  const getFieldProps = (fieldName: string) => {
    return {
      errorMessage: getFieldError(fieldName),
      isValid: isFieldValid(fieldName),
      isTouched: isFieldTouched(fieldName)
    }
  }

  // Create field handler that combines input and blur events
  const createFieldHandler = (fieldName: string, formData?: () => any) => {
    return {
      onBlur: () => {
        const data = formData ? formData() : {}
        handleFieldBlur(fieldName, data[fieldName], data)
      },
      onInput: (value: any) => {
        const data = formData ? formData() : {}
        data[fieldName] = value
        handleFieldInput(fieldName, value, data)
      }
    }
  }

  return {
    // State
    errors: readonly(errors),
    touched: readonly(touched),
    isValidating: readonly(isValidating),
    isValid: readonly(isValid),
    hasErrors,
    touchedFields,

    // Field methods
    getFieldError,
    isFieldTouched,
    isFieldValid,
    touchField,
    clearFieldError,
    getFieldProps,

    // Validation methods
    validateSingleField,
    validateAllFields,
    clearErrors,
    clearTouched,
    resetValidation,

    // Event handlers
    handleFieldBlur,
    handleFieldInput,
    handleFormSubmit,
    createFieldHandler,

    // Schema management
    addFieldValidation,
    removeFieldValidation
  }
}

// Predefined validation schemas for common forms
export const validationSchemas = {
  // Authentication forms
  login: {
    email: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'common.validation.email' }
      ]
    },
    password: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 6, message: 'common.validation.minLength' }
      ]
    }
  },

  register: {
    displayName: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 2, message: 'common.validation.minLength' },
        { test: (value: string) => value?.length <= 50, message: 'common.validation.maxLength' }
      ]
    },
    email: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'common.validation.email' }
      ]
    },
    password: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 8, message: 'common.validation.minLength' },
        { test: (value: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value), message: 'common.validation.password' }
      ]
    },
    confirmPassword: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string, formData: any) => value === formData?.password, message: 'common.validation.confirmPassword' }
      ]
    }
  },

  // Profile forms
  profile: {
    displayName: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 2, message: 'common.validation.minLength' },
        { test: (value: string) => value?.length <= 50, message: 'common.validation.maxLength' }
      ]
    },
    bio: {
      rules: [
        { test: (value: string) => !value || value.length <= 200, message: 'common.validation.maxLength' }
      ]
    },
    birthDate: {
      rules: [
        { test: (value: string) => {
          if (!value) return true
          const date = new Date(value)
          const today = new Date()
          return date <= today
        }, message: 'common.validation.pastDate' }
      ]
    },
    phone: {
      rules: [
        { test: (value: string) => {
          if (!value) return true
          return /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/.test(value.replace(/\s/g, ''))
        }, message: 'common.validation.phone' }
      ]
    }
  },

  // Memory forms
  memory: {
    title: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 3, message: 'common.validation.minLength' },
        { test: (value: string) => value?.length <= 100, message: 'common.validation.maxLength' }
      ]
    },
    content: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 10, message: 'common.validation.minLength' }
      ]
    },
    memoryDate: {
      rules: [
        { test: (value: string) => !!value, message: 'common.validation.required' },
        { test: (value: string) => {
          if (!value) return true
          const date = new Date(value)
          const today = new Date()
          return date <= today
        }, message: 'common.validation.pastDate' }
      ]
    }
  },

  // Reminder forms
  reminder: {
    title: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 3, message: 'common.validation.minLength' },
        { test: (value: string) => value?.length <= 100, message: 'common.validation.maxLength' }
      ]
    },
    reminderDate: {
      rules: [
        { test: (value: string) => !!value, message: 'common.validation.required' },
        { test: (value: string) => {
          if (!value) return true
          const date = new Date(value)
          return date instanceof Date && !isNaN(date.getTime())
        }, message: 'common.validation.validDate' }
      ]
    },
    reminderTime: {
      rules: [
        { test: (value: string) => !!value, message: 'common.validation.required' },
        { test: (value: string) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value), message: 'common.validation.validTime' }
      ]
    }
  },

  // Blog forms
  blog: {
    title: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 5, message: 'common.validation.minLength' },
        { test: (value: string) => value?.length <= 200, message: 'common.validation.maxLength' }
      ]
    },
    content: {
      rules: [
        { test: (value: string) => !!value?.trim(), message: 'common.validation.required' },
        { test: (value: string) => value?.length >= 50, message: 'common.validation.minLength' }
      ]
    },
    excerpt: {
      rules: [
        { test: (value: string) => !value || value.length <= 300, message: 'common.validation.maxLength' }
      ]
    }
  }
}
