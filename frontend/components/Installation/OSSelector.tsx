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
  display: flex;
  flex-direction: row;
  @media (max-width: 770px) {
    width: 60%;
    left: 20%;
  }
  @media (max-width: 440px) {
    width: 80%;
    left: 10%;
  }
  justify-content: center;
  background-color: white;
  border: 2px solid black;
  width: 33%;
  margin: auto;
  position: absolute;
  top: -3.5rem;
  left: 33%;
`

const OSSelector = () => {
  const { OS } = React.useContext(userOsContext)
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
