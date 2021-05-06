import {
  Paper,
  Typography,
  Skeleton,
  Alert,
  AlertTitle,
  Collapse,
  Checkbox,
  FormControlLabel,
} from "@material-ui/core"
import CollapseButton from "/components/Buttons/CollapseButton"
import dynamic from "next/dynamic"
import { DateTime } from "luxon"
import styled, { StyledComponent } from "@emotion/styled"
import { DatedInt } from "/components/Dashboard/Courses/Statistics/types"
import { ApolloError } from "@apollo/client"
import CoursesTranslations from "/translations/courses"
import { useTranslator } from "/util/useTranslator"
import { useLanguageContext } from "/contexts/LanguageContext"
import React, { useEffect, useState } from "react"
import { FormControl } from "@material-ui/core"

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
  error?: ApolloError
}

interface GraphProps {
  values: GraphEntry[]
  loading?: boolean
  error?: ApolloError
  label?: string
  updated_at?: string
}

interface Filter {
  name: string
  label: string
}

function useGraphFilter(values: GraphEntry[]) {
  const getFilters = (_values: GraphEntry[]) =>
    _values.map((v) => ({ name: v.name, label: v.label }))
  const calculateSeries = (_values: GraphEntry[]) =>
    _values.map((value) => ({
      name: value.label,
      data: (value?.value?.data ?? []).map((e) => ({
        x: new Date(DateTime.fromISO(e.date).toJSDate()).getTime(),
        y: e.value,
      })),
    }))

  const getLoading = (_values: GraphEntry[]) =>
    _values.map((v) => v.loading ?? false)
  const filterValues = getFilters(values)
  const [filter, setFilter] = useState<Filter[]>(filterValues)
  const [series, setSeries] = useState(calculateSeries(values))
  const [loading, setLoading] = useState(getLoading(values))

  useEffect(() => {
    setSeries(calculateSeries(values))
    setLoading(getLoading(values))
  }, [values])
  useEffect(() => {
    const filterNames = filter.map((f) => f.name)
    setSeries(
      calculateSeries(values.filter((v) => filterNames.includes(v.name))),
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

function Graph({ values, loading, error, label, updated_at }: GraphProps) {
  const t = useTranslator(CoursesTranslations)
  const { language } = useLanguageContext()
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [separate, setSeparate] = useState(true)

  console.log(values)
  const {
    filterValues,
    filter,
    setFilter,
    series,
    loading: seriesLoading,
  } = useGraphFilter(values)

  const options: ApexCharts.ApexOptions = {
    stroke: {
      curve: "smooth",
    },
    /*markers: {
      size: [4],
    },*/
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
      id: "group",
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
          </FilterColumn>
        </FilterMenu>
      </Collapse>
      {loading ? (
        <>
          <ChartSkeleton key="page-skeleton-1" />
          <ChartSkeleton key="page-skeleton-2" />
          <ChartSkeleton key="page-skeleton-3" />
        </>
      ) : error ? (
        <Alert severity="error">
          <AlertTitle>Error loading graph</AlertTitle>
          <pre>{JSON.stringify(error, undefined, 2)}</pre>
        </Alert>
      ) : separate ? (
        <div id="wrapper">
          {series.map((s, index) => (
            <div key={`chart-${index}`}>
              {seriesLoading[index] ? (
                <ChartSkeleton key={`skeleton-${index}`} />
              ) : (
                <Chart
                  options={{
                    ...options,
                    colors: [colors[index % colors.length]],
                  }}
                  series={[s]}
                  type="line"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <Chart options={options} series={series} type="line" />
      )}
    </ChartWrapper>
  )
}

export default Graph
