import React, { PropsWithChildren } from "react"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"
import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import { ProfileUserOverView_currentUser } from "/static/types/generated/ProfileUserOverView"
import ProfileSettings from "/components/Profile/ProfileSettings"
import notEmpty from "/util/notEmpty"
import OrganizationConnectionList from "./OrganizationConnection/OrganizationConnectionList"
import useDisconnect from "/components/Profile/OrganizationConnection/useDisconnect"

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
  const { onDisconnect } = useDisconnect()

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
        <OrganizationConnectionList
          data={data?.verified_users}
          onDisconnect={onDisconnect}
        />
      </TabPanel>
      <TabPanel index={3} value={tab}>
        <ProfileSettings data={data} />
      </TabPanel>
    </>
  )
}

export default StudentDataDisplay
