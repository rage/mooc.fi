export interface Module {
  name: string
  image: string
  id: string
  description: string
  courses: ModuleCourse[]
}

export interface ModuleCourse {
  name: string
  description: string
  id: string
  link: string
  photo: any[]
  promote: boolean
  slug: string
  start_point: boolean
  status: string
}
