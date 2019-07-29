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

interface LinkTabProps {
  label: string
  href: string
  disabled?: boolean
  icon: any
}
function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component="a"
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        event.preventDefault()
      }}
      {...props}
    />
  )
}
interface Props {
  value: number
  handleChange: (event: React.ChangeEvent<{}>, value: number) => void
  courseSlug: string | undefined | string[]
}
function DashboardTabBar(props: Props) {
  const classes = useStyles()
  const { value, handleChange, courseSlug } = props

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
      <LinkTab
        icon={<DashboardIcon />}
        label="Course home"
        href={`courses/${courseSlug}`}
      />
      <LinkTab
        icon={<ViewListIcon />}
        label="Completions"
        href={`courses/${courseSlug}/completions`}
      />
      <LinkTab
        icon={<ScatterplotIcon />}
        label="Points"
        href={`courses/${courseSlug}/points`}
      />
    </Tabs>
  )
}

export default DashboardTabBar
