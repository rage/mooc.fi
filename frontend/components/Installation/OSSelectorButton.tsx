import { useContext } from "react"

import styled from "@emotion/styled"
import { type IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import ButtonBase from "@mui/material/ButtonBase"
import Typography from "@mui/material/Typography"

import UserOSContext from "/contexts/UserOSContext"
import { userOsType } from "/util/getUserOS"

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
interface OSSelectorButtonProps {
  OSName: userOsType
  Icon: IconProp
  active: boolean
}

const OSSelectorButton = (props: OSSelectorButtonProps) => {
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
