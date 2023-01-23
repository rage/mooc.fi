import { SyntheticEvent, useState } from "react"

import { useRouter } from "next/router"

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

function a11yProps(index: any) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`,
  }
}

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
  const router = useRouter()

  function handleChange(_: SyntheticEvent<Element, Event>, newValue: number) {
    setValue(newValue)
    router.push(`/courses/${slug}${routes[newValue].path}`)
  }

  return (
    <TabBarContainer>
      <TabBar position="static">
        <TabContainer>
          <StyledTabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            aria-label="course dashboard navi"
          >
            {routes.map(({ label, icon }, index) => (
              <StyledTab
                key={index}
                value={index}
                label={label}
                icon={icon}
                {...a11yProps(index)}
              />
            ))}
          </StyledTabs>
        </TabContainer>
      </TabBar>
    </TabBarContainer>
  )
}
