import { useContext } from "react"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
//import { NextPageContext } from "next"
//import nookies from "nookies"
import LoginStateContext from "/contexts/LoginStateContext"
import { RegularContainer } from "/components/Container"
import EditDetailsForm from "/components/SignUp/EditDetailsForm"

interface RegistrationData {
  has_tmc: boolean
}

/*interface CheckRegistrationDetailsProps {
  registrationData: RegistrationData
}*/

function CheckRegistrationDetailsPage() {
  const { currentUser } = useContext(LoginStateContext)

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

export default CheckRegistrationDetailsPage
