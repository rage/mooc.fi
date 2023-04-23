import { useCallback } from "react"

import { MenuItem, TextField } from "@mui/material"

import { useUserPointsSummarySelectedCourseContext } from "./contexts"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

const CourseSelectDropdown = () => {
  const t = useTranslator(ProfileTranslations)
  const { courses, loading, selected, setSelected } =
    useUserPointsSummarySelectedCourseContext()

  const handleListItemClick = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelected(
        event.target.value as UserCourseSummaryCourseFieldsFragment["slug"],
      )
    },
    [setSelected],
  )

  return (
    <TextField
      select
      value={selected}
      onChange={handleListItemClick}
      label={t("selectedCourse")}
      disabled={loading}
    >
      {courses?.map((course) => (
        <MenuItem key={course.id} value={course.slug}>
          {course.name}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default CourseSelectDropdown
