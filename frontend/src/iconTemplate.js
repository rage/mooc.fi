// @ts-check
/** @type {import("@svgr/babel-plugin-transform-svg-component").Template} */
const iconTemplate = (
  { imports, interfaces, componentName, jsx, exports, props },
  { tpl },
) => {
  // svgr returns an svg element from the jsx, but we wrap it
  // in material-ui SvgIcon, which also creates an svg element.
  // So, we take the props (along with children) from the
  // svg element and pass them to SvgIcon.
  // The main reason here is that the svg icons coming from,
  // say, fontawesome, have a viewBox attribute, which may be
  // different for each.
  return tpl`
${imports}
${interfaces}
import { useCallback, useMemo } from "react"
import { SvgIcon, type SvgIconProps } from "@mui/material"

function ${componentName}(svgProps: SvgIconProps) {
  const svgElement = useCallback((${props}) => ${jsx}, [svgProps])
  const mergedProps = useMemo(() => ({ ...svgProps, ...svgElement(svgProps).props }), [svgProps])

  return (
    <SvgIcon {...mergedProps} />
  )
}

${exports}
`
}

module.exports = iconTemplate
