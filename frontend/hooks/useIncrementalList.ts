import { startTransition, useEffect, useState } from "react"

/**
 * Returns the first `initialCount` items, then the full list as an
 * interruptible transition, so a long list paints its top quickly.
 */
export function useIncrementalList<T>(
  items: Array<T>,
  initialCount: number,
): Array<T> {
  const [isComplete, setIsComplete] = useState(false)
  const isTruncated = !isComplete && items.length > initialCount

  useEffect(() => {
    if (!isTruncated) {
      return
    }
    const timeout = setTimeout(() => startTransition(() => setIsComplete(true)))
    return () => clearTimeout(timeout)
  }, [isTruncated])

  return isTruncated ? items.slice(0, initialCount) : items
}
