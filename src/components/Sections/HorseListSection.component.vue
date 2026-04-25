<template>
  <div class="horse-list">
    <div class="horse-list__header">
      <span>No.</span>
      <span>Name</span>
      <span>Condition</span>
    </div>
    <div class="horse-list__item" v-for="horse in horses" :key="horse._id">
      <span>{{ horse._id }}</span>
      <span>
        <span class="horse-list__color" :style="{ backgroundColor: horse.color }" />
        {{ horse.name }}</span
      >
      <span>{{ horse.condition }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHorseStore } from '@/stores/horse.store'
import { computed } from 'vue'

const horseStore = useHorseStore()

const horses = computed(() => horseStore.horses)
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/_mixins.scss' as *;

.horse-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.5rem;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-950);
  overflow: hidden;

  @include respond-to(md) {
    font-size: var(--text-xs);
  }

  &__header,
  &__item {
    display: grid;
    grid-template-columns: 3rem 1fr auto;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  &__header {
    border-bottom: 1px solid var(--color-neutral-200);
    background-color: var(--color-neutral-100);
    font-size: var(--text-xs);
    color: var(--color-neutral-500);
  }

  &__item:not(:last-child) {
    border-bottom: 1px solid var(--color-neutral-200);
  }

  &__color {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.5rem;
  }
}
</style>
