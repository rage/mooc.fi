import React from "react"
import { Container, Grid, CircularProgress } from "@material-ui/core"

const Spinner = () => (
  <Container style={{ display: "flex", height: "600px" }}>
    <Grid item container justify="center" alignItems="center">
      <CircularProgress color="primary" size={60} />
    </Grid>
  </Container>
)

export default Spinner
