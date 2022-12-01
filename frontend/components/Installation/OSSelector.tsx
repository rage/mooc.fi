import { useContext } from "react"

import AppleIcon from "@fortawesome/fontawesome-free/svgs/brands/apple.svg?icon"
import LinuxIcon from "@fortawesome/fontawesome-free/svgs/brands/linux.svg?icon"
import WindowsIcon from "@fortawesome/fontawesome-free/svgs/brands/windows.svg?icon"
import LaptopIcon from "@fortawesome/fontawesome-free/svgs/solid/laptop-code.svg?icon"
import { styled } from "@mui/material/styles"

import OSSelectorButton from "./OSSelectorButton"
import userOsContext from "/contexts/UserOSContext"

const Container = styled("div")`
  display: flex;
  flex-direction: row;
  position: absolute;
  justify-content: center;
  background-color: white;
  border: 2px solid black;
  left: 50%;
  transform: translateX(-50%);
  top: -3.5rem;
`

interface Props {
  excludeZip?: boolean
}

const OSSelector = (props: Props) => {
  const { excludeZip } = props
  const { OS } = useContext(userOsContext)
  return (
    <Container>
      <OSSelectorButton
        OSName="Linux"
        Icon={LinuxIcon}
        active={OS === "Linux"}
      />
      <OSSelectorButton
        OSName="Windows"
        Icon={WindowsIcon}
        active={OS === "Windows"}
      />
      <OSSelectorButton
        OSName="macOS"
        Icon={AppleIcon}
        active={OS === "macOS"}
      />
      {!excludeZip ? (
        <OSSelectorButton
          OSName="ZIP"
          Icon={LaptopIcon}
          active={OS === "ZIP"}
        />
      ) : null}
    </Container>
  )
}

export default OSSelector
