import React from "react"
import { Card, Typography } from "@material-ui/core"
import styled from "styled-components"

const Title = styled(Typography)`
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
