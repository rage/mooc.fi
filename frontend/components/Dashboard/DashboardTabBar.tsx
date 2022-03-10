import { ChangeEvent, useContext, useState } from "react"

import LanguageContext from "/contexts/LanguageContext"
import { useRouter } from "next/router"

import styled from "@emotion/styled"
import DashboardIcon from "@mui/icons-material/Dashboard"
import EditIcon from "@mui/icons-material/Edit"
import EqualizerIcon from "@mui/icons-material/Equalizer"
import ScatterplotIcon from "@mui/icons-material/ScatterPlot"
import ViewListIcon from "@mui/icons-material/ViewList"
import AppBar from "@mui/material/AppBar"
import Tab from "@mui/material/Tab"
import Tabs from "@mui/material/Tabs"

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
  max-width: 800px;
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
    label: "Statistics",
    icon: <EqualizerIcon />,
    path: "/statistics",
  },
  {
    label: "Edit",
    icon: <EditIcon />,
    path: "/edit",
  },
]

export default function DashboardTabBar(props: DashboardTabsProps) {
  const { slug, selectedValue } = props
  const { language } = useContext(LanguageContext)
  const [value, setValue] = useState(selectedValue)
  const router = useRouter()

  function handleChange(_: ChangeEvent<{}>, newValue: number) {
    setValue(newValue)
    router.push(`/${language}/courses/${slug}${routes[newValue].path}`)
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
            {routes.map(({ label, icon }, index) => (
              <Tab
                key={index}
                value={index}
                label={label}
                icon={icon}
                style={{ marginTop: "1rem", color: "unset" }}
                {...a11yProps(index)}
              />
            ))}
          </StyledTabs>
        </TabContainer>
      </AppBar>
    </TabBarContainer>
  )
}
