import { useContext, useState, ChangeEvent } from "react"
import AppBar from "@material-ui/core/AppBar"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import styled from "styled-components"
import ViewListIcon from "@material-ui/icons/ViewList"
import ScatterplotIcon from "@material-ui/icons/ScatterPlot"
import DashboardIcon from "@material-ui/icons/Dashboard"
import EditIcon from "@material-ui/icons/Edit"
import LanguageContext from "/contexes/LanguageContext"

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
  margin 0 auto;
`

const A = styled.a`
  color: unset;
`

interface LinkTabProps {
  label?: string
  href: string
  as: string
  icon: any
}

function LinkTab(props: LinkTabProps) {
  return (
    // TODO: using LangLink here does not work with the points tab in production.
    <A href={props.as}>
      <Tab style={{ marginTop: "1rem" }} component="div" {...props} />
    </A>
  )
}

interface DashboardTabsProps {
  slug: string
  selectedValue: number
}

export default function DashboardTabBar(props: DashboardTabsProps) {
  const { slug, selectedValue } = props
  const { language } = useContext(LanguageContext)
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
            aria-label="course dashboard navi"
          >
            <LinkTab
              label="Course Home"
              icon={<DashboardIcon />}
              as={`/${language}/courses/${slug}`}
              href={"/[lng]/courses/[slug]"}
              {...a11yProps(0)}
            />
            <LinkTab
              label="Completions"
              icon={<ViewListIcon />}
              as={`/${language}/courses/${slug}/completions`}
              href={"/[lng]/courses/[slug]/completions"}
              {...a11yProps(1)}
            />
            <LinkTab
              label="Points"
              icon={<ScatterplotIcon />}
              as={`/${language}/courses/${slug}/points`}
              href={"/[lng]/courses/[slug]/points"}
              {...a11yProps(2)}
            />
            <LinkTab
              label="Edit"
              icon={<EditIcon />}
              as={`/${language}/courses/${slug}/edit`}
              href={" /[lng]/courses/[slug]/edit"}
              {...a11yProps(3)}
            />
          </StyledTabs>
        </TabContainer>
      </AppBar>
    </TabBarContainer>
  )
}
