<template>
  <div v-if="currentRound" style="padding-bottom: 1rem">
    <div class="race-info">
      <div class="race-info__group">
        <span class="race-info__label">Round</span>
        <span class="race-info__value">{{ currentRoundIndex + 1 }} / {{ rounds.length }}</span>
      </div>
      <div class="race-info__group">
        <span class="race-info__label">Distance</span>
        <span class="race-info__value">{{ currentRound.distance }}m</span>
      </div>
      <div class="race-info__group">
        <span class="race-info__label">Horses</span>
        <span class="race-info__value"
          >{{ currentRound.horses.length }} / {{ HORSES_PER_ROUND }}</span
        >
      </div>
      <div class="race-info__actions">
        <AppButton
          variant="secondary"
          size="md"
          :disabled="!currentRound || isRaceFinished"
          @click="onActionClick"
        >
          {{ actionLabel }}
        </AppButton>
      </div>
    </div>
    <div class="race-progress">
      <RaceLaneItem
        v-for="(horse, index) in currentRound.horses"
        :key="currentRound._id + '-' + horse._id"
        :horse="horse"
        :round-id="currentRound._id"
        :index="index"
        :is-running="isRunning"
        :is-paused="isPaused"
        :is-finished="isFinished"
      />
      <span class="race-progress__finish">
        <span class="race-progress__finish-text">Finish</span>
        <span class="race-progress__finish-line" />
      </span>
    </div>
  </div>
  <div v-else style="padding-bottom: 1rem">
    <EmptyList
      message="No race in progress. You can start a new race by clicking the 'Generate Race' button."
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

//components
import AppButton from '@/components/Button/AppButton.component.vue'
import RaceLaneItem from '@/components/Item/RaceLaneItem.component.vue'
import EmptyList from '@/components/List/EmptyList.component.vue'

//stores
import { useRaceStore } from '@/stores/race.store'
import { HORSES_PER_ROUND } from '@/constants/race.constants'

const raceStore = useRaceStore()

const { currentRound, rounds, currentRoundIndex } = storeToRefs(raceStore)

const isRunning = computed(() => currentRound.value?.status === 'running')
const isPaused = computed(() => currentRound.value?.status === 'paused')
const isFinished = computed(() => currentRound.value?.status === 'finished')
const isRaceFinished = computed(
  () => rounds.value.length > 0 && rounds.value.every((r) => r.status === 'finished'),
)
const actionLabel = computed(() => {
  if (isRunning.value) return 'Pause'
  if (isPaused.value) return 'Resume'
  if (isRaceFinished.value) return 'Finished'
  if (isFinished.value) return `Next Round`
  return 'Start'
})

function onActionClick() {
  if (isRaceFinished.value) return
  if (isRunning.value) {
    raceStore.pauseRound()
  } else if (isFinished.value) {
    raceStore.nextRound()
  } else {
    raceStore.startRound()
  }
}
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins' as *;

.race-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid var(--color-neutral-200);
  border-radius: 0.5rem;
  padding: 1rem;
  gap: 3rem;

  @include respond-to(md) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  &__group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;

    @include respond-to(md) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }

  &__label {
    font-size: var(--text-xs);
    color: var(--color-neutral-500);
    font-weight: 600;
  }

  &__value {
    font-size: var(--text-sm);
    font-weight: 700;
    color: var(--color-neutral-950);
  }

  &__actions {
    margin-left: auto;

    @include respond-to(md) {
      margin-left: 0;
    }
  }
}

.race-progress {
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
  position: relative;
  padding-right: 1rem;

  &__finish {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0rem;
    height: 100%;
  }

  &__finish-text {
    font-size: var(--text-xs);
    font-weight: 600;
    color: var(--color-neutral-950);
  }

  &__finish-line {
    width: 1px;
    height: 100%;
    background-color: var(--color-neutral-800);
  }
}
</style>
