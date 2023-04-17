import { useRouter } from "next/router"

export default function useIsNew() {
  const router = useRouter()

  const isNew = router.pathname?.includes("_new")

  return isNew
}
