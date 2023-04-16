import { createContext, useContext } from "react"

import { CourseFormValues, TagFormValue } from "./types"

import {
  EditorCourseDetailedFieldsFragment,
  EditorCourseOtherCoursesFieldsFragment,
  StudyModuleDetailedFieldsFragment,
  TagCoreFieldsFragment,
} from "/graphql/generated"

export interface CourseEditorDataContext {
  course?: EditorCourseDetailedFieldsFragment
  courses?: EditorCourseOtherCoursesFieldsFragment[]
  studyModules?: StudyModuleDetailedFieldsFragment[]
  tags?: TagCoreFieldsFragment[]
  tagOptions?: TagFormValue[]
  defaultValues: CourseFormValues
  isClone?: boolean
}

const CourseEditorDataContextImpl = createContext<CourseEditorDataContext>({
  defaultValues: {} as CourseFormValues,
})

export function useCourseEditorData() {
  return useContext<CourseEditorDataContext>(CourseEditorDataContextImpl)
}

interface CourseEditorDataProviderProps {
  value: CourseEditorDataContext
}

export function CourseEditorDataProvider(
  props: React.PropsWithChildren<CourseEditorDataProviderProps>,
) {
  const { children, value } = props

  return (
    <CourseEditorDataContextImpl.Provider value={value}>
      {children}
    </CourseEditorDataContextImpl.Provider>
  )
}

export { CourseEditorDataContextImpl as CourseEditorDataContext }
