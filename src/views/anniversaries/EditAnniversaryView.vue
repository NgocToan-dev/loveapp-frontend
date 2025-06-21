<template>
  <v-container class="pa-6" max-width="800">
    <div class="text-center mb-8">
      <h1 class="font-heading text-3xl mb-4" :style="{ color: 'rgb(var(--v-theme-on-surface))' }">
        ✏️ {{ t('anniversaries.editAnniversary') }}
      </h1>
      <p class="text-lg font-script" :style="{ color: 'rgb(var(--v-theme-on-surface-variant))' }">
        "{{ t('anniversaries.editSubtitle') }}"
      </p>
    </div>

    <v-card rounded="xl" class="love-card-hover" elevation="0" :style="{ backgroundColor: 'rgb(var(--v-theme-surface))' }">
      <v-card-text class="pa-8">
        <v-form ref="anniversaryForm" @submit.prevent="updateAnniversary">
          <v-row>            <v-col cols="12">
              <v-text-field
                v-model="anniversaryData.title"
                :label="t('anniversaries.anniversaryTitle')"
                variant="outlined"
                rounded="lg"
                :rules="[v => !!v || t('validation.required')]"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="anniversaryData.description"
                :label="t('anniversaries.description')"
                variant="outlined"
                rounded="lg"
                rows="4"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="anniversaryData.date"
                :label="t('anniversaries.date')"
                type="date"
                variant="outlined"
                rounded="lg"
                :rules="[v => !!v || t('validation.required')]"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-select
                v-model="anniversaryData.type"
                :items="typeOptions"
                :label="t('anniversaries.type')"
                variant="outlined"
                rounded="lg"
                item-title="label"
                item-value="value"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              >
                <template #item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template #prepend>
                      <v-icon>{{ item.raw.icon }}</v-icon>
                    </template>
                    <v-list-item-title>{{ item.raw.label }}</v-list-item-title>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>            <v-col cols="12" md="6">
              <v-select
                v-model="anniversaryData.frequency"
                :items="frequencyOptions"
                :label="t('anniversaries.frequency')"
                variant="outlined"
                rounded="lg"
                item-title="label"
                item-value="value"
                :style="{ '--v-field-label-color': 'rgb(var(--v-theme-on-surface))' }"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-switch
                v-model="anniversaryData.isRecurring"
                :label="t('anniversaries.isRecurring')"
                color="primary"
                hide-details
              />            </v-col>
          </v-row>

          <v-divider class="my-6" />          <div class="d-flex justify-space-between flex-wrap gap-3">
            <v-btn
              variant="outlined"
              rounded="lg"
              size="large"
              @click="goBack"
              :style="{ color: 'rgb(var(--v-theme-on-surface))' }"
            >
              <v-icon start>mdi-arrow-left</v-icon>
              {{ t('common.cancel') }}
            </v-btn>
            
            <v-btn
              color="primary"
              variant="flat"
              rounded="lg"
              size="large"
              type="submit"
              :loading="loading"
            >
              <v-icon start>mdi-content-save</v-icon>
              {{ t('anniversaries.updateAnniversary') }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAnniversariesStore } from '@/stores/anniversaries'
import type { Anniversary } from '@/types'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const anniversariesStore = useAnniversariesStore()

const anniversaryForm = ref()
const loading = ref(false)

const anniversaryData = ref({
  title: '',
  description: '',
  date: '',
  type: 'relationship' as 'relationship' | 'milestone' | 'birthday' | 'other',
  frequency: 'yearly' as 'yearly' | 'monthly',
  isRecurring: false
})

const typeOptions = [
  { value: 'relationship', label: t('anniversaries.types.relationship'), icon: 'mdi-heart' },
  { value: 'birthday', label: t('anniversaries.types.birthday'), icon: 'mdi-cake' },
  { value: 'milestone', label: t('anniversaries.types.milestone'), icon: 'mdi-flag' },
  { value: 'other', label: t('anniversaries.types.other'), icon: 'mdi-calendar-heart' }
]

const frequencyOptions = [
  { value: 'yearly', label: t('anniversaries.frequencies.yearly') },
  { value: 'monthly', label: t('anniversaries.frequencies.monthly') }
]

const loadAnniversary = async () => {
  const anniversaryId = route.params.id as string
  const anniversary = anniversariesStore.anniversaries.find(a => a.id === anniversaryId)
  
  if (anniversary) {    anniversaryData.value = {
      title: anniversary.title,
      description: anniversary.description || '',
      date: anniversary.date,
      type: anniversary.type,
      frequency: anniversary.frequency || 'yearly',
      isRecurring: anniversary.isRecurring
    }
    // Note: Anniversary type doesn't have tags property, so we skip setting selectedTags
  } else {
    // Try to fetch from API if not in store
    await anniversariesStore.fetchAnniversaries()
    const fetchedAnniversary = anniversariesStore.anniversaries.find(a => a.id === anniversaryId)
    if (fetchedAnniversary) {      anniversaryData.value = {
        title: fetchedAnniversary.title,
        description: fetchedAnniversary.description || '',
        date: fetchedAnniversary.date,
        type: fetchedAnniversary.type,
        frequency: fetchedAnniversary.frequency || 'yearly',
        isRecurring: fetchedAnniversary.isRecurring
      }
      // Note: Anniversary type doesn't have tags property, so we skip setting selectedTags
    } else {
      // Anniversary not found, redirect to anniversaries list
      router.push('/anniversaries')
    }
  }
}

const updateAnniversary = async () => {
  const { valid } = await anniversaryForm.value.validate()
  if (!valid) return
  loading.value = true
  try {
    const anniversaryId = route.params.id as string
    const updatedAnniversary: Partial<Anniversary> = {
      id: anniversaryId,
      title: anniversaryData.value.title,
      description: anniversaryData.value.description,
      date: anniversaryData.value.date,
      type: anniversaryData.value.type,
      frequency: anniversaryData.value.frequency,
      isRecurring: anniversaryData.value.isRecurring
    }

    await anniversariesStore.updateAnniversary(anniversaryId, updatedAnniversary)
    router.push('/anniversaries')
  } catch (error) {
    console.error('Failed to update anniversary:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/anniversaries')
}

onMounted(() => {
  loadAnniversary()
})
</script>

<style scoped>
.love-card-hover {
  transition: all 0.3s ease;
  border: 1px solid rgb(var(--v-theme-outline-variant));
}

.love-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary), 0.15);
}
</style>
