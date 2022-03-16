import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"
import { IconButton, Typography } from "@mui/material"

interface CollapseButtonProps {
  open: boolean
  onClick: () => void
  label?: string
}

export default function CollapseButton({
  open,
  onClick,
  label,
}: CollapseButtonProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      {label ? <Typography variant="h4">{label}</Typography> : null}
      <IconButton size="small" onClick={onClick}>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </div>
  )
}
