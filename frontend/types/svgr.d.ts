declare module "*.svg?icon" {
  import { FunctionComponent, SVGProps } from "react"
  import { css } from "@mui/material/styles"
  import { SvgIconProps } from "@mui/material"

  declare const GraphicSvg: FunctionComponent<
    SvgIconProps & { css?: ReturnType<typeof css> }
  >

  export default GraphicSvg
}
