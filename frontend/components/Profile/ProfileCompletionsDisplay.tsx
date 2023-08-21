import { Typography } from "@mui/material"

import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { CompletionListItem } from "/components/Home/Completions"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { completionHasCourse } from "/util/guards"

import { CompletionDetailedFieldsWithCourseFragment } from "/graphql/generated"

interface CompletionsProps {
  completions: CompletionDetailedFieldsWithCourseFragment[]
}

const ProfileCompletionsDisplay = (props: CompletionsProps) => {
  const { completions } = props
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      {completions
        .filter(completionHasCourse)
        .slice(0, 10)
        .map((c) => (
          <CompletionListItem course={c.course} completion={c} key={c.id} />
        ))}
      {completions.length === 0 && (
        <Typography>{t("nocompletionsText")}</Typography>
      )}
      <FormSubmitButton href="/profile/completions" variant="text" fullWidth>
        {t("seeCompletions")}
      </FormSubmitButton>
    </>
  )
}

export default ProfileCompletionsDisplay
