import { useEffect, useState } from "react"

export default <T>(value: T, delay: number): [T, (cancelValue?: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  let handler: number

  useEffect(() => {
    handler = setTimeout(() => setDebouncedValue(value), delay)

    return () => clearTimeout(handler)
  }, [value])

  const cancelTimeout = (cancelValue?: T) => {
    if (handler) {
      clearTimeout(handler)
    }

    setDebouncedValue(cancelValue !== undefined ? cancelValue : value)
  }

  return [debouncedValue, cancelTimeout]
}
