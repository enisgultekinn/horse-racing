<template>
  <div class="race-lane">
    <span class="race-lane__number">{{ index + 1 }}</span>
    <div class="race-lane__track">
      <div
        class="race-lane__horse"
        :class="{
          'race-lane__horse--running': isRunning || isPaused || isFinished,
          'race-lane__horse--paused': isPaused,
        }"
        :style="{
          '--horse-duration': `${horse.duration}ms`,
          '--horse-easing': horse.easing,
        }"
        @animationend="onAnimationEnd"
      >
        <IconHorse :color="horse.color" :size="40" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//icons
import IconHorse from '@/assets/icons/IconHorse.vue'

//stores
import { useRaceStore } from '@/stores/race.store'
import type { RaceHorse } from '@/types'

const props = defineProps<{
  horse: RaceHorse
  roundId: string
  index: number
  isRunning: boolean
  isPaused: boolean
  isFinished: boolean
}>()

const raceStore = useRaceStore()

function onAnimationEnd() {
  raceStore.markHorseFinished(props.horse._id, props.roundId)
}
</script>

<style scoped lang="scss">
@use '@/assets/style/shared/mixins' as *;

.race-lane {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0rem;
  border-bottom: 1px dashed var(--color-neutral-200);

  &__number {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-neutral-950);
    background-color: var(--color-neutral-200);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.125rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @include respond-to(md) {
      width: 2rem;
      height: 2rem;
    }
  }

  &__track {
    position: relative;
    flex: 1;
    height: 40px;
  }

  &__horse {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;

    &--running {
      animation: race-lane-run var(--horse-duration, 0ms) var(--horse-easing, linear) forwards;
    }

    &--paused {
      animation-play-state: paused;
    }
  }
}

@keyframes race-lane-run {
  from {
    left: 0;
  }
  to {
    left: calc(100% - 40px);
  }
}
</style>
