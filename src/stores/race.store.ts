import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useHorseStore } from '@/stores/horse.store'
import { HORSES_PER_ROUND, RACE_DISTANCES } from '@/constants/race.constants'
import type { RaceRound } from '@/types'
import { shuffle } from '@/utils/array'

export const useRaceStore = defineStore('race', () => {
  const horseStore = useHorseStore()

  const rounds = ref<RaceRound[]>([])

  function generateRace() {
    horseStore.generateHorses()

    rounds.value = RACE_DISTANCES.map((distance, i) => ({
      _id: i + 1,
      round: i + 1,
      distance,
      horses: shuffle(horseStore.horses).slice(0, HORSES_PER_ROUND),
    }))
  }

  return { rounds, generateRace }
})
