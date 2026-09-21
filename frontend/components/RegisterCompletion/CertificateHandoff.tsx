import dynamic from "next/dynamic"

import { Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"

import { InstructionsSection, Prose } from "./styles"
import { useTranslator } from "/hooks/useTranslator"
import RegisterCompletionTranslations from "/translations/register-completion"

import {
  CompletionDetailedFieldsFragment,
  CourseCoreFieldsFragment,
} from "/graphql/generated"

const CertificateButton = dynamic(() => import("../CertificateButton"), {
  ssr: false,
  loading: () => <Skeleton />,
})

const CertificateButtonRow = styled("div")`
  /* CertificateButton caps itself at 20vw for the profile page's card, which is unreadable here. */
  & .MuiButtonBase-root {
    max-width: none;
  }
`

interface CertificateHandoffProps {
  course: CourseCoreFieldsFragment
  completion: CompletionDetailedFieldsFragment
}

/** End of the road for students who only need to show that they completed the course. */
function CertificateHandoff({ course, completion }: CertificateHandoffProps) {
  const t = useTranslator(RegisterCompletionTranslations)

  return (
    <InstructionsSection>
      <Prose>{t("certificateHandoffBody")}</Prose>
      <CertificateButtonRow>
        <CertificateButton course={course} completion={completion} />
      </CertificateButtonRow>
    </InstructionsSection>
  )
}

export default CertificateHandoff
