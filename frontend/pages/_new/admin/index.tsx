import Background from "components/NewLayout/Background"

import Container from "/components/Container"
import { Links } from "/components/NewLayout/Admin"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withAdmin from "/lib/with-admin"

const Admin = () => {
  useBreadcrumbs([
    {
      translation: "admin",
      href: "/admin",
    },
  ])

  return (
    <Container>
      <Background />
      <Links />
    </Container>
  )
}

export default withAdmin(Admin)
