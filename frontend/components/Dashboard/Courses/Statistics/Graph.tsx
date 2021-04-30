import { Paper, Typography, Skeleton, Alert, AlertTitle } from "@material-ui/core"
import dynamic from "next/dynamic"
import { DateTime } from "luxon"
import styled, { StyledComponent } from "@emotion/styled"
import { DatedInt } from "/components/Dashboard/Courses/Statistics/types"
import { ApolloError } from "@apollo/client"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import { useLanguageContext } from "/contexts/LanguageContext"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const ChartWrapper: StyledComponent<any> = styled((props: any[]) => <Paper elevation={3} {...props} />)`
  padding: 0.5rem;
  & + ${() => ChartWrapper} {
    margin-top: 1em;
  }
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
`
interface GraphProps {
  value?: {
    updated_at: string,
    data: DatedInt[] | null
  } | null
  name: string
  label: string
  loading: boolean
  error?: ApolloError
}
interface GraphEntry {
  value?: {
    updated_at: string
    data: DatedInt[] | null
  } | null
  name: string
  label: string
}

function Graph({
  value,
  label,
  loading,
  error
}: GraphProps) {
  const t = useTranslator(CoursesTranslations)
  const { language } = useLanguageContext()

  const options: ApexCharts.ApexOptions = {
    markers: {
      size: [4],
    },
    yaxis: {
      title: {
        text: "users"
      }
    },
    xaxis: {
      type: "datetime",
      labels: {
        rotate: -90,
        rotateAlways: true,
        hideOverlappingLabels: false,
        formatter: (_value, timestamp, _opts) => {
          return DateTime.fromMillis(timestamp ?? 0).toLocaleString({ locale: language ?? "en" })
        }
      }
    }
  }

  const series = [{
    name: label,
    data: (value?.data ?? []).map((e) => ({ x: new Date(DateTime.fromISO(e.date).toJSDate()).getTime(), y: e.value }))
  }]

  return (
    <ChartWrapper>
      <ChartHeader>
        <Typography variant="h3">{label}</Typography>
        <Typography variant="h3">{t("updated")} {DateTime.fromISO(value?.updated_at ?? "").toLocaleString({ locale: language ?? "en" })}</Typography>
      </ChartHeader>
      {loading ?
        <Skeleton
          variant="rectangular" width="100%" height="200px"
        />
        : error
          ? <Alert severity="error">
              <AlertTitle>Error loading graph</AlertTitle>
              <pre>{JSON.stringify(error, undefined, 2)}</pre>
            </Alert>
          : <Chart
              options={options}
              series={series}
              type="line"
            />}
    </ChartWrapper>
  )
}

export default Graph
