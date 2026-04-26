<template>
  <div v-if="finishedRounds.length > 0" class="results">
    <div v-for="round in finishedRounds" :key="round._id" class="results__round">
      <div class="results__round-title">{{ round.round }}. Round - {{ round.distance }}m</div>
      <div class="results__header">
        <span>Pos.</span>
        <span>Name</span>
        <span>Time</span>
      </div>
      <div v-for="(horse, index) in round.finishedHorses" :key="horse._id" class="results__item">
        <span class="results__position">{{ index + 1 }}</span>
        <span class="results__name">
          <span class="results__color" :style="{ backgroundColor: horse.color }" />
          {{ horse.name }}
        </span>
        <span class="results__time">{{ formatRaceTime(horse.duration) }}</span>
      </div>
    </div>
  </div>
  <div v-else>
    <EmptyList message="No results found." />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

//stores
import { useRaceStore } from '@/stores/race.store'

//types
import type { RaceHorse } from '@/types'

//utils
import { formatRaceTime } from '@/utils/time'

//components
import EmptyList from '@/components/List/EmptyList.component.vue'

const raceStore = useRaceStore()

const { rounds } = storeToRefs(raceStore)

const finishedRounds = computed(() =>
  rounds.value
    .filter((round) => round.results.length > 0)
    .map((round) => ({
      ...round,
      finishedHorses: round.results
        .map((id) => round.horses.find((h) => h._id === id))
        .filter((h): h is RaceHorse => !!h),
    }))
    .reverse(),
)
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins' as *;

.results {
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__header,
  &__item {
    display: grid;
    grid-template-columns: 3rem 1fr auto;
    padding: 0.5rem 0.75rem;
    align-items: center;
  }

  &__header {
    background-color: var(--color-neutral-200);
    font-size: var(--text-xs);
    color: var(--color-neutral-700);
  }

  &__name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

  &__time {
    font-variant-numeric: tabular-nums;
    font-weight: 600;
    color: var(--color-neutral-700);
    font-size: var(--text-xs);
  }
}
</style>
