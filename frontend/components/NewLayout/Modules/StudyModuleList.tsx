import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import { styled } from "@mui/material/styles"

import Introduction from "../Common/Introduction"
import { moduleColorSchemes } from "../Courses/common"
import ModuleNaviList from "../Frontpage/Modules/ModuleNaviList"
import { ListItem, ListItemSkeleton } from "./StudyModuleListItem"
import ErrorMessage from "/components/ErrorMessage"
import { useTranslator } from "/hooks/useTranslator"
import StudyModulesTranslations from "/translations/study-modules"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import { NewStudyModulesWithCoursesDocument } from "/graphql/generated"

const ModuleList = styled("ul")(
  ({ theme }) => `
  list-style: none;
  list-style-position: inside;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  width: 100%;
  z-index: 0;

  ${theme.breakpoints.up("lg")} {
    width: calc(100% + 4rem);
    margin-left: -2rem;
    margin-right: -2rem;
  }
`,
)

export function StudyModuleList() {
  const t = useTranslator(StudyModulesTranslations)
  const { locale = "fi" } = useRouter()
  const language = mapNextLanguageToLocaleCode(locale)

  const { data, loading, error } = useQuery(
    NewStudyModulesWithCoursesDocument,
    {
      variables: { language },
    },
  )

  if (error) {
    // TODO
    return <ErrorMessage />
  }

  if (loading) {
    return (
      <>
        <ModuleNaviList modules={data?.study_modules} loading={loading} />
        <ModuleList>
          <ListItemSkeleton
            backgroundColor={moduleColorSchemes["cyber-security"]!}
          />
          <ListItemSkeleton
            backgroundColor={moduleColorSchemes["programming"]!}
          />
          <ListItemSkeleton
            backgroundColor={
              moduleColorSchemes["pilvipohjaiset-websovellukset"]!
            }
          />
        </ModuleList>
      </>
    )
  }

  return (
    <section>
      <Introduction title={t("modulesTitle")} />
      <ModuleNaviList modules={data?.study_modules} loading={loading} />
      <ModuleList>
        {data?.study_modules?.map((studyModule) => (
          <ListItem
            studyModule={studyModule}
            key={studyModule.id}
            backgroundColor={
              studyModule?.slug
                ? moduleColorSchemes[studyModule.slug]!
                : moduleColorSchemes["other"]!
            }
          />
        ))}
      </ModuleList>
    </section>
  )
}
