import { CompletionListItem } from "/components/Home/Completions"
import ProfileTranslations from "/translations/profile"
import LangLink from "/components/LangLink"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { useTranslator } from "/util/useTranslator"
import { ProfileUserOverView_currentUser_completions } from "/static/types/generated/ProfileUserOverView"

interface CompletionsProps {
  completions: ProfileUserOverView_currentUser_completions[]
}

const ProfileCompletionsDisplay = (props: CompletionsProps) => {
  const { completions } = props
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      {completions.slice(0, 10).map((c) => (
        <CompletionListItem course={c.course!} completion={c} key={c.id} />
      ))}
      <LangLink href={`/profile/completions`} passHref>
        <FormSubmitButton variant="text" fullWidth>
          {t("seeCompletions")}
        </FormSubmitButton>
      </LangLink>
    </>
  )
}

export default ProfileCompletionsDisplay
