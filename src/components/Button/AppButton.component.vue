<template>
  <button
    :class="['button', `button--${variant}`, `button--${size}`]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const { variant = 'primary', type = 'button', disabled = false, size = 'md' } = defineProps<Props>()
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins.scss' as *;

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: opacity 0.3s ease;

  &--sm {
    padding: 0.5rem 1rem;
    font-size: var(--text-xs);
    line-height: var(--text-xs--line-height);
    border-radius: 0.375rem;
  }

  &--md {
    font-size: var(--text-sm);
    line-height: var(--text-sm--line-height);
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
  }

  &--lg {
    padding: 0.75rem 1.5rem;
    font-size: var(--text-lg);
    line-height: var(--text-lg--line-height);
    border-radius: 0.625rem;
  }

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &--primary {
    background-color: var(--color-neutral-900);
    color: var(--color-neutral-50);
    border: 1px solid var(--color-neutral-900);

    &:hover {
      background-color: var(--color-neutral-800);
      border-color: var(--color-neutral-800);
    }

    &:active {
      background-color: var(--color-neutral-950);
      border-color: var(--color-neutral-950);
    }
  }

  &--secondary {
    background-color: var(--color-white);
    color: var(--color-neutral-900);
    border: 1px solid var(--color-neutral-200);

    &:hover {
      background-color: var(--color-neutral-50);
      border-color: var(--color-neutral-300);
    }

    &:active {
      background-color: var(--color-neutral-100);
    }
  }
}
</style>
