# Migration Guide: Applying Global Dialog System to All Views

## Views Already Updated:
- ✅ TimelineView.vue - Converted to use dialog store
- ✅ MemoriesView.vue - Converted to use dialog store (placeholder)

## Views To Update:

### 1. NotesView.vue
**Changes needed:**
- Import `useDialogsStore`
- Replace local dialog state with global dialog calls
- Create note dialog helper methods

### 2. RemindersView.vue
**Changes needed:**
- Import `useDialogsStore`
- Replace local dialog management
- Create reminder dialog helpers

### 3. AnniversariesView.vue
**Changes needed:**
- Import `useDialogsStore`
- Replace anniversary form dialogs
- Use global confirm dialogs for delete actions

### 4. NotificationsView.vue
**Changes needed:**
- Use global alert/confirm dialogs
- Replace any local modals

### 5. CouplesView.vue
**Changes needed:**
- Import `useDialogsStore`
- Use `openInvitationsDialog()` and `openCouplePreferencesDialog()`

### 6. DashboardView.vue
**Changes needed:**
- Import `useDialogsStore`
- Use global dialogs for quick actions
- Replace any local modals with global ones

### 7. SettingsView.vue
**Changes needed:**
- Use global confirm dialogs for dangerous actions
- Replace any form dialogs

### 8. Auth Views (LoginView, RegisterView, etc.)
**Changes needed:**
- Use global alert dialogs for error messages
- Replace local error handling with global dialogs

## Common Pattern for Migration:

### Before:
```vue
<template>
  <v-dialog v-model="dialog">
    <SomeForm @save="handleSave" @cancel="dialog = false" />
  </v-dialog>
  <v-btn @click="dialog = true">Open</v-btn>
</template>

<script setup>
const dialog = ref(false)
const handleSave = (data) => { /* ... */ }
</script>
```

### After:
```vue
<template>
  <v-btn @click="openDialog">Open</v-btn>
</template>

<script setup>
import { useDialogsStore } from '@/stores/dialogs'

const dialogsStore = useDialogsStore()

const openDialog = () => {
  dialogsStore.openSomeDialog()
}
</script>
```

## Next Steps:
1. Update each view file systematically
2. Test dialog functionality
3. Remove unused dialog components
4. Update documentation
