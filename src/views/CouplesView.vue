<template>
  <div class="couples-view">
    <!-- Header -->
    <v-container>
      <div class="text-center mb-8">
        <h1 class="text-h3 font-weight-bold text-primary mb-4">
          💕 Không Gian Cặp Đôi
        </h1>
        <p class="text-h6 text-medium-emphasis">
          Nơi lưu giữ và chia sẻ những khoảnh khắc đẹp nhất của chúng ta
        </p>
      </div>

      <!-- Connection Section -->
      <CoupleConnection v-if="!couplesStore.isConnected" />

      <!-- Connected Dashboard -->
      <div v-if="couplesStore.isConnected">
        <!-- Stats Cards -->
        <v-row class="mb-8">
          <v-col cols="12" md="3" v-for="stat in statsCards" :key="stat.title">
            <v-card 
              :color="stat.color"
              variant="tonal"
              rounded="xl"
              class="love-stat-card"
            >
              <v-card-text class="pa-6 text-center">
                <v-icon :color="stat.color" size="48" class="mb-3">
                  {{ stat.icon }}
                </v-icon>
                <div class="text-h3 font-weight-bold mb-2" :class="`text-${stat.color}`">
                  {{ stat.value }}
                </div>
                <div class="text-body-1">
                  {{ stat.title }}
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Content Tabs -->
        <v-card rounded="xl" elevation="0" class="love-main-card">
          <v-tabs 
            v-model="activeMainTab" 
            color="primary"
            grow
            class="mb-4"
          >
            <v-tab value="love-days">
              <v-icon start>mdi-calendar-heart</v-icon>
              Ngày Đặc Biệt
            </v-tab>
            <v-tab value="partnerships">
              <v-icon start>mdi-handshake</v-icon>
              Mối Quan Hệ
            </v-tab>
            <v-tab value="timeline">
              <v-icon start>mdi-timeline</v-icon>
              Dòng Thời Gian
            </v-tab>
          </v-tabs>

          <v-card-text class="pa-6">
            <v-tabs-window v-model="activeMainTab">
              <!-- Love Days Tab -->
              <v-tabs-window-item value="love-days">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h3 class="text-h5 font-weight-medium">
                    <v-icon color="pink" class="mr-2">mdi-calendar-heart</v-icon>
                    Những Ngày Đặc Biệt
                  </h3>
                  <v-btn
                    color="primary"
                    variant="elevated"
                    rounded="xl"
                    @click="showCreateLoveDayDialog = true"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    Thêm Ngày Đặc Biệt
                  </v-btn>
                </div>

                <!-- Upcoming Love Days -->
                <div v-if="couplesStore.upcomingLoveDays.length > 0" class="mb-6">
                  <h4 class="text-h6 font-weight-medium mb-4">Sắp Tới</h4>
                  <v-row>
                    <v-col 
                      cols="12" 
                      md="6" 
                      lg="4"
                      v-for="loveDay in couplesStore.upcomingLoveDays.slice(0, 3)" 
                      :key="loveDay.id"
                    >
                      <LoveDayCard :love-day="loveDay" @edit="editLoveDay" @delete="deleteLoveDay" />
                    </v-col>
                  </v-row>
                </div>

                <!-- All Love Days -->
                <div v-if="couplesStore.loveDays.length > 0">
                  <h4 class="text-h6 font-weight-medium mb-4">Tất Cả Ngày Đặc Biệt</h4>
                  <v-row>
                    <v-col 
                      cols="12" 
                      md="6" 
                      lg="4"
                      v-for="loveDay in couplesStore.loveDays" 
                      :key="loveDay.id"
                    >
                      <LoveDayCard :love-day="loveDay" @edit="editLoveDay" @delete="deleteLoveDay" />
                    </v-col>
                  </v-row>
                </div>

                <!-- No Love Days -->
                <div v-if="couplesStore.loveDays.length === 0" class="text-center py-12">
                  <v-icon size="100" color="grey-lighten-2" class="mb-4">mdi-calendar-heart-outline</v-icon>
                  <h4 class="text-h6 font-weight-medium mb-2">Chưa có ngày đặc biệt nào</h4>
                  <p class="text-body-1 text-medium-emphasis mb-6">
                    Hãy thêm những ngày quan trọng trong mối quan hệ của bạn
                  </p>
                  <v-btn
                    color="primary"
                    variant="elevated"
                    size="large"
                    rounded="xl"
                    @click="showCreateLoveDayDialog = true"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    Thêm Ngày Đầu Tiên
                  </v-btn>
                </div>
              </v-tabs-window-item>

              <!-- Partnerships Tab -->
              <v-tabs-window-item value="partnerships">
                <div class="d-flex justify-space-between align-center mb-6">
                  <h3 class="text-h5 font-weight-medium">
                    <v-icon color="purple" class="mr-2">mdi-handshake</v-icon>
                    Mối Quan Hệ
                  </h3>
                  <v-btn
                    color="purple"
                    variant="elevated"
                    rounded="xl"
                    @click="showCreatePartnershipDialog = true"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    Thêm Mối Quan Hệ
                  </v-btn>
                </div>

                <!-- Active Partnerships -->
                <div v-if="couplesStore.activePartnerships.length > 0" class="mb-6">
                  <v-row>
                    <v-col 
                      cols="12" 
                      md="6"
                      v-for="partnership in couplesStore.activePartnerships" 
                      :key="partnership.id"
                    >
                      <PartnershipCard :partnership="partnership" @edit="editPartnership" @delete="deletePartnership" />
                    </v-col>
                  </v-row>
                </div>

                <!-- No Partnerships -->
                <div v-if="couplesStore.partnerships.length === 0" class="text-center py-12">
                  <v-icon size="100" color="grey-lighten-2" class="mb-4">mdi-handshake-outline</v-icon>
                  <h4 class="text-h6 font-weight-medium mb-2">Chưa có mối quan hệ nào</h4>
                  <p class="text-body-1 text-medium-emphasis mb-6">
                    Đánh dấu các mốc quan trọng trong mối quan hệ
                  </p>
                  <v-btn
                    color="purple"
                    variant="elevated"
                    size="large"
                    rounded="xl"
                    @click="showCreatePartnershipDialog = true"
                  >
                    <v-icon start>mdi-plus</v-icon>
                    Tạo Mối Quan Hệ Đầu Tiên
                  </v-btn>
                </div>
              </v-tabs-window-item>

              <!-- Timeline Tab -->
              <v-tabs-window-item value="timeline">
                <div class="text-center py-12">
                  <v-icon size="100" color="grey-lighten-2" class="mb-4">mdi-timeline-outline</v-icon>
                  <h4 class="text-h6 font-weight-medium mb-2">Dòng Thời Gian</h4>
                  <p class="text-body-1 text-medium-emphasis">
                    Tính năng đang được phát triển...
                  </p>
                </div>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
        </v-card>
      </div>
    </v-container>

    <!-- Create Love Day Dialog -->
    <CreateLoveDayDialog 
      v-model="showCreateLoveDayDialog"
      @created="handleLoveDayCreated"
    />

    <!-- Edit Love Day Dialog -->
    <EditLoveDayDialog 
      v-model="showEditLoveDayDialog"
      :love-day="selectedLoveDay"
      @updated="handleLoveDayUpdated"
    />

    <!-- Create Partnership Dialog -->
    <CreatePartnershipDialog 
      v-model="showCreatePartnershipDialog"
      @created="handlePartnershipCreated"
    />

    <!-- Edit Partnership Dialog -->
    <EditPartnershipDialog 
      v-model="showEditPartnershipDialog"
      :partnership="selectedPartnership"
      @updated="handlePartnershipUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCouplesStore } from '@/stores/couples'
import type { LoveDay, Partnership } from '@/services/couples'
import CoupleConnection from '@/components/CoupleConnection.vue'
import LoveDayCard from '@/components/LoveDayCard.vue'
import PartnershipCard from '@/components/PartnershipCard.vue'
import CreateLoveDayDialog from '@/components/CreateLoveDayDialog.vue'
import EditLoveDayDialog from '@/components/EditLoveDayDialog.vue'
import CreatePartnershipDialog from '@/components/CreatePartnershipDialog.vue'
import EditPartnershipDialog from '@/components/EditPartnershipDialog.vue'

const couplesStore = useCouplesStore()

const activeMainTab = ref('love-days')
const showCreateLoveDayDialog = ref(false)
const showEditLoveDayDialog = ref(false)
const showCreatePartnershipDialog = ref(false)
const showEditPartnershipDialog = ref(false)
const selectedLoveDay = ref<LoveDay | null>(null)
const selectedPartnership = ref<Partnership | null>(null)

const statsCards = computed(() => [
  {
    title: 'Ngày Bên Nhau',
    value: couplesStore.coupleStats?.daysTogether || 0,
    icon: 'mdi-heart',
    color: 'pink'
  },
  {
    title: 'Kỷ Niệm',
    value: couplesStore.coupleStats?.memoriesCount || 0,
    icon: 'mdi-camera-outline',
    color: 'purple'
  },
  {
    title: 'Ghi Chú',
    value: couplesStore.coupleStats?.notesCount || 0,
    icon: 'mdi-note-text-outline',
    color: 'orange'
  },
  {
    title: 'Ngày Đặc Biệt',
    value: couplesStore.coupleStats?.loveDaysCount || 0,
    icon: 'mdi-calendar-heart',
    color: 'green'
  }
])

const editLoveDay = (loveDay: LoveDay) => {
  selectedLoveDay.value = loveDay
  showEditLoveDayDialog.value = true
}

const deleteLoveDay = async (loveDayId: string) => {
  if (confirm('Bạn có chắc muốn xóa ngày đặc biệt này?')) {
    await couplesStore.deleteLoveDay(loveDayId)
  }
}

const editPartnership = (partnership: Partnership) => {
  selectedPartnership.value = partnership
  showEditPartnershipDialog.value = true
}

const deletePartnership = async (partnershipId: string) => {
  if (confirm('Bạn có chắc muốn xóa mối quan hệ này?')) {
    await couplesStore.deletePartnership(partnershipId)
  }
}

const handleLoveDayCreated = () => {
  showCreateLoveDayDialog.value = false
  couplesStore.fetchLoveDays()
  couplesStore.fetchCoupleStats()
}

const handleLoveDayUpdated = () => {
  showEditLoveDayDialog.value = false
  selectedLoveDay.value = null
  couplesStore.fetchLoveDays()
}

const handlePartnershipCreated = () => {
  showCreatePartnershipDialog.value = false
  couplesStore.fetchPartnerships()
}

const handlePartnershipUpdated = () => {
  showEditPartnershipDialog.value = false
  selectedPartnership.value = null
  couplesStore.fetchPartnerships()
}

onMounted(async () => {
  await Promise.all([
    couplesStore.fetchCurrentCouple(),
    couplesStore.fetchLoveDays(),
    couplesStore.fetchPartnerships(),
    couplesStore.fetchCoupleStats()
  ])
})
</script>

<style scoped lang="scss">
.couples-view {
  min-height: 100vh;
  background: linear-gradient(135deg, 
    rgba(var(--v-theme-primary), 0.05) 0%, 
    rgba(var(--v-theme-secondary), 0.03) 50%,
    rgba(var(--v-theme-accent), 0.02) 100%
  );
}

.love-stat-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.6, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
}

.love-main-card {
  border: 1px solid rgba(var(--v-theme-primary), 0.15);
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(10px);
}

.v-tabs {
  border-radius: 12px;
  background: rgba(var(--v-theme-surface), 0.8);
}

.v-tab {
  border-radius: 8px;
  margin: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(var(--v-theme-primary), 0.1);
  }
}

@media (max-width: 960px) {
  .love-stat-card:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 600px) {
  .love-stat-card:hover {
    transform: none;
  }
  
  .v-tab {
    font-size: 0.875rem;
    padding: 0 8px;
  }
}
</style> 