import React from "react"

function PointsItemChart() {
  return (
    <div
      style={{
        width: "95%",
        marginTop: "1em",
      }}
    >
      <div
        style={{
          width: `${30 / 42}%`,
          backgroundColor: "#ffc400",
          padding: "1em",
        }}
      >
        Points/Total: 30/42
      </div>
    </div>
  )
}

export default PointsItemChart
