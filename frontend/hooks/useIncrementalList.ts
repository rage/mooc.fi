import { startTransition, useEffect, useState } from "react"

/**
 * Returns only the first `initialCount` items at first and the full list right
 * after, rendered as an interruptible transition, so a long list paints its top
 * quickly instead of blocking on rendering every item.
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
