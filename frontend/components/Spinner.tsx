import { CircularProgress, Container, Grid } from "@mui/material"

const Spinner = () => (
  <Container style={{ display: "flex", height: "600px" }}>
    <Grid item container justifyContent="center" alignItems="center">
      <CircularProgress color="primary" size={60} />
    </Grid>
  </Container>
)

export default Spinner
