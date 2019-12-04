import React from "react"
import OSSelectorButton from "./OSSelectorButton"
import styled from "styled-components"
import {
  faWindows as Windows,
  faLinux as Linux,
  faApple as MAC,
} from "@fortawesome/free-brands-svg-icons"

import userOsContext from "/contexes/UserOSContext"
const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const OSSelector = () => {
  const { OS } = React.useContext(userOsContext)
  console.log("OS at selector", OS)
  return (
    <Container>
      <OSSelectorButton OSName="Linux" Icon={Linux} active={OS === "Linux"} />
      <OSSelectorButton
        OSName="Windows"
        Icon={Windows}
        active={OS === "Windows"}
      />
      <OSSelectorButton OSName="MAC" Icon={MAC} active={OS === "MAC"} />
    </Container>
  )
}

export default OSSelector
