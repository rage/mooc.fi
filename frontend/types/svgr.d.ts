declare module "*.svg?icon" {
  import { FunctionComponent, SVGProps } from "react"

  import { SvgIconTypeMap } from "@mui/material"
  import { SvgIconProps } from "@mui/material"
  import { OverridableComponent } from "@mui/material/OverridableComponent"
  import { css } from "@mui/material/styles"

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
