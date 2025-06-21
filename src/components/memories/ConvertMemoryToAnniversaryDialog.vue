<template>
  <v-dialog 
    v-model="dialog" 
    max-width="700"
    persistent
    scrollable
  >
    <v-card class="convert-dialog">
      <v-card-title class="pa-6 pb-4">
        <div class="d-flex align-center">
          <v-icon icon="mdi-calendar-star" color="primary" size="28" class="me-3" />
          <div>
            <h2 class="text-h5 font-weight-bold">
              {{ $t('memories.convert.title') }}
            </h2>
            <p class="text-body-2 text-medium-emphasis mt-1 mb-0">
              {{ $t('memories.convert.subtitle') }}
            </p>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-6">
        <v-row>
          <!-- Memory Preview -->
          <v-col cols="12" md="5">
            <div class="memory-preview">
              <h3 class="text-h6 mb-3">{{ $t('memories.convert.originalMemory') }}</h3>
              
              <v-card variant="outlined" class="memory-preview-card">
                <div v-if="memoryImage" class="preview-image">
                  <v-img
                    :src="memoryImage"
                    :alt="memory?.title"
                    height="150"
                    cover
                  />
                </div>
                
                <v-card-text class="pa-4">
                  <h4 class="text-subtitle-1 font-weight-medium mb-2">
                    {{ memory?.title }}
                  </h4>
                  <p class="text-body-2 text-medium-emphasis mb-2 line-clamp-2">
                    {{ memory?.description }}
                  </p>
                  <div class="d-flex align-center text-caption text-medium-emphasis">
                    <v-icon icon="mdi-calendar" size="14" class="me-1" />
                    {{ formatDate(memory?.date) }}
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>

          <!-- Anniversary Form -->
          <v-col cols="12" md="7">
            <div class="anniversary-form">
              <h3 class="text-h6 mb-4">{{ $t('memories.convert.anniversaryDetails') }}</h3>
              
              <v-form v-model="isFormValid" @submit.prevent="handleConvert">
                <!-- Anniversary Title -->
                <v-text-field
                  v-model="form.title"
                  :label="$t('anniversaries.form.title')"
                  :placeholder="memory?.title"
                  :rules="titleRules"
                  variant="outlined"
                  class="mb-4"
                  required
                />

                <!-- Anniversary Date -->
                <v-text-field
                  v-model="form.date"
                  :label="$t('anniversaries.form.date')"
                  type="date"
                  :rules="dateRules"
                  variant="outlined"
                  class="mb-4"
                  required
                />

                <!-- Description -->
                <v-textarea
                  v-model="form.description"
                  :label="$t('anniversaries.form.description')"
                  :placeholder="memory?.description"
                  variant="outlined"
                  rows="3"
                  class="mb-4"
                />

                <!-- Anniversary Type -->
                <v-select
                  v-model="form.type"
                  :items="anniversaryTypes"
                  :label="$t('anniversaries.form.type')"
                  variant="outlined"
                  class="mb-4"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :color="item.raw.color" size="20">
                          {{ item.raw.icon }}
                        </v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>

                <!-- Repeat Options -->
                <v-select
                  v-model="form.repeat"
                  :items="repeatOptions"
                  :label="$t('anniversaries.form.repeat')"
                  variant="outlined"
                  class="mb-4"
                />

                <!-- Reminder Settings -->
                <div class="reminder-section">
                  <h4 class="text-subtitle-1 mb-3">{{ $t('anniversaries.form.reminders') }}</h4>
                  
                  <v-switch
                    v-model="form.enableReminder"
                    :label="$t('anniversaries.form.enableReminder')"
                    color="primary"
                    class="mb-3"
                  />

                  <div v-if="form.enableReminder" class="reminder-settings">
                    <v-select
                      v-model="form.reminderDays"
                      :items="reminderDayOptions"
                      :label="$t('anniversaries.form.reminderDays')"
                      variant="outlined"
                      multiple
                      chips
                      class="mb-3"
                    />
                  </div>
                </div>

                <!-- Privacy Settings -->
                <v-switch
                  v-model="form.isPrivate"
                  :label="$t('anniversaries.form.private')"
                  color="secondary"
                  class="mb-4"
                />
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-6">
        <v-spacer />
        
        <v-btn
          variant="outlined"
          @click="handleCancel"
          :disabled="isLoading"
        >
          {{ $t('common.cancel') }}
        </v-btn>
        
        <v-btn
          color="primary"
          variant="elevated"
          :loading="isLoading"
          :disabled="!isFormValid"
          @click="handleConvert"
        >
          <v-icon start icon="mdi-calendar-star" />
          {{ $t('memories.convert.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMemoriesStore } from '@/stores/memories'
import { useNotificationsStore } from '@/stores/notifications'
import type { Memory } from '@/types'

interface Props {
  modelValue: boolean
  memory?: Memory
}

interface ConvertForm {
  title: string
  date: string
  description: string
  type: string
  repeat: string
  enableReminder: boolean
  reminderDays: number[]
  isPrivate: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'convert': [data: ConvertForm]
}>()

const { t } = useI18n()
const memoriesStore = useMemoriesStore()
const notificationsStore = useNotificationsStore()

// Local state
const dialog = ref(props.modelValue)
const isLoading = ref(false)
const isFormValid = ref(false)

// Form data
const form = ref<ConvertForm>({
  title: '',
  date: '',
  description: '',
  type: 'relationship',
  repeat: 'yearly',
  enableReminder: true,
  reminderDays: [7, 1],
  isPrivate: false
})

// Form options
const anniversaryTypes = computed(() => [
  { title: t('anniversaries.types.relationship'), value: 'relationship', icon: 'mdi-heart', color: 'red' },
  { title: t('anniversaries.types.first-meet'), value: 'first-meet', icon: 'mdi-heart-flash', color: 'pink' },
  { title: t('anniversaries.types.first-date'), value: 'first-date', icon: 'mdi-calendar-heart', color: 'purple' },
  { title: t('anniversaries.types.engagement'), value: 'engagement', icon: 'mdi-ring', color: 'indigo' },
  { title: t('anniversaries.types.marriage'), value: 'marriage', icon: 'mdi-church', color: 'deep-purple' },
  { title: t('anniversaries.types.milestone'), value: 'milestone', icon: 'mdi-trophy', color: 'success' },
  { title: t('anniversaries.types.custom'), value: 'custom', icon: 'mdi-star', color: 'amber' }
])

const repeatOptions = computed(() => [
  { title: t('anniversaries.repeat.yearly'), value: 'yearly' },
  { title: t('anniversaries.repeat.monthly'), value: 'monthly' },
  { title: t('anniversaries.repeat.none'), value: 'none' }
])

const reminderDayOptions = computed(() => [
  { title: t('anniversaries.reminder.1day'), value: 1 },
  { title: t('anniversaries.reminder.3days'), value: 3 },
  { title: t('anniversaries.reminder.1week'), value: 7 },
  { title: t('anniversaries.reminder.2weeks'), value: 14 },
  { title: t('anniversaries.reminder.1month'), value: 30 }
])

// Validation rules
const titleRules = computed(() => [
  (v: string) => !!v || t('validation.required'),
  (v: string) => v.length >= 3 || t('validation.minLength', { min: 3 })
])

const dateRules = computed(() => [
  (v: string) => !!v || t('validation.required'),
  (v: string) => !isNaN(Date.parse(v)) || t('validation.invalidDate')
])

// Memory data
const memoryImage = computed(() => {
  if (!props.memory) return null
  const imageFile = props.memory.files?.find(file => 
    file.type?.startsWith('image/') || 
    /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
  )
  return imageFile?.url || imageFile?.name
})

// Utility functions
const formatDate = (date?: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Event handlers
const handleConvert = async () => {
  if (!isFormValid.value || !props.memory) return
  
  isLoading.value = true
  try {    const success = await memoriesStore.convertMemoryToAnniversary(props.memory.id, {
      title: form.value.title,
      description: form.value.description,
      date: form.value.date,
      isRecurring: form.value.repeat !== 'none'
    })

    if (success) {
      notificationsStore.createNotification({
        type: 'memory',
        title: t('memories.convert.success'),
        message: t('memories.convert.successMessage', { title: form.value.title })
      })
      dialog.value = false
    } else {
      notificationsStore.createNotification({
        type: 'memory',
        title: t('memories.convert.error'),
        message: memoriesStore.error || t('memories.convert.errorMessage')
      })
    }
  } finally {
    isLoading.value = false
  }
}

const handleCancel = () => {
  dialog.value = false
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  dialog.value = newValue
})

watch(dialog, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.memory, (newMemory) => {
  if (newMemory) {
    // Pre-fill form with memory data
    form.value.title = newMemory.title
    form.value.date = newMemory.date
    form.value.description = newMemory.description || ''
    
    // Determine anniversary type based on memory category
    const categoryToType = {
      'first-meet': 'first-meet',
      'date': 'first-date',
      'milestone': 'milestone'
    }
    form.value.type = categoryToType[newMemory.category as keyof typeof categoryToType] || 'relationship'
  }
}, { immediate: true })
</script>

<style scoped>
.convert-dialog {
  border-radius: 20px;
}

.memory-preview-card {
  border-radius: 16px;
  overflow: hidden;
}

.preview-image {
  position: relative;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.reminder-section {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.reminder-settings {
  padding-left: 16px;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

/* Mobile responsive */
@media (max-width: 768px) {
  .convert-dialog {
    margin: 8px;
    max-height: 90vh;
  }
  
  .anniversary-form .v-text-field,
  .anniversary-form .v-textarea,
  .anniversary-form .v-select {
    margin-bottom: 16px;
  }
}

/* Dark theme adjustments */
.v-theme--dark .reminder-section {
  background: rgba(var(--v-theme-surface-variant), 0.2);
}

.v-theme--dark .reminder-settings {
  border-left-color: rgba(var(--v-theme-primary), 0.8);
}

/* Animation */
.convert-dialog {
  animation: slideInUp 0.4s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
