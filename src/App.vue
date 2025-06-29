<template>
  <!-- Global Loading Overlay -->
  <Transition name="fade">
    <LoadingOverlay v-if="uiStore.isLoading" />
  </Transition>

  <!-- Router View Only -->
  <RouterView v-slot="{ Component, route }">
    <Transition :name="getPageTransition(route)" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <!-- Global Modals & Notifications -->
  <ConfirmModal />
  <NotificationContainer />
  <OfflineIndicator v-if="!isOnline" />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import LoadingOverlay from "@/components/common/LoadingOverlay.vue";
import ConfirmModal from "@/components/common/ConfirmModal.vue";
import NotificationContainer from "@/components/common/NotificationContainer.vue";
import OfflineIndicator from "@/components/common/OfflineIndicator.vue";
import { useUIStore } from "@/stores/ui";
import { useOnlineStatus } from "@/composables/useOnlineStatus";
import { useCouple } from "@/composables/useCouple";
import { onMounted } from 'vue';

const uiStore = useUIStore();
const { isOnline } = useOnlineStatus();
// Global fetch of couple connection when app starts
const { fetchCoupleConnection } = useCouple();
onMounted(async () => {
  await fetchCoupleConnection(true);
});

function getPageTransition(route: { meta?: { transition?: string } }) {
  return route.meta?.transition || "fade";
}
</script>
