import React from "react"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import styled from "styled-components"
import Report from "@material-ui/icons/Report"
import Refresh from "@material-ui/icons/Refresh"

const StyledCard = styled(Card)`
  background-color: #c25450;
  max-width: 75%;
  margin: 2rem auto 2rem auto;
  color: white;
`

const StyledCardContent = styled(CardContent)`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
`
const StyledIcon = styled(Report)`
  height: 150px;
  width: 150px;
`

const StyledRefreshButton = styled(Button)`
  background-color: white;
  color: #c25450;
  padding: 1rem;
  margin: auto;
`
function ErrorMessage() {
  return (
    <StyledCard>
      <StyledCardContent>
        <StyledIcon />

        <Typography variant="body1" component="p" align="center">
          EN: An unexpected error has occurred...
        </Typography>
        <Typography variant="body1" component="p" align="center">
          FI: Jokin on mennyt pieleen...
        </Typography>
      </StyledCardContent>
      <CardActions>
        <StyledRefreshButton
          variant="text"
          onClick={() => window.location.reload()}
        >
          <Refresh />
        </StyledRefreshButton>
      </CardActions>
    </StyledCard>
  )
}

export default ErrorMessage
