declare module "*.svg?icon" {
  import { SvgIconTypeMap } from "@mui/material"
  import { OverridableComponent } from "@mui/material/OverridableComponent"
  import { FunctionComponent, SVGProps } from "react"
  import { css } from "@mui/material/styles"
  import { SvgIconProps } from "@mui/material"

  const GraphicSvg: OverridableComponent<
    SvgIconTypeMap<{ css?: ReturnType<typeof css> }>
  > & {
    muiName: string
  }
  /*const GraphicSvg: FunctionComponent<
    SvgIconProps & { css?: ReturnType<typeof css> }
  >*/

  export default GraphicSvg
}
