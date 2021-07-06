import { useState, ChangeEvent } from "react"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import styled from "@emotion/styled"
import ViewListIcon from "@material-ui/icons/ViewList"
import ScatterplotIcon from "@material-ui/icons/ScatterPlot"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import LangLink from "/components/LangLink"

const TabBarContainer = styled.div`
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

const TabContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`

interface DashboardTabsProps {
  slug: string
  selectedValue: number
}

interface Route {
  label: string
  icon: JSX.Element
  path: string
}

const routes: Route[] = [
  {
    label: "Course Home",
    icon: <DashboardIcon />,
    path: "/",
  },
  {
    label: "Completions",
    icon: <ViewListIcon />,
    path: "/completions",
  },
  {
    label: "Points",
    icon: <ScatterplotIcon />,
    path: "/points",
  },
  {
    label: "Edit",
    icon: <EditIcon />,
    path: "/edit",
  },
]

export default function DashboardTabBar(props: DashboardTabsProps) {
  const { slug, selectedValue } = props
  const [value, setValue] = useState(selectedValue)

  function handleChange(_: ChangeEvent<{}>, newValue: number) {
    setValue(newValue)
  }

  return (
    <TabBarContainer>
      <AppBar position="static" style={{ boxShadow: "0 0 0 0" }}>
        <TabContainer>
          <StyledTabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            aria-label="course dashboard navi"
          >
            {routes.map(({ label, icon, path }, index) => (
              <LangLink
                href={`/courses/${slug}${path}`}
                passHref
                prefetch={false}
              >
                <Tab
                  key={index}
                  value={index}
                  label={label}
                  icon={icon}
                  style={{ marginTop: "1rem", color: "unset" }}
                  {...a11yProps(index)}
                />
              </LangLink>
            ))}
          </StyledTabs>
        </TabContainer>
      </AppBar>
    </TabBarContainer>
  )
}
