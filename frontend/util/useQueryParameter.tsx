import { useRouter } from "next/router"

export function useQueryParameter(parameter: string, check: boolean = true) {
  const router = useRouter()

  if (!router) {
    return ""
  }

  const checkingParameter = router?.query?.[parameter]

  if (checkingParameter === null || checkingParameter === undefined) {
    if (check) {
      throw new Error(
        "You have tried to use useQueryParameter hook with a query parameter which is not in the path of this page.",
      )
    }
    return ""
  }

  if (typeof checkingParameter === "string") {
    return decodeURIComponent(checkingParameter)
  }
  return decodeURIComponent(checkingParameter[checkingParameter.length - 1])
}
