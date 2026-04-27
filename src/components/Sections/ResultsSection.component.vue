<template>
  <div
    v-if="finishedRounds.length > 0"
    class="results"
    role="region"
    aria-live="polite"
    :aria-label="t('results.ariaLabel')"
  >
    <div v-for="round in finishedRounds" :key="round._id" class="results__round">
      <div class="results__round-title">
        {{ t('results.roundTitle', { round: round.round, distance: round.distance }) }}
      </div>
      <div class="results__header">
        <span>{{ t('results.pos') }}</span>
        <span>{{ t('results.name') }}</span>
        <span>{{ t('results.time') }}</span>
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
  <div v-else style="padding-bottom: 1rem">
    <EmptyList :message="t('results.empty')" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

//stores
import { useRaceStore } from '@/stores/race.store'

//utils
import { formatRaceTime } from '@/utils/time'

//types
import type { RaceHorse } from '@/types'

//components
import EmptyList from '@/components/List/EmptyList.component.vue'

const { t } = useI18n()

const raceStore = useRaceStore()

const { rounds } = storeToRefs(raceStore)

const finishedRounds = computed(() =>
  rounds.value
    .filter((round) => round.results.length > 0)
    .map((round) => ({
      ...round,
      finishedHorses: round.results.map(
        (id) => round.horses.find((horse) => horse._id === id) as RaceHorse,
      ),
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
