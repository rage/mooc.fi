import React, { useContext } from "react"
import { WideContainer } from "/components/Container"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import CourseEdit from "/components/Dashboard/Editor/Course"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import { StudyModules as StudyModuleData } from "/static/types/generated/StudyModules"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"

export const StudyModuleQuery = gql`
  query StudyModules {
    study_modules {
      id
      name
      slug
    }
  }
`

const NewCourse = () => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)

  const { data, loading, error } = useQuery<StudyModuleData>(StudyModuleQuery)

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("createCourse")}
        </H1NoBackground>
        {loading ? (
          <FormSkeleton />
        ) : (
          <CourseEdit modules={data?.study_modules} />
        )}
      </WideContainer>
    </section>
  )
}

export default withAdmin(NewCourse)
