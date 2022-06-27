import { PropsWithChildren } from "react"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"

import ProfileSettings from "/components/Profile/ProfileSettings"
import { ProfileUserOverView_currentUser } from "/static/types/generated/ProfileUserOverView"
import notEmpty from "/util/notEmpty"

interface TabPanelProps {
  index: any
  value: any
}

const TabPanel = ({
  value,
  index,
  children,
}: PropsWithChildren<TabPanelProps>) => (
  <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`user-profile-${index}`}
    aria-labelledby={`user-profile-tab-${index}`}
  >
    <Box sx={{ p: 3 }}>{children}</Box>
  </Typography>
)

interface StudentDataDisplayProps {
  tab: number
  data?: ProfileUserOverView_currentUser
}

const StudentDataDisplay = ({ tab, data }: StudentDataDisplayProps) => {
  const { completions = [] } = data || {}

  return (
    <>
      <TabPanel index={0} value={tab}>
        {tab !== 0 ? <div /> : <ProfilePointsDisplay />}
      </TabPanel>
      <TabPanel index={1} value={tab}>
        {tab !== 1 ? (
          <div />
        ) : (
          <ProfileCompletionsDisplay
            completions={completions?.filter(notEmpty) ?? []}
          />
        )}
      </TabPanel>
      <TabPanel index={2} value={tab}>
        {tab !== 2 ? <div /> : <ProfileSettings data={data} />}
      </TabPanel>
    </>
  )
}

export default StudentDataDisplay
