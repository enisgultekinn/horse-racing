export interface Horse {
  _id: number
  name: string
  color: string
  condition: number
}

export interface RaceRound {
  _id: number
  round: number
  distance: number
  horses: Horse[]
}
