import { defineStore } from 'pinia'
import { useHorseStore } from '@/stores/horse.store'

export const useRaceStore = defineStore('race', () => {
  const horseStore = useHorseStore()

  function generateRace() {
    horseStore.generateHorses()
  }

  return { generateRace }
})
