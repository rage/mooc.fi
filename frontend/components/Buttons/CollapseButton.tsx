import React from "react"

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { IconButton, Tooltip, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

interface CollapseButtonProps {
  open: boolean
  onClick: () => void
  label?: string
  tooltip?: string
}

const CollapseButtonContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`

const CollapseButton = React.memo(
  ({ open, onClick, label, tooltip }: CollapseButtonProps) => {
    return (
      <CollapseButtonContainer>
        {label ? <Typography variant="h4">{label}</Typography> : null}
        <Tooltip title={tooltip ?? ""}>
          <IconButton size="small" onClick={onClick}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </Tooltip>
      </CollapseButtonContainer>
    )
  },
)

export default CollapseButton
