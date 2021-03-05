import { IconButton, Typography } from "@material-ui/core"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"

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
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      {label ? <Typography variant="h4">{label}</Typography> : null}
      <IconButton size="small" onClick={onClick}>
        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </div>
  )
}
