import { useContext } from "react"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"
import styled from "@emotion/styled"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { userOsType } from "/util/getUserOS"
import UserOSContext from "/contexts/UserOSContext"

interface ButtonProps {
  selected: boolean
}

const StyledButtonBase = styled(ButtonBase)<ButtonProps>`
  margin: 1em;
  display: flex;
  flex-direction: column;
  ${(props) => props.selected && `border-bottom: 4px solid #00D2FF;`}
  padding: 1 em;
`
const StyledIcon = styled(FontAwesomeIcon)`
  margin-top: 0.5rem;
  margin-left: 0.7rem;
  margin-right: 0.7rem;
  margin-bottom: 0.25rem;
`

const StyledTypography = styled(Typography)<any>`
  margin-bottom: 0.3rem;
`
interface Props {
  OSName: userOsType
  Icon: any
  active: boolean
}
const OSSelectorButton = (props: Props) => {
  const { OSName, Icon, active } = props
  const { changeOS } = useContext(UserOSContext)
  return (
    <StyledButtonBase onClick={() => changeOS(OSName)} selected={active}>
      <StyledIcon icon={Icon} size="4x" />
      <StyledTypography>{OSName}</StyledTypography>
    </StyledButtonBase>
  )
}

export default OSSelectorButton
