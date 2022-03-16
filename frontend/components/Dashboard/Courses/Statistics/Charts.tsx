import { useCallback, useMemo } from "react"

import { Series } from "/components/Dashboard/Courses/Statistics/types"
import { useLanguageContext } from "/contexts/LanguageContext"
import { DateTime } from "luxon"
import dynamic from "next/dynamic"

import { ApolloError } from "@apollo/client"
import { Alert, AlertTitle, Skeleton } from "@mui/material"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const getChartName = (s: Series) =>
  Array.isArray(s) ? s.map((s2) => s2.name).join("-") : s.name

const colors = [
  "rgba(0, 143, 251, 0.85)",
  "rgba(0, 27,150,0.85)",
  "rgba(254,176,25,0.85)",
  "#F44336",
  "#E91E63",
  "#9C27B0",
]

interface ChartsProps {
  series: Series[]
  error?: ApolloError
  loading?: boolean
  separate: boolean
  seriesLoading: boolean[]
}

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

function Charts({
  loading,
  error,
  separate,
  series,
  seriesLoading,
}: ChartsProps) {
  const { language } = useLanguageContext()

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
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
            return DateTime.fromMillis(Number(timestamp) ?? 0).toLocaleString(
              {},
              {
                locale: language ?? "en",
              },
            )
          },
        },
        tickPlacement: "on",
      },
      chart: {
        animations: {
          enabled: false,
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
    }),
    [language],
  )

  const chartOptions = useCallback(
    () =>
      series.map((_, index) => ({
        ...options,
        colors: colors
          .slice(index % colors.length)
          .concat(colors.slice(0, index % colors.length)),
        chart: {
          ...options.chart,
          id: `chart-${index}`,
        },
      })),
    [series],
  )

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

export default Charts
