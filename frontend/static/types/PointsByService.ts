export type pointsDataByGroup = {
  group: string
  summary_max_points: number
  summary_n_points: number
  services: serviceData[]
}

export type serviceData = {
  service: string
  points: serviceDataPoints
}

export type serviceDataPoints = {
  group: string
  n_points: number
  max_points: number
  progress: number
}
