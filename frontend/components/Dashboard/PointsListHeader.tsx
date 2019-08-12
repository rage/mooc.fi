import React from "react"
import { Typography, Grid } from "@material-ui/core"
import styled from "styled-components"

const TitleCard = styled(Grid)`
  padding: 1em;
  background-color: white;
`

const TitleCardContent = styled.div`
  padding: 1em;
  background-color: white;
`

const Title = styled(Typography)`
  text-transform: uppercase;
  font-size: 24;
`

const PointsListHeader = () => (
  <TitleCard item xs={12} sm={12} lg={12}>
    <Grid container>
      <Grid item xs={12} sm={12} lg={12}>
        <TitleCardContent>
          <Title variant="h6" component="p">
            Elements of Ai
          </Title>
          <Typography variant="subtitle1" component="p">
            Students: 50 0000
          </Typography>
        </TitleCardContent>
      </Grid>
      <Grid item xs={12} sm={12} lg={12}>
        {/* <PointsListHeaderTable /> */}
      </Grid>
    </Grid>
  </TitleCard>
)

export default PointsListHeader
