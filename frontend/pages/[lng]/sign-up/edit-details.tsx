import { useContext } from "react"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
//import { NextPageContext } from "next"
//import nookies from "nookies"
import LoginStateContext from "/contexts/LoginStateContext"
import { RegularContainer } from "/components/Container"
import EditDetailsForm from "/components/SignUp/EditDetailsForm"
import withSignedIn from "/lib/with-signed-in"
import { useMutation } from "@apollo/client"
import { UpdateUserMutation } from "/graphql/mutations/users"
import { UserDetailQuery } from "/lib/with-apollo-client/fetch-user-details"
import { UserOverViewQuery } from "/graphql/queries/user"
import { UpdateUser } from "/static/types/generated/UpdateUser"

function CheckRegistrationDetailsPage() {
  const { currentUser } = useContext(LoginStateContext)
  const [updateUserMutation, { data, error }] = useMutation<UpdateUser>(
    UpdateUserMutation,
    {
      refetchQueries: [
        { query: UserDetailQuery },
        { query: UserOverViewQuery },
      ],
    },
  )

  useBreadcrumbs([
    {
      translation: "signUp", // TODO: add translation
      href: "/sign-up/check-details",
    },
  ])

  return (
    <div>
      <RegularContainer>
        <EditDetailsForm
          firstName={currentUser?.first_name ?? ""}
          lastName={currentUser?.last_name ?? ""}
          email={currentUser?.email ?? ""}
          upstreamId={currentUser?.upstream_id}
          updateUser={updateUserMutation}
        />
      </RegularContainer>
    </div>
  )
}

/*CheckRegistrationDetailsPage.getInitialProps = (ctx: NextPageContext) => {
  const registrationCookie =
    nookies.get(ctx)["__moocfi_register_status"] ?? "{}"

  console.log(registrationCookie)
  return {
    registrationData: JSON.parse(registrationCookie),
  }
}*/

export default withSignedIn(CheckRegistrationDetailsPage)
