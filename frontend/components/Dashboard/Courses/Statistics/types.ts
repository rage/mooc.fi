export type DatedInt = {
  value: number | null
  date: string
}

export interface Filter {
  name: string
  label: string
}

export interface SeriesEntry {
  name: string
  data: Array<{ x: number; y: number | null }>
}
/*interface SeriesEntry {
  name: string
  [key: string]: any
}*/

export type Series = SeriesEntry | SeriesEntry[]
