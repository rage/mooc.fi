import React, { useContext } from "react"

import ButtonBase from "@mui/material/ButtonBase"
import { css, styled } from "@mui/material/styles"
import Typography from "@mui/material/Typography"
import { SerializedStyles } from "@mui/styled-engine"

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
const iconStyle = css`
  height: 3rem;
  margin-top: 0.5rem;
  margin-left: 0.7rem;
  margin-right: 0.7rem;
  margin-bottom: 0.25rem;
`
const StyledTypography = styled(Typography)`
  margin-bottom: 0.3rem;
`

interface OSSelectorButtonProps {
  OSName: userOsType
  Icon: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { css?: SerializedStyles }
  >
  active: boolean
}

const OSSelectorButton = (props: OSSelectorButtonProps) => {
  const { OSName, Icon, active } = props
  const { changeOS } = useContext(UserOSContext)
  return (
    <StyledButtonBase onClick={() => changeOS(OSName)} selected={active}>
      <Icon css={iconStyle} />
      <StyledTypography>{OSName}</StyledTypography>
    </StyledButtonBase>
  )
}

export default OSSelectorButton
