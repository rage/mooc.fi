import { PropsWithChildren } from "react"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"
import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import { ProfileUserOverView_currentUser } from "/static/types/generated/ProfileUserOverView"
import ProfileSettings from "/components/Profile/ProfileSettings"
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
        <ProfilePointsDisplay />
      </TabPanel>
      <TabPanel index={1} value={tab}>
        <ProfileCompletionsDisplay
          completions={completions?.filter(notEmpty) ?? []}
        />
      </TabPanel>
      <TabPanel index={2} value={tab}>
        <ProfileSettings data={data} />
      </TabPanel>
    </>
  )
}

export default StudentDataDisplay
