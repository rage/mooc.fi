import * as React from "react"
import { Typography } from "@material-ui/core"

function AdminError() {
  return (
    <section>
      <Typography
        component="h1"
        variant="h2"
        gutterBottom={true}
        align="center"
      >
        Sorry...
      </Typography>
      <Typography variant="body1" gutterBottom={true} align="center">
        Looks like you are trying to view an Admin only page. If you think you
        should have access to this page, log in again using your admin details.
      </Typography>
    </section>
  )
}

export default AdminError
