import React from "react"
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core"
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
    <Card>
      <CardMedia
        component="img"
        image="/static/images/coming-soon.png"
        title="Dashboard coming soon"
        alt="Street sign stating coming soon"
      />
      <CardContent>New course dashboard will be here soon</CardContent>
    </Card>
  </section>
)

export default CourseDashboard
