import { ref } from 'vue'
import { defineStore } from 'pinia'
import { HORSE_NAMES, HORSE_COLORS } from '@/constants/horse.constants'
import type { Horse } from '@/types'
import { shuffle } from '@/utils/array'

const MIN_CONDITION = 1
const MAX_CONDITION = 100

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const useHorseStore = defineStore('horse', () => {
  const horses = ref<Horse[]>([])

  function generateHorses() {
    const shuffledColors = shuffle(HORSE_COLORS)
    const mappedHorses = HORSE_NAMES.map((name, i) => ({
      _id: i + 1,
      name,
      color: shuffledColors[i]!,
      condition: randomInt(MIN_CONDITION, MAX_CONDITION),
    }))

    const shuffledHorses = shuffle(mappedHorses)
    horses.value = shuffledHorses
  }

  return { horses, generateHorses }
})
