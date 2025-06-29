<template>
  <div class="crud-actions">
    <div class="action-group primary-actions">
      <!-- Edit Action -->
      <Button
        v-if="canEdit"
        @click="$emit('edit')"
        variant="primary"
        size="sm"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <PencilIcon class="w-4 h-4 mr-2" />
        {{ $t('common.actions.edit') }}
      </Button>

      <!-- Favorite Action -->
      <Button
        v-if="canFavorite"
        @click="$emit('favorite')"
        :variant="isFavorite ? 'primary' : 'outline'"
        size="sm"
        :loading="isLoading"
        :disabled="isLoading"
        class="favorite-button"
        :class="{ 'is-favorite': isFavorite }"
      >
        <HeartIcon class="w-4 h-4 mr-2" :class="{ 'fill-current': isFavorite }" />
        {{ isFavorite ? $t('common.actions.unfavorite') : $t('common.actions.favorite') }}
      </Button>
    </div>

    <div class="action-group secondary-actions">
      <!-- Share Action -->
      <Button
        v-if="canShare"
        @click="$emit('share')"
        variant="outline"
        size="sm"
        :loading="isLoading"
        :disabled="isLoading"
      >
        <ShareIcon class="w-4 h-4 mr-2" />
        {{ $t('common.actions.share') }}
      </Button>

      <!-- More Actions Dropdown -->
      <Dropdown>
        <template #trigger>
          <Button variant="ghost" size="sm" class="more-actions">
            <EllipsisVerticalIcon class="w-4 h-4" />
          </Button>
        </template>

        <!-- Duplicate Action -->
        <DropdownItem
          v-if="canDuplicate"
          @click="$emit('duplicate')"
          :disabled="isLoading"
        >
          <DocumentDuplicateIcon class="w-4 h-4 mr-2" />
          {{ $t('common.actions.duplicate') }}
        </DropdownItem>

        <!-- Export Action -->
        <DropdownItem
          v-if="canExport"
          @click="$emit('export')"
          :disabled="isLoading"
        >
          <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
          {{ $t('common.actions.export') }}
        </DropdownItem>

        <!-- Archive Action -->
        <DropdownItem
          v-if="canArchive"
          @click="$emit('archive')"
          :disabled="isLoading"
        >
          <ArchiveBoxIcon class="w-4 h-4 mr-2" />
          {{ isArchived ? $t('common.actions.unarchive') : $t('common.actions.archive') }}
        </DropdownItem>

        <div v-if="canDelete" class="border-t border-gray-200 my-1"></div>

        <!-- Delete Action -->
        <DropdownItem
          v-if="canDelete"
          @click="$emit('delete')"
          :disabled="isLoading"
          class="danger"
        >
          <TrashIcon class="w-4 h-4 mr-2" />
          {{ $t('common.actions.delete') }}
        </DropdownItem>
      </Dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Button from '@/components/common/Button.vue'
import Dropdown from '@/components/common/Dropdown.vue'
import DropdownItem from '@/components/common/DropdownItem.vue'
import { PencilIcon, HeartIcon, ShareIcon, DocumentDuplicateIcon, ArrowDownTrayIcon, ArchiveBoxIcon, TrashIcon, EllipsisVerticalIcon } from '@heroicons/vue/24/outline'

interface Props {
  canEdit?: boolean
  canDelete?: boolean
  canShare?: boolean
  canFavorite?: boolean
  canDuplicate?: boolean
  canExport?: boolean
  canArchive?: boolean
  isFavorite?: boolean
  isArchived?: boolean
  isLoading?: boolean
}

interface Emits {
  edit: []
  delete: []
  share: []
  favorite: []
  duplicate: []
  export: []
  archive: []
}

const props = withDefaults(defineProps<Props>(), {
  canEdit: true,
  canDelete: true,
  canShare: true,
  canFavorite: true,
  canDuplicate: true,
  canExport: true,
  canArchive: false,
  isFavorite: false,
  isArchived: false,
  isLoading: false
})

const emit = defineEmits<Emits>()
const { t } = useI18n()
</script>

<style scoped>
.crud-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-actions {
  flex: 1;
  justify-content: flex-start;
}

.secondary-actions {
  flex-shrink: 0;
}

.favorite-button.is-favorite {
  color: #e91e63;
  border-color: #e91e63;
}

.favorite-button.is-favorite:hover {
  background-color: #fce4ec;
}

.more-actions {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.danger {
  color: #f44336;
}

.danger:hover {
  background-color: #ffebee;
  color: #d32f2f;
}

@media (max-width: 640px) {
  .crud-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .action-group {
    width: 100%;
    justify-content: space-between;
  }

  .primary-actions {
    order: 1;
  }

  .secondary-actions {
    order: 2;
    justify-content: flex-end;
  }
}
</style>
