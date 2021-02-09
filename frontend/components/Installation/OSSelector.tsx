import OSSelectorButton from "./OSSelectorButton"
import styled from "@emotion/styled"
import {
  faWindows as Windows,
  faLinux as Linux,
  faApple as MAC,
} from "@fortawesome/free-brands-svg-icons"
import { faLaptopCode as AnyOS } from "@fortawesome/free-solid-svg-icons"

import userOsContext from "/contexes/UserOSContext"
import { useContext } from "react"
const Container = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 1095px) {
    width: 60%;
    left: 20%;
  }
  @media (max-width: 675px) {
    width: 80%;
    left: 10%;
  }
  @media (max-width: 500px) {
    width: 100%;
    left: 0;
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
interface Props {
  excludeZip?: boolean
}

const OSSelector = (props: Props) => {
  const { excludeZip } = props
  const { OS } = useContext(userOsContext)
  return (
    <Container>
      <OSSelectorButton OSName="Linux" Icon={Linux} active={OS === "Linux"} />
      <OSSelectorButton
        OSName="Windows"
        Icon={Windows}
        active={OS === "Windows"}
      />
      <OSSelectorButton OSName="macOS" Icon={MAC} active={OS === "macOS"} />
      {excludeZip || (
        <OSSelectorButton OSName="ZIP" Icon={AnyOS} active={OS === "ZIP"} />
      )}
    </Container>
  )
}

export default OSSelector
