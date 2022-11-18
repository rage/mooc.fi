import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import styled from "@emotion/styled"

import { SectionContainer } from "../Common"
import { ListItem, ListItemSkeleton } from "./StudyModuleListItem"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import { StudyModulesWithCoursesDocument } from "/graphql/generated"
import Modules from "/components/NewLayout/Frontpage/Modules/Modules"
import ModuleNaviList from "../Frontpage/Modules/ModuleNaviList"
import ErrorMessage from "/components/ErrorMessage"

const colorSchemes = {
  csb: "#08457A",
  programming: "#065853",
  cloud: "#1A2333",
  ai: "#51309F",
}

const Container = styled(SectionContainer)`
  flex: 1;
  width: 100%;
`

const ModuleList = styled.ul`
  list-style: none;
  list-style-position: inside;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  width: 100%;
`

export function StudyModuleList() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)

  const { data, loading, error } = useQuery(StudyModulesWithCoursesDocument, {
    variables: { language },
  })

  if (error) {
    // TODO
    return <ErrorMessage />
  }

  if (loading) {
    return (
      <Container>
        <ModuleList>
          <ListItemSkeleton backgroundColor={colorSchemes.csb} />
          <ListItemSkeleton backgroundColor={colorSchemes.programming} />
          <ListItemSkeleton backgroundColor={colorSchemes.cloud} />
        </ModuleList>
      </Container>
    )
  }

  return (
    <Container>
      <ModuleNaviList modules={data?.study_modules!} loading={loading} />
      <ModuleList>
        {data?.study_modules?.map((module, index) => (
          <ListItem module={module} key={module.id} backgroundColor={Object.values(colorSchemes)[index]}/>
        ))}
      </ModuleList>
    </Container>
  )
}
