// Export all validation utilities for easy importing
export * from './validation'
export { useFormValidation, validationSchemas } from '../composables/useFormValidation'

// Common validation schemas for quick access
import { validationSchemas } from '../composables/useFormValidation'

export const commonSchemas = validationSchemas

// Quick validation functions for inline use
export { validationRules } from './validation'

// Re-export components
export { default as FormField } from '../components/common/FormField.vue'
export { default as ValidatedForm } from '../components/common/ValidatedForm.vue'
