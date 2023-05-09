import HistoryIcon from "@mui/icons-material/History"
import { IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"

import Tooltip from "./Tooltip"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

interface RevertButtonProps {
  onRevert: () => void
  disabled?: boolean
}

const TooltipWrapper = styled("span")`
  display: flex;
`

const RevertButton = ({ onRevert, disabled }: RevertButtonProps) => {
  const t = useTranslator(CommonTranslations)

  return (
    <TooltipWrapper id="revert">
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
    </TooltipWrapper>
  )
}

export default RevertButton
