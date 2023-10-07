import { memo } from "react"

import dynamic from "next/dynamic"

const OriginalLayout = dynamic(() => import("../pages/_old/_layout"), {
  loading: () => null,
})
const NewLayout = dynamic(() => import("../pages/_layout"), {
  loading: () => null,
})

const DynamicLayout = ({ isOld, ...props }: any) => {
  return isOld ? <OriginalLayout {...props} /> : <NewLayout {...props} />
}

export default memo(DynamicLayout)
