<template>
  <div v-if="rounds.length > 0" class="race-program">
    <div
      v-for="round in rounds"
      :key="round._id"
      :data-round-id="round._id"
      class="race-program__round"
      :class="{
        'race-program__round--finished': round.status === 'finished',
      }"
    >
      <div class="race-program__round-title">
        <span>{{ round.round }}. Round - {{ round.distance }}m</span>
        <span v-if="round.status === 'running'" class="race-program__pulse" />
      </div>
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
import { nextTick, watch } from 'vue'

//stores
import { useRaceStore } from '@/stores/race.store'

//components
import EmptyList from '@/components/List/EmptyList.component.vue'

const raceStore = useRaceStore()

const { rounds, currentRound } = storeToRefs(raceStore)

watch(
  currentRound,
  async (round) => {
    if (!round) return
    await nextTick()
    document
      .querySelector(`[data-round-id="${round._id}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  },
  { immediate: true },
)
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
    transition:
      opacity 0.3s ease,
      filter 0.3s ease;

    &--finished {
      opacity: 0.5;
      filter: grayscale(0.4);
    }
  }

  &__round-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background-color: var(--color-neutral-900);
    color: var(--color-neutral-50);
    font-size: var(--text-xs);
    font-weight: 600;
  }

  &__pulse {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background-color: var(--color-green-500);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
    animation: race-program-pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    flex-shrink: 0;
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

@keyframes race-program-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  }
  70% {
    box-shadow: 0 0 0 0.5rem rgba(34, 197, 94, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
  }
}
</style>
