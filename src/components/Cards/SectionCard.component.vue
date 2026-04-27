<template>
  <section class="section-card">
    <h2 class="section-card__title">{{ title }}</h2>
    <div class="section-card__body hide-scrollbar">
      <slot />
    </div>
  </section>
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
  padding: 1rem 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;

  &__title {
    font-size: var(--text-base);
    font-weight: 600;
    color: var(--color-neutral-900);
    margin-bottom: 1rem;
    flex-shrink: 0;
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }
}
</style>
