# MemoryForm.vue - JSON API Integration

## Tóm tắt thay đổi để support JSON API

### 🔄 **Key Changes**

#### 1. **Form Data Structure**
```typescript
// OLD - File objects
const form = ref<CreateMemoryData>({
  images: [], // File[]
})

// NEW - Image URLs
const form = ref<CreateMemoryData>({
  images: [], // string[] - Array of URLs
})
```

#### 2. **Image Upload Flow**
```typescript
// NEW: Upload images first, then submit memory with URLs
const uploadImage = async (imageItem) => {
  const response = await memoriesService.uploadImage(imageItem.file)
  imageItem.url = response.url
  return response.url
}

const handleSubmit = async () => {
  // 1. Upload all new images first
  const imageUploadPromises = selectedImages.value
    .filter(img => !img.isExisting && img.file && !img.url)
    .map(img => uploadImage(img))
  
  const uploadedUrls = await Promise.all(imageUploadPromises)
  
  // 2. Collect all image URLs
  const allImageUrls = selectedImages.value
    .filter(img => img.url || img.isExisting)
    .map(img => img.url!)
  
  // 3. Submit memory with URLs
  const submitData = {
    title: form.value.title,
    // ... other fields
    images: allImageUrls // Array of URLs
  }
}
```

#### 3. **UI Enhancements**
- ✅ **Upload Progress**: Hiển thị loading spinner khi upload images
- ✅ **Success Indicators**: Green checkmark khi upload thành công
- ✅ **Error Indicators**: Red X khi upload thất bại
- ✅ **Existing Images**: Load và hiển thị existing images khi edit

#### 4. **Error Handling**
```typescript
// Enhanced image item structure
const selectedImages = ref<Array<{ 
  file: File | null; 
  preview: string; 
  isExisting?: boolean; 
  url?: string;
  isUploading?: boolean;     // NEW
  uploadError?: string;      // NEW
}>>([])
```

#### 5. **Store Integration**
```typescript
// Updated stores/memories.ts
export interface CreateMemoryData {
  images?: string[] // Changed from File[] to string[]
}

export interface UpdateMemoryData extends Partial<CreateMemoryData> {
  images?: string[] // Changed from File[] to string[]
}
```

### 🎯 **Flow Diagram**

```
1. User selects images
   ↓
2. Images shown in preview with loading state
   ↓
3. User clicks submit
   ↓
4. Upload each new image individually
   ↓ 
5. Collect all image URLs (existing + new)
   ↓
6. Submit memory with JSON payload containing URLs
   ↓
7. Update UI with success/error
```

### 🔧 **Template Changes**

#### Upload Indicators:
```vue
<!-- Loading indicator -->
<div v-if="image.isUploading" class="absolute inset-0 flex items-center justify-center">
  <div class="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full"></div>
</div>

<!-- Success indicator -->
<div v-else-if="image.url && !image.isExisting" class="absolute top-1 left-1 bg-green-500">
  <CheckIcon />
</div>

<!-- Error indicator -->
<div v-else-if="image.uploadError" class="absolute top-1 left-1 bg-red-500">
  <XIcon />
</div>
```

### 📋 **Benefits**

1. **Clear Separation**: Image upload vs memory creation
2. **Better UX**: Users see upload progress per image
3. **Error Handling**: Individual image upload errors
4. **Reusability**: Upload function can be reused elsewhere
5. **Consistency**: All APIs use JSON instead of FormData

### ⚠️ **Error Scenarios Handled**

1. **Upload Failure**: Individual images can fail without blocking the whole form
2. **Network Issues**: Upload retries can be added easily
3. **File Size**: Backend validation on upload endpoint
4. **File Type**: Frontend validation before upload

### 🧪 **Testing Checklist**

- [ ] Upload new images in create mode
- [ ] Upload additional images in edit mode  
- [ ] Remove images before submit
- [ ] Mix of existing + new images in edit mode
- [ ] Handle upload failures gracefully
- [ ] Submit form with no images
- [ ] Submit form with only existing images (edit mode)

### 🔮 **Future Enhancements**

1. **Progress Bars**: Show upload progress percentage
2. **Retry Logic**: Retry failed uploads
3. **Drag Reorder**: Allow reordering images
4. **Batch Upload**: Upload multiple images in single request
5. **Image Optimization**: Resize/compress before upload
