# 🎯 Tooltip Directive Documentation

## Overview
Custom Vue 3 directive for displaying tooltips with various placements, themes, and configurations.

## Installation
Tooltip directive đã được đăng ký globally trong `main.ts`, sẵn sàng sử dụng trong toàn bộ app.

## Basic Usage

### Simple Tooltip
```vue
<template>
  <button v-tooltip="'This is a simple tooltip'">
    Hover me
  </button>
</template>
```

### Advanced Configuration
```vue
<template>
  <button v-tooltip="{
    content: 'Advanced tooltip',
    placement: 'top',
    delay: 200,
    theme: 'dark',
    disabled: false
  }">
    Advanced Tooltip
  </button>
</template>
```

## Configuration Options

### `content` (string, required)
Text content của tooltip.

```vue
v-tooltip="'Hello World'"
v-tooltip="{ content: 'Hello World' }"
```

### `placement` (string, optional)
Vị trí hiển thị tooltip. Default: `'top'`

- `'top'` - Hiển thị phía trên element
- `'bottom'` - Hiển thị phía dưới element  
- `'left'` - Hiển thị bên trái element
- `'right'` - Hiển thị bên phải element

```vue
v-tooltip="{ content: 'Top tooltip', placement: 'top' }"
v-tooltip="{ content: 'Bottom tooltip', placement: 'bottom' }"
```

### `delay` (number, optional)
Độ trễ trước khi hiển thị tooltip (milliseconds). Default: `100`

```vue
v-tooltip="{ content: 'No delay', delay: 0 }"
v-tooltip="{ content: 'Slow tooltip', delay: 500 }"
```

### `theme` (string, optional)
Theme của tooltip. Default: `'dark'`

- `'dark'` - Background đen, text trắng
- `'light'` - Background trắng, text đen với border

```vue
v-tooltip="{ content: 'Dark theme', theme: 'dark' }"
v-tooltip="{ content: 'Light theme', theme: 'light' }"
```

### `disabled` (boolean, optional)
Tắt/bật tooltip. Default: `false`

```vue
v-tooltip="{ content: 'This tooltip is disabled', disabled: true }"
```

## Real-world Examples

### Icon Buttons (như trong ReminderCard)
```vue
<template>
  <div class="action-buttons">
    <!-- Complete Button -->
    <Button
      variant="success"
      size="sm"
      v-tooltip="$t('reminders.mark_complete')"
      @click="markComplete"
    >
      <CheckIcon class="h-4 w-4" />
    </Button>
    
    <!-- Edit Button -->
    <Button
      variant="ghost"
      size="sm"
      v-tooltip="isCompleted ? $t('reminders.cannot_edit_completed') : $t('common.actions.edit')"
      :disabled="isCompleted"
      @click="editReminder"
    >
      <PencilIcon class="h-4 w-4" />
    </Button>
    
    <!-- Delete Button -->
    <Button
      variant="ghost"
      size="sm"
      v-tooltip="$t('common.actions.delete')"
      @click="deleteReminder"
    >
      <TrashIcon class="h-4 w-4" />
    </Button>
  </div>
</template>
```

### Dynamic Content
```vue
<template>
  <button v-tooltip="dynamicTooltip" @click="toggleStatus">
    {{ status }}
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'

const status = ref('inactive')

const dynamicTooltip = computed(() => ({
  content: status.value === 'active' 
    ? 'Click to deactivate' 
    : 'Click to activate',
  placement: 'top',
  theme: status.value === 'active' ? 'dark' : 'light'
}))

const toggleStatus = () => {
  status.value = status.value === 'active' ? 'inactive' : 'active'
}
</script>
```

### With Reactive Disabled State
```vue
<template>
  <button 
    v-tooltip="{
      content: 'Cannot perform this action',
      disabled: !canPerformAction
    }"
    :disabled="!canPerformAction"
    @click="performAction"
  >
    Action Button
  </button>
</template>

<script setup>
const canPerformAction = ref(false)
</script>
```

## Styling & Customization

### CSS Classes
Tooltip sử dụng các CSS classes có thể customize:

- `.v-tooltip` - Base tooltip container
- `.v-tooltip-dark` / `.v-tooltip-light` - Theme variants
- `.v-tooltip-show` - Visible state
- `.v-tooltip-arrow-{placement}` - Arrow styling

### Custom Styling
```css
/* Custom dark theme */
.v-tooltip-dark {
  background-color: #1f2937;
  color: #f9fafb;
  font-weight: 500;
}

/* Custom light theme */
.v-tooltip-light {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

## Features

### ✨ **Auto-positioning**
- Tự động điều chỉnh vị trí để không bị overflow khỏi viewport
- Intelligent fallback positioning

### 🎨 **Themes**
- Dark theme (default): Professional, high contrast
- Light theme: Clean, accessible với border

### ⚡ **Performance**
- Lazy creation: Tooltip elements chỉ được tạo khi cần
- Automatic cleanup: Tự động xóa khi component unmount
- Debounced show/hide: Tránh flickering

### 📱 **Responsive**
- Smaller size trên mobile devices
- Touch-friendly với focus support

### ♿ **Accessibility**
- Keyboard navigation support (focus/blur events)
- ARIA role="tooltip"
- High contrast mode support
- Reduced motion support

## Browser Support
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## Demo
Xem demo tại: `/tooltip-demo` hoặc sử dụng component `TooltipDemo.vue`

## Migration từ title attribute

### Trước:
```vue
<button :title="$t('reminders.mark_complete')">
  <CheckIcon />
</button>
```

### Sau:
```vue
<button v-tooltip="$t('reminders.mark_complete')">
  <CheckIcon />
</button>
```

## Best Practices

1. **Ngắn gọn**: Tooltip content nên ngắn và súc tích
2. **Meaningful**: Chỉ thêm tooltip khi cần thiết cho UX
3. **Consistent**: Sử dụng cùng placement và theme trong cùng context
4. **Accessible**: Đảm bảo tooltip content có ý nghĩa khi đọc bằng screen reader
5. **Responsive**: Test trên mobile để đảm bảo không bị overflow

## Troubleshooting

### Tooltip không hiển thị
- Kiểm tra content có empty không
- Kiểm tra disabled prop
- Đảm bảo CSS đã được import

### Tooltip bị cut off
- Auto-positioning sẽ tự động điều chỉnh
- Có thể thay đổi placement manually

### Performance issues
- Tooltip sử dụng efficient event listeners
- Tự động cleanup khi component unmount
- Không tạo DOM nodes cho đến khi cần thiết
