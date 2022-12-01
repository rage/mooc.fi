// @ts-check
/** @type {import("@svgr/babel-plugin-transform-svg-component").Template} */
const iconTemplate = (
  { imports, interfaces, componentName, jsx, exports },
  { tpl },
) => {
  return tpl`
${imports}
${interfaces}
import { SvgIcon, SvgIconProps } from "@mui/material"

const ${componentName} = (props: SvgIconProps) => {
  return (
    <SvgIcon {...props}>
      {${jsx}}
    </SvgIcon>
  )
}

${exports}
`
}

module.exports = iconTemplate
