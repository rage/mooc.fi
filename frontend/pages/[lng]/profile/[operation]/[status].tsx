import { Container, Typography } from "@material-ui/core"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import capitalizeFirstLetter from "/util/capitalizeFirstLetter"

interface ConnectionStatusProps {
  status: String
  operation: "connect" | "disconnect"
}

function ConnectionStatus({ operation, status }: ConnectionStatusProps) {
  const isSuccess = status?.toLowerCase().trim() === "success"
  const capitalizedOperation = capitalizeFirstLetter(operation)

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
    {
      translation: `profile${capitalizedOperation}`,
      href: `/profile/${operation}`, // TODO: disconnect doesn't exist
    },
    {
      translation: isSuccess
        ? `profile${capitalizedOperation}Success`
        : `profile${capitalizedOperation}Failure`,
      href: `/profile/${operation}/${status}`,
    },
  ])

  return (
    <>
      <Container style={{ maxWidth: "900" }}>
        <Typography component="h1" variant="h1" align="center">
          {isSuccess ? "Success!" : "Error!"}
        </Typography>
        <Typography variant="body1" align="center">
          {operation === "connect"
            ? isSuccess
              ? "Your account was connected successfully."
              : "There was an error connecting your account. Please try again later."
            : isSuccess
            ? "Your account was disconnected successfully."
            : "There was an error connecting your account. Please try again later."}
        </Typography>
      </Container>
    </>
  )
}

ConnectionStatus.getInitialProps = async (ctx: any) => {
  const { operation, status } = ctx?.query ?? {}

  if (
    !status ||
    !operation ||
    !["success", "failure"].includes(status?.toLowerCase().trim()) ||
    !["connect", "disconnect"].includes(operation?.toLowerCase().trim())
  ) {
    ctx?.res.writeHead(302, { location: "/404" })
    ctx?.res.end()

    return {}
  }

  return {
    status,
    operation,
  }
}

export default withSignedIn(ConnectionStatus)
