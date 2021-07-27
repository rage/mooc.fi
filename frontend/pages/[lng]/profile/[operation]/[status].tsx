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

// @ts-ignore: not used
const getCookies = () => {
  if (typeof document === "undefined" || !document?.cookie) {
    return {}
  }

  return document.cookie
    .split("; ")
    .reduce<{ [key: string]: string }>((acc, curr) => {
      try {
        const [key, value] = curr.split("=")

        return {
          ...acc,
          [key]: value
        }
      } catch {}

      return acc
    }, {})
}

//const shibCookies = ["_shibstate", "_opensaml", "_shibsession"]
function ConnectionStatus({ operation, status }: ConnectionStatusProps) {
  const t = useTranslator(ProfileTranslations)
  const capitalizedOperation = capitalizeFirstLetter(operation)
  const capitalizedStatus = capitalizeFirstLetter(status)

  /*useEffect(() => {
    if (operation === "connect" && status === "success") {
      const cookies = getCookies()

      console.log("got cookies")

      Object.keys(cookies).map((key) => {
        shibCookies.forEach((prefix) => {
          if (key.startsWith(prefix)) {
            console.log("reset key", key)
            document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`
          }
        })
      })
    }
  })*/

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
