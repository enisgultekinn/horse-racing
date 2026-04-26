<template>
  <div v-if="rounds.length > 0" class="race-program">
    <div v-for="round in rounds" :key="round._id" class="race-program__round">
      <div class="race-program__round-title">{{ round.round }}. Round - {{ round.distance }}m</div>
      <div class="race-program__header">
        <span>Pos.</span>
        <span>Name</span>
        <span>No</span>
      </div>
      <div v-for="(horse, index) in round.horses" :key="horse._id" class="race-program__item">
        <span>{{ index + 1 }}</span>
        <span class="race-program__name">
          <span class="race-program__color" :style="{ backgroundColor: horse.color }" />
          {{ horse.name }}
        </span>
        <span class="race-program__no">{{ horse._id }}</span>
      </div>
    </div>
  </div>
  <div v-else>
    <EmptyList message="No race program found." />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

//stores
import { useRaceStore } from '@/stores/race.store'

//components
import EmptyList from '@/components/List/EmptyList.component.vue'

const raceStore = useRaceStore()

const { rounds } = storeToRefs(raceStore)
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins' as *;

.race-program {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-neutral-950);
  margin-bottom: 1rem;

  &__round {
    border: 1px solid var(--color-neutral-200);
    border-radius: 0.5rem;
    overflow: hidden;
  }

  &__round-title {
    padding: 0.5rem 0.75rem;
    background-color: var(--color-neutral-900);
    color: var(--color-neutral-50);
    font-size: var(--text-xs);
    font-weight: 600;
  }

  &__header,
  &__item {
    display: grid;
    grid-template-columns: 3rem 1fr auto;
    padding: 0.5rem 0.75rem;
  }

  &__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__header {
    background-color: var(--color-neutral-200);
    font-size: var(--text-xs);
    color: var(--color-neutral-700);
  }

  &__item {
    background-color: var(--color-neutral-100);

    &:nth-child(odd) {
      background-color: var(--color-neutral-50);
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
}
</style>
