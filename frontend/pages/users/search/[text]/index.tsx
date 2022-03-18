import withAdmin from "/lib/with-admin"
import UserSearch from "/pages/users/search"

const SearchText = (props: any) => {
  return <UserSearch {...props} />
}

export default withAdmin(SearchText)
