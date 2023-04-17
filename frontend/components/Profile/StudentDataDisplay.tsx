import { PropsWithChildren } from "react"

import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"

import { Box, Typography } from "@mui/material"

import ProfileSettings from "/components/Profile/ProfileSettings"

import { UserOverviewFieldsFragment } from "/graphql/generated"

interface TabPanelProps {
  index: number
  value: number
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
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </Typography>
)

interface StudentDataDisplayProps {
  tab: number
  data?: UserOverviewFieldsFragment
}

const StudentDataDisplay = ({ tab, data }: StudentDataDisplayProps) => {
  const { completions = [] } = data ?? {}

  return (
    <>
      <TabPanel index={0} value={tab}>
        <ProfilePointsDisplay />
      </TabPanel>
      <TabPanel index={1} value={tab}>
        <ProfileCompletionsDisplay completions={completions ?? []} />
      </TabPanel>
      <TabPanel index={2} value={tab}>
        <ProfileSettings data={data} />
      </TabPanel>
    </>
  )
}

export default StudentDataDisplay
