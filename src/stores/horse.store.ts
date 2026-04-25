import { ref } from 'vue'
import { defineStore } from 'pinia'
import { HORSES } from '@/constants/horse.constants'
import type { Horse } from '@/types'
import { shuffle } from '@/utils/array'
import { randomInt } from '@/utils/random'

const MIN_CONDITION = 1
const MAX_CONDITION = 100

export const useHorseStore = defineStore('horse', () => {
  const horses = ref<Horse[]>([])

  function generateHorses() {
    const mappedHorses = HORSES.map((horse, i) => ({
      _id: i + 1,
      name: horse.name,
      color: horse.color,
      condition: randomInt(MIN_CONDITION, MAX_CONDITION),
    }))

    horses.value = shuffle(mappedHorses)
  }

  return { horses, generateHorses }
})
