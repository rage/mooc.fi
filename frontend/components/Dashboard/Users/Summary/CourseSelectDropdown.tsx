import { MenuItem, TextField } from "@mui/material"
import { useEventCallback } from "@mui/material/utils"

import {
  useUserPointsSummaryContext,
  useUserPointsSummaryFunctionsContext,
} from "./contexts"
import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"

import { UserCourseSummaryCourseFieldsFragment } from "/graphql/generated"

const CourseSelectDropdown = () => {
  const t = useTranslator(ProfileTranslations)
  const { data, loading, selected } = useUserPointsSummaryContext()
  const { setSelected } = useUserPointsSummaryFunctionsContext()

  const handleListItemClick = useEventCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelected(
        event.target.value as UserCourseSummaryCourseFieldsFragment["slug"],
      )
    },
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
