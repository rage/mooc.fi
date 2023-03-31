import HistoryIcon from "@mui/icons-material/History"
import { IconButton } from "@mui/material"

import Tooltip from "./Tooltip"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

interface RevertButtonProps {
  onRevert: () => void
  disabled?: boolean
}

const RevertButton = ({ onRevert, disabled }: RevertButtonProps) => {
  const t = useTranslator(CommonTranslations)

  return (
    <Tooltip title={t("editorRevert")}>
      <span>
        <IconButton
          aria-label={t("editorRevert")}
          disabled={disabled}
          onClick={onRevert}
          size="large"
        >
          <HistoryIcon />
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default RevertButton
