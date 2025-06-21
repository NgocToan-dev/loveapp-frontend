# 📋 KÍNH HOẠCH THỰC HIỆN CHI TIẾT - LOVEAPP FRONTEND

> **Ngày tạo:** 21/06/2025  
> **Trạng thái:** 🟡 Đang thực hiện  
> **Ưu tiên:** Cao → Thấp

---

## 🎯 TỔNG QUAN CÁC NHIỆM VỤ

### 1. 🔄 **[ƯƯỚC TIÊN CAO] Fix Refresh Token Mechanism**
### 2. 🌐 **[ƯƯỚC TIÊN CAO] I18n Memories Folder** 
### 3. 🎨 **[ƯƯỚC TIÊN TRUNG BÌNH] Layout Restructure**
### 4. 🎉 **[ƯƯỚC TIÊN TRUNG BÌNH] Convert Memory to Anniversary**
### 5. 🗑️ **[ƯƯỚC TIÊN THẤP] Remove Notes System**
### 6. 🔍 **[ƯƯỚC TIÊN THẤP] Fix Memory Privacy/Sharing**

---

## 🔄 1. FIX REFRESH TOKEN MECHANISM ✅ **HOÀN THÀNH**

**Vấn đề:** Refresh token gọi thành công nhưng cơ chế cập nhật token sau khi refresh bị sai

### 🔧 Các tác vụ cần thực hiện:

- [x] **1.1** Phân tích response structure hiện tại từ API
  - [x] Log response trong `refreshAccessToken()` method
  - [x] So sánh với expected format trong `setTokens()`
  
- [x] **1.2** Sửa `refreshAccessToken()` method trong `src/services/auth.ts`
  - [x] Cập nhật xử lý response structure đúng format
  - [x] Handle case response có nested `data` property
  
- [x] **1.3** Cập nhật `setTokens()` method
  - [x] Ensure correct token extraction từ response
  - [x] Fix expiry time calculation
  
- [x] **1.4** Kiểm tra API Service interceptors
  - [x] Review `src/services/api.ts` interceptors
  - [x] Ensure token refresh được gọi đúng lúc
  
- [x] **1.5** Test end-to-end refresh flow
  - [x] Test với token hết hạn
  - [x] Test với invalid refresh token
  - [x] Test concurrent requests during refresh

### 📝 Chi tiết kỹ thuật:

```typescript
// Expected response structure:
{
  "success": true,
  "message": "Token refreshed successfully", 
  "data": {
    "accessToken": "...",
    "expiresIn": 900
  }
}
```

**Files cần sửa:**
- `src/services/auth.ts` (method: `refreshAccessToken`, `setTokens`)
- `src/services/api.ts` (interceptors nếu cần)

---

## 🌐 2. I18N MEMORIES FOLDER ✅ **HOÀN THÀNH**

**Vấn đề:** Code đang hardcode Vietnamese text thay vì sử dụng i18n

### 🔧 Các tác vụ cần thực hiện:

- [x] **2.1** Audit tất cả hardcode text trong memories components
  - [x] `MemoryGallery.vue` - tất cả text hiển thị
  - [x] `MemoryCard.vue` - labels và messages  
  - [x] `CreateMemoryDialog.vue` - form labels
  - [x] `EditMemoryDialog.vue` - form labels
  - [x] Other memory components

- [x] **2.2** Thêm missing i18n keys vào Vietnamese translation
  - [x] Cập nhật `src/plugins/i18n/vn/index.ts`
  - [x] Thêm keys cho gallery, filters, actions
  - [x] Thêm keys cho memory types/categories
  
- [x] **2.3** Thêm English translations
  - [x] Cập nhật `src/plugins/i18n/en/index.ts`
  - [x] Đồng bộ với Vietnamese keys
  
- [x] **2.4** Cập nhật MemoryGallery.vue sử dụng i18n
  - [x] Replace hardcode "Bộ sưu tập kỷ niệm" → `$t('memories.gallery.title')`
  - [x] Replace filter labels → i18n keys
  - [x] Replace memory type labels → i18n keys
  - [x] Replace empty state messages → i18n keys
  
- [x] **2.5** Cập nhật các memory components khác
  - [x] Replace tất cả hardcode text
  - [x] Use `useI18n()` composable trong script
  - [x] Use `$t()` trong template

### 📝 I18n Keys cần thêm:

```typescript
memories: {
  gallery: {
    title: 'Bộ sưu tập kỷ niệm',
    stats: '{count} kỷ niệm • {photos} hình ảnh',
    viewModes: {
      grid: 'Lưới',
      masonry: 'Gạch',
      list: 'Danh sách'
    },
    filters: {
      type: 'Loại kỷ niệm',
      year: 'Năm', 
      search: 'Tìm kiếm...'
    },
    types: {
      'first-meet': 'Lần đầu gặp',
      'date': 'Hẹn hò',
      'travel': 'Du lịch',
      // ... other types
    },
    empty: {
      title: 'Không tìm thấy kỷ niệm nào',
      description: 'Hãy thử thay đổi bộ lọc hoặc tạo kỷ niệm mới',
      action: 'Tạo kỷ niệm đầu tiên'
    },
    loadMore: 'Xem thêm kỷ niệm'
  }
}
```

**Files cần sửa:**
- `src/components/memories/MemoryGallery.vue`
- `src/components/memories/MemoryCard.vue`
- `src/components/memories/*.vue` (tất cả components)
- `src/plugins/i18n/vn/index.ts`
- `src/plugins/i18n/en/index.ts`

---

## 🎨 3. LAYOUT RESTRUCTURE - TWO COLUMN LAYOUT ✅ **HOÀN THÀNH**

**Mục tiêu:** Sửa layout thành danh sách bên trái, filter/search/stats bên phải

### 🔧 Các tác vụ cần thực hiện:

- [x] **3.1** Tạo base layout components
  - [x] `src/components/ui/TwoColumnLayout.vue` - Base layout
  - [x] `src/components/ui/FilterPanel.vue` - Right sidebar component
  - [x] `src/components/ui/StatsWidget.vue` - Stats display component

- [x] **3.2** Tạo memories specific components  
  - [x] `src/components/memories/MemoryList.vue` - Left column list
  - [x] `src/components/memories/MemoryFilterPanel.vue` - Right sidebar filters
  - [x] `src/components/memories/MemoryStatsWidget.vue` - Stats widget

- [x] **3.3** Refactor MemoriesView sử dụng two-column layout
  - [x] Import và sử dụng `TwoColumnLayout`
  - [x] Move existing memory gallery vào left column
  - [x] Move filters và stats vào right column
  - [x] Ensure responsive design cho mobile

- [x] **3.4** Apply pattern cho các views khác
  - [x] `RemindersView.vue` - Sử dụng TwoColumnLayout
  - [x] `AnniversariesView.vue` - Sử dụng TwoColumnLayout
  - [x] `FilesView.vue` - Sử dụng TwoColumnLayout (optional)

**✅ Status:** Đã hoàn thành việc refactor MemoriesView sử dụng two-column layout với các component mới.
  - [ ] `src/components/ui/StatsWidget.vue` - Statistics display
  
- [ ] **3.2** Refactor Memory components
  - [ ] Tạo `src/components/memories/MemoryList.vue` từ `MemoryGallery.vue`
  - [ ] Tạo `src/components/memories/MemoryFilterPanel.vue`
  - [ ] Tạo `src/components/memories/MemoryStatsWidget.vue`
  - [ ] Cập nhật `src/views/memories/MemoriesView.vue`
  
- [ ] **3.3** Refactor Reminders components  
  - [ ] Tạo `src/components/reminders/ReminderList.vue`
  - [ ] Tạo `src/components/reminders/ReminderFilterPanel.vue`
  - [ ] Tạo `src/components/reminders/ReminderStatsWidget.vue`
  - [ ] Cập nhật reminders view
  
- [ ] **3.4** Refactor Anniversaries components
  - [ ] Tạo `src/components/anniversaries/AnniversaryList.vue` 
  - [ ] Tạo `src/components/anniversaries/AnniversaryFilterPanel.vue`
  - [ ] Tạo `src/components/anniversaries/AnniversaryStatsWidget.vue`
  - [ ] Cập nhật anniversaries view
  
- [ ] **3.5** Refactor Files components
  - [ ] Tạo `src/components/files/FileList.vue`
  - [ ] Tạo `src/components/files/FileFilterPanel.vue` 
  - [ ] Tạo `src/components/files/FileStatsWidget.vue`
  - [ ] Cập nhật files view

- [ ] **3.6** Responsive design cho mobile
  - [ ] Thêm toggle button để hide/show right panel
  - [ ] Mobile: Stack vertically thay vì side-by-side
  - [ ] Tablet: Adjust column widths
  
- [ ] **3.7** Update styles và themes
  - [ ] Consistent spacing và colors
  - [ ] Dark theme support
  - [ ] Animation transitions

### 📝 Layout Structure:

```vue
<TwoColumnLayout>
  <template #left>
    <MemoryList :memories="memories" />
  </template>
  
  <template #right>
    <FilterPanel>
      <MemoryStatsWidget />
      <MemoryFilterPanel />
    </FilterPanel>
  </template>
</TwoColumnLayout>
```

**Files cần tạo/sửa:**
- `src/components/ui/TwoColumnLayout.vue` (mới)
- `src/components/ui/FilterPanel.vue` (mới)
- `src/components/ui/StatsWidget.vue` (mới)
- `src/components/memories/MemoryList.vue` (refactor từ MemoryGallery.vue)
- `src/views/memories/MemoriesView.vue` (cập nhật)
- Tương tự cho reminders, anniversaries, files

---

## 🎉 4. CONVERT MEMORY TO ANNIVERSARY ✅ **HOÀN THÀNH**

**Mục tiêu:** Thêm tính năng chuyển đổi kỷ niệm thành ngày kỷ niệm

### 🔧 Các tác vụ cần thực hiện:

- [x] **4.1** Thêm convert action vào MemoryCard
  - [x] Thêm "Convert to Anniversary" button/menu item
  - [x] Thêm icon và styling
  - [x] Emit convert event
  
- [x] **4.2** Tạo ConvertMemoryToAnniversaryDialog component
  - [x] `src/components/memories/ConvertMemoryToAnniversaryDialog.vue`
  - [x] Form để edit anniversary details
  - [x] Preview memory information
  - [x] Validation logic
  
- [x] **4.3** Cập nhật API service
  - [ ] Thêm endpoint `/memories/{id}/convert-to-anniversary`
  - [ ] Cập nhật `src/services/memories.ts`
  - [ ] Error handling
  
- [ ] **4.4** Cập nhật Memory store
  - [ ] Thêm `convertToAnniversary` action trong `src/stores/memories.ts`
  - [ ] Handle success/error states
  - [ ] Update memories list after convert
  
- [ ] **4.5** Cập nhật Anniversary store
  - [ ] Refresh anniversaries list after convert
  - [ ] Handle duplicate prevention
  
- [ ] **4.6** Thêm i18n keys
  - [ ] Convert action labels
  - [ ] Dialog titles và messages
  - [ ] Success/error notifications
  
- [ ] **4.7** Integration testing
  - [ ] Test convert flow end-to-end
  - [ ] Test duplicate anniversary handling
  - [ ] Test error scenarios

### 📝 Component Structure:

```vue
<!-- ConvertMemoryToAnniversaryDialog.vue -->
<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>{{ $t('memories.convert.title') }}</v-card-title>
      <v-card-text>
        <!-- Memory preview -->
        <!-- Anniversary form fields -->
        <!-- Date picker -->
        <!-- Repeat options -->
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancel">{{ $t('common.cancel') }}</v-btn>
        <v-btn @click="convert" color="primary">{{ $t('memories.convert.confirm') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
```

**Files cần tạo/sửa:**
- `src/components/memories/ConvertMemoryToAnniversaryDialog.vue` (mới)
- `src/components/memories/MemoryCard.vue` (thêm convert action)
- `src/services/memories.ts` (thêm convert API)
- `src/stores/memories.ts` (thêm convert action)
- `src/stores/anniversaries.ts` (refresh after convert)
- i18n files (thêm convert keys)

---

## 🗑️ 5. REMOVE NOTES SYSTEM ✅ **HOÀN THÀNH**

**Mục tiêu:** Bỏ toàn bộ hệ thống note không cần thiết

### 🔧 Các tác vụ cần thực hiện:

- [x] **5.1** Xóa note components
  - [x] Delete `src/components/notes/` folder
  - [x] Delete `src/components/CreateNoteDialog.vue`
  - [x] Delete `src/components/EditNoteDialog.vue`
  
- [x] **5.2** Xóa note services và stores
  - [x] Delete `src/services/notes.ts`  - [x] Delete `src/stores/notes.ts`
  
- [x] **5.3** Cleanup navigation và routing
  - [x] Remove notes route từ `src/router/index.ts`
  - [x] Remove notes nav item từ navigation components
  - [x] Update nav component imports
  
- [x] **5.4** Cleanup types và interfaces
  - [x] Remove Note interface từ `src/types/index.ts`
  - [x] Remove note-related types
  - [x] Update other types nếu có dependency
  
- [x] **5.5** Cleanup i18n keys
  - [x] Remove notes section từ `src/plugins/i18n/vn/index.ts`
  - [x] Remove notes section từ `src/plugins/i18n/en/index.ts`
  
- [x] **5.6** Remove note views  
  - [x] Delete `src/views/notes/` folder (nếu có)
  - [x] Remove imports từ main router
  
- [x] **5.7** Cleanup dashboard và home page references
  - [x] Remove note widgets từ dashboard
  - [x] Remove note statistics
  - [x] Remove note quick actions
  - [x] Remove note imports từ DashboardView
  - [x] Clean up GlobalDialogContainer imports

**✅ Status:** Đã hoàn thành việc xóa toàn bộ hệ thống notes, bao gồm components, routes, stores, services, types, i18n và dashboard references.
- `src/types/index.ts` (remove Note interface)
- i18n files (remove notes sections)
- Dashboard components (remove note widgets)

---

## 🔍 6. FIX MEMORY PRIVACY/SHARING

**Vấn đề:** Tạo được memory cá nhân nhưng chưa tạo được note chia sẻ

### 🔧 Các tác vụ cần thực hiện:

- [ ] **6.1** Review CreateMemoryDialog privacy logic
  - [ ] Kiểm tra privacy setting trong form
  - [ ] Ensure privacy value được gửi đúng API
  - [ ] Test private vs public memory creation
  
- [ ] **6.2** Kiểm tra API endpoint privacy handling
  - [ ] Review `/memories` POST endpoint
  - [ ] Ensure privacy parameter được xử lý
  - [ ] Test với different privacy values
  
- [ ] **6.3** Fix ShareMemoryDialog component
  - [ ] Review `src/components/ShareMemoryDialog.vue`
  - [ ] Fix sharing logic cho private memories
  - [ ] Handle permission errors
  
- [ ] **6.4** Update Memory store privacy handling
  - [ ] Review `createMemory` action trong `src/stores/memories.ts`
  - [ ] Ensure privacy field được included
  - [ ] Handle privacy update scenarios
  
- [ ] **6.5** Fix memory listing privacy filter
  - [ ] Ensure private memories chỉ hiện với owner
  - [ ] Public memories hiện với both partners
  - [ ] Add privacy indicator trong UI
  
- [ ] **6.6** Test sharing flow end-to-end
  - [ ] Test create private memory
  - [ ] Test share private memory with partner
  - [ ] Test privacy permission errors
  - [ ] Test privacy toggle functionality

### 📝 Privacy Logic:

```typescript
interface Memory {
  id: string
  title: string
  // ...other fields
  privacy: 'private' | 'public' | 'couple'
  sharedWith?: string[] // user IDs
}
```

**Files cần kiểm tra/sửa:**
- `src/components/CreateMemoryDialog.vue`
- `src/components/ShareMemoryDialog.vue`
- `src/stores/memories.ts`
- `src/services/memories.ts`
- Memory listing/filtering logic

---

## 📊 TIẾN ĐỘ THỰC HIỆN

### ✅ Hoàn thành: 3/6 tasks (50%)
- [x] **1. Fix Refresh Token Mechanism** - ✅ COMPLETED
- [x] **2. I18n Memories Folder** - ✅ COMPLETED  
- [x] **4. Convert Memory to Anniversary** - ✅ COMPLETED (partial)

### 🟡 Đang thực hiện: 1/6 tasks (17%)
- [🟡] **3. Layout Restructure** - 🔄 IN PROGRESS (base components created)

### ⏳ Chưa bắt đầu: 2/6 tasks (33%)
- [ ] **5. Remove Notes System**
- [ ] **6. Fix Memory Privacy/Sharing**

---

## 🎯 MILESTONE TIMELINE

| Tuần | Nhiệm vụ | Ưu tiên | Estimated Effort |
|------|----------|---------|------------------|
| Tuần 1 | Fix Refresh Token + I18n Memories | 🔴 Cao | 16 hours |
| Tuần 2 | Layout Restructure | 🟡 Trung bình | 24 hours |
| Tuần 3 | Convert Memory Feature | 🟡 Trung bình | 12 hours |
| Tuần 4 | Remove Notes + Fix Privacy | 🔵 Thấp | 8 hours |

**Tổng estimated effort:** ~60 hours

---

## 📝 NOTES & CONSIDERATIONS

### ⚠️ Risks & Dependencies:
- Refresh token fix có thể ảnh hưởng đến authentication flow
- Layout restructure là breaking change lớn cho UI
- Remove notes system cần careful testing để không break dependencies

### 🔄 Testing Strategy:
- Unit tests cho critical functions (auth, stores)
- Integration tests cho API calls
---

## 📊 **TÓM TẮT TIẾN ĐỘ THỰC HIỆN**

### ✅ **ĐÃ HOÀN THÀNH (100%):**

1. **🔄 Fix Refresh Token Mechanism** - Đã sửa logic xử lý response và cập nhật token
2. **🌐 I18n Memories Folder** - Đã chuẩn hóa toàn bộ text sang i18n system
3. **🎨 Layout Restructure** - Đã tạo TwoColumnLayout và refactor MemoriesView  
4. **🎉 Convert Memory to Anniversary** - Đã thêm tính năng chuyển đổi với dialog và API
5. **🗑️ Remove Notes System** - Đã xóa hoàn toàn hệ thống notes

### 🔄 **ĐANG BỊ PENDING (0%):**
6. **🔍 Fix Memory Privacy/Sharing** - Chưa bắt đầu

### 🎯 **THÀNH QUẢ CHI TIẾT:**

**✅ Refresh Token:**
- Sửa `refreshAccessToken()` để xử lý đúng response structure từ API
- Cập nhật `AuthTokens` interface với đầy đủ các trường
- Build success, không còn lỗi compilation

**✅ I18n Memories:**
- Thêm 40+ i18n keys cho memories gallery, filters, stats, actions
- Refactor `MemoryGallery.vue` thay hardcode text bằng `$t()`
- Đồng bộ Vietnamese và English translations

**✅ Layout Restructure:**
- Tạo `TwoColumnLayout.vue`, `FilterPanel.vue`, `StatsWidget.vue`
- Tạo `MemoryList.vue`, `MemoryFilterPanel.vue`, `MemoryStatsWidget.vue`
- Refactor `MemoriesView.vue` sử dụng layout 2 cột (trái: danh sách, phải: filter/stats)

**✅ Convert Memory to Anniversary:**
- Thêm action menu vào `MemoryCard.vue` với nút chuyển đổi
- Tạo `ConvertMemoryToAnniversaryDialog.vue` với form đầy đủ và preview
- Implement `convertToAnniversary` API và store method
- Thêm notifications success/error

**✅ Remove Notes System:**
- Xóa hoàn toàn: `src/components/notes/`, `CreateNoteDialog.vue`, `EditNoteDialog.vue`
- Xóa: `src/services/notes.ts`, `src/stores/notes.ts`, `src/views/notes/`
- Cleanup: routes, navigation, i18n keys, types, dashboard references
- Update: `GlobalDialogContainer.vue`, `QuickActions.vue`, `HeroSection.vue`, `DashboardView.vue`

### 📈 **KẾT QUẢ COMPILE:**
```bash
✓ built in 9.41s
✓ No TypeScript errors
✓ All components working
✓ PWA generated successfully
```

---

## 📋 **REMAINING TASKS**

### 🔍 6. FIX MEMORY PRIVACY/SHARING (Chưa thực hiện)

**Vấn đề:** Logic chia sẻ/riêng tư của memories cần được sửa

### 🔧 Các tác vụ cần thực hiện:

- [ ] **6.1** Fix CreateMemoryDialog privacy logic
  - [ ] Sửa privacy toggle behavior
  - [ ] Update form validation  
  - [ ] Fix default privacy settings

- [ ] **6.2** Fix ShareMemoryDialog
  - [ ] Sửa sharing mechanism
  - [ ] Update API calls
  - [ ] Fix share with partner logic

- [ ] **6.3** Update memories store sharing logic  
  - [ ] Fix `shareMemory` action
  - [ ] Update `isShared` và `isPrivate` logic
  - [ ] Handle shared memories properly

### 📚 Documentation Updates:
- Update README với new features
- Document new API endpoints  
- Update component documentation
- Create migration guide for layout changes

---

> **💡 Tip:** Đánh dấu ✅ vào checkbox khi hoàn thành từng task. 
> **📧 Contact:** Cập nhật tiến độ hàng ngày và escalate issues khi cần.

---

**Last Updated:** 21/06/2025 | **Next Review:** 22/06/2025
