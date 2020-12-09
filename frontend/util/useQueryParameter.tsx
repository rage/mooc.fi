import { useRouter } from "next/router"

export function useQueryParameter(parameter: string, check: boolean = true) {
  const router = useRouter()

  if (!router) {
    return ""
  }

  // combine params in the url with the dynamic params
  const params: Record<string, any> = (
    (router?.asPath?.split("?")[1] || "").split("&") || []
  ).reduce(
    (acc, curr) => {
      const [key, val] = curr.split("=")

      return {
        ...acc,
        [key]: val,
      }
    },
    { ...router?.query },
  )

  const checkingParameter = params?.[parameter]

  if (checkingParameter === null || checkingParameter === undefined) {
    if (check) {
      throw new Error(
        "You have tried to use useQueryParameter hook with a query parameter which is not in the path of this page.",
      )
    }
    return ""
  }
  if (typeof checkingParameter === "string") {
    return decodeURI(checkingParameter)
  }
  return decodeURI(checkingParameter[checkingParameter.length - 1])
}
