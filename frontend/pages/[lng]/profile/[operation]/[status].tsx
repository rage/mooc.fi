import { Container, Typography } from "@material-ui/core"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import withSignedIn from "/lib/with-signed-in"
import ProfileTranslations from "/translations/profile"
import capitalizeFirstLetter from "/util/capitalizeFirstLetter"
import { useTranslator } from "/util/useTranslator"

interface ConnectionStatusProps {
  status: "success" | "failure"
  operation: "connect" | "disconnect"
}

function ConnectionStatus({ operation, status }: ConnectionStatusProps) {
  const t = useTranslator(ProfileTranslations)
  const capitalizedOperation = capitalizeFirstLetter(operation)
  const capitalizedStatus = capitalizeFirstLetter(status)

  useBreadcrumbs([
    {
      translation: "profile",
      href: "/profile",
    },
    {
      translation: `profileConnect`,
      href: `/profile/connect`,
    },
    {
      translation: `profile${capitalizedOperation}${capitalizedStatus}`,
      href: `/profile/${operation}/${status}`,
    },
  ])

  return (
    <>
      <Container style={{ maxWidth: "900" }}>
        <Typography component="h1" variant="h1" align="center">
          {t(`${operation}${capitalizedStatus}`)}
        </Typography>
        <Typography variant="body1" align="center">
          {t(`${operation}${capitalizedStatus}Message`)}
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
