import React from "react"
import { Grid, Card, CardContent, Typography } from "@material-ui/core"
import { AllCompletions_completionsPaginated_edges_node } from "/static/types/generated/AllCompletions"
import styled from "styled-components"

const TitleCard = styled(Card)`
  border-left: 7px solid #af52bf;
`

const HeaderCard = ({
  course,
}: {
  course: AllCompletions_completionsPaginated_edges_node["course"]
}) => (
  <Grid item xs={12} sm={12} lg={8}>
    <TitleCard>
      <CardContent>
        <Typography component="p" variant="h6">
          {course.name}
        </Typography>
      </CardContent>
    </TitleCard>
  </Grid>
)

export default HeaderCard
