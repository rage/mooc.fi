import { PropsWithChildren } from "react"

import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"

import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import ProfileSettings from "/components/Profile/ProfileSettings"

import { UserOverviewFieldsFragment } from "/graphql/generated"

interface TabPanelProps {
  index: number
  value: number
}

const TabContainer = styled("div")(
  ({ theme }) => `
  ${theme.spacing(3)};
`,
)

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
    {value === index && <TabContainer>{children}</TabContainer>}
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
