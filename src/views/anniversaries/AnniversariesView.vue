<template>
  <ResponsiveContainer>
    <div class="anniversaries-view">
      <!-- Hero Section -->
      <section class="hero-section">
        <v-container>
          <div class="hero-content">
            <div class="hero-text">
              <h1 class="hero-title">
                <v-icon icon="mdi-calendar-heart" size="40" class="hero-icon" />
                Our Special Moments
              </h1>
              <p class="hero-subtitle">
                Cherish and celebrate every milestone in your love story
              </p>
            </div>
              <!-- Next Anniversary Countdown -->
            <div v-if="anniversaries.length > 0" class="hero-countdown">
              <AnniversaryCountdownWidget :anniversaries="anniversaries" />
            </div>
          </div>
        </v-container>
      </section>

      <!-- Stats Section -->
      <section class="stats-section">
        <v-container>
          <v-row>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-calendar-multiple" size="32" color="primary" />
                  </div>
                  <div class="stat-number">{{ stats.total }}</div>
                  <div class="stat-label">Total Anniversaries</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-clock-outline" size="32" color="warning" />
                  </div>
                  <div class="stat-number">{{ stats.upcoming }}</div>
                  <div class="stat-label">Upcoming</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-repeat" size="32" color="success" />
                  </div>
                  <div class="stat-number">{{ stats.recurring }}</div>
                  <div class="stat-label">Recurring</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6" md="3">
              <v-card rounded="xl" elevation="2" class="stat-card">
                <v-card-text class="text-center">
                  <div class="stat-icon">
                    <v-icon icon="mdi-heart" size="32" color="pink" />
                  </div>
                  <div class="stat-number">{{ stats.relationship }}</div>
                  <div class="stat-label">Love Milestones</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Controls Section -->      <!-- Advanced Filter Section -->
      <section class="filter-section">
        <v-container>
          <v-card class="filter-card" elevation="0" rounded="xl">
            <v-card-text class="pa-6">
              <!-- Header with Title and Create Button -->
              <div class="filter-header">
                <div class="filter-title">
                  <h2>Anniversary Collection</h2>
                  <p class="text-medium-emphasis mb-0">Manage and explore your special moments</p>
                </div>
                <v-btn
                  color="primary"
                  size="large"
                  rounded="xl"
                  @click="createAnniversary"
                  class="create-btn"
                >
                  <v-icon icon="mdi-plus" start />
                  Add Anniversary
                </v-btn>
              </div>

              <v-divider class="my-6" />

              <!-- Main Filter Controls -->
              <v-row align="center" class="filter-controls">
                <!-- Search -->
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="searchQuery"
                    prepend-inner-icon="mdi-magnify"
                    placeholder="Search anniversaries..."
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    clearable
                    rounded="lg"
                    class="search-field"
                    bg-color="surface"
                  />
                </v-col>

                <!-- Sort -->
                <v-col cols="12" md="3">
                  <v-select
                    v-model="sortBy"
                    :items="sortOptions"
                    label="Sort by"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    rounded="lg"
                    bg-color="surface"
                    prepend-inner-icon="mdi-sort"
                  />
                </v-col>

                <!-- Type Filter -->
                <v-col cols="12" md="3">
                  <v-select
                    v-model="selectedType"
                    :items="typeOptions"
                    label="Filter by type"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    clearable
                    rounded="lg"
                    bg-color="surface"
                    prepend-inner-icon="mdi-filter"
                  />
                </v-col>

                <!-- View Toggle -->
                <v-col cols="12" md="2" class="text-right">
                  <v-btn-toggle v-model="viewMode" mandatory class="view-toggle" rounded="lg">
                    <v-btn value="grid" variant="outlined" icon size="large">
                      <v-icon icon="mdi-grid" />
                    </v-btn>
                    <v-btn value="list" variant="outlined" icon size="large">
                      <v-icon icon="mdi-view-list" />
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>

              <!-- Quick Filter Chips -->
              <div class="quick-filters mt-4">
                <div class="quick-filters-label">
                  <v-icon icon="mdi-lightning-bolt" size="small" class="mr-2" />
                  Quick Filters:
                </div>
                <v-chip-group
                  v-model="selectedQuickFilter"
                  selected-class="text-primary"
                  class="quick-filter-chips"
                >
                  <v-chip
                    v-for="type in typeQuickFilters"
                    :key="type.value"
                    :value="type.value"
                    variant="outlined"
                    size="small"
                    rounded="lg"
                    class="quick-filter-chip"
                    @click="handleQuickFilter(type.value)"
                  >
                    <v-icon :icon="type.icon" start size="small" />
                    {{ type.text }}
                    <v-badge
                      v-if="getTypeCount(type.value) > 0"
                      :content="getTypeCount(type.value)"
                      color="primary"
                      class="ml-2"
                    />
                  </v-chip>
                </v-chip-group>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
      </section>

      <!-- Content Area -->
      <section class="content-section" ref="anniversariesSection">
        <v-container>
          <!-- Loading State -->
          <div v-if="isLoading" class="loading-container">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              width="4"
            />
            <p class="loading-text">Loading your special moments...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredAnniversaries.length === 0" class="empty-state">
            <div class="empty-icon">
              <v-icon icon="mdi-calendar-heart" size="120" color="grey-lighten-2" />
            </div>
            <h3 class="empty-title">No anniversaries yet</h3>
            <p class="empty-subtitle">
              Create your first anniversary to start celebrating special moments!
            </p>
            <v-btn
              color="primary"
              size="large"
              rounded
              @click="createAnniversary"
            >
              <v-icon icon="mdi-plus" start />
              Add Your First Anniversary
            </v-btn>
          </div>

          <!-- Anniversaries Grid View -->
          <div v-else-if="viewMode === 'grid'" class="anniversaries-grid">
            <v-row>
              <v-col
                v-for="anniversary in filteredAnniversaries"
                :key="anniversary.id"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <AnniversaryCard
                  :anniversary="anniversary"
                  @open-anniversary="handleOpenAnniversary"
                  @edit-anniversary="handleEditAnniversary"
                  @delete-anniversary="handleDeleteAnniversary"
                  @celebrate="handleCelebrate"
                />
              </v-col>
            </v-row>
          </div>

          <!-- Anniversaries List View -->
          <div v-else class="anniversaries-list">
            <v-card rounded="xl" elevation="2">
              <v-list>
                <v-list-item
                  v-for="anniversary in filteredAnniversaries"
                  :key="anniversary.id"
                  class="anniversary-list-item"
                  @click="handleOpenAnniversary(anniversary)"
                >
                  <template #prepend>
                    <v-avatar :color="getTypeColor(anniversary.type)" size="40">
                      <v-icon color="white">{{ getTypeIcon(anniversary.type) }}</v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="anniversary-list-title">
                    {{ anniversary.title }}
                  </v-list-item-title>
                  
                  <v-list-item-subtitle class="anniversary-list-subtitle">
                    <div class="d-flex align-center">
                      <v-chip size="x-small" :color="getTypeColor(anniversary.type)" variant="tonal" class="me-2">
                        {{ getTypeLabel(anniversary.type) }}
                      </v-chip>
                      <span>{{ formatDate(anniversary.date) }}</span>
                      <v-icon v-if="anniversary.isRecurring" size="14" color="success" class="ms-2">mdi-repeat</v-icon>
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <div class="list-actions">
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="handleEditAnniversary(anniversary)"
                      >
                        <v-icon size="16">mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        icon
                        size="small"
                        variant="text"
                        @click.stop="handleCelebrate(anniversary)"
                        color="pink"
                      >
                        <v-icon size="16">mdi-party-popper</v-icon>
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
          </div>        </v-container>
      </section>
    </div>
  </ResponsiveContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnniversariesStore } from '@/stores/anniversaries'
import { useDialogsStore } from '@/stores/dialogs'
import type { Anniversary } from '@/types'
import dayjs from 'dayjs'
import AnniversaryCard from '@/components/anniversaries/AnniversaryCard.vue'
import AnniversaryCountdownWidget from '@/components/anniversaries/AnniversaryCountdownWidget.vue'
import ResponsiveContainer from '@/components/ui/ResponsiveContainer.vue'

const anniversariesStore = useAnniversariesStore()
const dialogsStore = useDialogsStore()
const router = useRouter()

// State
const searchQuery = ref('')
const selectedType = ref('')
const sortBy = ref('date-asc')
const viewMode = ref<'grid' | 'list'>('grid')
const selectedQuickFilter = ref('')

// Computed
const anniversaries = computed(() => anniversariesStore.anniversaries || [])
const isLoading = computed(() => anniversariesStore.isLoading)
const error = computed(() => anniversariesStore.error)

const stats = computed(() => ({
  total: anniversaries.value.length,
  upcoming: anniversaries.value.filter(a => getDaysUntil(a.date) >= 0 && getDaysUntil(a.date) <= 30).length,
  recurring: anniversaries.value.filter(a => a.isRecurring).length,
  relationship: anniversaries.value.filter(a => a.type === 'relationship').length
}))

const nextAnniversary = computed(() => {
  const upcoming = anniversaries.value
    .filter(a => getDaysUntil(a.date) >= 0)
    .sort((a, b) => getDaysUntil(a.date) - getDaysUntil(b.date))
  
  return upcoming.length > 0 ? upcoming[0] : null
})

const typeOptions = [
  { title: 'Relationship', value: 'relationship' },
  { title: 'Milestone', value: 'milestone' },
  { title: 'Birthday', value: 'birthday' },
  { title: 'Other', value: 'other' }
]

const sortOptions = [
  { title: 'Date (newest)', value: 'date-desc' },
  { title: 'Date (oldest)', value: 'date-asc' },
  { title: 'Title A-Z', value: 'title-asc' },
  { title: 'Type', value: 'type-asc' }
]

const filteredAnniversaries = computed(() => {
  let filtered = [...anniversaries.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(anniversary =>
      anniversary.title.toLowerCase().includes(query) ||
      (anniversary.description && anniversary.description.toLowerCase().includes(query))
    )
  }

  // Type filter
  if (selectedType.value) {
    filtered = filtered.filter(anniversary => anniversary.type === selectedType.value)
  }

  // Sort
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'type-asc':
        return a.type.localeCompare(b.type)
      default:
        return 0
    }
  })

  return filtered
})

// Quick filter definitions
const typeQuickFilters = [
  { text: 'All', value: '', icon: 'mdi-all-inclusive' },
  { text: 'Relationship', value: 'relationship', icon: 'mdi-heart' },
  { text: 'Milestone', value: 'milestone', icon: 'mdi-trophy' },
  { text: 'Birthday', value: 'birthday', icon: 'mdi-cake' },
  { text: 'Other', value: 'other', icon: 'mdi-star' }
]

// Methods
const loadAnniversaries = async () => {
  try {
    await anniversariesStore.fetchAnniversaries()
  } catch (error) {
    console.error('Failed to load anniversaries:', error)
  }
}

const createAnniversary = () => {
  router.push('/anniversaries/create')
}

const handleOpenAnniversary = (anniversary: Anniversary) => {
  console.log('View anniversary:', anniversary)
  // Navigate to anniversary detail view or open modal
}

const handleEditAnniversary = (anniversary: Anniversary) => {
  router.push({ name: 'edit-anniversary', params: { id: anniversary.id } })
}

const handleDeleteAnniversary = async (anniversary: Anniversary) => {
  dialogsStore.openConfirmDialog({
    title: 'Confirm Delete',
    message: `Are you sure you want to delete "${anniversary.title}"?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: async () => {
      try {
        await anniversariesStore.deleteAnniversary(anniversary.id)
        
        dialogsStore.openAlertDialog({
          title: 'Deleted!',
          message: 'Anniversary has been deleted successfully!'
        })
      } catch (error) {
        console.error('Delete failed:', error)
        
        dialogsStore.openAlertDialog({
          title: 'Error!',
          message: 'Failed to delete anniversary. Please try again.'
        })
      }
    }
  })
}

const handleCelebrate = (anniversary: Anniversary) => {
  console.log('Celebrate anniversary:', anniversary)
  // Add celebration animation or effect
}

const handleQuickFilter = (value: string) => {
  selectedType.value = value
  selectedQuickFilter.value = value
}

const getTypeCount = (type: string) => {
  if (!type) return anniversaries.value.length
  return anniversaries.value.filter(anniversary => anniversary.type === type).length
}

const getTypeColor = (type: string) => {
  const colors = {
    'relationship': 'pink',
    'milestone': 'purple',
    'birthday': 'orange',
    'other': 'success'
  }
  return colors[type as keyof typeof colors] || 'success'
}

const getTypeIcon = (type: string) => {
  const icons = {
    'relationship': 'mdi-heart',
    'milestone': 'mdi-trophy',
    'birthday': 'mdi-cake',
    'other': 'mdi-calendar-star'
  }
  return icons[type as keyof typeof icons] || 'mdi-calendar-star'
}

const getTypeLabel = (type: string) => {
  const labels = {
    'relationship': 'Relationship',
    'milestone': 'Milestone',
    'birthday': 'Birthday',
    'other': 'Other'
  }
  return labels[type as keyof typeof labels] || type
}

const formatDate = (date: string | Date) => {
  return dayjs(date).format('DD/MM/YYYY')
}

const getDaysUntil = (date: string | Date) => {
  const today = dayjs()
  const anniversaryDate = dayjs(date)
  
  let targetDate = anniversaryDate.year(today.year())
  if (targetDate.isBefore(today, 'day')) {
    targetDate = targetDate.year(today.year() + 1)
  }
  
  return targetDate.diff(today, 'day')
}

// Initialize
onMounted(() => {
  loadAnniversaries()
})
</script>

<style scoped>
.anniversaries-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdfbfb 0%, #f7f3f0 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  color: white;
  padding: 80px 0 60px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0-11.046 8.954-20 20-20s20 8.954 20 20-8.954 20-20 20-20-8.954-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.hero-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  position: relative;
  z-index: 1;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  line-height: 1.2;
}

.hero-icon {
  color: rgba(255, 255, 255, 0.9);
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.5;
}

.hero-countdown {
  flex: 1;
  max-width: 400px;
}

/* Stats Section */
.stats-section {
  padding: 40px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  margin-top: -30px;
  position: relative;
  z-index: 2;
}

.stat-card {
  height: 100%;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  margin-bottom: 12px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  font-weight: 500;
}

/* Filter Section */
.filter-section {
  padding: 40px 0;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.05) 0%, 
    rgba(var(--v-theme-secondary), 0.03) 100%);
}

.filter-card {
  background: rgba(var(--v-theme-surface), 0.9) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  transition: all 0.3s ease;
}

.filter-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
}

.filter-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 24px;
}

.filter-title h2 {
  font-size: 2rem;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary)));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.filter-title p {
  font-size: 0.95rem;
  opacity: 0.8;
}

.create-btn {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)), rgb(var(--v-theme-secondary))) !important;
  color: white !important;
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 24px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 36px rgba(var(--v-theme-primary), 0.4);
}

.filter-controls {
  margin: 0;
}

.search-field :deep(.v-field) {
  transition: all 0.3s ease;
}

.search-field :deep(.v-field:hover) {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.15);
}

.view-toggle {
  background: rgba(var(--v-theme-surface), 0.9);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  overflow: hidden;
}

.view-toggle .v-btn {
  transition: all 0.3s ease;
}

.view-toggle .v-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.quick-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.quick-filters-label {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.8;
  flex-shrink: 0;
}

.quick-filter-chips {
  flex: 1;
  min-width: 0;
}

.quick-filter-chip {
  transition: all 0.3s ease;
  margin: 2px;
}

.quick-filter-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.2);
}

.quick-filter-chip.v-chip--selected {
  background: rgba(var(--v-theme-primary), 0.15) !important;
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

/* Content Section */
.content-section {
  padding: 20px 0 80px;
}

/* Loading */
.loading-container {
  text-align: center;
  padding: 80px 20px;
}

.loading-text {
  margin-top: 24px;
  font-size: 1.125rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  margin-bottom: 32px;
}

.empty-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 16px;
}

.empty-subtitle {
  font-size: 1.125rem;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.6;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* Grid View */
.anniversaries-grid {
  margin-top: 20px;
}

/* List View */
.anniversaries-list {
  margin-top: 20px;
}

.anniversary-list-item {
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.anniversary-list-item:hover {
  background: rgba(var(--v-theme-primary), 0.02);
}

.anniversary-list-item:last-child {
  border-bottom: none;
}

.anniversary-list-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: rgb(var(--v-theme-on-surface));
}

.anniversary-list-subtitle {
  margin-top: 8px;
}

.list-actions {
  display: flex;
  gap: 8px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.anniversary-list-item:hover .list-actions {
  opacity: 1;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .controls-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .section-title {
    text-align: center;
  }

  .filter-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .filter-title h2 {
    font-size: 1.75rem;
  }
  
  .create-btn {
    width: 100%;
    margin-top: 16px;
  }
  
  .quick-filters {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .quick-filters-label {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 12px;
  }
  
  .hero-subtitle {
    font-size: 1.125rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .view-toggle {
    justify-self: center;
  }
  
  .filter-title h2 {
    font-size: 1.5rem;
  }
  
  .filter-controls {
    gap: 16px;
  }
  
  .quick-filter-chips {
    justify-content: center;
  }
}
</style>
