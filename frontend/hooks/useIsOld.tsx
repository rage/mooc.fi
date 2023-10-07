import { useRouter } from "next/router"

export default function useIsOld() {
  const router = useRouter()

  const isOld = router.pathname?.includes("_old")

  return isOld
}
