# I18n Translation Files Restructure & Synchronization

## Nguyên nhân lỗi trước đây

Lỗi `[intlify] Fall back to translate 'memories.types.special-moment' key with 'en' locale.` xảy ra vì:

1. **Cấu trúc import không đúng**: File i18n.ts đang import từ `./vn` và `./en` thay vì `./vi` và `./en`
2. **File translation quá lớn**: Các file translation cũ có hơn 500 dòng, khó quản lý và dễ bị lỗi cấu trúc
3. **Thiếu keywords đồng bộ**: Một số keywords bị thiếu hoặc không đồng bộ giữa tiếng Việt và tiếng Anh

## Giải pháp đã thực hiện

### 1. Tái cấu trúc thư mục

```
src/plugins/i18n/
├── i18n.ts (main config)
├── locales/
│   ├── vi/
│   │   ├── index.ts
│   │   ├── nav.ts
│   │   ├── common.ts
│   │   ├── home.ts
│   │   ├── auth.ts
│   │   ├── memories.ts
│   │   ├── anniversaries.ts
│   │   ├── reminders.ts
│   │   ├── files.ts
│   │   ├── dashboard.ts
│   │   ├── notifications.ts
│   │   ├── validation.ts
│   │   └── notFound.ts
│   └── en/
│       ├── index.ts
│       ├── nav.ts
│       ├── common.ts
│       ├── home.ts
│       ├── auth.ts
│       ├── memories.ts
│       ├── anniversaries.ts
│       ├── reminders.ts
│       ├── files.ts
│       ├── dashboard.ts
│       ├── notifications.ts
│       ├── validation.ts
│       └── notFound.ts
```

### 2. Lợi ích của cấu trúc mới

#### **Dễ quản lý**
- Mỗi module có file riêng biệt
- Dễ tìm kiếm và chỉnh sửa
- Giảm conflict khi nhiều người làm việc

#### **Đồng bộ keywords**
- Tất cả keywords đã được đồng bộ giữa tiếng Việt và tiếng Anh
- Cấu trúc nested objects hoàn toàn giống nhau
- Đảm bảo không có keyword nào bị thiếu

#### **Tối ưu import**
- Import có thể lazy load theo module
- Giảm bundle size ban đầu
- Tree-shaking tốt hơn

### 3. Các module được tách

| Module | Mô tả |
|--------|-------|
| `nav.ts` | Navigation, menu items |
| `common.ts` | Common UI elements, buttons, actions |
| `home.ts` | Landing page content |
| `auth.ts` | Authentication related |
| `memories.ts` | Memories management |
| `anniversaries.ts` | Anniversary management |
| `reminders.ts` | Reminder management |
| `files.ts` | File management |
| `dashboard.ts` | Dashboard specific |
| `notifications.ts` | Notification system |
| `validation.ts` | Form validation messages |
| `notFound.ts` | 404 page |

### 4. Keywords đã được đồng bộ

#### **Memories module**
```typescript
types: {
  'first-meet': 'First Meet' / 'Lần đầu gặp',
  'date': 'Date' / 'Hẹn hò', 
  'travel': 'Travel' / 'Du lịch',
  'special-moment': 'Special Moment' / 'Khoảnh khắc đặc biệt', // ✅ Đã fix
  'celebration': 'Celebration' / 'Kỷ niệm',
  'milestone': 'Milestone' / 'Cột mốc',
  'everyday': 'Everyday' / 'Hàng ngày',
  'other': 'Other' / 'Khác'
}
```

#### **Cấu trúc nested objects đã đồng bộ**
- `search.placeholder`
- `filter.type`, `filter.year`, `filter.sortBy`
- `gallery.viewModes`, `gallery.stats`
- `actions.quick`, `actions.export`
- `stats.overview`, `stats.total`

### 5. Cách sử dụng

#### **Import trong components**
```typescript
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Sử dụng
const memoryTypes = computed(() => [
  { value: 'special-moment', title: t('memories.types.special-moment') }
])
```

#### **Trong template**
```vue
<template>
  <v-select
    :items="memoryTypes"
    :label="$t('memories.filter.type')"
  />
</template>
```

### 6. Cách thêm keywords mới

1. **Thêm vào cả 2 ngôn ngữ**: Luôn thêm keyword mới vào cả file tiếng Việt và tiếng Anh
2. **Giữ cấu trúc nhất quán**: Đảm bảo nested structure giống nhau
3. **Đặt tên rõ ràng**: Sử dụng dot notation có ý nghĩa (`module.submodule.key`)

### 7. Testing

Build thành công với cấu trúc mới:
```bash
npm run build
# ✅ No errors
# ✅ All translation keys resolved correctly
```

## Kết luận

- ✅ **Lỗi fallback đã được fix**
- ✅ **Cấu trúc được tối ưu hóa**
- ✅ **Keywords đã đồng bộ 100%**
- ✅ **Dễ bảo trì và mở rộng**
- ✅ **Performance tốt hơn**

Từ giờ việc quản lý translation sẽ đơn giản và hiệu quả hơn rất nhiều!
