<template>
  <form @submit.prevent="handleSubmit" class="validated-form">
    <slot 
      :errors="errors"
      :touched="touched"
      :isValid="isValid"
      :isValidating="isValidating"
      :hasErrors="hasErrors"
      :getFieldError="getFieldError"
      :getFieldProps="getFieldProps"
      :handleFieldInput="handleFieldInput"
      :handleFieldBlur="handleFieldBlur"
      :clearFieldError="clearFieldError"
      :validateField="validateSingleField"
      :resetValidation="resetValidation"
    />
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'
import type { ValidationSchema } from '@/utils/validation'

interface Props {
  schema: ValidationSchema
  modelValue?: Record<string, any>
  validateOnSubmit?: boolean
  validateOnBlur?: boolean
  validateOnInput?: boolean
  debounceMs?: number
  resetOnSubmit?: boolean
}

interface Emits {
  'update:modelValue': [value: Record<string, any>]
  'submit': [data: Record<string, any>, isValid: boolean]
  'invalid-submit': [data: Record<string, any>, errors: Record<string, string>]
  'field-change': [fieldName: string, value: any]
  'validation-change': [isValid: boolean, errors: Record<string, string>]
}

const props = withDefaults(defineProps<Props>(), {
  validateOnSubmit: true,
  validateOnBlur: true,
  validateOnInput: false,
  debounceMs: 300,
  resetOnSubmit: false
})

const emit = defineEmits<Emits>()

// Form data
const formData = ref<Record<string, any>>(props.modelValue || {})

// Initialize validation
const {
  errors,
  touched,
  isValid,
  isValidating,
  hasErrors,
  getFieldError,
  getFieldProps,
  handleFieldInput: handleInput,
  handleFieldBlur: handleBlur,
  validateSingleField,
  validateAllFields,
  resetValidation,
  clearFieldError
} = useFormValidation(props.schema, {
  validateOnBlur: props.validateOnBlur,
  validateOnInput: props.validateOnInput,
  validateOnSubmit: props.validateOnSubmit,
  debounceMs: props.debounceMs
})

// Enhanced field handlers that update form data
const handleFieldInput = (fieldName: string, value: any) => {
  // Update form data
  formData.value[fieldName] = value
  
  // Emit update
  emit('update:modelValue', formData.value)
  emit('field-change', fieldName, value)
  
  // Handle validation
  handleInput(fieldName, value, formData.value)
}

const handleFieldBlur = (fieldName: string, value: any) => {
  // Handle validation
  handleBlur(fieldName, value, formData.value)
}

// Form submit handler
const handleSubmit = async () => {
  try {
    const isFormValid = validateAllFields(formData.value).isValid
    
    if (isFormValid) {
      emit('submit', formData.value, true)
      
      if (props.resetOnSubmit) {
        await nextTick()
        resetForm()
      }
    } else {
      emit('invalid-submit', formData.value, errors.value)
    }
  } catch (error) {
    console.error('Form submission error:', error)
  }
}

// Reset form
const resetForm = () => {
  formData.value = {}
  resetValidation()
  emit('update:modelValue', {})
}

// Set form data
const setFormData = (data: Record<string, any>) => {
  formData.value = { ...data }
  emit('update:modelValue', formData.value)
}

// Set field value
const setFieldValue = (fieldName: string, value: any) => {
  formData.value[fieldName] = value
  emit('update:modelValue', formData.value)
  emit('field-change', fieldName, value)
}

// Get field value
const getFieldValue = (fieldName: string) => {
  return formData.value[fieldName]
}

// Validate specific field
const validateField = (fieldName: string) => {
  const value = formData.value[fieldName]
  validateSingleField(fieldName, value, formData.value)
}

// Watch for external model value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue && typeof newValue === 'object') {
    formData.value = { ...newValue }
  }
}, { immediate: true, deep: true })

// Watch validation state changes
watch([isValid, errors], ([valid, errs]) => {
  emit('validation-change', valid, errs)
}, { deep: true })

// Expose methods for parent component
defineExpose({
  formData,
  errors,
  touched,
  isValid,
  isValidating,
  hasErrors,
  resetForm,
  setFormData,
  setFieldValue,
  getFieldValue,
  validateField,
  validateAllFields: () => validateAllFields(formData.value),
  resetValidation,
  clearFieldError,
  getFieldError,
  getFieldProps
})
</script>

<style scoped>
.validated-form {
  width: 100%;
}
</style>
