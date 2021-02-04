import { Card, Typography } from "@material-ui/core"
import styled from "@emotion/styled"

const Title = styled(Typography)<any>`
  text-transform: uppercase;
  margin-top: 0.7em;
  margin-bottom: 0.7em;
`

const CourseDashboard = () => (
  <section>
    <Title variant="h3" component="h2" align="center" gutterBottom={true}>
      Dashboard
    </Title>
    <Card />
  </section>
)

export default CourseDashboard
