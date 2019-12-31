import React from "react"
import { WideContainer } from "/components/Container"
import { gql } from "apollo-boost"
import { useQuery } from "@apollo/react-hooks"
import CourseEdit from "/components/Dashboard/Editor/Course"
import FormSkeleton from "/components/Dashboard/Editor/FormSkeleton"
import { H1NoBackground } from "/components/Text/headers"
import { StudyModules as StudyModuleData } from "/static/types/generated/StudyModules"
import Spinner from "/components/Spinner"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import withAdmin from "/lib/with-admin"
import withSignedIn from "/lib/with-signed-in"

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
  const { data, loading, error } = useQuery<StudyModuleData>(StudyModuleQuery)

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  if (loading || !data) {
    return <Spinner />
  }

  return (
    <section>
      <WideContainer>
        <H1NoBackground component="h1" variant="h1" align="center">
          Create a new course
        </H1NoBackground>
        {loading ? (
          <FormSkeleton />
        ) : (
          <CourseEdit modules={data.study_modules} />
        )}
      </WideContainer>
    </section>
  )
}

NewCourse.displayName = "NewCourse"

export default withAdmin(withSignedIn(NewCourse))
