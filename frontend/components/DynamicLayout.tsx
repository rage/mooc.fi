import { memo } from "react"

import dynamic from "next/dynamic"

const OriginalLayout = dynamic(() => import("../pages/_layout"), {
  loading: () => null,
})
const NewLayout = dynamic(() => import("../pages/_new/_layout"), {
  loading: () => null,
})

const DynamicLayout = ({ isNew, ...props }: any) => {
  return isNew ? <NewLayout {...props} /> : <OriginalLayout {...props} />
}

export default memo(DynamicLayout)
