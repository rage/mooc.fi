import { useRouter } from "next/router"

export function useQueryParameter(parameter: string) {
  const router = useRouter()

  if (!router) {
    console.log("no router")
    return ""
  }

  const checkingParameter = router?.query?.[parameter]
  if (checkingParameter === null || checkingParameter === undefined) {
    throw new Error(
      "You have tried to use useQueryParameter hook with a query parameter which is not in the path of this page.",
    )
  }
  if (typeof checkingParameter === "string") {
    return checkingParameter
  }
  return checkingParameter[checkingParameter.length - 1]
}
