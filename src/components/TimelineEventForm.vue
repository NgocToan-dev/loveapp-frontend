<template>
  <v-dialog 
    :model-value="true" 
    @update:model-value="$emit('cancel')"
    max-width="600"
    persistent
  >
    <v-card>
      <v-card-title class="form-header">
        <span>{{ event ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện mới' }}</span>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="$emit('cancel')"
        />
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.type"
                :items="eventTypes"
                label="Loại sự kiện"
                required
                :rules="[v => !!v || 'Vui lòng chọn loại sự kiện']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.priority"
                :items="priorityOptions"
                label="Độ ưu tiên"
                required
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="formData.title"
            label="Tiêu đề"
            required
            :rules="[v => !!v || 'Tiêu đề là bắt buộc']"
          />

          <v-textarea
            v-model="formData.description"
            label="Mô tả"
            rows="3"
            auto-grow
          />

          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.date"
                label="Ngày"
                type="date"
                required
                :rules="[v => !!v || 'Ngày là bắt buộc']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.location"
                label="Địa điểm"
              />
            </v-col>
          </v-row>

          <v-checkbox
            v-model="formData.isRecurring"
            label="Sự kiện lặp lại (Anniversary)"
          />

          <v-select
            v-if="formData.isRecurring"
            v-model="formData.recurringType"
            :items="recurringOptions"
            label="Lặp lại"
          />

          <!-- Tags Section -->
          <div class="tags-section">
            <v-text-field
              v-model="tagInput"
              label="Thêm tag"
              @keyup.enter="addTag"
              append-icon="mdi-plus"
              @click:append="addTag"
            />
            
            <div v-if="formData.tags && formData.tags.length > 0" class="tags-display">
              <v-chip
                v-for="tag in formData.tags"
                :key="tag"
                closable
                @click:close="removeTag(tag)"
                size="small"
                color="primary"
                variant="outlined"
              >
                #{{ tag }}
              </v-chip>
            </div>
          </div>

          <!-- Images Section -->
          <div class="images-section">
            <v-text-field
              v-model="imageInput"
              label="URL hình ảnh"
              @keyup.enter="addImage"
              append-icon="mdi-plus"
              @click:append="addImage"
            />
            
            <div v-if="formData.images && formData.images.length > 0" class="images-preview">
              <div
                v-for="(img, index) in formData.images"
                :key="index"
                class="image-preview-item"
              >
                <v-img
                  :src="img"
                  :alt="`Preview ${index + 1}`"
                  class="preview-image"
                  cover
                />
                <v-btn
                  icon="mdi-close"
                  size="x-small"
                  color="error"
                  class="remove-image-btn"
                  @click="removeImage(img)"
                />
              </div>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions class="form-actions">
        <v-spacer />
        <v-btn @click="$emit('cancel')">
          Hủy
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!formValid"
          @click="handleSubmit"
        >
          {{ event ? 'Cập nhật' : 'Tạo mới' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import type { TimelineEvent } from '@/types'
import type { CreateTimelineEventData } from '@/services/timelineEvents'

interface Props {
  event?: TimelineEvent
}

interface Emits {
  (e: 'save', event: CreateTimelineEventData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref()
const formValid = ref(false)
const loading = ref(false)
const tagInput = ref('')
const imageInput = ref('')

const formData = reactive<CreateTimelineEventData>({
  title: '',
  description: '',
  date: new Date(),
  type: 'memory',
  images: [],
  location: '',
  tags: [],
  isRecurring: false,
  recurringType: 'yearly',
  priority: 'medium'
})

const eventTypes = [
  { title: 'Kỷ niệm', value: 'memory' },
  { title: 'Ngày kỷ niệm', value: 'anniversary' },
  { title: 'Cột mốc', value: 'milestone' }
]

const priorityOptions = [
  { title: 'Thấp', value: 'low' },
  { title: 'Trung bình', value: 'medium' },
  { title: 'Cao', value: 'high' }
]

const recurringOptions = [
  { title: 'Hàng năm', value: 'yearly' },
  { title: 'Hàng tháng', value: 'monthly' }
]

// Initialize form data if editing
onMounted(() => {
  if (props.event) {
    Object.assign(formData, {
      title: props.event.title,
      description: props.event.description || '',
      date: props.event.date,
      type: props.event.type,
      images: props.event.images || [],
      location: props.event.location || '',
      tags: props.event.tags || [],
      isRecurring: props.event.isRecurring,
      recurringType: props.event.recurringType || 'yearly',
      priority: props.event.priority
    })
  }
})

// Watch for event changes
watch(() => props.event, (newEvent) => {
  if (newEvent) {
    Object.assign(formData, {
      title: newEvent.title,
      description: newEvent.description || '',
      date: newEvent.date,
      type: newEvent.type,
      images: newEvent.images || [],
      location: newEvent.location || '',
      tags: newEvent.tags || [],
      isRecurring: newEvent.isRecurring,
      recurringType: newEvent.recurringType || 'yearly',
      priority: newEvent.priority
    })
  }
})

const addTag = () => {
  if (tagInput.value.trim() && formData.tags && !formData.tags.includes(tagInput.value.trim())) {
    if (!formData.tags) {
      formData.tags = []
    }
    formData.tags.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tagToRemove: string) => {
  if (!formData.tags) return
  const index = formData.tags.indexOf(tagToRemove)
  if (index > -1) {
    formData.tags.splice(index, 1)
  }
}

const addImage = () => {
  if (imageInput.value.trim() && formData.images && !formData.images.includes(imageInput.value.trim())) {
    if (!formData.images) {
      formData.images = []
    }
    formData.images.push(imageInput.value.trim())
    imageInput.value = ''
  }
}

const removeImage = (imageToRemove: string) => {
  if (!formData.images) return
  const index = formData.images.indexOf(imageToRemove)
  if (index > -1) {
    formData.images.splice(index, 1)
  }
}

const handleSubmit = async () => {
  if (!formValid.value) return

  try {
    loading.value = true
    
    // Create event data object
    const eventData: CreateTimelineEventData = {
      ...formData,
      date: new Date(formData.date)
    }

    emit('save', eventData)
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags-section,
.images-section {
  margin: 16px 0;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.image-preview-item {
  position: relative;
}

.preview-image {
  width: 100%;
  height: 80px;
  border-radius: 6px;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
}

.form-actions {
  padding: 16px 24px;
}

@media (max-width: 768px) {
  .images-preview {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }
  
  .preview-image {
    height: 60px;
  }
}
</style>
