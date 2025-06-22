<template>
  <v-card rounded="xl" elevation="0" class="reminder-form-card" :style="{ backgroundColor: 'rgb(var(--v-theme-surface))', border: '1px solid rgb(var(--v-theme-outline-variant))' }">
    <v-card-text class="reminder-form-content">
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="formData.title"
              :label="t('reminders.form.title')"
              :rules="titleRules"
              variant="outlined"
              rounded="xl"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="formData.description"
              :label="t('reminders.form.description')"
              variant="outlined"
              rounded="xl"
              rows="3"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.reminderDate"
              :label="t('reminders.form.date')"
              type="datetime-local"
              variant="outlined"
              rounded="xl"
              :rules="dateRules"
              required
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.repeat"
              :items="repeatOptions"
              :label="t('reminders.form.repeat')"
              variant="outlined"
              rounded="xl"
              clearable
            />
          </v-col>
          <v-col cols="12">
            <v-chip-group v-model="formData.priority" mandatory variant="tonal">
              <v-chip
                v-for="opt in priorityOptions"
                :key="opt.value"
                :value="opt.value"
                :color="opt.color"
                class="ma-1"
              >
                <v-icon start size="16">{{ opt.icon }}</v-icon>
                {{ opt.label }}
              </v-chip>
            </v-chip-group>
          </v-col>
          <v-col cols="12" v-if="formMode === 'edit'">
            <v-switch v-model="formData.isCompleted" :label="t('reminders.form.completed')" color="success" />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn variant="outlined" rounded="xl" size="large" @click="$emit('cancel')">
        {{ t('common.cancel') }}
      </v-btn>
      <v-btn color="primary" rounded="xl" size="large" :loading="isLoading" :disabled="!valid" @click="handleSubmit">
        <v-icon start>{{ formMode === 'create' ? 'mdi-plus' : 'mdi-content-save' }}</v-icon>
        {{ formMode === 'create' ? t('reminders.create') : t('reminders.update') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Reminder } from '@/types'

// Define props and emits using script setup macros
const props = defineProps<{ formMode: 'create' | 'edit'; initialData?: Reminder }>()

const emit = defineEmits<{
  cancel: []
  confirm: [Partial<Reminder>]
}>()
const { t } = useI18n()

const form = ref()
const valid = ref(false)
const isLoading = ref(false)

const formData = ref<Partial<Reminder>>({
  title: '',
  description: '',
  reminderDate: '',
  priority: 'medium',
  repeat: undefined,
  isCompleted: false
})

const titleRules = [
  (v: string) => !!v || t('validation.required')
]
const dateRules = [
  (v: string) => !!v || t('validation.required')
]

const priorityOptions = [
  { value: 'low', label: t('reminders.priority.low'), icon: 'mdi-arrow-down', color: 'success' },
  { value: 'medium', label: t('reminders.priority.medium'), icon: 'mdi-minus', color: 'warning' },
  { value: 'high', label: t('reminders.priority.high'), icon: 'mdi-arrow-up', color: 'error' }
]
const repeatOptions = [
  { title: t('reminders.repeat.none'), value: undefined },
  { title: t('reminders.repeat.daily'), value: 'daily' },
  { title: t('reminders.repeat.weekly'), value: 'weekly' },
  { title: t('reminders.repeat.monthly'), value: 'monthly' },
  { title: t('reminders.repeat.yearly'), value: 'yearly' }
]

// initialize formData for edit
watch(() => props.initialData, (data) => {
  if (props.formMode === 'edit' && data) {
    formData.value = {
      title: data.title,
      description: data.description,
      reminderDate: new Date(data.reminderDate).toISOString().slice(0,16),
      priority: data.priority,
      repeat: data.repeat,
      isCompleted: data.isCompleted
    }
  }
}, { immediate: true })

const handleSubmit = async () => {
  const { valid: formValid } = await form.value.validate()
  if (!formValid) return
  isLoading.value = true
  emit('confirm', { ...formData.value })
  isLoading.value = false
}
</script>

<style scoped>
/* Add any component-specific styles */
</style>
