<template>
  <div v-if="horses.length > 0" class="horse-list">
    <div class="horse-list__header">
      <span>No.</span>
      <span>Name</span>
      <span>Condition</span>
    </div>
    <div class="horse-list__item" v-for="horse in horses" :key="horse._id">
      <span>{{ horse._id }}</span>
      <span class="horse-list__name">
        <span class="horse-list__color" :style="{ backgroundColor: horse.color }" />
        {{ horse.name }}</span
      >
      <span class="horse-list__condition">{{ horse.condition }}%</span>
    </div>
  </div>
  <div v-else>
    <EmptyList message="No horses found." />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

//components
import EmptyList from '@/components/List/EmptyList.component.vue'

//stores
import { useHorseStore } from '@/stores/horse.store'

const horseStore = useHorseStore()

const horses = computed(() => [...horseStore.horses].sort((a, b) => a._id - b._id))
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins' as *;

.horse-list {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.5rem;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-neutral-950);
  overflow: hidden;
  margin-bottom: 1rem;

  &__header,
  &__item {
    display: grid;
    grid-template-columns: 2rem 1fr auto;
    padding: 0.75rem;
  }

  &__header {
    border-bottom: 1px solid var(--color-neutral-200);
    background-color: var(--color-neutral-950);
    font-size: var(--text-xs);
    color: var(--color-neutral-200);
  }

  &__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item {
    background-color: var(--color-neutral-50);

    &:nth-child(odd) {
      background-color: var(--color-neutral-100);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--color-neutral-200);
    }
  }

  &__color {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 0.5rem;
  }

  &__condition {
    font-weight: 800;
  }
}
</style>
