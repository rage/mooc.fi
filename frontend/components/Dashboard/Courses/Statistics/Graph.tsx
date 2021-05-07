import {
  Paper,
  Typography,
  Skeleton,
  Alert,
  AlertTitle,
  Collapse,
  Checkbox,
  FormControlLabel,
  Button,
} from "@material-ui/core"
import CollapseButton from "/components/Buttons/CollapseButton"
import dynamic from "next/dynamic"
import { DateTime } from "luxon"
import styled, { StyledComponent } from "@emotion/styled"
import { DatedInt } from "/components/Dashboard/Courses/Statistics/types"
import { ApolloError, OperationVariables, QueryLazyOptions } from "@apollo/client"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import { useLanguageContext } from "/contexts/LanguageContext"
import React, { useCallback, useEffect, useState } from "react"
import { FormControl } from "@material-ui/core"
import { flatten } from "lodash"
import notEmpty from "/util/notEmpty"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const ChartWrapper: StyledComponent<any> = styled((props: any[]) => (
  <Paper elevation={3} {...props} />
))`
  padding: 0.5rem;
  & + ${() => ChartWrapper} {
    margin-top: 1em;
  }
`

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
`

const FilterMenu = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const FilterColumn: any = styled(FormControl)`
  /*& + ${() => FilterColumn} {
    border-left: 1px ridge grey;
  }*/
`
interface GraphEntry {
  value?: {
    updated_at: string
    data: DatedInt[] | null
  } | null
  name: string
  label: string
  loading: boolean
  fetch?: (_?: QueryLazyOptions<OperationVariables>) => void
  error?: ApolloError
}

type GraphValues = GraphEntry | GraphEntry[]

interface GraphProps {
  values: GraphValues[]
  loading?: boolean
  error?: ApolloError
  label?: string
  updated_at?: string
}

interface Filter {
  name: string
  label: string
}

interface SeriesEntry {
  name: string
  data: Array<{ x: number, y: number | null }>
}
/*interface SeriesEntry {
  name: string
  [key: string]: any
}*/

type Series = SeriesEntry | SeriesEntry[]

function useGraphFilter(values: GraphValues[]) {
  const getFilters = (_values: GraphValues[]) =>
    flatten(_values.map((v) => { 
      if (Array.isArray(v)) {
        return v.map((v2) => ({ name: v2.name, label: v2.label }))
      }
      return { name: v.name, label: v.label }
    }))
  const mapGraphEntry = (value: GraphEntry): SeriesEntry => ({
    name: value.label,
    data: (value?.value?.data ?? []).map((e) => ({
      x: new Date(DateTime.fromISO(e.date).toJSDate()).getTime(),
      y: e.value,
    })),
  })

  console.log(values)
  const calculateSeries = (_values: GraphValues[]): Series[] => 
    _values.map((value) => {
      if (Array.isArray(value)) return value.map(mapGraphEntry)

      return mapGraphEntry(value)
    })
  
  const getLoading = (_values: GraphValues[]) =>
    _values.map((v) => {
      if (Array.isArray(v)) return v.reduce((acc, curr) => acc || (curr.loading ?? false), false)

      return v.loading ?? false
    })
  
  const filterValues = getFilters(values)
  const [filter, setFilter] = useState<Filter[]>(filterValues)
  const [series, setSeries] = useState(calculateSeries(values))
  const [loading, setLoading] = useState(getLoading(values))

  console.log(filterValues)
  useEffect(() => {
    setSeries(calculateSeries(values))
    setLoading(getLoading(values))
  }, [values])
  useEffect(() => {
    const filterNames = filter.map((f) => f.name)
    console.log(filterNames)
    const tmp = values.map((v) => {
      if (Array.isArray(v)) {
        const arr = v.filter((v2) => filterNames.includes(v2.name)) 
        return arr.length > 0 ? arr : undefined
      }

      return filterNames.includes(v.name) ? v : undefined
    }).filter(notEmpty)
    
    console.log("temp", tmp)
    setSeries(
      calculateSeries(tmp),
    )
  }, [filter])

  return {
    filterValues,
    filter,
    setFilter,
    series,
    loading,
  }
}

const colors = [
  "rgba(0, 143, 251, 0.85)",
  "rgba(0, 27,150,0.85)",
  "rgba(254,176,25,0.85)",
  "#F44336",
  "#E91E63",
  "#9C27B0",
]

function ChartSkeleton() {
  return (
    <>
      <div
        style={{
          display: "flex",
          padding: "0.5rem",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Skeleton width="200px" />
        <Skeleton width="135px" style={{ position: "absolute", right: 0 }} />
      </div>
      <Skeleton variant="rectangular" width="100%" height={200} />
    </>
  )
}

interface ChartsProps {
  series: Series[]
  error?: ApolloError
  loading?: boolean
  separate: boolean
  seriesLoading: boolean[]
}

function Graph({ values, loading, error, label, updated_at }: GraphProps) {
  const t = useTranslator(CoursesTranslations)
  const { language } = useLanguageContext()
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [separate, setSeparate] = useState(true)

  const {
    filterValues,
    filter,
    setFilter,
    series,
    loading: seriesLoading,
  } = useGraphFilter(values)

  console.log(series)


  const handleFilterChange = (filterValue: Filter) => (
    _: any,
    checked: boolean,
  ) =>
    checked
      ? setFilter((prev) => prev.concat(filterValue))
      : setFilter((prev) => prev.filter((f) => f.name !== filterValue.name))

  const updatedAtFormatted = updated_at
    ? DateTime.fromISO(updated_at)
      .setLocale(language ?? "en")
      .toLocaleString(DateTime.DATETIME_FULL)
    : undefined

  const refreshSeries = () => {
    // todo: only fetch selected
    values.forEach((v) => {
      if (Array.isArray(v)) {
        return v.forEach((v2) => v2.fetch?.())
      }
      v.fetch?.()
    })
  }

  return (
    <ChartWrapper>
      <ChartHeader>
        <div style={{ display: "inline" }}>
          {label && <Typography variant="h3">{label}</Typography>}
          {updatedAtFormatted && (
            <Typography variant="caption">
              {t("updated")} {updatedAtFormatted}
            </Typography>
          )}
        </div>
        <CollapseButton
          open={isFilterVisible}
          onClick={() => setIsFilterVisible((v) => !v)}
          label="Options"
        />
      </ChartHeader>
      <Collapse in={isFilterVisible}>
        <FilterMenu>
          <FilterColumn>
            {filterValues.map((filterValue, index) => (
              <FormControlLabel
                label={filterValue.label}
                key={`filter-value-${filterValue.name}-${index}`}
                control={
                  <Checkbox
                    id={`filter-${filterValue.name}`}
                    checked={filter
                      .map((f) => f.name)
                      .includes(filterValue.name)}
                    onChange={handleFilterChange(filterValue)}
                  />
                }
              />
            ))}
          </FilterColumn>
          <FilterColumn>
            <FormControlLabel
              label="Separate charts"
              style={{ justifyContent: "flex-end" }}
              control={
                <Checkbox
                  id="filter-separate"
                  checked={separate}
                  onChange={(_, checked) => setSeparate(checked)}
                />
              }
            />
            <Button onClick={() => refreshSeries()}>Refresh</Button>
          </FilterColumn>
        </FilterMenu>
      </Collapse>
      <Charts
        loading={loading}
        error={error}
        separate={separate}
        series={series}
        seriesLoading={seriesLoading}
      />
    </ChartWrapper>
  )
}

const getChartName = (s: Series) => 
  Array.isArray(s) ? s.map((s2) => s2.name).join("-") : s.name

function Charts({ loading, error, separate, series, seriesLoading }: ChartsProps) {
  const { language } = useLanguageContext()

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    yaxis: {
      title: {
        text: "users",
      },
      labels: {
        minWidth: 10,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        rotate: -90,
        rotateAlways: true,
        hideOverlappingLabels: false,
        formatter: (_value, timestamp, _opts) => {
          return DateTime.fromMillis(Number(timestamp) ?? 0).toLocaleString({
            locale: language ?? "en",
          })
        },
      },
      tickPlacement: "on",
    },
    chart: {
      animations: {
        enabled: false
      },
      group: "group",
    },
    grid: {
      show: true,
      position: "back",
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    legend: {
      position: "top",
      showForSingleSeries: true,
      showForNullSeries: false,
    },
  }

  const chartOptions = useCallback(() => series.map((_, index) => ({
    ...options,
    colors: colors.slice(index % colors.length).concat(colors.slice(0, index % colors.length)),
    chart: {
      ...options.chart,
      id: `chart-${index}`
    }
  })), [series])

  if (loading) {
    return (
      <>
        <ChartSkeleton key="page-skeleton-1" />
        <ChartSkeleton key="page-skeleton-2" />
        <ChartSkeleton key="page-skeleton-3" />
      </>
    )
  }

  if (error) {
    return (
      <Alert severity="error">
        <AlertTitle>Error loading chart</AlertTitle>
        <pre>{JSON.stringify(error, undefined, 2)}</pre>
      </Alert>
    )
  }

  if (separate) {
    return (
      <>
        {series.map((s, index) => (
          <div key={`chart-${getChartName(s)}`}>
            {seriesLoading[index] ? (
              <ChartSkeleton key={`skeleton-${getChartName(s)}`} />
            ) : (
              //<div/>
              <Chart
                options={chartOptions()[index]}
                series={Array.isArray(s) ? s : [s]}
                type="line"
              />
            )}
          </div>
        ))}
      </>
    )
  }

  return (
    // <div />
    <Chart options={options} series={series} type="line" />
  )
}

export default Graph
