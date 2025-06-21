<template>
  <v-dialog v-model="dialog" max-width="500" scrollable>
    <v-card rounded="xl">
      <v-card-title class="text-h5 font-weight-bold pa-6">
        <v-icon color="primary" class="mr-2">mdi-share-variant</v-icon>
        Chia Sẻ Memory
      </v-card-title>

      <v-card-text class="pa-6">
        <!-- Memory Preview -->
        <v-card 
          v-if="memory"
          variant="outlined" 
          rounded="lg" 
          class="mb-6"
        >
          <div class="d-flex pa-4">
            <!-- Memory Image -->
            <div class="memory-preview-image mr-4">
              <v-img
                v-if="memory.files && memory.files[0]"
                :src="memory.files[0].url"
                :alt="memory.title"
                width="80"
                height="80"
                cover
                rounded="lg"
              />
              <div v-else class="image-placeholder">
                <v-icon size="32" color="grey-lighten-2">mdi-image-outline</v-icon>
              </div>
            </div>

            <!-- Memory Info -->
            <div class="flex-grow-1">
              <h4 class="text-h6 font-weight-medium mb-1">
                {{ memory.title }}
              </h4>
              <p class="text-body-2 text-medium-emphasis mb-2 text-truncate-2">
                {{ memory.description || memory.content || '' }}
              </p>
              <div class="d-flex align-center">
                <v-icon size="16" color="grey" class="mr-1">mdi-calendar</v-icon>
                <span class="text-caption text-medium-emphasis">
                  {{ formatDate(memory.date || memory.memoryDate || '') }}
                </span>
              </div>
            </div>
          </div>
        </v-card>

        <!-- Partner Selection -->
        <div class="mb-6">
          <h4 class="text-h6 font-weight-medium mb-3">
            <v-icon color="primary" class="mr-2">mdi-account-heart</v-icon>
            Chia Sẻ Với
          </h4>
          
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <div v-if="couplesStore.isConnected && couplesStore.partner" class="d-flex align-center">
              <v-avatar size="48" class="mr-3">
                <v-img 
                  v-if="couplesStore.partner.photoURL" 
                  :src="couplesStore.partner.photoURL" 
                />
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
              <div>
                <h4 class="text-subtitle-1 font-weight-medium">
                  {{ couplesStore.partner.displayName || couplesStore.partner.name }}
                </h4>
                <p class="text-body-2 text-medium-emphasis">
                  {{ couplesStore.partner.email }}
                </p>
              </div>
              <v-spacer />
              <v-icon color="success">mdi-check-circle</v-icon>
            </div>
            
            <div v-else class="text-center py-4">
              <v-icon size="48" color="grey-lighten-2" class="mb-2">mdi-account-off</v-icon>
              <p class="text-body-2 text-medium-emphasis">
                Bạn chưa kết nối với partner nào
              </p>
              <v-btn 
                color="primary" 
                variant="outlined" 
                size="small"
                @click="$router.push('/couples')"
                class="mt-2"
              >
                Kết Nối Ngay
              </v-btn>
            </div>
          </v-card>
        </div>

        <!-- Share Message -->
        <div class="mb-4">
          <h4 class="text-h6 font-weight-medium mb-3">
            <v-icon color="primary" class="mr-2">mdi-message-text</v-icon>
            Lời Nhắn (Tùy Chọn)
          </h4>
          <v-textarea
            v-model="shareMessage"
            placeholder="Viết lời nhắn gửi kèm memory này..."
            rows="3"
            variant="outlined"
            rounded="lg"
            hide-details
            counter="200"
            maxlength="200"
          />
        </div>

        <!-- Share Options -->
        <div class="mb-4">
          <h4 class="text-h6 font-weight-medium mb-3">
            <v-icon color="primary" class="mr-2">mdi-cog</v-icon>
            Tùy Chọn
          </h4>
          <v-card variant="outlined" rounded="lg" class="pa-4">
            <v-switch
              v-model="notifyPartner"
              label="Gửi thông báo cho partner"
              color="primary"
              hide-details
              class="mb-2"
            />
            <v-switch
              v-model="allowPartnerEdit"
              label="Cho phép partner chỉnh sửa"
              color="primary"
              hide-details
            />
          </v-card>
        </div>
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          variant="text"
          @click="closeDialog"
          :disabled="isSharing"
        >
          Hủy
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="shareMemory"
          :loading="isSharing"
          :disabled="!couplesStore.isConnected || !couplesStore.partner"
        >
          <v-icon start>mdi-share-variant</v-icon>
          Chia Sẻ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMemoriesStore } from '@/stores/memories'
import { useCouplesStore } from '@/stores/couples'
import { useDialogsStore } from '@/stores/dialogs'
import type { Memory } from '@/types'

// Props
interface Props {
  memory?: Memory | null
}

const props = defineProps<Props>()

// Composables
const router = useRouter()
const memoriesStore = useMemoriesStore()
const couplesStore = useCouplesStore()
const dialogsStore = useDialogsStore()

// Local state
const shareMessage = ref('')
const notifyPartner = ref(true)
const allowPartnerEdit = ref(false)
const isSharing = ref(false)

// Computed
const dialog = computed({
  get: () => dialogsStore.shareMemoryDialog.isOpen,
  set: (value: boolean) => {
    if (!value) {
      dialogsStore.closeShareMemoryDialog()
    }
  }
})

const memory = computed(() => props.memory || dialogsStore.shareMemoryDialog.memory)

// Methods
const formatDate = (date: string | Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const shareMemory = async () => {
  if (!memory.value || !couplesStore.partner) return

  try {
    isSharing.value = true
    
    await memoriesStore.shareMemory(
      memory.value.id, 
      couplesStore.partner.id,
      shareMessage.value || undefined
    )

    // Show success message
    dialogsStore.showAlert({
      type: 'success',
      title: 'Thành Công!',
      message: 'Memory đã được chia sẻ với partner của bạn',
      confirmText: 'Đóng'
    })

    closeDialog()
  } catch (error: any) {
    console.error('Error sharing memory:', error)
    
    // Show error message
    dialogsStore.showAlert({
      type: 'error',
      title: 'Lỗi!',
      message: error.message || 'Không thể chia sẻ memory. Vui lòng thử lại.',
      confirmText: 'Đóng'
    })
  } finally {
    isSharing.value = false
  }
}

const closeDialog = () => {
  // Reset form
  shareMessage.value = ''
  notifyPartner.value = true
  allowPartnerEdit.value = false
  
  // Close dialog
  dialogsStore.closeShareMemoryDialog()
}
</script>

<style scoped>
.memory-preview-image {
  min-width: 80px;
}

.image-placeholder {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 8px;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
