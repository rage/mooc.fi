export interface FormStatus {
  message: string | null
  error?: boolean
}

export interface FormValues {
  id?: string | null
  [key: string]: any
}
