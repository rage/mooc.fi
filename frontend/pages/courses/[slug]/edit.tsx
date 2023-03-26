import { useCallback, useEffect, useMemo } from "react"

import { omit } from "lodash"
import { NextSeo } from "next-seo"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"

import { Link, Paper, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import FormSkeleton from "../../../components/Dashboard/EditorLegacy/FormSkeleton"
import { WideContainer } from "/components/Container"
import DashboardTabBar from "/components/Dashboard/DashboardTabBar"
import { toCourseForm } from "/components/Dashboard/Editor/Course/serialization"
import { CourseFormValues } from "/components/Dashboard/Editor/Course/types"
import { EditorDataProvider } from "/components/Dashboard/Editor/EditorContext"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { H1Background } from "/components/Text/headers"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { useEditorCourses } from "/hooks/useEditorCourses"
import { useQueryParameter } from "/hooks/useQueryParameter"
import useSubtitle from "/hooks/useSubtitle"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import CoursesTranslations from "/translations/courses"

const ErrorContainer = styled(Paper)`
  padding: 1em;
`

const ContainerBackground = styled("section")`
  background-color: #e9fef8;
`
const CourseEdit = dynamic(
  () => import("../../../components/Dashboard/Editor/Course"),
  { loading: () => <FormSkeleton /> },
)
const LegacyCourseEdit = dynamic(
  () => import("../../../components/Dashboard/EditorLegacy/Course"),
  { loading: () => <FormSkeleton /> },
)

const EditCourse = () => {
  const t = useTranslator(CoursesTranslations)
  const slug = useQueryParameter("slug") ?? ""
  const legacy = useQueryParameter("legacy", false)
  const router = useRouter()
  const {
    loading,
    error,
    courseData,
    studyModulesData,
    coursesData,
    tagsData,
  } = useEditorCourses({
    slug,
  })

  useEffect(() => {
    let redirectTimeout: NodeJS.Timeout | null = null

    if (typeof window === "undefined") {
      return
    }

    if (!loading && !courseData?.course) {
      redirectTimeout = setTimeout(
        () => router.push("/courses", undefined, { shallow: true }),
        5000,
      )
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout)
      }
    }
  }, [loading, courseData])

  useBreadcrumbs([
    {
      translation: "courses",
      href: `/courses`,
    },
    {
      label:
        error || (!loading && !courseData?.course)
          ? slug
          : courseData?.course?.name,
      href: `/courses/${slug}`,
    },
    {
      translation: "courseEdit",
      href: `/courses/${slug}/edit`,
    },
  ])

  const title = useSubtitle(
    !loading && !courseData?.course ? slug : courseData?.course?.name,
  )

  const EditorComponent = useCallback(() => {
    if (!courseData?.course) {
      return null
    }

    if (legacy) {
      return (
        <LegacyCourseEdit
          course={courseData.course}
          courses={coursesData?.courses ?? []}
          modules={studyModulesData?.study_modules ?? []}
        />
      )
    }

    return <CourseEdit />
  }, [courseData, coursesData, studyModulesData, tagsData, legacy])

  const editorDataContextValue = useMemo(() => {
    const course = courseData?.course ?? undefined
    const courses = coursesData?.courses ?? []
    const studyModules = studyModulesData?.study_modules ?? []
    const tags = tagsData?.tags ?? []
    const defaultValues = course
      ? toCourseForm({
          course,
          modules: studyModules,
        })
      : ({} as CourseFormValues)
    const tagOptions = tags.map((tag) => ({
      ...omit(tag, ["__typename", "id"]),
      _id: tag.id,
      types: tag.types ?? [],
      tag_translations: (tag.tag_translations ?? []).map((translation) => ({
        ...translation,
        description: translation.description ?? undefined,
      })),
    }))

    return {
      course,
      courses,
      studyModules,
      tags,
      tagOptions,
      defaultValues,
    }
  }, [courseData, coursesData, studyModulesData, tagsData])

  if (error) {
    return <ModifiableErrorMessage errorMessage={JSON.stringify(error)} />
  }

  return (
    <>
      <NextSeo title={title} />
      <ContainerBackground>
        <DashboardTabBar slug={slug} selectedValue={3} />
        <WideContainer>
          <H1Background component="h1" variant="h1" align="center">
            {t("editCourse")}
          </H1Background>
          {loading && <FormSkeleton />}
          <EditorDataProvider value={editorDataContextValue}>
            <EditorComponent />
          </EditorDataProvider>
          {!loading && !courseData?.course && (
            <ErrorContainer elevation={2}>
              <Typography variant="body1">
                {t("courseWithIdNotFound", { slug })}
              </Typography>
              <Typography variant="body2">
                {t("redirectMessagePre")}
                <Link href="/courses">{t("redirectLinkText")}</Link>
                {t("redirectMessagePost")}
              </Typography>
            </ErrorContainer>
          )}
        </WideContainer>
      </ContainerBackground>
    </>
  )
}

export default withAdmin(EditCourse)
