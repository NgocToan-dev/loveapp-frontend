<template>
  <div class="relative w-full">
    <!-- Selected Items Display -->
    <div v-if="modelValue.length > 0" class="mb-2">
      <div class="flex flex-wrap gap-2">
        <span
          v-for="item in modelValue"
          :key="item[keyValue]"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
        >
          {{ item[displayValue] }}
          <button
            type="button"
            @click="removeItem(item)"
            class="flex-shrink-0 ml-1.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-pink-400 hover:bg-pink-200 hover:text-pink-500 focus:outline-none focus:bg-pink-500 focus:text-white"
          >
            <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
              <path stroke-linecap="round" stroke-width="1.5" d="m1 1 6 6m0-6-6 6" />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <Combobox
      :model-value="modelValue"
      multiple
      @update:model-value="handleUpdate"
    >
      <div class="relative">
        <ComboboxInput
          v-model="query"
          :placeholder="placeholder"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          @change="handleInputChange"
        />
        <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            class="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </ComboboxButton>
      </div>

      <Transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-out"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <ComboboxOptions
          class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <ComboboxOption
            v-for="option in filteredOptions"
            :key="option[keyValue]"
            :value="option"
            class="cursor-pointer select-none"
            v-slot="{ active, selected }"
          >
            <div :class="[
              'py-2 px-4 flex items-center relative',
              active ? 'bg-pink-500 text-white' : 'text-gray-900 hover:bg-gray-50'
            ]">
              <span :class="[
                'block truncate',
                selected ? 'font-semibold' : 'font-normal'
              ]">
                {{ option[displayValue] }}
              </span>
              <span v-if="selected" class="absolute right-0 flex items-center pr-4">
                <svg class="h-5 w-5" :class="active ? 'text-white' : 'text-pink-600'" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
            </div>
          </ComboboxOption>

          <div v-if="filteredOptions.length === 0" class="relative cursor-default select-none py-2 px-4 text-gray-700">
            {{ $t('common.noResults') }}
          </div>
        </ComboboxOptions>
      </Transition>
    </Combobox>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxButton
} from '@headlessui/vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    options: any[]
    modelValue: any[]
    keyValue: string
    displayValue: string
    placeholder?: string
  }>(),
  {
    placeholder: '',
    modelValue: () => []
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: any[]): void
}>()

const query = ref('')

// Filter options by query
const filteredOptions = computed(() => {
  const q = query.value.toLowerCase()
  if (!q) return props.options
  return props.options.filter(option =>
    option[props.displayValue]?.toLowerCase().includes(q)
  )
})

// Handle model value update - prevent infinite loop
const handleUpdate = (value: any[]) => {
  if (!Array.isArray(value)) return
  
  // Only emit if the value actually changed
  const currentValue = props.modelValue || []
  const valueHasChanged = value.length !== currentValue.length || 
    value.some((item, index) => item[props.keyValue] !== currentValue[index]?.[props.keyValue])
  
  if (valueHasChanged) {
    emit('update:modelValue', value)
  }
  
  // Clear query after selection
  query.value = ''
}

// Handle input change
const handleInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  query.value = target.value
}

// Remove selected item
const removeItem = (itemToRemove: any) => {
  const currentValue = Array.isArray(props.modelValue) ? props.modelValue : []
  const newValue = currentValue.filter(item => item[props.keyValue] !== itemToRemove[props.keyValue])
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
/* ComboBox focus styles */
.combobox-input:focus {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

/* Dropdown positioning */
.absolute {
  position: absolute;
}

.z-50 {
  z-index: 50;
}

/* Option hover styles */
[data-headlessui-state~="active"] {
  background-color: #ec4899 !important;
  color: white !important;
}

[data-headlessui-state~="active"] * {
  color: inherit !important;
}

/* Text color fixes */
.text-gray-900 {
  color: #111827 !important;
}

.text-white {
  color: white !important;
}

/* Ensure text is visible */
span {
  color: inherit;
  font-size: 14px;
  line-height: 1.5;
}

/* Ensure proper spacing */
.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Dropdown container */
.max-h-60 {
  max-height: 15rem;
}

.overflow-auto {
  overflow: auto;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.ring-1 {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.ring-black {
  --tw-ring-color: rgb(0 0 0);
}

.ring-opacity-5 {
  --tw-ring-opacity: 0.05;
}
</style>
