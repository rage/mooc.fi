import Refresh from "@mui/icons-material/Refresh"
import Report from "@mui/icons-material/Report"
import { styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"

import { ReloadButton as StyledRefreshButton } from "/components/Buttons/ReloadButton"
import {
  ErrorMessageBackground as StyledCard,
  ErrorMessageContentArea as StyledCardContent,
} from "/components/Surfaces/ErrorMessageBackground"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const StyledIcon = styled(Report)`
  height: 35%;
  width: 35%;
`

const ErrorMessageText = styled(Typography)`
  margin-bottom: 1rem;
  font-size: 1.2rem;
` as typeof Typography

interface Props {
  errorMessage: string
}
function ModifiableErrorMessage(props: Props) {
  const t = useTranslator(CommonTranslations)
  const { errorMessage } = props

  return (
    <StyledCard>
      <StyledCardContent>
        <StyledIcon />
        <Typography variant="h2" component="h2">
          {t("errorTitle")}
        </Typography>
        <ErrorMessageText variant="body1" component="p" align="center">
          {errorMessage}
        </ErrorMessageText>
        <StyledRefreshButton
          variant="text"
          onClick={() => window.location.reload()}
        >
          <Refresh />
        </StyledRefreshButton>
      </StyledCardContent>
    </StyledCard>
  )
}

export default ModifiableErrorMessage
