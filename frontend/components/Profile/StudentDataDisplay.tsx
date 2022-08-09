import { PropsWithChildren } from "react"

import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import ProfileSettings from "/components/Profile/ProfileSettings"
import notEmpty from "/util/notEmpty"

import { UserOverviewFieldsFragment } from "/static/types/generated"

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
  data?: UserOverviewFieldsFragment
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
