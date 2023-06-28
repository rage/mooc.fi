import { useEffect, useRef } from "react"

function getArrayDiff(a: any[], b: any[]) {
  const diff = []
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      diff.push({
        from: a[i],
        to: b[i],
      })
    }
  }
  return diff
}

function useWhyDidYouUpdate(name: string, props: any) {
  // Get a mutable ref object where we can store props ...
  // ... for comparison next time this hook runs.
  const previousProps: any = useRef()

  useEffect(() => {
    if (previousProps.current) {
      // Get all keys from previous and current props
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      // Use this object to keep track of changed props
      const changesObj: any = {}
      // Iterate through keys
      allKeys.forEach((key) => {
        // If previous is different from current
        if (previousProps.current[key] !== props[key]) {
          let arrayDiff = undefined
          // Add to changesObj
          if (
            Array.isArray(previousProps.current[key]) &&
            Array.isArray(props[key])
          ) {
            if (previousProps.current[key].length === props[key].length) {
              arrayDiff = getArrayDiff(previousProps.current[key], props[key])
            }
          }
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key],
            arrayDiff,
          }
        }
      })

      // If changesObj not empty then output to console
      if (Object.keys(changesObj).length) {
        console.log("[why-did-you-update]", name, changesObj)
      }
    }

    // Finally update previousProps with current props for next hook call
    previousProps.current = props
  })
}

export default useWhyDidYouUpdate
