// import React from "react"
// import { useRouter } from "next/router"
import UserSearch from "/pages/[lng]/users/search"
import withAdmin from "/lib/with-admin"

const SearchText = (props: any) => {
  return <UserSearch {...props} />
}

export default withAdmin(SearchText)
