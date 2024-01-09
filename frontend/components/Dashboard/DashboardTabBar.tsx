import { SyntheticEvent, useCallback, useState } from "react"

import Router from "next/router"

import DashboardIcon from "@mui/icons-material/Dashboard"
import EditIcon from "@mui/icons-material/Edit"
import ScatterplotIcon from "@mui/icons-material/ScatterPlot"
import ViewListIcon from "@mui/icons-material/ViewList"
import { AppBar, Tab, Tabs } from "@mui/material"
import { styled } from "@mui/material/styles"

const TabBarContainer = styled("div")`
  flex-grow: 1;
  background-color: inherit;
`

const StyledTabs = styled(Tabs)`
  box-shadow: 0 0 0 0;
`

const TabContainer = styled("div")`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`

const TabBar = styled(AppBar)`
  box-shadow: 0 0 0 0;
`

const StyledTab = styled(Tab)`
  margin-top: 1rem;
` as typeof Tab

interface DashboardTabsProps {
  slug: string
  selectedValue: number
}

interface Route {
  label: string
  icon: React.JSX.Element
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

function DashboardTabBar(props: DashboardTabsProps) {
  const { slug, selectedValue } = props
  const [value, setValue] = useState(selectedValue)

  const handleChange = useCallback(
    (_: SyntheticEvent<Element, Event>, newValue: number) => {
      setValue(newValue)
      Router.push(`/admin/courses/${slug}${routes[newValue].path}`)
    },
    [slug],
  )

  return (
    <TabBarContainer>
      <TabBar position="static">
        <TabContainer>
          <StyledTabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            textColor="primary"
            indicatorColor="secondary"
            aria-label="course dashboard navi"
          >
            {routes.map(({ label, icon }, index) => (
              <StyledTab
                key={label}
                value={index}
                label={label}
                icon={icon}
                id={`nav-tab-${index}`}
                aria-controls={`nav-tabpanel-${index}`}
              />
            ))}
          </StyledTabs>
        </TabContainer>
      </TabBar>
    </TabBarContainer>
  )
}

export default DashboardTabBar
