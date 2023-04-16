import React, { useCallback, useContext } from "react"

import { ButtonBase, SvgIconProps, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import { css, SerializedStyles } from "@mui/styled-engine"

import UserOSContext from "/contexts/UserOSContext"
import { UserOSType } from "/util/getUserOS"

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
  font-size: max(2rem, 4.5vw);
  width: max(2rem, 4.5vw);
  margin-top: 0.5rem;
  margin-left: 0.7rem;
  margin-right: 0.7rem;
  margin-bottom: 0.25rem;
`

const StyledTypography = styled(Typography)`
  margin-bottom: 0.3rem;
`

interface OSSelectorButtonProps {
  OSName: UserOSType
  Icon: React.FunctionComponent<SvgIconProps & { css?: SerializedStyles }>
  active: boolean
}

const OSSelectorButton = (props: OSSelectorButtonProps) => {
  const { OSName, Icon, active } = props
  const { changeOS } = useContext(UserOSContext)
  const onClick = useCallback(() => changeOS(OSName), [changeOS, OSName])

  return (
    <StyledButtonBase onClick={onClick} selected={active}>
      <Icon css={iconStyle} />
      <StyledTypography>{OSName}</StyledTypography>
    </StyledButtonBase>
  )
}

export default OSSelectorButton
