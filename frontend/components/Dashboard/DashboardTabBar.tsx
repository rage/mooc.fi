import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import styled from "styled-components"
import ViewListIcon from "@material-ui/icons/ViewList"
import ScatterplotIcon from "@material-ui/icons/ScatterPlot"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"

const TabContainer = styled.div`
  flex-grow: 1;
  background-color: inherit;
`

const StyledTabs = styled(Tabs)`
  box-shadow: 0 0 0 0;
`

function a11yProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  }
}

interface LinkTabProps {
  label?: string
  href?: string
  icon: any
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      style={{ marginTop: "1rem" }}
      component="a"
      // @ts-ignore
      onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {}}
      {...props}
    />
  )
}

interface DashboardTabsProps {
  slug: string
  selectedValue: number
}

export default function DashboardTabBar(props: DashboardTabsProps) {
  const { slug, selectedValue } = props

  const [value, setValue] = React.useState(selectedValue)

  // @ts-ignore
  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue)
  }

  return (
    <TabContainer>
      <AppBar position="static" style={{ boxShadow: "0 0 0 0" }}>
        <StyledTabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="course dashboard navi"
        >
          <LinkTab
            label="Course Home"
            icon={<DashboardIcon />}
            href={`/courses/${slug}`}
            {...a11yProps(0)}
          />
          <LinkTab
            label="Completions"
            icon={<ViewListIcon />}
            href={`/courses/${slug}/completions`}
            {...a11yProps(1)}
          />
          <LinkTab
            label="Points"
            icon={<ScatterplotIcon />}
            href={`/courses/${slug}/points`}
            {...a11yProps(2)}
          />
          <LinkTab
            label="Edit"
            icon={<EditIcon />}
            href={`/courses/${slug}/edit`}
            {...a11yProps(3)}
          />
        </StyledTabs>
      </AppBar>
    </TabContainer>
  )
}
