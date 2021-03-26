import { useContext } from "react"
import CompletionListItem from "/components/CompletionListItem"
import LanguageContext from "../../contexts/LanguageContext"
import ProfileTranslations from "/translations/profile"
import LangLink from "/components/LangLink"
import { FormSubmitButton } from "/components/Buttons/FormSubmitButton"
import { useTranslator } from "/util/useTranslator"
interface CompletionsProps {
  completions: any[]
}
const ProfileCompletionsDisplay = (props: CompletionsProps) => {
  const { completions } = props
  const lng = useContext(LanguageContext)
  const t = useTranslator(ProfileTranslations)

  return (
    <>
      {completions.slice(0, 10).map((c) => (
        <CompletionListItem listItem={c} key={c.id} />
      ))}
      <LangLink
        href="/[lng]/profile/completions"
        as={`/${lng.language}/profile/completions`}
      >
        <FormSubmitButton variant="text" fullWidth>
          <a href={`/${lng.language}/profile/completions`}>
            {t("seeCompletions")}
          </a>
        </FormSubmitButton>
      </LangLink>
    </>
  )
}

export default ProfileCompletionsDisplay
