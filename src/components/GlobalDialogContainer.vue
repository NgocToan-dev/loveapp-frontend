<template>
  <div>
    <!-- Render all active dialogs -->
    <template v-for="dialog in dialogs" :key="dialog.id">
      <v-dialog
        :model-value="true"
        @update:model-value="(value) => !value && closeDialog(dialog.id)"
        :persistent="dialog.options?.persistent"
        :max-width="dialog.options?.maxWidth"
        :fullscreen="dialog.options?.fullscreen"
        :scrollable="dialog.options?.scrollable"
      >
        <!-- Dynamic component rendering -->
        <component
          :is="getDialogComponent(dialog.component)"
          v-bind="dialog.props"
          @confirm="(data: any) => handleConfirm(dialog, data)"
          @cancel="() => handleCancel(dialog)"
          @close="() => closeDialog(dialog.id)"
        />
      </v-dialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDialogsStore } from '@/stores/dialogs'

// Import dialog components
import InvitationsDialog from './InvitationsDialog.vue'
import ConfirmDialog from '@components/ConfirmDialog.vue'
import AlertDialog from '@components/AlertDialog.vue'
import ShareMemoryDialog from '@components/ShareMemoryDialog.vue'

const dialogsStore = useDialogsStore()

const dialogs = computed(() => dialogsStore.dialogs)

const getDialogComponent = (componentName: string) => {
  const components: Record<string, any> = {
    InvitationsDialog,
    ConfirmDialog,
    AlertDialog,
    ShareMemoryDialog
  }
  return components[componentName] || null
}

const closeDialog = (id: string) => {
  dialogsStore.closeDialog(id)
}

const handleConfirm = (dialog: any, data?: any) => {
  if (dialog.onConfirm) {
    dialog.onConfirm(data)
  }
  closeDialog(dialog.id)
}

const handleCancel = (dialog: any) => {
  if (dialog.onCancel) {
    dialog.onCancel()
  }
  closeDialog(dialog.id)
}
</script>
