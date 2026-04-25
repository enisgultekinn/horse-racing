<template>
  <div class="section-card">
    <span class="section-card__title">{{ title }}</span>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
}

const { title } = defineProps<Props>()
</script>

<style scoped lang="scss">
.section-card {
  border-radius: 0.5rem;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  height: 100%;

  &__title {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--color-neutral-900);
  }
}
</style>
