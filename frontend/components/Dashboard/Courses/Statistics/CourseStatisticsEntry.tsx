import { Skeleton, Typography } from "@material-ui/core"
import { DatedInt } from "/components/Dashboard/Courses/Statistics/types"
import styled from "@emotion/styled"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import { DateTime } from "luxon"
import { useLanguageContext } from "/contexts/LanguageContext"

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

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

function CourseStatisticsEntry({
  name,
  label,
  value,
  loading,
  error,
}: CourseStatisticsEntryProps) {
  const t = useTranslator(CoursesTranslations)
  const { language } = useLanguageContext()

  if (loading) {
    return <Skeleton />
  }

  if (error) {
    return <div>Error loading {name}</div>
  }

  const updated_at = DateTime.fromISO(value?.updated_at ?? "")
    .setLocale(language ?? "en")
    .toLocaleString(DateTime.DATETIME_FULL)

  return (
    <StatisticsEntryWrapper>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          <LabelWrapper>
            <Typography variant="h3">{label}</Typography>
            <Typography variant="caption">
              {t("updated")} {updated_at}
            </Typography>
          </LabelWrapper>
          <Typography variant="h1">
            {value?.data?.[0].value ?? "---"}
          </Typography>
        </>
      )}
    </StatisticsEntryWrapper>
  )
}

export default CourseStatisticsEntry
