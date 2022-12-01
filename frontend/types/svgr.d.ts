declare module "*.svg?icon" {
  import { FunctionComponent, SVGProps } from "react"
  import { SerializedStyles } from "@mui/styled-engine"
  import { SvgIconProps } from "@mui/material"

  const GraphicSvg: FunctionComponent<SvgIconProps & { css?: SerializedStyles }>

  export default GraphicSvg
}
