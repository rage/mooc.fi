import React from "react"
import ButtonBase from "@material-ui/core/ButtonBase"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { userOsType } from "/util/getUserOS"
import UserOSContext from "/contexes/UserOSContext"

interface ButtonProps {
  selected: boolean
}

const StyledButtonBase = styled(ButtonBase)<ButtonProps>`
  margin: 1em;
  padding: 1 em;
  ${props => (props.selected ? `color: orange` : `color: black`)}
`
const StyledIcon = styled(FontAwesomeIcon)`
  margin: 0.5rem;
`
interface Props {
  OSName: userOsType
  Icon: any
  active: boolean
}
const OSSelectorButton = (props: Props) => {
  const { OSName, Icon, active } = props
  const { changeOS } = React.useContext(UserOSContext)
  return (
    <StyledButtonBase onClick={() => changeOS(OSName)} selected={active}>
      <StyledIcon icon={Icon} size="4x" />
    </StyledButtonBase>
  )
}

export default OSSelectorButton
