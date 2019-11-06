import React from "react"
import ButtonBase from "@material-ui/core/ButtonBase"
import styled from "styled-components"

const StyledButtonBase = styled(ButtonBase)`
  margin: 1em;
  padding: 1 em;
`

interface Props {
  OSName: string
}
const OSSelectorButton = (props: Props) => {
  const { OSName } = props
  return <StyledButtonBase>{OSName}</StyledButtonBase>
}

export default OSSelectorButton
