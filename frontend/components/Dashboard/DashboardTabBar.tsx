import React from "react"
import { Tabs, Tab } from "@material-ui/core"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import ViewListIcon from "@material-ui/icons/ViewList"
import ScatterplotIcon from "@material-ui/icons/ScatterPlot"
import DashboardIcon from "@material-ui/icons/Dashboard"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      backgroundColor: "#6d1b7b",
      color: "white",
    },
  }),
)
interface Props {
  value: number
  handleChange: (event: React.ChangeEvent<{}>, value: number) => void
}
function DashboardTabBar(props: Props) {
  const classes = useStyles()
  const { value, handleChange } = props
  return (
    <Tabs
      indicatorColor="primary"
      value={value}
      onChange={handleChange}
      className={classes.tabs}
      variant="fullWidth"
      centered
    >
      {" "}
      <Tab icon={<DashboardIcon />} label="Dashboard" wrapped />
      <Tab icon={<ViewListIcon />} label="Completions" wrapped />
      <Tab icon={<ScatterplotIcon />} label="Points" wrapped />
    </Tabs>
  )
}

export default DashboardTabBar
