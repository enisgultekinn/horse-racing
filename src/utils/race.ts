import type { Horse, RaceHorse } from '@/types'
import { RACE_EASINGS } from '@/constants/race.constants'

const MIN_SPEED = 10
const MAX_SPEED = 18
const TIME_SCALE = 0.12 // For adjust the time of the race
const LUCK_RANGE = 0.1 // For add luck to the race

function calculateHorseDuration(horse: Horse, distance: number): number {
  const normalized = (horse.condition - 1) / 99
  const speed = MIN_SPEED + normalized * (MAX_SPEED - MIN_SPEED)
  const baseTimeMs = (distance / speed) * TIME_SCALE * 1000
  const luck = 1 + (Math.random() * 2 - 1) * LUCK_RANGE
  return baseTimeMs * luck
}

function pickEasing(): string {
  const index = Math.floor(Math.random() * RACE_EASINGS.length)
  return RACE_EASINGS[index] ?? 'linear'
}

export function getRaceHorses(horses: Horse[], distance: number): RaceHorse[] {
  return horses.map((horse) => ({
    ...horse,
    duration: calculateHorseDuration(horse, distance),
    easing: pickEasing(),
    finished: false,
  }))
}
