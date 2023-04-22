import { useCallback } from "react"

import { MenuItem, TextField } from "@mui/material"

import {
  useUserPointsSummaryContext,
  useUserPointsSummarySelectedCourseContext,
} from "./contexts"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

interface CourseSelectDropdownProps {
  loading?: boolean
  selected?: UserCourseSummaryCourseFieldsFragment["slug"]
}

const CourseSelectDropdown = ({
  selected,
  loading,
}: CourseSelectDropdownProps) => {
  const t = useTranslator(ProfileTranslations)
  const { data } = useUserPointsSummaryContext()
  const { setSelected } = useUserPointsSummarySelectedCourseContext()

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
      {data?.map(({ course }) => (
        <MenuItem key={course.id} value={course.slug}>
          {course.name}
        </MenuItem>
      ))}
    </TextField>
  )
}

export default CourseSelectDropdown
