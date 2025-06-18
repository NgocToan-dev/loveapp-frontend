# Global Dialog System Documentation

Hệ thống quản lý dialog toàn cục cho LoveApp sử dụng Pinia store để có thể mở dialog từ bất kỳ component nào trong ứng dụng.

## Tại sao cần Global Dialog System?

### Vấn đề với cách cũ
- Dialog được quản lý trong từng component riêng lẻ
- Chỉ có thể mở dialog từ component cha
- Khó khăn khi muốn mở dialog từ service, store, hoặc component khác
- Code bị lặp lại nhiều nơi

### Lợi ích của Global Dialog System
- ✅ Mở dialog từ bất kỳ đâu trong ứng dụng
- ✅ Quản lý tập trung tất cả dialog
- ✅ Tái sử dụng code
- ✅ Type-safe với TypeScript
- ✅ Dễ dàng mở rộng và bảo trì

## Cấu trúc hệ thống

```
src/
├── stores/
│   └── dialogs.ts                    # Store quản lý dialog
├── components/
│   ├── GlobalDialogContainer.vue     # Container render dialog
│   ├── TimelineEventFormDialog.vue  # Form dialog mới
│   ├── ConfirmDialog.vue            # Dialog xác nhận
│   └── AlertDialog.vue              # Dialog thông báo
└── views/
    └── DialogDemoView.vue           # Demo các dialog
```

## Cách sử dụng

### 1. Mở Timeline Event Form

```vue
<script setup>
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore()

// Tạo mới event
const createEvent = () => {
  dialogsStore.openTimelineEventForm()
}

// Chỉnh sửa event
const editEvent = (event) => {
  dialogsStore.openTimelineEventForm(event)
}
</script>

<template>
  <v-btn @click="createEvent">Tạo sự kiện</v-btn>
  <v-btn @click="editEvent(selectedEvent)">Sửa sự kiện</v-btn>
</template>
```

### 2. Mở Confirm Dialog

```vue
<script setup>
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore()

const deleteItem = () => {
  dialogsStore.openConfirmDialog({
    title: 'Xác nhận xóa',
    message: 'Bạn có chắc chắn muốn xóa item này?',
    confirmText: 'Xóa',
    cancelText: 'Hủy',
    onConfirm: () => {
      // Xử lý xóa
      console.log('Đã xóa!')
    },
    onCancel: () => {
      console.log('Đã hủy!')
    }
  })
}
</script>
```

### 3. Mở Alert Dialog

```vue
<script setup>
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore()

const showSuccess = () => {
  dialogsStore.openAlertDialog({
    title: 'Thành công',
    message: 'Thao tác đã được thực hiện thành công!',
    buttonText: 'OK',
    onClose: () => {
      console.log('Dialog đã đóng!')
    }
  })
}
</script>
```

### 4. Mở dialog khác

```vue
<script setup>
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore()

// Mở Invitations Dialog
const openInvitations = () => {
  dialogsStore.openInvitationsDialog()
}

// Mở Couple Preferences Dialog
const openPreferences = () => {
  dialogsStore.openCouplePreferencesDialog()
}
</script>
```

## API Reference

### DialogsStore Methods

#### `openDialog(config: DialogConfig)`
Mở dialog tùy chỉnh với config đầy đủ.

```typescript
interface DialogConfig {
  component: string                    // Tên component
  props?: Record<string, any>          // Props truyền vào component
  options?: {                          // Tùy chọn dialog
    persistent?: boolean
    maxWidth?: string
    fullscreen?: boolean
    scrollable?: boolean
  }
  onConfirm?: (data?: any) => void    // Callback khi confirm
  onCancel?: () => void               // Callback khi cancel
}
```

#### `closeDialog(id: string)`
Đóng dialog theo ID.

#### `closeAllDialogs()`
Đóng tất cả dialog.

#### Specific Dialog Methods
- `openTimelineEventForm(event?: TimelineEvent)`
- `openInvitationsDialog()`
- `openCouplePreferencesDialog()`
- `openConfirmDialog(options)`
- `openAlertDialog(options)`

## Sử dụng từ Store hoặc Service

```typescript
// Trong store
import { useDialogsStore } from '@/stores/dialogs'

export const useSomeStore = defineStore('someStore', () => {
  const dialogsStore = useDialogsStore()
  
  const handleAction = async () => {
    try {
      await someAsyncAction()
      
      // Hiển thị thông báo thành công
      dialogsStore.openAlertDialog({
        title: 'Thành công',
        message: 'Thao tác đã được thực hiện!'
      })
    } catch (error) {
      // Hiển thị lỗi
      dialogsStore.openAlertDialog({
        title: 'Lỗi',
        message: 'Có lỗi xảy ra!'
      })
    }
  }
  
  return { handleAction }
})
```

## Tạo Dialog Component mới

Để tạo dialog component mới:

1. Tạo component dialog:

```vue
<!-- MyCustomDialog.vue -->
<template>
  <v-card>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <!-- Nội dung dialog -->
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="$emit('cancel')">Hủy</v-btn>
      <v-btn color="primary" @click="$emit('confirm', formData)">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
defineProps<{ title: string }>()
defineEmits<{
  confirm: [data: any]
  cancel: []
}>()
</script>
```

2. Thêm vào `GlobalDialogContainer.vue`:

```typescript
import MyCustomDialog from './MyCustomDialog.vue'

const getDialogComponent = (componentName: string) => {
  const components: Record<string, any> = {
    // ...existing components
    MyCustomDialog
  }
  return components[componentName] || null
}
```

3. Thêm helper method vào `dialogs.ts`:

```typescript
const openMyCustomDialog = (title: string) => {
  return openDialog({
    component: 'MyCustomDialog',
    props: { title },
    options: { maxWidth: '500' }
  })
}
```

## Demo

Truy cập `/dialog-demo` để xem demo đầy đủ của hệ thống dialog.

## Lưu ý

- Tất cả dialog sẽ được render trong `GlobalDialogContainer` 
- `GlobalDialogContainer` đã được thêm vào `App.vue`
- Dialog sẽ tự động đóng khi emit `confirm` hoặc `cancel`
- Có thể mở nhiều dialog cùng lúc (stacking)
- Dialog store hoạt động độc lập, không phụ thuộc vào component nào

## Migration từ v-dialog cũ

Thay vì:
```vue
<!-- Cách cũ -->
<template>
  <v-dialog v-model="dialog">
    <TimelineEventForm @save="handleSave" @cancel="dialog = false" />
  </v-dialog>
  <v-btn @click="dialog = true">Mở form</v-btn>
</template>

<script setup>
const dialog = ref(false)
const handleSave = (data) => { /* ... */ }
</script>
```

Sử dụng:
```vue
<!-- Cách mới -->
<template>
  <v-btn @click="openForm">Mở form</v-btn>
</template>

<script setup>
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore()
const openForm = () => dialogsStore.openTimelineEventForm()
</script>
```
