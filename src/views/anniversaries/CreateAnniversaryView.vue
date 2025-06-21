<template>
  <v-container fluid max-width="800">
    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <v-btn
        icon="mdi-arrow-left"
        variant="text"
        class="mr-3"
        @click="goBack"
      ></v-btn>
      <div>
        <h1 class="text-h4 font-weight-bold text-pink mb-1">
          <v-icon icon="mdi-calendar-heart" class="mr-2"></v-icon>
          {{ $t('anniversaries.createNew') || 'Create New Anniversary' }}
        </h1>
        <p class="text-body-1 text-medium-emphasis">
          {{ $t('anniversaries.createSubtitle') || 'Add a special date to remember' }}
        </p>
      </div>
    </div>

    <v-form ref="form" v-model="valid" @submit.prevent="saveAnniversary">
      <v-card>
        <v-card-text class="pa-6">
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
                prepend-inner-icon="mdi-tag"
                required
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon :icon="getTypeIcon(item.raw.value)" :color="getTypeColor(item.raw.value)"></v-icon>
                    </template>
                    <v-list-item-title>{{ item.raw.title }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                :label="$t('anniversaries.description') || 'Description (Optional)'"
                variant="outlined"
                prepend-inner-icon="mdi-text"
                rows="4"
                counter="500"
                maxlength="500"
                no-resize
              ></v-textarea>
            </v-col>

            <!-- Recurring Settings -->
            <v-col cols="12">
              <v-switch
                v-model="formData.isRecurring"
                :label="$t('anniversaries.recurring') || 'Recurring Anniversary'"
                color="primary"
                hide-details
              ></v-switch>
            </v-col>

            <!-- Frequency (only if recurring) -->
            <v-col v-if="formData.isRecurring" cols="12" md="6">
              <v-select
                v-model="formData.frequency"
                :items="frequencyOptions"
                :label="$t('anniversaries.frequency') || 'Frequency'"
                variant="outlined"
                prepend-inner-icon="mdi-repeat"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions class="px-6 pb-6">
          <v-spacer></v-spacer>
          <v-btn
            variant="text"
            @click="goBack"
          >
            {{ $t('common.cancel') || 'Cancel' }}
          </v-btn>
          <v-btn
            color="pink"
            variant="elevated"
            type="submit"
            :loading="isLoading"
            :disabled="!valid"
            prepend-icon="mdi-calendar-heart"
          >
            {{ $t('anniversaries.save') || 'Save Anniversary' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAnniversariesStore } from '@/stores/anniversaries'

const { t } = useI18n()
const router = useRouter()
const anniversariesStore = useAnniversariesStore()

// Form references
const form = ref()
const valid = ref(false)

// Reactive data
const formData = ref({
  title: '',
  description: '',
  date: '',
  type: 'milestone' as 'relationship' | 'milestone' | 'birthday' | 'other',
  isRecurring: true,
  frequency: 'yearly' as 'yearly' | 'monthly'
})

const isLoading = ref(false)

// Computed options
const typeOptions = computed(() => [
  { title: t('anniversaries.types.relationship') || 'Relationship', value: 'relationship' },
  { title: t('anniversaries.types.milestone') || 'Milestone', value: 'milestone' },
  { title: t('anniversaries.types.birthday') || 'Birthday', value: 'birthday' },
  { title: t('anniversaries.types.other') || 'Other', value: 'other' }
])

const frequencyOptions = computed(() => [
  { title: t('anniversaries.frequencies.yearly') || 'Yearly', value: 'yearly' },
  { title: t('anniversaries.frequencies.monthly') || 'Monthly', value: 'monthly' }
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

// Helper methods
const getTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'relationship': 'mdi-heart',
    'milestone': 'mdi-star',
    'birthday': 'mdi-cake',
    'other': 'mdi-calendar'
  }
  return icons[type] || 'mdi-calendar'
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'relationship': 'pink',
    'milestone': 'purple',
    'birthday': 'orange',
    'other': 'blue'
  }
  return colors[type] || 'blue'
}

const saveAnniversary = async () => {
  if (!valid.value) return

  try {
    isLoading.value = true
    
    // Create anniversary using store
    await anniversariesStore.createAnniversary({
      title: formData.value.title,
      description: formData.value.description || undefined,
      date: formData.value.date,
      type: formData.value.type,
      isRecurring: formData.value.isRecurring,
      frequency: formData.value.isRecurring ? formData.value.frequency : undefined
    })
    
    // Show success message and redirect
    router.push({ name: 'anniversaries' })
  } catch (error) {
    console.error('Error creating anniversary:', error)
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/anniversaries')
}
</script>

<style scoped>
.text-pink {
  color: rgb(233, 30, 99) !important;
}
</style>
