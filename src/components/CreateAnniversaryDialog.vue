<template>
  <v-card max-width="700" rounded="xl">
    <v-card-title class="text-h5 font-weight-bold pa-6">
      <v-icon color="purple" class="mr-2">mdi-calendar-heart</v-icon>
      {{ $t('anniversaries.createNew') || 'Create New Anniversary' }}
    </v-card-title>

    <v-card-text class="pa-6">
      <v-form ref="form" v-model="valid" @submit.prevent="handleSubmit">
        <v-row>
          <!-- Title -->
          <v-col cols="12">
            <v-text-field
              v-model="formData.title"
              :label="$t('anniversaries.title') || 'Anniversary Title'"
              :rules="titleRules"
              variant="outlined"
              prepend-inner-icon="mdi-format-title"
              required
              counter="100"
              maxlength="100"
            ></v-text-field>
          </v-col>

          <!-- Date -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="formData.date"
              :label="$t('anniversaries.date') || 'Anniversary Date'"
              :rules="dateRules"
              variant="outlined"
              prepend-inner-icon="mdi-calendar"
              type="date"
              required
            ></v-text-field>
          </v-col>

          <!-- Type -->
          <v-col cols="12" md="6">
            <v-select
              v-model="formData.type"
              :items="typeOptions"
              :label="$t('anniversaries.type') || 'Type'"
              :rules="typeRules"
              variant="outlined"
              prepend-inner-icon="mdi-shape"
              required
            ></v-select>
          </v-col>

          <!-- Description -->
          <v-col cols="12">
            <v-textarea
              v-model="formData.description"
              :label="$t('anniversaries.description') || 'Description (Optional)'"
              variant="outlined"
              prepend-inner-icon="mdi-text"
              rows="4"
              counter
              no-resize
            ></v-textarea>
          </v-col>

          <!-- Recurring -->
          <v-col cols="12" md="6">
            <v-switch
              v-model="formData.isRecurring"
              :label="$t('anniversaries.recurring') || 'Recurring Anniversary'"
              color="purple"
              hide-details
            ></v-switch>
          </v-col>

          <!-- Frequency -->
          <v-col cols="12" md="6" v-if="formData.isRecurring">
            <v-select
              v-model="formData.frequency"
              :items="frequencyOptions"
              :label="$t('anniversaries.frequency') || 'Frequency'"
              variant="outlined"
              prepend-inner-icon="mdi-repeat"
              required
            ></v-select>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="pa-6">
      <v-spacer></v-spacer>
      <v-btn
        variant="text"
        @click="$emit('cancel')"
      >
        {{ $t('common.cancel') || 'Cancel' }}
      </v-btn>
      <v-btn
        color="purple"
        variant="elevated"
        :loading="isLoading"
        :disabled="!valid"
        @click="handleSubmit"
        prepend-icon="mdi-calendar-heart"
      >
        {{ $t('anniversaries.save') || 'Save Anniversary' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAnniversariesStore } from '@/stores/anniversaries'

const { t } = useI18n()
const anniversariesStore = useAnniversariesStore()

// Form references
const form = ref()
const valid = ref(false)

// Reactive data
const formData = ref({
  title: '',
  description: '',
  date: '',
  type: 'other' as 'relationship' | 'milestone' | 'birthday' | 'other',
  isRecurring: false,
  frequency: 'yearly' as 'yearly' | 'monthly'
})

const isLoading = ref(false)

// Computed
const typeOptions = computed(() => [
  { title: 'Relationship', value: 'relationship' },
  { title: 'Milestone', value: 'milestone' },
  { title: 'Birthday', value: 'birthday' },
  { title: 'Other', value: 'other' }
])

const frequencyOptions = computed(() => [
  { title: 'Yearly', value: 'yearly' },
  { title: 'Monthly', value: 'monthly' }
])

// Validation rules
const titleRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required',
  (v: string) => (v && v.length <= 100) || t('validation.maxLength', { max: 100 }) || 'Maximum 100 characters'
]

const dateRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required'
]

const typeRules = [
  (v: string) => !!v || t('validation.required') || 'This field is required'
]

// Events
const emit = defineEmits<{
  confirm: [data: any]
  cancel: []
}>()

// Methods
const handleSubmit = async () => {
  if (!valid.value) return

  try {
    isLoading.value = true
    
    // Create anniversary using store
    const newAnniversary = await anniversariesStore.createAnniversary({
      title: formData.value.title,
      description: formData.value.description,
      date: formData.value.date,
      type: formData.value.type,
      isRecurring: formData.value.isRecurring,
      frequency: formData.value.isRecurring ? formData.value.frequency : undefined
    })
    
    // Emit success with the created anniversary
    emit('confirm', newAnniversary)
  } catch (error) {
    console.error('Error creating anniversary:', error)
    // Could show error toast here
  } finally {
    isLoading.value = false
  }
}
</script>
