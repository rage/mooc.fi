import { Paper, SvgIcon, SvgIconProps, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

const ImportantNoticeContainer = styled(Paper)`
  padding: 1em;
  margin: 1em;
  background-color: #9c27b0;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const AlertSvgIcon = styled(SvgIcon)`
  height: 50;
  width: 50;
  margin: 0.5em;
  color: white;
`

function AlertIcon(props: SvgIconProps) {
  return (
    <AlertSvgIcon {...props}>
      <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
    </AlertSvgIcon>
  )
}

type RegProps = {
  email: string
}

function ImportantNotice(props: RegProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <ImportantNoticeContainer>
      <AlertIcon />
      <Typography
        dangerouslySetInnerHTML={{
          __html: t("InstructionsEmail", { email: props.email }),
        }}
      />
    </ImportantNoticeContainer>
  )
}

export default ImportantNotice
