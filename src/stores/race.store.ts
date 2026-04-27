import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useHorseStore } from '@/stores/horse.store'
import { HORSES_PER_ROUND, RACE_DISTANCES } from '@/constants/race.constants'
import type { RaceRound } from '@/types'
import { shuffle } from '@/utils/array'
import { getRaceHorses } from '@/utils/race'

export const useRaceStore = defineStore('race', () => {
  const horseStore = useHorseStore()

  const rounds = ref<RaceRound[]>([])

  const currentRoundIndex = ref(0)
  const currentRound = computed<RaceRound | undefined>(() => rounds.value[currentRoundIndex.value])

  const isRunning = computed(() => currentRound.value?.status === 'running')
  const isPaused = computed(() => currentRound.value?.status === 'paused')
  const isFinished = computed(() => currentRound.value?.status === 'finished')
  const isRaceFinished = computed(
    () => rounds.value.length > 0 && rounds.value.every((r) => r.status === 'finished'),
  )

  function generateRace() {
    if (isRunning.value) return

    horseStore.generateHorses()

    rounds.value = RACE_DISTANCES.map((distance, i) => {
      const roundHorses = shuffle(horseStore.horses).slice(0, HORSES_PER_ROUND)
      return {
        _id: crypto.randomUUID(),
        round: i + 1,
        distance,
        status: 'idle',
        results: [],
        horses: getRaceHorses(roundHorses, distance),
      }
    })

    currentRoundIndex.value = 0
  }

  function startRound() {
    const round = currentRound.value
    if (!round) return

    if (round.status === 'idle' || round.status === 'paused') {
      round.status = 'running'
    }
  }

  function nextRound() {
    const round = currentRound.value
    if (!round || round.status !== 'finished') return

    const isLastRound = currentRoundIndex.value >= rounds.value.length - 1
    if (!isLastRound) {
      currentRoundIndex.value++

      const next = currentRound.value
      if (next) {
        next.status = 'running'
      }
    }
  }

  function pauseRound() {
    const round = currentRound.value
    if (!round) return

    if (round.status !== 'running') return

    round.status = 'paused'
  }

  function markHorseFinished(horseId: number, roundId: string) {
    const round = rounds.value.find((round) => round._id === roundId)
    if (!round) return

    const horse = round.horses.find((horse) => horse._id === horseId)
    if (!horse || horse.finished) return

    horse.finished = true

    round.results.push(horseId)

    if (round.horses.every((horse) => horse.finished)) {
      round.status = 'finished'
    }
  }

  return {
    currentRound,
    rounds,
    currentRoundIndex,
    isRunning,
    isPaused,
    isFinished,
    isRaceFinished,
    generateRace,
    startRound,
    pauseRound,
    markHorseFinished,
    nextRound,
  }
})
