import { useMemo } from "react"

import { omit } from "remeda"

import { useMutation, useQuery } from "@apollo/client"

import { toCourseForm } from "/components/Dashboard/Editor/Course/serialization"
import { filterNull } from "/util/filterNull"

import {
  AddCourseDocument,
  CourseEditorDetailsDocument,
  CourseEditorOtherCoursesDocument,
  CourseEditorSponsorsDocument,
  CourseEditorTagsDocument,
  CoursesDocument,
  DeleteCourseDocument,
  EditorCourseDetailedFieldsFragment,
  EditorCoursesDocument,
  EditorStudyModulesDocument,
  UpdateCourseDocument,
} from "/graphql/generated"

interface UseEditorCoursesProps {
  slug?: string
  isClone?: boolean
}

export function useEditorCourses({ slug, isClone }: UseEditorCoursesProps) {
  const {
    data: courseData,
    loading: courseLoading,
    error: courseError,
  } = useQuery(CourseEditorDetailsDocument, {
    variables: { slug },
  })
  const {
    data: studyModulesData,
    loading: studyModulesLoading,
    error: studyModulesError,
  } = useQuery(EditorStudyModulesDocument)

  const {
    data: coursesData,
    loading: coursesLoading,
    error: coursesError,
  } = useQuery(CourseEditorOtherCoursesDocument)

  const {
    data: tagsData,
    loading: tagsLoading,
    error: tagsError,
  } = useQuery(CourseEditorTagsDocument, {
    variables: {
      includeWithNoCourses: true,
    },
  })

  const {
    data: sponsorsData,
    loading: sponsorsLoading,
    error: sponsorsError,
  } = useQuery(CourseEditorSponsorsDocument)

  const [addCourse, { loading: addCourseLoading, error: addCourseError }] =
    useMutation(AddCourseDocument)
  const [
    updateCourse,
    { loading: updateCourseLoading, error: updateCourseError },
  ] = useMutation(UpdateCourseDocument)
  const [
    deleteCourse,
    { loading: deleteCourseLoading, error: deleteCourseError },
  ] = useMutation(DeleteCourseDocument, {
    refetchQueries: [
      { query: CoursesDocument },
      { query: EditorCoursesDocument },
      { query: CourseEditorOtherCoursesDocument },
    ],
  })

  const data = useMemo(() => {
    let course = courseData?.course ?? undefined
    const courses = coursesData?.courses ?? []
    const studyModules = studyModulesData?.study_modules ?? []
    const tags = tagsData?.tags ?? []
    const sponsors = sponsorsData?.sponsors ?? []

    if (isClone && course) {
      course = {
        ...course,
        id: "",
        slug: "",
        photo: {
          ...course.photo,
          id: null,
        },
        course_translations: course.course_translations.map((translation) => ({
          ...translation,
          id: null,
          course_id: null,
        })),
        course_variants: course.course_variants.map((variant) => ({
          ...variant,
          id: null,
        })),
        course_aliases: course.course_aliases.map((alias) => ({
          ...alias,
          id: null,
        })),
        user_course_settings_visibilities:
          course.user_course_settings_visibilities.map((visibility) => ({
            ...visibility,
            id: null,
          })),
      } as unknown as EditorCourseDetailedFieldsFragment
    }

    const defaultValues = toCourseForm({
      course,
      modules: studyModules,
    })
    const tagOptions = (tags ?? []).map((tag) => ({
      ...omit(tag, ["__typename", "id"]),
      _id: tag.id,
      types: tag.types ?? [],
      tag_translations: (tag.tag_translations ?? []).map((translation) =>
        filterNull(translation),
      ),
    }))
    const sponsorOptions = (sponsors ?? []).map((sponsor) => ({
      ...omit(sponsor, ["__typename", "id"]),
      _id: sponsor.id,
      translations: sponsor.translations.map((translation) =>
        filterNull(translation),
      ),
      images: (sponsor.images ?? []).map((image) => filterNull(image)),
      order: 0,
    }))

    return {
      course,
      courses,
      studyModules,
      tags,
      sponsors,
      defaultValues,
      tagOptions,
      sponsorOptions,
      isClone,
    }
  }, [
    isClone,
    courseData,
    coursesData,
    studyModulesData,
    tagsData,
    sponsorsData,
  ])

  return {
    loading:
      courseLoading ||
      studyModulesLoading ||
      coursesLoading ||
      tagsLoading ||
      sponsorsLoading,
    error:
      courseError ??
      studyModulesError ??
      coursesError ??
      tagsError ??
      sponsorsError,
    addCourse,
    updateCourse,
    deleteCourse,
    mutationLoading:
      addCourseLoading || updateCourseLoading || deleteCourseLoading,
    mutationError: addCourseError ?? updateCourseError ?? deleteCourseError,
    data,
  }
}
