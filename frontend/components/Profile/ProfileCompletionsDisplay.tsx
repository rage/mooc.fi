import Link from "next/link"

import { Typography } from "@mui/material"

import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { CompletionListItem } from "/components/Home/Completions"
import ProfileTranslations from "/translations/profile"
import { useTranslator } from "/util/useTranslator"

import { CompletionDetailedFieldsWithCourseFragment } from "/graphql/generated"

interface CompletionsProps {
  completions: CompletionDetailedFieldsWithCourseFragment[]
}

const ProfileCompletionsDisplay = (props: CompletionsProps) => {
  const { completions } = props
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      {completions.slice(0, 10).map((c) => (
        <CompletionListItem course={c.course!} completion={c} key={c.id} />
      ))}
      {completions.length === 0 && (
        <Typography>{t("nocompletionsText")}</Typography>
      )}
      <Link href={`/profile/completions`} passHref>
        <FormSubmitButton variant="text" fullWidth>
          {t("seeCompletions")}
        </FormSubmitButton>
      </Link>
    </>
  )
}

export default ProfileCompletionsDisplay
