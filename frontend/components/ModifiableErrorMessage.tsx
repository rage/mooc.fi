import {
  ErrorMessageBackground as StyledCard,
  ErrorMessageContentArea as StyledCardContent,
} from "/components/Surfaces/ErrorMessageBackground"
import Report from "@material-ui/icons/Report"
import Typography from "@material-ui/core/Typography"
import styled from "styled-components"
import { ReloadButton as StyledRefreshButton } from "/components/Buttons/ReloadButton"
import Refresh from "@material-ui/icons/Refresh"
import getCommonTranslator from "/translations/common"
import LanguageContext from "/contexes/LanguageContext"
import { useContext } from "react"

const StyledIcon = styled(Report)`
  height: 35%;
  width: 35%;
`

const ErrorMessageText = styled(Typography)`
  margin-bottom: 1rem;
  font-size: 1.2rem;
`
interface Props {
  errorMessage: string
}
function ModifiableErrorMessage(props: Props) {
  const lng = useContext(LanguageContext)
  const t = getCommonTranslator(lng.language)
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
