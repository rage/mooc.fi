import { useRouter } from "next/router"

type UseQueryParameterOptions = {
  enforce?: boolean
  array?: boolean
}

export function useQueryParameter(parameter: string): string
export function useQueryParameter(
  parameter: string,
  options: UseQueryParameterOptions & { array?: false },
): string
export function useQueryParameter(
  parameter: string,
  options: UseQueryParameterOptions & { array: true },
): string[]
export function useQueryParameter(
  parameter: string,
  options?: UseQueryParameterOptions,
): string | string[] {
  const { enforce = true, array } = options ?? {}

  const router = useRouter()

  if (!router) {
    return array ? [] : ""
  }

  const paramValue = router?.query?.[parameter]

  if (paramValue === null || paramValue === undefined) {
    if (enforce) {
      throw new Error(
        "You have tried to use useQueryParameter hook with a query parameter which is not in the path of this page.",
      )
    }
    return array ? [] : ""
  }

  if (array) {
    if (Array.isArray(paramValue)) {
      return paramValue.map(decodeURIComponent)
    }
    return [decodeURIComponent(paramValue)]
  }

  if (typeof paramValue === "string") {
    return decodeURIComponent(paramValue)
  }
  return decodeURIComponent(paramValue[paramValue.length - 1])
}
