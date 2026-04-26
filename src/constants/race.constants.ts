export const RACE_DISTANCES: ReadonlyArray<number> = [1200, 1400, 1600, 1800, 2000, 2200]

export const HORSES_PER_ROUND = 10

export const BASE_HORSE_SPEED = 20

// For prevent linear animations
export const RACE_EASINGS: ReadonlyArray<string> = [
  'linear',
  'cubic-bezier(0.4, 0.47, 0.6, 0.53)',
  'cubic-bezier(0.47, 0.4, 0.53, 0.6)',
  'cubic-bezier(0.38, 0.5, 0.62, 0.5)',
  'cubic-bezier(0.5, 0.38, 0.5, 0.62)',
  'cubic-bezier(0.42, 0.52, 0.58, 0.48)',
  'cubic-bezier(0.52, 0.42, 0.48, 0.58)',
  'cubic-bezier(0.45, 0.5, 0.55, 0.5)',
]
