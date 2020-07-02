import React, { useContext } from "react"
import { WideContainer } from "/components/Container"
import { useQuery } from "@apollo/react-hooks"
import CourseEdit from "/components/Dashboard/Editor/Course"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import getCoursesTranslator from "/translations/courses"
import LanguageContext from "/contexes/LanguageContext"
import { CourseEditorStudyModules } from "/static/types/generated/CourseEditorStudyModules"
import {
  CourseEditorStudyModuleQuery,
  CourseEditorCoursesQuery,
} from "/graphql/queries/courses"
import { CourseEditorCourses } from "/static/types/generated/CourseEditorCourses"

const NewCourse = () => {
  const { language } = useContext(LanguageContext)
  const t = getCoursesTranslator(language)

  const {
    data: studyModulesData,
    loading: studyModulesLoading,
    error: studyModulesError,
  } = useQuery<CourseEditorStudyModules>(CourseEditorStudyModuleQuery)
  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery<CourseEditorCourses>(CourseEditorCoursesQuery)

  if (studyModulesError || coursesError) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(studyModulesError || coursesError)}
      />
    )
  }

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          {t("createCourse")}
        </H1NoBackground>
        {studyModulesLoading || coursesLoading ? (
          <FormSkeleton />
        ) : (
          <CourseEdit
            modules={studyModulesData?.study_modules ?? undefined}
            courses={coursesData?.courses ?? undefined}
          />
        )}
      </WideContainer>
    </section>
  )
}

export default withAdmin(NewCourse)
