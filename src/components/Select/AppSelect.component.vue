<template>
  <div
    ref="rootRef"
    class="select"
    :class="[`select--${size}`, { 'select--open': isOpen, 'select--disabled': disabled }]"
  >
    <button type="button" class="select__trigger" :disabled="disabled" @click="toggle">
      <span class="select__value" :class="{ 'select__value--placeholder': !selectedLabel }">
        {{ selectedLabel ?? placeholder }}
      </span>
      <IconChevronDown class="select__chevron" :size="16" />
    </button>

    <ul v-show="isOpen" class="select__menu" role="listbox">
      <li
        v-for="option in options"
        :key="String(option.value)"
        role="option"
        :aria-selected="option.value === modelValue"
        class="select__option"
        :class="{ 'select__option--selected': option.value === modelValue }"
        @click="select(option.value)"
      >
        <span class="select__option-label">{{ option.label }}</span>
        <IconCheck v-if="option.value === modelValue" :size="16" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'

//types
import type { SelectOption } from '@/types'

//icons
import IconChevronDown from '@/assets/icons/IconChevronDown.vue'
import IconCheck from '@/assets/icons/IconCheck.vue'

interface Props {
  modelValue: string | number
  options: ReadonlyArray<SelectOption>
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  placeholder?: string
}

const {
  modelValue,
  options,
  size = 'md',
  disabled = false,
  placeholder = '',
} = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const rootRef = useTemplateRef<HTMLDivElement>('rootRef')
const isOpen = ref(false)

const selectedLabel = computed(() => options.find((option) => option.value === modelValue)?.label)

function open() {
  if (disabled) return
  isOpen.value = true
}

function close() {
  isOpen.value = false
}

function toggle() {
  if (isOpen.value) close()
  else open()
}

function select(value: string | number) {
  emit('update:modelValue', value)
  close()
}

function onDocumentMousedown(event: MouseEvent) {
  if (!isOpen.value) return
  const target = event.target as Node | null
  if (target && rootRef.value && !rootRef.value.contains(target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', onDocumentMousedown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocumentMousedown)
})
</script>

<style scoped lang="scss">
.select {
  position: relative;

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    width: 100%;
    background-color: var(--color-white);
    color: var(--color-neutral-900);
    border: 1px solid var(--color-neutral-200);
    cursor: pointer;
    user-select: none;
    font-weight: 500;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease;

    &:hover {
      background-color: var(--color-neutral-50);
      border-color: var(--color-neutral-300);
    }

    &:focus-visible {
      outline: none;
      border-color: var(--color-neutral-900);
    }
  }

  &--sm &__trigger {
    padding: 0.375rem 0.625rem;
    font-size: var(--text-xs);
    border-radius: 0.375rem;
    min-width: 5rem;
  }

  &--md &__trigger {
    padding: 0.5rem 0.875rem;
    font-size: var(--text-sm);
    border-radius: 0.375rem;
    min-width: 7rem;
  }

  &--lg &__trigger {
    padding: 0.75rem 1.125rem;
    font-size: var(--text-base);
    border-radius: 0.625rem;
    min-width: 9rem;
  }

  &__value {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &--placeholder {
      color: var(--color-neutral-400);
      font-weight: 500;
    }
  }

  &__chevron {
    transition: transform 0.2s ease;
  }

  &--open &__chevron {
    transform: rotate(180deg);
  }

  &__menu {
    position: absolute;
    top: calc(100% + 0.25rem);
    right: 0;
    z-index: 10;
    min-width: 100%;
    padding: 0.25rem;
    list-style: none;
    background-color: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-200);
    border-radius: 0.5rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  &__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    font-size: var(--text-xs);
    font-weight: 500;
    color: var(--color-neutral-700);
    border-radius: 0.375rem;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: var(--color-neutral-50);
    }

    &--selected {
      background-color: var(--color-neutral-100);
      color: var(--color-neutral-900);
      font-weight: 500;

      &:hover {
        background-color: var(--color-neutral-100);
      }
    }
  }

  &--md &__option,
  &--lg &__option {
    font-size: var(--text-sm);
    padding: 0.5rem 0.75rem;
  }

  &__option-label {
    flex: 1;
    text-align: left;
  }
}
</style>
