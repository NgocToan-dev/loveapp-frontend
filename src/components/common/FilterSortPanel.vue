<template>
  <div class="filter-sort-panel">
    <div class="panel-header">
      <h3>{{ $t('common.filter.title') }}</h3>
      <Button @click="$emit('clear')" variant="ghost" size="sm">
        {{ $t('common.filter.clear_all') }}
      </Button>
    </div>

    <div class="filter-groups">
      <!-- Date Range Filter -->
      <div class="filter-group">
        <label class="filter-label">{{ $t('common.filter.date_range') }}</label>
        <div class="date-range">
          <input
            v-model="localFilters.dateFrom"
            type="date"
            class="form-input"
            @change="updateFilters"
          />
          <input
            v-model="localFilters.dateTo"
            type="date"
            class="form-input"
            @change="updateFilters"
          />
        </div>
      </div>

      <!-- Tags Filter -->
      <div class="filter-group">
        <label class="filter-label">{{ $t('common.filter.tags') }}</label>
        <div class="tags-input">
          <Input
            v-model="tagInput"
            :placeholder="$t('common.filter.tags_placeholder')"
            size="sm"
            @keyup.enter="addTag"
          >
            <template #suffix>
              <Button
                @click="addTag"
                variant="ghost"
                size="sm"
                :disabled="!tagInput.trim()"
              >
                <PlusIcon class="w-4 h-4" />
              </Button>
            </template>
          </Input>
          
          <div v-if="localFilters.tags && localFilters.tags.length > 0" class="selected-tags">
            <Badge
              v-for="tag in localFilters.tags"
              :key="tag"
              :label="tag"
              variant="secondary"
              removable
              @remove="removeTag(tag)"
            />
          </div>
        </div>
      </div>

      <!-- Entity-specific filters -->
      
      <!-- Memory Filters -->
      <template v-if="entity === 'memory'">
        <!-- Mood Filter -->
        <div class="filter-group">
          <label class="filter-label">{{ $t('memories.filter.mood') }}</label>
          <Select
            v-model="localFilters.mood"
            :options="moodOptions"
            :placeholder="$t('memories.filter.select_mood')"
            clearable
            @change="updateFilters"
          />
        </div>

        <!-- Privacy Filter -->
        <div class="filter-group">
          <label class="filter-label">{{ $t('memories.filter.privacy') }}</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input
                v-model="localFilters.isPrivate"
                type="checkbox"
                @change="updateFilters"
              />
              <span>{{ $t('memories.filter.private_only') }}</span>
            </label>
            <label class="checkbox-item">
              <input
                v-model="localFilters.isFavorite"
                type="checkbox"
                @change="updateFilters"
              />
              <span>{{ $t('memories.filter.favorites_only') }}</span>
            </label>
          </div>
        </div>
      </template>

      <!-- Reminder Filters -->
      <template v-if="entity === 'reminder'">
        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">{{ $t('reminders.filter.status') }}</label>
          <Select
            v-model="localFilters.status"
            :options="reminderStatusOptions"
            :placeholder="$t('reminders.filter.select_status')"
            clearable
            @change="updateFilters"
          />
        </div>

        <!-- Type Filter -->
        <div class="filter-group">
          <label class="filter-label">{{ $t('reminders.filter.type') }}</label>
          <Select
            v-model="localFilters.type"
            :options="reminderTypeOptions"
            :placeholder="$t('reminders.filter.select_type')"
            clearable
            @change="updateFilters"
          />
        </div>

        <!-- Recurring Filter -->
        <div class="filter-group">
          <label class="filter-label">{{ $t('reminders.filter.recurring') }}</label>
          <div class="checkbox-group">
            <label class="checkbox-item">
              <input
                v-model="localFilters.isRecurring"
                type="checkbox"
                @change="updateFilters"
              />
              <span>{{ $t('reminders.filter.recurring_only') }}</span>
            </label>
          </div>
        </div>
      </template>

      <!-- Blog Filters -->
      <template v-if="entity === 'blog'">
        <!-- Privacy Filter -->
        <div class="filter-group">
          <label class="filter-label">{{ $t('blog.filter.privacy') }}</label>
          <Select
            v-model="localFilters.privacy"
            :options="blogPrivacyOptions"
            :placeholder="$t('blog.filter.select_privacy')"
            clearable
            @change="updateFilters"
          />
        </div>

        <!-- Status Filter -->
        <div class="filter-group">
          <label class="filter-label">{{ $t('blog.filter.status') }}</label>
          <Select
            v-model="localFilters.status"
            :options="blogStatusOptions"
            :placeholder="$t('blog.filter.select_status')"
            clearable
            @change="updateFilters"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import Badge from '@/components/common/Badge.vue'
import Select from '@/components/common/Select.vue'
import PlusIcon from '@/components/icons/PlusIcon.vue'

interface Props {
  filters: Record<string, any>
  entity: 'memory' | 'reminder' | 'blog'
}

interface Emits {
  'update:filters': [filters: Record<string, any>]
  clear: []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

// State
const tagInput = ref('')
const localFilters = reactive({ ...props.filters })

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

// Computed options
const moodOptions = computed(() => [
  { value: 'happy', label: t('memories.moods.happy') },
  { value: 'love', label: t('memories.moods.love') },
  { value: 'excited', label: t('memories.moods.excited') },
  { value: 'romantic', label: t('memories.moods.romantic') },
  { value: 'nostalgic', label: t('memories.moods.nostalgic') },
  { value: 'grateful', label: t('memories.moods.grateful') }
])

const reminderStatusOptions = computed(() => [
  { value: 'pending', label: t('reminders.status.pending') },
  { value: 'completed', label: t('reminders.status.completed') },
  { value: 'overdue', label: t('reminders.status.overdue') }
])

const reminderTypeOptions = computed(() => [
  { value: 'anniversary', label: t('reminders.types.anniversary') },
  { value: 'birthday', label: t('reminders.types.birthday') },
  { value: 'date', label: t('reminders.types.date') },
  { value: 'custom', label: t('reminders.types.custom') }
])

const blogPrivacyOptions = computed(() => [
  { value: 'private', label: t('blog.privacy.private') },
  { value: 'couple', label: t('blog.privacy.couple') },
  { value: 'public', label: t('blog.privacy.public') }
])

const blogStatusOptions = computed(() => [
  { value: 'draft', label: t('blog.status.draft') },
  { value: 'published', label: t('blog.status.published') }
])

// Methods
const updateFilters = () => {
  emit('update:filters', { ...localFilters })
}

const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && (!localFilters.tags || !localFilters.tags.includes(tag))) {
    if (!localFilters.tags) {
      localFilters.tags = []
    }
    localFilters.tags.push(tag)
    tagInput.value = ''
    updateFilters()
  }
}

const removeTag = (tagToRemove: string) => {
  if (localFilters.tags) {
    const index = localFilters.tags.indexOf(tagToRemove)
    if (index > -1) {
      localFilters.tags.splice(index, 1)
      updateFilters()
    }
  }
}
</script>

<style scoped>
.filter-sort-panel {
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e0e0e0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
}

.filter-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.date-range {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tags-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 24px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
}

.checkbox-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid #d1d5db;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"]:checked {
  background-color: #4caf50;
  border-color: #4caf50;
}

.checkbox-item span {
  color: #374151;
}

@media (max-width: 768px) {
  .filter-groups {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .date-range {
    grid-template-columns: 1fr;
  }

  .panel-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}
</style>
