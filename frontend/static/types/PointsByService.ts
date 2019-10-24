export type pointsDataByGroup = {
  pointsByGroup: pointsByGroup[]
}

export type pointsByGroup = {
  service?: string
  group: string
  n_points: Number
  max_points: Number
}
