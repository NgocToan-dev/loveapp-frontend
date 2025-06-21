# Kế hoạch thực hiện i18n cho Views

## Tổng quan
Dự án LoveApp hiện có hệ thống i18n cơ bản với tiếng Việt (vi) và tiếng Anh (en). Kế hoạch này chi tiết việc cập nhật tất cả các view để sử dụng i18n thay vì hardcode text.

## Trạng thái hiện tại

### ✅ Views đã hoàn thành i18n:
1. **AnniversariesView.vue** - Vừa hoàn thành
2. **LoginView.vue** - Đã có sẵn
3. **ProfileView.vue** - Đã có sẵn  
4. **NotFoundView.vue** - Đã có sẵn
5. **DashboardView.vue** - Đã có một phần

### 🔄 Views cần cập nhật i18n:

#### Mức độ ưu tiên cao:
1. **FilesView.vue** - View quản lý file
2. **NotesView.vue** - View ghi chú
3. **MemoriesView.vue** - View kỷ niệm
4. **SettingsView.vue** - View cài đặt

#### Mức độ ưu tiên trung bình:
5. **RemindersView.vue** - View nhắc nhở
6. **CouplesView.vue** - View quản lý cặp đôi
7. **NotificationsView.vue** - View thông báo

#### Mức độ ưu tiên thấp:
8. **DialogDemoView.vue** - View demo (có thể bỏ qua)

#### Views con cần cập nhật:
- `anniversaries/CreateAnniversaryView.vue`
- `anniversaries/EditAnniversaryView.vue`
- `notes/CreateNoteView.vue`
- `notes/EditNoteView.vue`
- `notes/NoteDetailView.vue`
- `memories/CreateMemoryView.vue`
- `memories/MemoryDetailView.vue`
- `reminders/CreateReminderView.vue`
- `reminders/EditReminderView.vue`
- `auth/RegisterView.vue`

## Cấu trúc i18n hiện tại

File `src/plugins/i18n.ts` chứa:
- **nav**: Navigation labels
- **home**: Trang chủ 
- **files**: Quản lý file
- **notes**: Ghi chú
- **reminders**: Nhắc nhở
- **anniversaries**: Ngày kỷ niệm (vừa hoàn thành)
- **memories**: Kỷ niệm
- **notifications**: Thông báo
- **common**: Các từ chung
- **auth**: Xác thực
- **validation**: Validation messages
- **dashboard**: Dashboard

## Kế hoạch thực hiện từng bước

### Bước 1: Hoàn thiện i18n config ✅
- Đã cập nhật keys cho anniversaries
- Cần thêm keys cho các views còn lại

### Bước 2: Cập nhật FilesView.vue
**Cần thêm keys:**
```javascript
files: {
  title: 'Our Memory Collection' / 'Bộ sưu tập kỷ niệm',
  subtitle: 'Preserve and organize...' / 'Lưu giữ và sắp xếp...',
  uploadFiles: 'Upload Files' / 'Tải lên tệp',
  // ... thêm các keys khác
}
```

**Các text cần i18n:**
- Hero section title/subtitle
- Stats labels
- Filter/search placeholders
- Button labels
- Empty state messages
- Loading messages

### Bước 3: Cập nhật NotesView.vue
**Cần thêm keys:**
```javascript
notes: {
  heroTitle: 'My Love Journal' / 'Nhật ký tình yêu',
  heroSubtitle: 'Write down your thoughts...' / 'Ghi lại suy nghĩ...',
  writeNewNote: 'Write New Note' / 'Viết ghi chú mới',
  // ... đã có sẵn một phần
}
```

### Bước 4: Cập nhật MemoriesView.vue
**Cần thêm keys:** (đã có sẵn một phần trong config)

### Bước 5: Cập nhật các views còn lại
Theo thứ tự ưu tiên đã định.

## Pattern chuẩn cho mỗi view

### 1. Import và setup
```typescript
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
```

### 2. Template updates
```vue
<!-- Thay vì -->
<h1>Our Special Moments</h1>

<!-- Dùng -->
<h1>{{ t('anniversaries.title') }}</h1>
```

### 3. Computed options
```typescript
const sortOptions = computed(() => [
  { title: t('common.newestFirst'), value: 'date-desc' },
  { title: t('common.oldestFirst'), value: 'date-asc' }
])
```

### 4. Dynamic messages
```typescript
// Dialog messages
message: t('anniversaries.confirmDelete', { title: anniversary.title })
```

## Keys chung cần có

```javascript
common: {
  // Actions
  save: 'Save' / 'Lưu',
  cancel: 'Cancel' / 'Hủy',
  delete: 'Delete' / 'Xóa',
  edit: 'Edit' / 'Chỉnh sửa',
  create: 'Create' / 'Tạo',
  
  // States
  loading: 'Loading...' / 'Đang tải...',
  noData: 'No data' / 'Không có dữ liệu',
  error: 'Error' / 'Lỗi',
  success: 'Success' / 'Thành công',
  
  // Sorting
  sortBy: 'Sort by' / 'Sắp xếp theo',
  newestFirst: 'Newest first' / 'Mới nhất trước',
  oldestFirst: 'Oldest first' / 'Cũ nhất trước',
  
  // Search
  search: 'Search...' / 'Tìm kiếm...',
  searchResults: 'Search results' / 'Kết quả tìm kiếm',
  noResults: 'No results found' / 'Không tìm thấy kết quả'
}
```

## Testing checklist

Cho mỗi view đã cập nhật:
- [ ] Tất cả text hiển thị đúng với locale hiện tại
- [ ] Switching language hoạt động tốt
- [ ] Không có lỗi console
- [ ] Computed options cập nhật khi đổi ngôn ngữ
- [ ] Dialog messages hiển thị đúng
- [ ] Validation messages hiển thị đúng

## Lưu ý kỹ thuật

1. **Reactivity**: Sử dụng `computed()` cho các options array để tự động cập nhật khi đổi ngôn ngữ
2. **Pluralization**: Vue i18n hỗ trợ pluralization cho các trường hợp cần thiết
3. **Interpolation**: Sử dụng `t('key', { param: value })` cho dynamic content
4. **Fallback**: Đảm bảo có fallback locale (English) cho các keys missing
5. **Performance**: Avoid calling `t()` quá nhiều trong computed, cache khi cần thiết

## Tiến độ thực hiện

- [x] AnniversariesView.vue - Hoàn thành
- [ ] FilesView.vue - Kế hoạch tiếp theo
- [ ] NotesView.vue - Sau FilesView
- [ ] MemoriesView.vue
- [ ] SettingsView.vue
- [ ] RemindersView.vue
- [ ] CouplesView.vue
- [ ] NotificationsView.vue
- [ ] Các view con (Create/Edit views)

## Estimated timeline
- Mỗi main view: 2-3 hours
- Mỗi sub view: 1-2 hours
- Testing và bug fixes: 1-2 days
- **Tổng thời gian ước tính: 1-2 tuần**
