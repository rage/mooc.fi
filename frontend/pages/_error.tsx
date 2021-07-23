import { Typography } from "@material-ui/core"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

interface ErrorProps {
  statusCode: number
}

const Error = ({ statusCode }: ErrorProps) => {
  useBreadcrumbs([
    {
      label: `${statusCode}`,
    },
  ])

  return (
    <section>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom={true}
        align="center"
      >
        {statusCode}
      </Typography>
      {statusCode === 404 ? (
        <>
          <Typography variant="body1" gutterBottom={true} align="center">
            Hups. Tätä sivua ei ole olemassa.
          </Typography>
          <Typography variant="body1" gutterBottom={true} align="center">
            Uh oh. You've reached a non-existent page.
          </Typography>
          <Typography variant="body1" gutterBottom={true} align="center">
            Hoppsan. Sidan finns inte.
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body1" gutterBottom={true} align="center">
            Tapahtui virhe.
          </Typography>
          <Typography variant="body1" gutterBottom={true} align="center">
            An error occurred.
          </Typography>
          <Typography variant="body1" gutterBottom={true} align="center">
            Det uppstod ett fel.
          </Typography>
        </>
      )}
    </section>
  )
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res?.statusCode || err?.statusCode || 404

  return { statusCode }
}

export default Error
