import React, { useMemo } from "react"

import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"

import CourseHighlights from "./CourseHighlights"
import ModuleList from "./ModuleList"
import ModuleNavi from "./ModuleNavi"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { useTranslator } from "/hooks/useTranslator"
import backgroundPattern from "/public/images/background/backgroundPattern.svg"
import HomeTranslations from "/translations/home"
import { mapNextLanguageToLocaleCode } from "/util/moduleFunctions"

import {
  CourseStatus,
  FrontpageCoursesModulesDocument,
} from "/graphql/generated"

const CourseAndModuleList = () => {
  const { locale = "fi" } = useRouter()
  const t = useTranslator(HomeTranslations)
  const language = mapNextLanguageToLocaleCode(locale)

  // TODO: do this in one query; get module courses already in backend
  const { loading, error, data } = useQuery(FrontpageCoursesModulesDocument, {
    variables: { language },
  })

  const courses = data?.courses ?? []
  const study_modules = data?.study_modules ?? []

  const { studyModules, modulesWithCourses } = useMemo(() => {
    let studyModules = study_modules ?? []
    const modulesWithCourses = studyModules
      .map((module) => {
        const moduleCourses = (courses ?? []).filter(
          (course) =>
            course.study_modules?.some(
              (courseModule) => courseModule.id === module.id,
            ) && course?.status !== CourseStatus.Ended,
        )

        return { ...module, courses: moduleCourses }
      })
      .filter((m) => m.courses.length > 0)

    studyModules = studyModules.filter((s) =>
      modulesWithCourses.find((m) => m.id === s.id),
    )

    return { studyModules, modulesWithCourses }
  }, [study_modules, courses])

  const [activeCourses, upcomingCourses, endedCourses] = useMemo(
    () =>
      ["Active", "Upcoming", "Ended"].map((status) =>
        courses.filter((c) => !c.hidden && c.status === status),
      ),
    [courses],
  )

  const promotedCourses = useMemo(
    () => activeCourses.filter((c) => c.promote),
    [activeCourses],
  )

  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  return (
    <section>
      <section id="courses">
        <CourseHighlights
          courses={promotedCourses}
          loading={loading}
          title={t("highlightTitle")}
          headerImage={backgroundPattern}
          subtitle={t("highlightSubtitle")}
          backgroundColor="#4D78A3"
          hueRotateAngle={177}
          brightness={5.5}
          fontColor="#4D78A3"
          titleBackground="#ffffff"
        />
        <CourseHighlights
          courses={activeCourses}
          loading={loading}
          title={t("allCoursesTitle")}
          headerImage={backgroundPattern}
          backgroundColor="#ffffff"
          hueRotateAngle={34}
          brightness={1}
          fontColor="white"
          titleBackground="#008EBD"
        />
        <CourseHighlights
          courses={upcomingCourses}
          loading={loading}
          title={t("upcomingCoursesTitle")}
          headerImage={backgroundPattern}
          backgroundColor="#007DC8"
          hueRotateAngle={0}
          brightness={5.5}
          fontColor="#007DC8"
          titleBackground="#ffffff"
        />
      </section>
      {language === "fi_FI" && (
        <section id="modules">
          <ModuleNavi modules={studyModules} loading={loading} />
          <ModuleList modules={modulesWithCourses} loading={loading} />
        </section>
      )}
      <CourseHighlights
        courses={endedCourses}
        loading={loading}
        title={t("endedCoursesTitle")}
        headerImage={backgroundPattern}
        backgroundColor="#ffffff"
        hueRotateAngle={58}
        brightness={1}
        fontColor="white"
        titleBackground="#3066C0"
      />
    </section>
  )
}

export default CourseAndModuleList
