# Validation System Documentation

## Tổng quan

Hệ thống validation mới cung cấp một cách thống nhất và linh hoạt để validate các form trong ứng dụng LoveApp. Nó bao gồm:

- **Validation utilities**: Các rule validation phổ biến
- **Form validation composable**: Hook để quản lý validation state
- **FormField component**: Component input có sẵn validation
- **ValidatedForm component**: Wrapper form có validation tự động

## Cài đặt và Import

```typescript
// Import tất cả utilities
import { validationRules, useFormValidation, validationSchemas } from '@/utils'

// Import components
import FormField from '@/components/common/FormField.vue'
import ValidatedForm from '@/components/common/ValidatedForm.vue'
```

## Validation Rules

### Các rule có sẵn:

```typescript
import { validationRules } from '@/utils/validation'

// Required field
validationRules.required()

// Length validation
validationRules.minLength(3)
validationRules.maxLength(100)

// Email format
validationRules.email()

// Password strength
validationRules.password()

// Date validation
validationRules.futureDate()
validationRules.pastDate()
validationRules.validDate()
validationRules.validTime()

// Numeric validation
validationRules.numeric()
validationRules.min(10)
validationRules.max(100)

// File validation
validationRules.fileSize(5) // 5MB
validationRules.fileType(['image/jpeg', 'image/png'])

// Phone number (Vietnamese format)
validationRules.phone()

// URL format
validationRules.url()

// Custom validation
validationRules.custom(
  (value) => value.includes('@'),
  'Must contain @ symbol'
)
```

## FormField Component

Component input với validation tích hợp sẵn:

```vue
<template>
  <FormField
    type="text"
    label="Tên hiển thị"
    :model-value="form.displayName"
    :error-message="getFieldError('displayName')"
    required
    @update:model-value="handleFieldInput"
    @blur="handleFieldBlur"
  />
</template>
```

### Props:

- `type`: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'file' | 'checkbox' | 'radio' | 'date' | 'time' | 'number'
- `label`: Label hiển thị
- `placeholder`: Placeholder text
- `errorMessage`: Thông báo lỗi
- `required`: Trường bắt buộc
- `disabled`: Vô hiệu hóa input
- `options`: Danh sách option cho select/radio
- `maxlength`: Độ dài tối đa
- `showCharacterCount`: Hiển thị số ký tự

## ValidatedForm Component

Wrapper form với validation tự động:

```vue
<template>
  <ValidatedForm
    v-model="formData"
    :schema="validationSchema"
    @submit="handleSubmit"
    @invalid-submit="handleInvalidSubmit"
  >
    <template #default="{ getFieldProps, handleFieldInput, handleFieldBlur }">
      <FormField
        type="text"
        label="Title"
        :model-value="formData.title"
        v-bind="getFieldProps('title')"
        @update:model-value="(value) => handleFieldInput('title', value)"
        @blur="() => handleFieldBlur('title', formData.title)"
      />
      
      <button type="submit">Submit</button>
    </template>
  </ValidatedForm>
</template>

<script setup>
const formData = ref({
  title: '',
  email: ''
})

const validationSchema = {
  title: {
    rules: [
      validationRules.required(),
      validationRules.minLength(3)
    ]
  },
  email: {
    rules: [
      validationRules.required(),
      validationRules.email()
    ]
  }
}

const handleSubmit = (data, isValid) => {
  console.log('Form submitted:', data)
}

const handleInvalidSubmit = (data, errors) => {
  console.log('Form has errors:', errors)
}
</script>
```

## Validation Schemas

Các schema validation có sẵn cho các form phổ biến:

```typescript
import { validationSchemas } from '@/utils'

// Login form
validationSchemas.login

// Register form
validationSchemas.register

// Profile form
validationSchemas.profile

// Memory form
validationSchemas.memory

// Reminder form
validationSchemas.reminder

// Blog form
validationSchemas.blog
```

## Composable useFormValidation

Hook để quản lý validation state:

```vue
<script setup>
import { useFormValidation } from '@/composables/useFormValidation'

const schema = {
  username: {
    rules: [
      validationRules.required(),
      validationRules.minLength(3)
    ]
  }
}

const {
  errors,
  isValid,
  hasErrors,
  getFieldError,
  getFieldProps,
  handleFieldInput,
  handleFieldBlur,
  validateAllFields,
  resetValidation
} = useFormValidation(schema)

// Validate entire form
const isFormValid = validateAllFields(formData.value)

// Get error for specific field
const usernameError = getFieldError('username')

// Get all props for field
const fieldProps = getFieldProps('username')
</script>
```

## Tích hợp với các form hiện có

### Ví dụ: Cập nhật ReminderForm

```vue
<template>
  <ValidatedForm
    v-model="form"
    :schema="reminderSchema"
    @submit="handleSubmit"
  >
    <template #default="{ getFieldProps, handleFieldInput, handleFieldBlur }">
      <FormField
        type="text"
        :label="$t('reminders.form.title')"
        :model-value="form.title"
        required
        v-bind="getFieldProps('title')"
        @update:model-value="(value) => handleFieldInput('title', value)"
        @blur="() => handleFieldBlur('title', form.title)"
      />
      
      <FormField
        type="date"
        :label="$t('reminders.form.date')"
        :model-value="form.reminderDate"
        required
        v-bind="getFieldProps('reminderDate')"
        @update:model-value="(value) => handleFieldInput('reminderDate', value)"
        @blur="() => handleFieldBlur('reminderDate', form.reminderDate)"
      />
      
      <button type="submit">
        {{ isEditing ? $t('common.buttons.save') : $t('common.buttons.create') }}
      </button>
    </template>
  </ValidatedForm>
</template>

<script setup>
const reminderSchema = {
  title: {
    rules: [
      validationRules.required(),
      validationRules.minLength(3),
      validationRules.maxLength(100)
    ]
  },
  reminderDate: {
    rules: [
      validationRules.required(),
      validationRules.validDate()
    ]
  }
}
</script>
```

## Validation cho các loại form khác

### Memory Form:
```typescript
const memorySchema = {
  title: {
    rules: [
      validationRules.required(),
      validationRules.minLength(3),
      validationRules.maxLength(100)
    ]
  },
  content: {
    rules: [
      validationRules.required(),
      validationRules.minLength(10)
    ]
  },
  memoryDate: {
    rules: [
      validationRules.required(),
      validationRules.pastDate()
    ]
  }
}
```

### Blog Form:
```typescript
const blogSchema = {
  title: {
    rules: [
      validationRules.required(),
      validationRules.minLength(5),
      validationRules.maxLength(200)
    ]
  },
  content: {
    rules: [
      validationRules.required(),
      validationRules.minLength(50)
    ]
  },
  coverImage: {
    rules: [
      validationRules.fileSize(5),
      validationRules.fileType(['image/jpeg', 'image/png', 'image/webp'])
    ]
  }
}
```

### Profile Form:
```typescript
const profileSchema = {
  displayName: {
    rules: [
      validationRules.required(),
      validationRules.minLength(2),
      validationRules.maxLength(50)
    ]
  },
  email: {
    rules: [
      validationRules.required(),
      validationRules.email()
    ]
  },
  phone: {
    rules: [
      validationRules.phone()
    ]
  },
  birthDate: {
    rules: [
      validationRules.pastDate()
    ]
  }
}
```

## Customization

### Tạo rule validation tùy chỉnh:

```typescript
const customRule = validationRules.custom(
  (value, formData) => {
    // Logic validation
    return value.length > 5 && value.includes(formData.username)
  },
  'Validation error message'
)
```

### Tạo schema validation phức tạp:

```typescript
const complexSchema = {
  password: {
    rules: [
      validationRules.required(),
      validationRules.minLength(8),
      validationRules.custom(
        (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
        'Password must contain uppercase, lowercase and number'
      )
    ]
  },
  confirmPassword: {
    rules: [
      validationRules.required(),
      validationRules.custom(
        (value, formData) => value === formData.password,
        'Passwords must match'
      )
    ]
  }
}
```

## Translation

Tất cả validation messages đều hỗ trợ i18n:

```typescript
// vi/common.ts
validation: {
  required: 'Trường này là bắt buộc',
  email: 'Email không hợp lệ',
  minLength: 'Tối thiểu {min} ký tự',
  maxLength: 'Tối đa {max} ký tự',
  // ...
}

// en/common.ts
validation: {
  required: 'This field is required',
  email: 'Invalid email address',
  minLength: 'Minimum {min} characters',
  maxLength: 'Maximum {max} characters',
  // ...
}
```

## Best Practices

1. **Sử dụng schema có sẵn** khi có thể để đảm bảo consistency
2. **Validate trên client và server** để đảm bảo security
3. **Hiển thị lỗi ngay khi user blur** để UX tốt hơn
4. **Sử dụng debounce** cho input validation để tránh validate quá nhiều
5. **Group validation rules** theo logic business
6. **Test validation logic** kỹ lưỡng với edge cases

## File Structure

```
src/
├── utils/
│   ├── validation.ts          # Core validation utilities
│   └── index.ts              # Export all validation utils
├── composables/
│   └── useFormValidation.ts  # Validation composable
├── components/
│   ├── common/
│   │   ├── FormField.vue     # Input component with validation
│   │   └── ValidatedForm.vue # Form wrapper with validation
│   └── examples/
│       └── ValidationDemo.vue # Demo validation system
└── plugins/
    └── i18n/
        ├── vi/common.ts      # Vietnamese validation messages
        └── en/common.ts      # English validation messages
```

## Migration Guide

Để migrate các form hiện có sang validation system mới:

1. **Import validation utilities**
2. **Tạo validation schema** cho form
3. **Thay thế Input components** bằng FormField
4. **Wrap form** trong ValidatedForm
5. **Cập nhật event handlers** để sử dụng validation props
6. **Test thoroughly** với các case khác nhau
