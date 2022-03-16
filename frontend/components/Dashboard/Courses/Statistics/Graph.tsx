import React, { useEffect, useState } from "react"

import CollapseButton from "/components/Buttons/CollapseButton"
// import Charts from "/components/Dashboard/Courses/Statistics/Charts"
import {
  DatedInt,
  Filter,
  Series,
  SeriesEntry,
} from "/components/Dashboard/Courses/Statistics/types"
import { useLanguageContext } from "/contexts/LanguageContext"
import CoursesTranslations from "/translations/courses"
import notEmpty from "/util/notEmpty"
import { useTranslator } from "/util/useTranslator"
import { flatten } from "lodash"
import { DateTime } from "luxon"
import dynamic from "next/dynamic"

// import dynamic from "next/dynamic"
import {
  ApolloError,
  OperationVariables,
  QueryLazyOptions,
} from "@apollo/client"
import styled, { StyledComponent } from "@emotion/styled"
import {
  Button,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  Paper,
  Typography,
} from "@mui/material"

const Charts = dynamic(() => import("./Charts"), { ssr: false })

const ChartWrapper: StyledComponent<any> = styled((props: any[]) => (
  <Paper elevation={3} {...props} />
))`
  padding: 0.5rem;
  row-gap: 1em;
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

const FilterColumn: any = styled(FormControl)``
/*& + ${() => FilterColumn} {
    border-left: 1px ridge grey;
  }*/

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

function useGraphFilter(values: GraphValues[]) {
  const getFilters = (_values: GraphValues[]) =>
    flatten(
      _values.map((v) => {
        if (Array.isArray(v)) {
          return v.map((v2) => ({ name: v2.name, label: v2.label }))
        }
        return { name: v.name, label: v.label }
      }),
    )

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
      if (Array.isArray(v))
        return v.reduce((acc, curr) => acc || (curr.loading ?? false), false)

      return v.loading ?? false
    })

  const onFilterChange = (filterValue: Filter) => (_: any, checked: boolean) =>
    checked
      ? setFilter((prev) => prev.concat(filterValue))
      : setFilter((prev) => prev.filter((f) => f.name !== filterValue.name))

  const isChecked = (filterValue: Filter) =>
    filter.map((f) => f.name).includes(filterValue.name)

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
    console.log(filterNames)
    const tmp = values
      .map((v) => {
        if (Array.isArray(v)) {
          const arr = v.filter((v2) => filterNames.includes(v2.name))
          return arr.length > 0 ? arr : undefined
        }

        return filterNames.includes(v.name) ? v : undefined
      })
      .filter(notEmpty)

    console.log("temp", tmp)
    setSeries(calculateSeries(tmp))
  }, [filter])

  return {
    filterValues,
    filter,
    setFilter,
    series,
    loading,
    isChecked,
    onFilterChange,
  }
}

function Graph({ values, loading, error, label, updated_at }: GraphProps) {
  const t = useTranslator(CoursesTranslations)
  const { language } = useLanguageContext()
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [separate, setSeparate] = useState(true)

  const {
    filterValues,
    series,
    loading: seriesLoading,
    isChecked,
    onFilterChange,
  } = useGraphFilter(values)

  console.log("series", series)

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
                    checked={isChecked(filterValue)}
                    onChange={onFilterChange(filterValue)}
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

export default Graph
