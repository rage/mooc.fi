import { Card, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const Title = styled(Typography)`
  text-transform: uppercase;
  margin-top: 0.7em;
  margin-bottom: 0.7em;
` as typeof Typography

const CourseDashboard = () => (
  <section>
    <Title variant="h3" component="h2" align="center" gutterBottom={true}>
      Dashboard
    </Title>
    <Card />
  </section>
)

export default CourseDashboard
