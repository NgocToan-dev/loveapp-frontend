<template>
  <div class="dialog-demo-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h2 class="text-h4 mb-4">Demo Dialog System</h2>
          <p class="text-body-1 mb-6">
            Bạn có thể mở các dialog từ bất kỳ component nào trong ứng dụng bằng cách sử dụng Pinia store.
          </p>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Create Dialogs</v-card-title>
            <v-card-text>
              <div class="d-flex flex-column ga-3">
                <v-btn
                  color="primary"
                  @click="openCreateMemoryDialog"
                  prepend-icon="mdi-heart-plus"
                >
                  Tạo kỷ niệm mới
                </v-btn>
                
                <v-btn
                  color="secondary"
                  @click="openCreateNoteDialog"
                  prepend-icon="mdi-note-plus"
                >
                  Tạo ghi chú mới
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Other Dialogs</v-card-title>
            <v-card-text>
              <div class="d-flex flex-column ga-3">
                <v-btn
                  color="info"
                  @click="openInvitationsDialog"
                  prepend-icon="mdi-email"
                >
                  Mở Invitations Dialog
                </v-btn>
                
                <v-btn
                  color="success"
                  @click="openPreferencesDialog"
                  prepend-icon="mdi-cog"
                >
                  Mở Preferences Dialog
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Confirmation & Alert Dialogs</v-card-title>
            <v-card-text>
              <div class="d-flex flex-wrap ga-3">
                <v-btn
                  color="warning"
                  @click="showConfirmDialog"
                  prepend-icon="mdi-help"
                >
                  Confirm Dialog
                </v-btn>
                
                <v-btn
                  color="error"
                  @click="showDeleteConfirmDialog"
                  prepend-icon="mdi-delete"
                >
                  Delete Confirm
                </v-btn>
                
                <v-btn
                  color="info"
                  @click="showAlertDialog"
                  prepend-icon="mdi-information"
                >
                  Alert Dialog
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title>Cách sử dụng từ component khác</v-card-title>
            <v-card-text>
              <pre class="code-example">
<code>// Trong bất kỳ component nào
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore()

// Mở dialog tạo sự kiện
const openEventForm = () => {
  dialogsStore.openBaseDialog(
    'TimelineEventForm',
    {},
    { maxWidth: '600', persistent: true }
  )
}

// Mở dialog confirm
const confirmDelete = () => {
  dialogsStore.openConfirmDialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa item này?',
    onConfirm: () => {
      // Xử lý xóa
      console.log('Đã xóa!')
    }
  })
}

// Mở dialog alert
const showSuccess = () => {
  dialogsStore.openAlertDialog({
    title: 'Thành công',
    message: 'Thao tác đã được thực hiện thành công!'
  })
}</code>
              </pre>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useDialogsStore } from '@stores/dialogs'

const dialogsStore = useDialogsStore()

// Create Dialogs
const openCreateMemoryDialog = () => {
  dialogsStore.openBaseDialog('CreateMemoryDialog')
}

const openCreateNoteDialog = () => {
  dialogsStore.openBaseDialog('CreateNoteDialog')
}

// Other Dialogs
const openInvitationsDialog = () => {
  dialogsStore.openBaseDialog(
    'InvitationsDialog',
    {},
    { maxWidth: '800', scrollable: true }
  )
}

const openPreferencesDialog = () => {
  dialogsStore.openBaseDialog(
    'CouplePreferencesDialog',
    {},
    { maxWidth: '600', scrollable: true }
  )
}

// Confirmation & Alert Dialogs
const showConfirmDialog = () => {
  dialogsStore.openConfirmDialog({
    title: 'Xác nhận thao tác',
    message: 'Bạn có chắc chắn muốn thực hiện thao tác này không?',
    onConfirm: () => {
      console.log('User confirmed!')
      showAlertDialog('Thao tác đã được xác nhận!')
    },
    onCancel: () => {
      console.log('User cancelled!')
    }
  })
}

const showDeleteConfirmDialog = () => {
  dialogsStore.openConfirmDialog({
    title: 'Xác nhận xóa',
    message: 'Thao tác này không thể hoàn tác. Bạn có chắc chắn muốn xóa?',
    confirmText: 'Xóa',
    cancelText: 'Hủy',
    onConfirm: () => {
      console.log('Item deleted!')
      showAlertDialog('Đã xóa thành công!')
    }
  })
}

const showAlertDialog = (message = 'Đây là một thông báo demo!') => {
  dialogsStore.openAlertDialog({
    title: 'Thông báo',
    message: message,
    onClose: () => {
      console.log('Alert dialog closed!')
    }
  })
}
</script>

<style scoped>
.dialog-demo-container {
  min-height: 100vh;
  padding: 20px;
}

.code-example {
  background-color: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 8px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  overflow-x: auto;
  white-space: pre;
}

.ga-3 {
  gap: 12px;
}
</style>
