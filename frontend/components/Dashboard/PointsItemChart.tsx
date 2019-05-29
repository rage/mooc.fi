import React from "react"
import { VictoryChart, VictoryBar, VictoryAxis } from "victory"

function PointsItemChart() {
  return (
    <VictoryChart
      height={75}
      padding={{ top: 1, bottom: 45, left: 3, right: 3 }}
    >
      <VictoryBar
        horizontal
        style={{ data: { fill: "#c43a31" } }}
        data={[{ y: 12, x: 0.2 }]}
        barWidth={15}
        domain={{ y: [0, 15], x: [0, 0.5] }}
      />
      <VictoryAxis
        dependentAxis
        label="Points awarded from total points possible"
      />
    </VictoryChart>
  )
}

export default PointsItemChart
