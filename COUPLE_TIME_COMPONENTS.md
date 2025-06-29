# Couple Time Display Components

Các component hiển thị thời gian bên nhau của cặp đôi với thiết kế đẹp mắt và nổi bật.

## 📦 Components

### 1. CoupleTimeDisplay.vue
**Vị trí**: `src/components/couple/CoupleTimeDisplay.vue`  
**Sử dụng**: Trang chủ Dashboard - hiển thị nổi bật ở giữa màn hình

#### Tính năng:
- ✨ Hiển thị full-width với gradient background
- 💕 Hiệu ứng trái tim bay lơ lửng
- 🔢 Số ngày bên nhau với hiệu ứng shimmer và pulse
- 📊 Phân tích thời gian (năm, tháng, ngày)
- 🎉 Đếm ngược đến kỷ niệm tiếp theo
- 💬 Trích dẫn tình yêu thay đổi theo ngày
- 📱 Responsive design hoàn chỉnh
- ✨ Animation fade-in sequence

#### Cách sử dụng:
```vue
<template>
  <CoupleTimeDisplay />
</template>

<script setup>
import CoupleTimeDisplay from '@/components/couple/CoupleTimeDisplay.vue'
</script>
```

### 2. CoupleTimeBanner.vue
**Vị trí**: `src/components/couple/CoupleTimeBanner.vue`  
**Sử dụng**: Các trang khác (Memories, Reminders) - banner compact

#### Tính năng:
- 🎨 Layout ngang tiết kiệm không gian
- 📊 Hiển thị số ngày + phân tích thời gian
- 🎉 Thông tin kỷ niệm tiếp theo
- 📱 Responsive tốt
- ⚡ Tải nhanh, thiết kế tối ưu

#### Cách sử dụng:
```vue
<template>
  <CoupleTimeBanner />
</template>

<script setup>
import CoupleTimeBanner from '@/components/couple/CoupleTimeBanner.vue'
</script>
```

### 3. CoupleTimeWidget.vue
**Vị trí**: `src/components/couple/CoupleTimeWidget.vue`  
**Sử dụng**: Header, Sidebar - widget nhỏ gọn

#### Tính năng:
- 💎 Thiết kế tối giản
- 💕 Hiệu ứng heartbeat cho icon
- 🔢 Chỉ hiển thị số ngày bên nhau
- 🎯 Perfect cho navigation
- 📐 Dạng pill rounded

#### Cách sử dụng:
```vue
<template>
  <CoupleTimeWidget />
</template>

<script setup>
import CoupleTimeWidget from '@/components/couple/CoupleTimeWidget.vue'
</script>
```

## 🎯 Đã tích hợp vào:

### ✅ Dashboard (HomePage)
- Sử dụng `CoupleTimeDisplay` làm feature chính
- Chỉ hiển thị khi đã kết nối couple
- Thay thế stats grid cũ

### ✅ Header (AppLayout)
- Sử dụng `CoupleTimeWidget` 
- Hiển thị trên desktop (lg breakpoint)
- Vị trí giữa navigation và user section

### ✅ MemoriesPage
- Sử dụng `CoupleTimeBanner`
- Hiển thị trước page header

### ✅ ReminderPage
- Sử dụng `CoupleTimeBanner`
- Hiển thị trước page header

## 🛠️ Technical Details

### Dependencies:
- `vue-i18n` - Internationalization
- `@/composables/useCouple` - Couple data
- `@/composables/useAuth` - User authentication
- `@/utils/helpers` - Utility functions

### Computed Properties:
- `isConnected` - Kiểm tra kết nối couple
- `relationshipDuration` - Thời gian bên nhau
- `nextAnniversary` - Kỷ niệm tiếp theo
- `coupleNames` - Tên cặp đôi

### Translations Required:
```typescript
// vi/couple.ts
stats: {
  days_together: 'ngày bên nhau',
  years: 'năm',
  months: 'tháng', 
  days: 'ngày'
}

// en/couple.ts
stats: {
  days_together: 'days together',
  years: 'years',
  months: 'months',
  days: 'days'
}
```

## 🎨 Design Features

### CoupleTimeDisplay:
- **Colors**: Gradient từ #667eea đến #764ba2
- **Typography**: Font weights từ 300-900
- **Animations**: Floating hearts, pulse, shimmer, bounce
- **Effects**: Backdrop blur, text gradients, box shadows

### CoupleTimeBanner:
- **Layout**: Flexbox horizontal với responsive
- **Colors**: Cùng gradient với display chính
- **Typography**: Balanced cho compact space

### CoupleTimeWidget:
- **Shape**: Rounded pill (border-radius: 25px)
- **Size**: Compact cho header/sidebar
- **Animation**: Heartbeat cho icon

## 🚀 Demo

Truy cập `/couple-time-demo` để xem demo tất cả components.

## 📱 Responsive Breakpoints

- **Desktop**: Full features
- **Tablet (768px)**: Reduced sizes, adjusted layouts
- **Mobile (480px)**: Stack layouts, minimized content

## 🔧 Customization

Các component sử dụng CSS custom properties và có thể được customize thông qua:
- CSS variables
- Component props (có thể mở rộng)
- Theme system integration
