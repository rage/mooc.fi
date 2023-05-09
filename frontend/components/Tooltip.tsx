import React from "react"

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined"
import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"
import MUITooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip"

const Tooltip = styled(({ className, ...props }: TooltipProps) => (
  <MUITooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    cursor: "pointer",
  },
})) as typeof MUITooltip

const InfoIcon = styled(InfoOutlinedIcon)`
  cursor: help;
  color: #a0a0ff;
  transition: color 0.2s;
  :hover {
    color: #6060ff;
  }
`

const InfoTooltip = styled(Tooltip)`
  :hover {
    cursor: help;
  }
`

const TooltipWrapper = styled("span")`
  display: flex;
`

interface InfoTooltipWithLabelProps {
  label: string
}

export const InfoTooltipWithLabel = ({
  label,
  ...props
}: InfoTooltipWithLabelProps & Omit<TooltipProps, "children">) => (
  <TooltipWrapper id={`tooltip-${label}`}>
    <InfoTooltip
      {...props}
      title={
        <>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="caption">{props.title}</Typography>
        </>
      }
    >
      <InfoIcon />
    </InfoTooltip>
  </TooltipWrapper>
)

export default Tooltip
