import { IconButton } from "@material-ui/core"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"

interface CollapseButtonProps {
  open: boolean
  onClick: () => void
}

export default function CollapseButton({ open, onClick }: CollapseButtonProps) {
  return (
    <IconButton size="small" onClick={onClick}>
      {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
    </IconButton>
  )
}
