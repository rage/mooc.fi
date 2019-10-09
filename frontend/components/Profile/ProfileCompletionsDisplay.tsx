import React, { useContext } from "react"
import CompletionListItem from "/components/CompletionListItem"
import LanguageContext from "/contexes/LanguageContext"
import getProfileTranslator from "/translations/profile"
import LangLink from "/components/LangLink"
import Button from "@material-ui/core/Button"
interface CompletionsProps {
  completions: any[]
}
const ProfileCompletionsDisplay = (props: CompletionsProps) => {
  const { completions } = props
  const lng = useContext(LanguageContext)
  const t = getProfileTranslator(lng.language)
  console.log(t)
  return (
    <>
      {completions.slice(0, 10).map(c => (
        <CompletionListItem listItem={c} key={c.id} />
      ))}
      <LangLink
        href="/[lng]/profile/completions"
        as={`/${lng.language}/profile/completions`}
      >
        <Button variant="text" fullWidth>
          <a href={`/${lng.language}/profile/completions`}>
            {t("seeCompletions")}
          </a>
        </Button>
      </LangLink>
    </>
  )
}

export default ProfileCompletionsDisplay
