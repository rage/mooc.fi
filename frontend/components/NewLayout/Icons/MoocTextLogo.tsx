import Image from "next/image"

import MoocLogo from "/public/images/new/logos/moocfi_text.svg"

type LogoProps = {
  height?: number
}

const MoocTextLogo = ({ height }: LogoProps) => {
  return <Image src={MoocLogo} alt="Mooc.fi logo" height={height} />
}

export default MoocTextLogo
