import { useContext } from "react"
import { WideContainer } from "/components/Container"
import StudyModuleEdit from "/components/Dashboard/Editor/StudyModule"
import { H1NoBackground } from "/components/Text/headers"
import withAdmin from "/lib/with-admin"
import getStudyModuleTranslator from "/translations/study-modules"
import LanguageContext from "/contexes/LanguageContext"

const NewStudyModule = () => {
  const { language } = useContext(LanguageContext)
  const t = getStudyModuleTranslator(language)
  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("newStudyModule")}
        </H1NoBackground>
        <StudyModuleEdit />
      </WideContainer>
    </section>
  )
}

export default withAdmin(NewStudyModule)
