import { Typography } from "@material-ui/core"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"

const FourOhFour = () => {
  useBreadcrumbs([
    {
      label: "404",
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
        404
      </Typography>
      <Typography variant="body1" gutterBottom={true} align="center">
        Hups. Tätä sivua ei ole olemassa.
      </Typography>
      <Typography variant="body1" gutterBottom={true} align="center">
        Uh oh. You've reached a non-existent page.
      </Typography>
      <Typography variant="body1" gutterBottom={true} align="center">
        Hoppsan. Sidan finns inte.
      </Typography>
    </section>
  )
}

export default FourOhFour
