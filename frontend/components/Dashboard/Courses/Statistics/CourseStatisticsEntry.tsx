import { Skeleton, Typography } from "@material-ui/core"
import { DatedInt } from "/components/Dashboard/Courses/Statistics/types"
import styled from "@emotion/styled"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

interface CourseStatisticsEntryProps {
  name: string
  label: string
  value?: {
    updated_at: string
    data: DatedInt[] | null
  } | null
  loading: boolean
  error: boolean
}

const StatisticsEntryWrapper: any = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  & + & {
    border-top: 1px ridge;
  }
`
function CourseStatisticsEntry({
  name, label, value, loading, error
}: CourseStatisticsEntryProps) {
  const t = useTranslator(CoursesTranslations)

  if (loading) {
    return <Skeleton />
  }

  if (error) {
    return <div>Error loading {name}</div>
  }
  return (
    <StatisticsEntryWrapper>
      {loading
        ? <Skeleton />
        : <>
            <Typography variant="h3">{label}: {value?.data?.[0].value}</Typography>
            <Typography variant="h3">{t("updated")} {value?.updated_at}</Typography>
          </>}
    </StatisticsEntryWrapper>
  )
}

export default CourseStatisticsEntry