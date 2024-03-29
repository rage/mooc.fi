import { useCallback } from "react"

import Refresh from "@mui/icons-material/Refresh"
import Report from "@mui/icons-material/Report"
import CardActions from "@mui/material/CardActions"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import { ReloadButton as StyledRefreshButton } from "/components/Buttons/ReloadButton"
import {
  ErrorMessageBackground as StyledCard,
  ErrorMessageContentArea as StyledCardContent,
} from "/components/Surfaces/ErrorMessageBackground"

const StyledIcon = styled(Report)`
  height: 150px;
  width: 150px;
`

function ErrorMessage() {
  const onRefreshClick = useCallback(() => window.location.reload(), [])

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
        <StyledRefreshButton variant="text" onClick={onRefreshClick}>
          <Refresh />
        </StyledRefreshButton>
      </CardActions>
    </StyledCard>
  )
}

export default ErrorMessage
