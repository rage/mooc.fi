import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { styled } from "@mui/material/styles"

import { SectionContainer } from "../Common"
import { ListItem, ListItemSkeleton } from "./StudyModuleListItem"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import { StudyModulesWithCoursesDocument } from "/graphql/generated"

const Container = styled(SectionContainer)`
  flex: 1;
  width: 100%;
`

const ModuleList = styled("ul")`
  list-style: none;
  list-style-position: inside;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  width: 100%;
  padding: 1rem;
`

export function StudyModuleList() {
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)

  const { data, loading, error } = useQuery(StudyModulesWithCoursesDocument, {
    variables: { language },
  })

  if (error) {
    // TODO
    return <div>error</div>
  }

  if (loading) {
    return (
      <Container>
        <ModuleList>
          <ListItemSkeleton />
          <ListItemSkeleton />
          <ListItemSkeleton />
        </ModuleList>
      </Container>
    )
  }

  return (
    <Container>
      <ModuleList>
        {data?.study_modules?.map((module) => (
          <ListItem module={module} key={module.id} />
        ))}
      </ModuleList>
    </Container>
  )
}
