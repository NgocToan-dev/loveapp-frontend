# Hướng dẫn Upload Ảnh Bìa cho Blog Post

## 📸 Tính năng đã được triển khai

### Backend MinIO Upload System

1. **File Service** (`src/services/fileService.ts`):
   - `uploadBuffer()` - Upload file từ buffer lên MinIO
   - `deleteFile()` - Xóa file từ MinIO 
   - `generatePresignedUrl()` - Tạo URL có thời hạn

2. **Upload Controller** (`src/controllers/uploadController.ts`):
   - `POST /api/upload/single` - Upload 1 file
   - `POST /api/upload/multiple` - Upload nhiều file
   - `DELETE /api/upload/file` - Xóa file
   - `POST /api/upload/presigned-url` - Tạo presigned URL

3. **Upload Routes** (`src/routes/upload.ts`):
   - Tất cả routes đều yêu cầu authentication
   - Sử dụng multer middleware cho file upload
   - Validation với Zod schema

### Frontend Upload Integration

1. **Upload Service** (`src/services/upload.ts`):
   - `uploadSingle()` - Upload 1 file
   - `uploadCoverImage()` - Upload ảnh bìa blog
   - `deleteFile()` - Xóa file
   - `uploadMultiple()` - Upload nhiều file

2. **BlogPostForm Enhancement**:
   - Drag & drop upload area
   - Real-time upload progress
   - Image preview
   - Error handling với validation
   - Auto-upload khi user chọn file
   - Tự động xóa file cũ khi thay đổi

## 🚀 Cách sử dụng

### 1. Upload ảnh bìa cho blog post

```typescript
// Trong BlogPostForm.vue
const processImage = async (file: File) => {
  // Validate image file
  const validation = validateImageFile(file)
  if (!validation.isValid) {
    errors.value.coverImage = validation.error
    return
  }

  // Upload to MinIO
  isUploadingImage.value = true
  try {
    const result = await uploadService.uploadCoverImage(file)
    form.value.coverImageUrl = result.imageUrl
    coverImagePreview.value = URL.createObjectURL(file)
  } catch (error) {
    errors.value.coverImage = t('blog.form.imageUploadFailed')
  } finally {
    isUploadingImage.value = false
  }
}
```

### 2. Giao diện upload

```vue
<!-- Drag & Drop Area -->
<div
  @drop.prevent="handleDrop"
  @dragover.prevent
  @dragenter.prevent
  class="border-2 border-dashed rounded-lg p-6 text-center"
  :class="{ 
    'border-pink-400 bg-pink-50': isDragging,
    'border-blue-400 bg-blue-50': isUploadingImage,
    'opacity-50 pointer-events-none': isUploadingImage
  }"
>
  <!-- Upload Loading State -->
  <div v-if="isUploadingImage" class="flex flex-col items-center">
    <div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    <p class="mt-2 text-sm text-blue-600">
      {{ $t('blog.form.uploadingImage') }}
    </p>
  </div>
  
  <!-- Normal Upload Area -->
  <div v-else>
    <svg class="mx-auto h-12 w-12 text-gray-400">...</svg>
    <p>{{ $t('blog.form.dragCoverImage') }}</p>
    <Button @click="imageInput?.click()">
      {{ $t('blog.form.selectCoverImage') }}
    </Button>
  </div>
</div>
```

### 3. API Endpoints được sử dụng

```typescript
// Upload single file
POST /api/upload/single
Content-Type: multipart/form-data
Body: { file: File }

Response: {
  message: 'File uploaded successfully',
  fileUrl: 'http://minio:9000/loveapp-photos/images/2024/12/timestamp-random.jpg',
  fileName: 'original-name.jpg',
  fileType: 'image/jpeg',
  fileSize: 1234567
}

// Delete file  
DELETE /api/upload/file
Content-Type: application/json
Body: { fileUrl: 'http://minio:9000/...' }

Response: {
  message: 'File deleted successfully',
  fileUrl: 'http://minio:9000/...'
}
```

## 📝 Validation Rules

### File Upload Validation
- **File types**: `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- **Max size**: 5MB
- **Validation function**: `validateImageFile()` trong `src/utils/helpers.ts`

### Frontend Validation
```typescript
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check if it's an image
  if (!isImageFile(file)) {
    return { isValid: false, error: 'File must be an image' }
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size must be less than 5MB' }
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }
  }
  
  return { isValid: true }
}
```

## 🌍 Internationalization

### Vietnamese (`vi/blog.ts`)
```typescript
form: {
  coverImage: 'Ảnh bìa',
  dragCoverImage: 'Kéo và thả ảnh bìa vào đây hoặc nhấp để chọn',
  selectCoverImage: 'Chọn ảnh bìa',
  coverImagePreview: 'Xem trước ảnh bìa',
  removeCoverImage: 'Xóa ảnh bìa',
  uploadingImage: 'Đang tải ảnh lên...',
  imageUploadFailed: 'Tải ảnh lên thất bại. Vui lòng thử lại.',
}
```

### English (`en/blog.ts`)
```typescript
form: {
  coverImage: 'Cover Image',
  dragCoverImage: 'Drag and drop a cover image here or click to select',
  selectCoverImage: 'Select Cover Image',
  uploadingImage: 'Uploading image...',
  imageUploadFailed: 'Image upload failed. Please try again.',
}
```

## 🔧 Technical Implementation

### File Upload Flow
1. User selects/drops image → `handleImageSelect()` or `handleDrop()`
2. Validate file → `validateImageFile()`
3. Upload to MinIO → `uploadService.uploadCoverImage()`
4. Set form data → `form.value.coverImageUrl = result.imageUrl`
5. Show preview → `coverImagePreview.value = ...`
6. Save blog post → Backend stores `coverImageUrl` in MongoDB

### File Storage Structure
```
MinIO Bucket: loveapp-photos/
├── images/
│   ├── 2024/
│   │   ├── 12/
│   │   │   ├── timestamp1-random1.jpg
│   │   │   ├── timestamp2-random2.png
│   │   │   └── ...
│   └── ...
├── blog-covers/  # Được tạo bởi blog upload endpoint
├── avatars/      # User avatars
└── memories/     # Memory images
```

## ✅ Features Complete

1. ✅ **Drag & Drop Upload** - Kéo thả file vào area
2. ✅ **Real-time Validation** - Kiểm tra file type, size
3. ✅ **Upload Progress** - Loading states với spinner
4. ✅ **Image Preview** - Xem trước ảnh đã chọn
5. ✅ **Error Handling** - Hiển thị lỗi upload
6. ✅ **File Management** - Tự động xóa file cũ
7. ✅ **MinIO Integration** - Lưu trữ file an toàn
8. ✅ **Form Integration** - Tích hợp với blog form
9. ✅ **Internationalization** - Hỗ trợ đa ngôn ngữ
10. ✅ **TypeScript Support** - Type safety đầy đủ

## 🧪 Testing

### Test Upload Manually
1. Mở BlogPostForm
2. Kéo một file ảnh vào upload area
3. Kiểm tra loading state
4. Kiểm tra preview hiển thị
5. Submit form và kiểm tra database

### Test Error Cases
1. Upload file không phải ảnh → Hiển thị error
2. Upload file > 5MB → Hiển thị error  
3. Network error → Hiển thị error
4. Invalid file format → Hiển thị error

## 🎯 Kết luận

Hệ thống upload ảnh bìa cho blog post đã được triển khai hoàn chỉnh với:

- **Backend**: MinIO integration, file service, upload controller
- **Frontend**: Upload service, drag & drop UI, validation, preview
- **Security**: File type validation, size limits, authentication required
- **UX**: Loading states, error handling, internationalization
- **Performance**: Direct upload to MinIO, efficient file management

Người dùng có thể dễ dàng upload ảnh bìa cho blog post bằng cách kéo thả hoặc chọn file, với giao diện trực quan và feedback real-time.
