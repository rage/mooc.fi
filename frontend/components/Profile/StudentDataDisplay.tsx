import { PropsWithChildren } from "react"

import useDisconnect from "/components/Profile/OrganizationConnection/useDisconnect"
import ProfileSettings from "/components/Profile/ProfileSettings"
import { CurrentUserUserOverView_currentUser } from "/static/types/generated/CurrentUserUserOverView"
import notEmpty from "/util/notEmpty"
import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"

import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

import OrganizationConnectionList from "./OrganizationConnection/OrganizationConnectionList"

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
  data?: CurrentUserUserOverView_currentUser
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
          origin="profile"
        />
      </TabPanel>
      <TabPanel index={3} value={tab}>
        <ProfileSettings data={data} />
      </TabPanel>
    </>
  )
}

export default StudentDataDisplay
