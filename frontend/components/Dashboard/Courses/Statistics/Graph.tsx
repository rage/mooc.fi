
import { Line } from "react-chartjs-2"

type GraphData = Array<{
  value: number | null
  date: string
}>

interface GraphProps {
  data?: GraphData | null
  label: string
}

function Graph({
  data = [],
  label
}: GraphProps) {
  const chartData = {
    labels: (data ?? []).map((e) => e.date),
    datasets: [{
      label,
      data: (data ?? []).map((e) => e.value),
    }],
  }

  const options = {
    scales: {
      xAxes: [{
        type: "time",
        time: { 
          displayFormats: {
            hour: 'hA MMM D'
        },
        parser: "yyyy-MM-ddTHH:mm:ss.msZ"}
      }]
    }
  }

  return (
    <Line data={chartData} options={options} type="line" />
  )
}

export default Graph
