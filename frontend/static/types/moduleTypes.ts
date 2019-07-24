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
  photo: Image
  promote: boolean
  slug: string
  start_point: boolean
  hidden: boolean
  status: string
}

export interface Image {
  id: any
  name: string | null
  original: string
  original_mimetype: string
  compressed: string
  compressed_mimetype: string
  uncompressed: string
  uncompressed_mimetype: string
  encoding: string | null
  default: boolean | null
}
