import { useEffect, useState } from "react"

const isFunction = <T>(value: T | (() => T)): value is () => T =>
  typeof value === "function"

export default function useDebounce<T>(
  value: T | (() => T),
  delay: number,
  compare = false,
): [T, (cancelValue?: T) => void] {
  const _value = isFunction(value) ? value() : value
  const [debouncedValue, setDebouncedValue] = useState(_value)

  let handler: NodeJS.Timeout

  useEffect(() => {
    handler = setTimeout(() => {
      if (
        !compare ||
        (compare && JSON.stringify(debouncedValue) !== JSON.stringify(_value))
      ) {
        setDebouncedValue(_value)
      }
    }, delay)

    return () => clearTimeout(handler)
  }, [_value])

  const cancelTimeout = (cancelValue?: T) => {
    if (handler) {
      clearTimeout(handler)
    }

    setDebouncedValue(cancelValue !== undefined ? cancelValue : _value)
  }

  return [debouncedValue, cancelTimeout]
}
