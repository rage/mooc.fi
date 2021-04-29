import { CourseStatistics_course_course_statistics } from "/static/types/generated/CourseStatistics"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"

interface CourseStatisticsListProps {
  data: CourseStatistics_course_course_statistics | null
}

function CourseStatisticsList({ data }: CourseStatisticsListProps) {
  const t = useTranslator(CoursesTranslations)

  if (!data) {
    return <div>No data!</div>
  }

  return (
    <section>
      <CourseStatisticsEntry
        field="started"
        value={data.started!.value}
        date={data.started!.date}
      />
      <CourseStatisticsEntry
        field="completed"
        value={data.completed!.value}
        date={data.completed!.date}
      />
      <CourseStatisticsEntry
        field="atLeastOneExercise"
        value={data.at_least_one_exercise!.value}
        date={data.at_least_one_exercise!.date}
      />
    </section>
  )
}

interface CourseStatisticsEntryProps {
  field: Omit<keyof CourseStatistics_course_course_statistics, "__typename">
  value: number | null
  date: any
}

function CourseStatisticsEntry({
  field,
  value,
  date,
}: CourseStatisticsEntryProps) {
  const t = useTranslator(CoursesTranslations)

  console.log(field)
  return (
    <div key={field as string}>
      {t(field as any)}: {value} Updated {date}
    </div>
  )
}

export default CourseStatisticsList
