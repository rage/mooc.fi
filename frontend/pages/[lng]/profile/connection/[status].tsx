import { Container, Typography } from "@material-ui/core"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"

interface ConnectionStatusProps {
  status: String
}

function ConnectionStatus({ status }: ConnectionStatusProps) {
  const isSuccess = status?.toLowerCase().trim() === "success"

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
    {
      translation: "profileConnection",
      href: "/profile/connection",
    },
    {
      translation: isSuccess
        ? "profileConnectionSuccess"
        : "profileConnectionFailure",
      href: `/profile/connection/${status}`,
    },
  ])

  return (
    <>
      <Container style={{ maxWidth: "900" }}>
        <Typography component="h1" variant="h1" align="center">
          {isSuccess ? "Success!" : "Error!"}
        </Typography>
        <Typography variant="body1" align="center">
          {isSuccess
            ? "Your account was connected successfully."
            : "There was an error connecting your account. Please try again later."}
        </Typography>
      </Container>
    </>
  )
}

ConnectionStatus.getInitialProps = async (ctx: any) => {
  const { status } = ctx?.query ?? {}

  if (
    !status ||
    !["success", "failure"].includes(status?.toLowerCase().trim())
  ) {
    ctx?.res.writeHead(302, { location: "/404" })
    ctx?.res.end()

    return {}
  }

  return {
    status: ctx?.query?.status,
  }
}

export default withSignedIn(ConnectionStatus)
