export interface Horse {
  _id: number
  name: string
  color: string
  condition: number
}

export interface RaceHorse extends Horse {
  duration: number
  easing: string
  finished: boolean
}

export interface RaceRound {
  _id: string
  round: number
  distance: number
  horses: RaceHorse[]
  status: RaceRoundStatus
  results: number[]
}

export type RaceRoundStatus = 'idle' | 'paused' | 'running' | 'finished'

export interface SelectOption {
  value: string | number
  label: string
}
