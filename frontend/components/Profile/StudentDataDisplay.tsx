import React, { useState } from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"
import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`completions-points-${index}`}
      aria-labelledby={`completions-points-tab-${index}`}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}
interface StudentDataDisplayProps {
  completions: any[]
}
const StudentDataDisplay = (props: StudentDataDisplayProps) => {
  const { completions } = props
  const [tabOpen, setTabOpen] = useState(0)
  //@ts-ignore
  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabOpen(newValue)
  }
  return (
    <>
      <Tabs
        value={tabOpen}
        onChange={handleTabChange}
        aria-label="tab to select if viewing points or completions"
      >
        <Tab
          label="Points"
          id="completions-points-tab-0"
          aria-controls="completions-points-tab-0"
        />
        <Tab
          label="Completions"
          id="completions-points-tab-1"
          aria-controls="completions-points-tab-1"
        />
      </Tabs>
      <TabPanel index={0} value={tabOpen}>
        <ProfilePointsDisplay />
      </TabPanel>
      <TabPanel index={1} value={tabOpen}>
        <ProfileCompletionsDisplay completions={completions} />
      </TabPanel>
    </>
  )
}

export default StudentDataDisplay
