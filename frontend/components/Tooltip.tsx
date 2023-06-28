import React from "react"

import { PropsOf } from "@emotion/react"
import InfoIcon from "@mui/icons-material/Info"
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { BoxProps, Typography, TypographyProps } from "@mui/material"
import { css, styled } from "@mui/material/styles"
import MUITooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip"

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MUITooltip {...props} classes={{ popper: className }} />
))(
  ({ theme }) => `
  & .${tooltipClasses.tooltip} {
    background-color: #f5f5f9;
    color: rgba(0, 0, 0, 0.87);
    max-width: 300px;
    font-size: ${theme.typography.pxToRem(12)};
    border: 1px solid #dadde9;
    cursor: pointer;
  }
`,
) as typeof MUITooltip

const IconStyle = css`
  --icon-color: #a0a0ff;
  --icon-hover-color: #6060ff;

  cursor: help;
  transition: all 0.2s ease-in-out;
  color: var(--icon-color);
  :hover {
    color: var(--icon-hover-color);
    scale: 1.2;
  }
`

const InfoTooltipBase = styled(Tooltip)`
  :hover {
    cursor: help;
  }
`

const InfoOutlined = styled(InfoOutlinedIcon, {
  shouldForwardProp: (prop) => prop !== "iconClor" && prop !== "hoverColor",
})<{ iconColor?: string; hoverColor?: string }>(
  ({ iconColor, hoverColor }) => `
  ${IconStyle.styles}
  ${iconColor ? `--icon-color: ${iconColor};` : ""}
  ${hoverColor ? `--icon-hover-color: ${hoverColor};` : ""}
`,
)

const Info = styled(InfoIcon, {
  shouldForwardProp: (prop) => prop !== "iconColor" && prop !== "hoverColor",
})<{ iconColor?: string; hoverColor?: string }>(
  ({ iconColor, hoverColor }) => `
  ${IconStyle.styles}
  ${iconColor ? `--icon-color: ${iconColor};` : ""}
  ${hoverColor ? `--icon-hover-color: ${hoverColor};` : ""}
`,
)

const TooltipWrapper = styled("span")`
  display: flex;
`

interface InfoTooltipProps {
  label?: string
  labelProps?: TypographyProps & BoxProps
  titleProps?: TypographyProps & BoxProps
  outlined?: boolean
  IconProps?: PropsOf<typeof Info>
}

export const InfoTooltip = ({
  label,
  outlined = true,
  IconProps,
  labelProps,
  titleProps,
  ...props
}: InfoTooltipProps & Omit<TooltipProps, "children">) => (
  <TooltipWrapper id={`tooltip-${label}`}>
    <InfoTooltipBase
      {...props}
      title={
        <>
          {label && (
            <Typography variant="subtitle2" {...labelProps}>
              {label}
            </Typography>
          )}
          <Typography variant="caption" {...titleProps}>
            {props.title}
          </Typography>
        </>
      }
    >
      {outlined ? <InfoOutlined {...IconProps} /> : <Info {...IconProps} />}
    </InfoTooltipBase>
  </TooltipWrapper>
)

export default Tooltip
