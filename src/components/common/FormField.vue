<template>
  <div class="form-field">
    <label v-if="label" :for="fieldId" class="form-label">
      {{ label }}
      <span v-if="required" class="required-indicator">*</span>
    </label>
    
    <div class="input-wrapper">
      <!-- Text Input -->
      <input
        v-if="type === 'text' || type === 'email' || type === 'password' || type === 'tel' || type === 'url'"
        :id="fieldId"
        v-model="internalValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :class="inputClasses"
        @blur="handleBlur"
        @input="handleInput"
        @focus="handleFocus"
      />
      
      <!-- Number Input -->
      <input
        v-else-if="type === 'number'"
        :id="fieldId"
        v-model.number="internalValue"
        type="number"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :min="min"
        :max="max"
        :step="step"
        :class="inputClasses"
        @blur="handleBlur"
        @input="handleInput"
        @focus="handleFocus"
      />
      
      <!-- Date Input -->
      <input
        v-else-if="type === 'date'"
        :id="fieldId"
        v-model="internalValue"
        type="date"
        :disabled="disabled"
        :readonly="readonly"
        :min="minDate"
        :max="maxDate"
        :class="inputClasses"
        @blur="handleBlur"
        @input="handleInput"
        @focus="handleFocus"
      />
      
      <!-- Time Input -->
      <input
        v-else-if="type === 'time'"
        :id="fieldId"
        v-model="internalValue"
        type="time"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @blur="handleBlur"
        @input="handleInput"
        @focus="handleFocus"
      />
      
      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="fieldId"
        v-model="internalValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :maxlength="maxlength"
        :class="textareaClasses"
        @blur="handleBlur"
        @input="handleInput"
        @focus="handleFocus"
      ></textarea>
      
      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="fieldId"
        v-model="internalValue"
        :disabled="disabled"
        :class="selectClasses"
        @blur="handleBlur"
        @change="handleInput"
        @focus="handleFocus"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <!-- File Input -->
      <input
        v-else-if="type === 'file'"
        :id="fieldId"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :disabled="disabled"
        :class="fileInputClasses"
        @change="handleFileChange"
        @focus="handleFocus"
      />
      
      <!-- Checkbox -->
      <div v-else-if="type === 'checkbox'" class="checkbox-wrapper">
        <input
          :id="fieldId"
          v-model="internalValue"
          type="checkbox"
          :disabled="disabled"
          :class="checkboxClasses"
          @change="handleInput"
          @focus="handleFocus"
        />
        <label v-if="checkboxLabel" :for="fieldId" class="checkbox-label">
          {{ checkboxLabel }}
        </label>
      </div>
      
      <!-- Radio Group -->
      <div v-else-if="type === 'radio'" class="radio-group">
        <div
          v-for="option in options"
          :key="option.value"
          class="radio-item"
        >
          <input
            :id="`${fieldId}_${option.value}`"
            v-model="internalValue"
            type="radio"
            :value="option.value"
            :disabled="disabled"
            :class="radioClasses"
            @change="handleInput"
            @focus="handleFocus"
          />
          <label :for="`${fieldId}_${option.value}`" class="radio-label">
            {{ option.label }}
          </label>
        </div>
      </div>
    </div>
    
    <!-- Help Text -->
    <div v-if="helpText && !errorMessage" class="help-text">
      {{ helpText }}
    </div>
    
    <!-- Error Message -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <!-- Success Message -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    
    <!-- Character Count -->
    <div
      v-if="showCharacterCount && maxlength"
      class="character-count"
      :class="{ 'near-limit': characterCount >= maxlength * 0.8 }"
    >
      {{ characterCount }}/{{ maxlength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Option {
  label: string
  value: string | number
}

interface Props {
  modelValue?: any
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'number' | 'date' | 'time' | 'textarea' | 'select' | 'file' | 'checkbox' | 'radio'
  label?: string
  placeholder?: string
  helpText?: string
  errorMessage?: string
  successMessage?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  
  // Input-specific props
  maxlength?: number
  minlength?: number
  min?: number | string
  max?: number | string
  step?: number
  rows?: number
  
  // Date props
  minDate?: string
  maxDate?: string
  
  // File props
  accept?: string
  multiple?: boolean
  
  // Select/Radio props
  options?: Option[]
  
  // Checkbox props
  checkboxLabel?: string
  
  // UI props
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  showCharacterCount?: boolean
  
  // Validation props
  validationRules?: any[]
  validateOn?: 'blur' | 'input' | 'submit'
}

interface Emits {
  'update:modelValue': [value: any]
  'blur': [event: Event]
  'focus': [event: Event]
  'input': [value: any]
  'change': [value: any]
  'validate': [value: any, isValid: boolean, error?: string]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  variant: 'default',
  rows: 3,
  validateOn: 'blur'
})

const emit = defineEmits<Emits>()

// Generate unique field ID
const fieldId = computed(() => `field_${Math.random().toString(36).substr(2, 9)}`)

// Internal value management
const internalValue = ref(props.modelValue)
const isFocused = ref(false)

// Character count
const characterCount = computed(() => {
  if (typeof internalValue.value === 'string') {
    return internalValue.value.length
  }
  return 0
})

// CSS Classes
const baseInputClasses = [
  'form-input',
  'w-full',
  'px-3',
  'py-2',
  'border',
  'rounded-md',
  'transition-colors',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary-500',
  'focus:border-primary-500'
]

const inputClasses = computed(() => [
  ...baseInputClasses,
  {
    'border-gray-300': !props.errorMessage && !props.successMessage,
    'border-red-500 focus:ring-red-500 focus:border-red-500': props.errorMessage,
    'border-green-500 focus:ring-green-500 focus:border-green-500': props.successMessage,
    'bg-gray-100 cursor-not-allowed': props.disabled,
    'bg-gray-50': props.readonly,
    'text-sm py-1.5': props.size === 'sm',
    'text-base py-2': props.size === 'md',
    'text-lg py-3': props.size === 'lg'
  }
])

const textareaClasses = computed(() => [
  ...baseInputClasses,
  'resize-vertical',
  {
    'border-gray-300': !props.errorMessage && !props.successMessage,
    'border-red-500 focus:ring-red-500 focus:border-red-500': props.errorMessage,
    'border-green-500 focus:ring-green-500 focus:border-green-500': props.successMessage,
    'bg-gray-100 cursor-not-allowed': props.disabled,
    'bg-gray-50': props.readonly
  }
])

const selectClasses = computed(() => [
  ...baseInputClasses,
  'cursor-pointer',
  {
    'border-gray-300': !props.errorMessage && !props.successMessage,
    'border-red-500 focus:ring-red-500 focus:border-red-500': props.errorMessage,
    'border-green-500 focus:ring-green-500 focus:border-green-500': props.successMessage,
    'bg-gray-100 cursor-not-allowed': props.disabled
  }
])

const fileInputClasses = computed(() => [
  'form-input',
  'w-full',
  'px-3',
  'py-2',
  'border',
  'rounded-md',
  'transition-colors',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-primary-500',
  'focus:border-primary-500',
  'file:mr-3',
  'file:py-1',
  'file:px-3',
  'file:rounded-md',
  'file:border-0',
  'file:bg-primary-50',
  'file:text-primary-700',
  'file:cursor-pointer',
  'hover:file:bg-primary-100',
  {
    'border-gray-300': !props.errorMessage,
    'border-red-500': props.errorMessage,
    'bg-gray-100 cursor-not-allowed': props.disabled
  }
])

const checkboxClasses = computed(() => [
  'form-checkbox',
  'h-4',
  'w-4',
  'text-primary-600',
  'focus:ring-primary-500',
  'border-gray-300',
  'rounded',
  {
    'cursor-not-allowed': props.disabled
  }
])

const radioClasses = computed(() => [
  'form-radio',
  'h-4',
  'w-4',
  'text-primary-600',
  'focus:ring-primary-500',
  'border-gray-300',
  {
    'cursor-not-allowed': props.disabled
  }
])

// Event handlers
const handleInput = (event?: Event) => {
  let value = internalValue.value
  
  if (event?.target && 'value' in event.target) {
    value = (event.target as HTMLInputElement).value
    internalValue.value = value
  }
  
  emit('update:modelValue', value)
  emit('input', value)
  
  if (props.validateOn === 'input') {
    validateField(value)
  }
}

const handleBlur = (event: Event) => {
  isFocused.value = false
  emit('blur', event)
  
  if (props.validateOn === 'blur') {
    validateField(internalValue.value)
  }
}

const handleFocus = (event: Event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  
  if (files) {
    const value = props.multiple ? Array.from(files) : files[0]
    internalValue.value = value
    emit('update:modelValue', value)
    emit('change', value)
    
    if (props.validateOn === 'input') {
      validateField(value)
    }
  }
}

// Validation
const validateField = (value: any) => {
  if (!props.validationRules?.length) return
  
  // Here you would integrate with your validation system
  // For now, emit the validate event for parent to handle
  emit('validate', value, true) // Placeholder - implement actual validation
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
}, { immediate: true })
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.required-indicator {
  color: #ef4444;
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
}

.help-text {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.error-message {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
}

.success-message {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #16a34a;
}

.character-count {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
}

.character-count.near-limit {
  color: #f97316;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label {
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-label {
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

/* Form input base styles */
.form-input {
  appearance: none;
}

.form-input:disabled {
  opacity: 0.5;
}

.form-checkbox:checked {
  background-color: #22c55e;
  border-color: #22c55e;
}

.form-radio:checked {
  background-color: #22c55e;
  border-color: #22c55e;
}

/* File input custom styling */
.form-input[type="file"]::-webkit-file-upload-button {
  margin-right: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  border: 0;
  background-color: #f0fdf4;
  color: #15803d;
  cursor: pointer;
}

.form-input[type="file"]::-webkit-file-upload-button:hover {
  background-color: #dcfce7;
}
</style>
