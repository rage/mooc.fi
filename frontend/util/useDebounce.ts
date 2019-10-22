import { useEffect, useState } from "react"

export default <T>(value: T, delay: number): [T, () => void] => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  let handler: number

  useEffect(() => {
    handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
  }, [value])

  const setImmediately = () => {
    if (handler) {
      clearTimeout(handler)
    }

    setDebouncedValue(value)
  }

  return [debouncedValue, setImmediately]
}
