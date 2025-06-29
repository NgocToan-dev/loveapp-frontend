<template>
  <div class="rich-text-editor border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500">
    <!-- Toolbar -->
    <div class="border-b border-gray-200 bg-gray-50 px-3 py-2">
      <div class="flex items-center space-x-1">
        <!-- Text Formatting -->
        <div class="flex items-center space-x-1 pr-2 border-r border-gray-300">
          <button
            type="button"
            @click="editor?.chain().focus().toggleBold().run()"
            :class="[
              'p-2 rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('bold') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.bold')"
          >
            <BoldIcon class="w-4 h-4" />
          </button>

          <button
            type="button"
            @click="editor?.chain().focus().toggleItalic().run()"
            :class="[
              'p-2 rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('italic') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.italic')"
          >
            <ItalicIcon class="w-4 h-4" />
          </button>

          <button
            type="button"
            @click="editor?.chain().focus().toggleStrike().run()"
            :class="[
              'p-2 rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('strike') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.strikethrough')"
          >
            <StrikethroughIcon class="w-4 h-4" />
          </button>
        </div>

        <!-- Headers -->
        <div class="flex items-center space-x-1 pr-2 border-r border-gray-300">
          <button
            type="button"
            @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
            :class="[
              'px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('heading', { level: 1 }) ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.heading1')"
          >
            H1
          </button>

          <button
            type="button"
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
            :class="[
              'px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('heading', { level: 2 }) ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.heading2')"
          >
            H2
          </button>

          <button
            type="button"
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
            :class="[
              'px-2 py-1 text-sm rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('heading', { level: 3 }) ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.heading3')"
          >
            H3
          </button>
        </div>

        <!-- Lists -->
        <div class="flex items-center space-x-1 pr-2 border-r border-gray-300">
          <button
            type="button"
            @click="editor?.chain().focus().toggleBulletList().run()"
            :class="[
              'p-2 rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('bulletList') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.bulletList')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
          </button>

          <button
            type="button"
            @click="editor?.chain().focus().toggleOrderedList().run()"
            :class="[
              'p-2 rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('orderedList') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.orderedList')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h6v4H3V4zm7 0h11v2H10V4zm0 2h11v2H10V6zM3 10h6v4H3v-4zm7 0h11v2H10v-2zm0 2h11v2H10v-2zM3 16h6v4H3v-4zm7 0h11v2H10v-2zm0 2h11v2H10v-2z"/>
            </svg>
          </button>
        </div>

        <!-- Special -->
        <div class="flex items-center space-x-1 pr-2 border-r border-gray-300">
          <button
            type="button"
            @click="editor?.chain().focus().toggleBlockquote().run()"
            :class="[
              'p-2 rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('blockquote') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.blockquote')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
            </svg>
          </button>

          <button
            type="button"
            @click="addLink"
            :class="[
              'p-2 rounded hover:bg-gray-200 transition-colors',
              editor?.isActive('link') ? 'bg-gray-300 text-gray-900' : 'text-gray-600'
            ]"
            :title="$t('blog.editor.link')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/>
            </svg>
          </button>

          <button
            type="button"
            @click="addImage"
            class="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600"
            :title="$t('blog.editor.image')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>

        <!-- Actions -->
        <div class="flex items-center space-x-1">
          <button
            type="button"
            @click="editor?.chain().focus().undo().run()"
            :disabled="!editor?.can().undo()"
            class="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :title="$t('blog.editor.undo')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
          </button>

          <button
            type="button"
            @click="editor?.chain().focus().redo().run()"
            :disabled="!editor?.can().redo()"
            class="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            :title="$t('blog.editor.redo')"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Editor Content -->
    <div class="prose prose-pink max-w-none">
      <EditorContent 
        :editor="editor" 
        class="min-h-[200px] p-4 focus:outline-none"
      />
    </div>

    <!-- Link Modal -->
    <Modal 
      :is-open="showLinkModal" 
      :title="$t('blog.editor.addLink')"
      @close="showLinkModal = false"
    >
      <form @submit.prevent="setLink" class="space-y-4">
        <Input
          v-model="linkUrl"
          :label="$t('blog.editor.linkUrl')"
          :placeholder="$t('blog.editor.linkUrlPlaceholder')"
          type="url"
          required
        />
        <Input
          v-model="linkText"
          :label="$t('blog.editor.linkText')"
          :placeholder="$t('blog.editor.linkTextPlaceholder')"
        />
        <div class="flex justify-end space-x-3">
          <Button type="button" variant="outline" @click="showLinkModal = false">
            {{ $t('common.actions.cancel') }}
          </Button>
          <Button type="submit">
            {{ $t('common.actions.save') }}
          </Button>
        </div>
      </form>
    </Modal>

    <!-- Image Upload -->
    <input
      ref="imageInput"
      type="file"
      accept="image/*"
      @change="handleImageUpload"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Modal from '@/components/common/Modal.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon
} from '@heroicons/vue/24/outline'

interface Props {
  modelValue: string
  placeholder?: string
  editable?: boolean
}

interface Emits {
  'update:modelValue': [value: string]
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  editable: true
})
const emit = defineEmits<Emits>()

const { t } = useI18n()

// Editor state
const showLinkModal = ref(false)
const linkUrl = ref('')
const linkText = ref('')
const imageInput = ref<HTMLInputElement>()

// Editor setup
const editor = useEditor({
  content: props.modelValue,
  editable: props.editable,
  extensions: [
    StarterKit,
    Image.configure({
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg',
      },
    }),
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-pink-600 hover:text-pink-700 underline',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder || t('blog.editor.placeholder'),
    }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Methods
const addLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const selectedText = editor.value?.state.doc.textBetween(
    editor.value.state.selection.from,
    editor.value.state.selection.to
  )

  linkUrl.value = previousUrl || ''
  linkText.value = selectedText || ''
  showLinkModal.value = true
}

const setLink = () => {
  if (!linkUrl.value) {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    showLinkModal.value = false
    return
  }

  // If there's selected text or link text provided, use it
  if (linkText.value) {
    editor.value?.chain()
      .focus()
      .insertContent(`<a href="${linkUrl.value}">${linkText.value}</a>`)
      .run()
  } else {
    // Just set the link on current selection
    editor.value?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: linkUrl.value })
      .run()
  }

  showLinkModal.value = false
  linkUrl.value = ''
  linkText.value = ''
}

const addImage = () => {
  imageInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Create a URL for the image (in real app, you'd upload to a server)
  const url = URL.createObjectURL(file)
  
  editor.value?.chain().focus().setImage({ src: url }).run()

  // Reset the input
  if (imageInput.value) {
    imageInput.value.value = ''
  }
}

// Watch for external content changes
watch(() => props.modelValue, (newValue) => {
  // Only update if the content is different from what's in the editor
  if (editor.value && editor.value.getHTML() !== newValue) {
    editor.value.commands.setContent(newValue)
  }
})

// Watch for editable changes
watch(() => props.editable, (newValue) => {
  if (editor.value) {
    editor.value.setEditable(newValue)
  }
})

// Cleanup
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
/* Custom styles for the editor */
:deep(.ProseMirror) {
  outline: none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: #6b7280;
  pointer-events: none;
  height: 0;
}

:deep(.ProseMirror h1) {
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.25rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

:deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 2rem;
  margin-top: 1.25rem;
  margin-bottom: 0.75rem;
}

:deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

:deep(.ProseMirror blockquote) {
  border-left: 4px solid #ec4899;
  padding-left: 1rem;
  margin: 1rem 0;
  font-style: italic;
  color: #6b7280;
}

:deep(.ProseMirror ul, .ProseMirror ol) {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

:deep(.ProseMirror li) {
  margin: 0.25rem 0;
}

:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
</style>
