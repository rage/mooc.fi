import { PropsWithChildren } from "react"

import { SvgIcon, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

const NoticeContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-left: 3px solid #46749b;
  border-radius: 0 6px 6px 0;
  background-color: #fbfcfd;
`

const NoticeIcon = styled(SvgIcon)`
  flex: none;
  width: 20px;
  height: 20px;
  margin-top: 0.15rem;
  color: #46749b;
`

const NoticeBody = styled("div")`
  flex: 1;
`

export const NoticeText = styled(Typography)`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #313947;
` as typeof Typography

const EmailNoticeText = styled(NoticeText)`
  strong {
    padding: 0.1em 0.28em;
    border-radius: 4px;
    background-color: #f5f6f7;
    /* Monospace keeps O/0 and l/1 apart: students transcribe the address by hand. */
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.92em;
    font-weight: 700;
    overflow-wrap: anywhere;
  }
` as typeof Typography

export function Notice({ children }: PropsWithChildren) {
  return (
    <NoticeContainer>
      <NoticeIcon aria-hidden="true">
        <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
      </NoticeIcon>
      <NoticeBody>{children}</NoticeBody>
    </NoticeContainer>
  )
}

type RegProps = {
  email: string
  translationKey?: "InstructionsEmail" | "sisuEmailNotice"
}

function ImportantNotice({
  email,
  translationKey = "InstructionsEmail",
}: RegProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <Notice>
      <EmailNoticeText
        dangerouslySetInnerHTML={{
          __html: t(translationKey, { email }),
        }}
      />
    </Notice>
  )
}

export default ImportantNotice
