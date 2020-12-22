import { useState, useContext, PropsWithChildren, ChangeEvent } from "react"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import ProfilePointsDisplay from "components/Profile/ProfilePointsDisplay"
import ProfileCompletionsDisplay from "components/Profile/ProfileCompletionsDisplay"
import { ProfileUserOverView_currentUser } from "/static/types/generated/ProfileUserOverView"
import ProfileSettings from "/components/Profile/ProfileSettings"
import getProfileTranslator from "/translations/profile"
import LanguageContext from "/contexes/LanguageContext"
import Warning from "@material-ui/icons/Warning"
import styled from "styled-components"
import notEmpty from "/util/notEmpty"

const ConsentNotification = styled.div`
  display: flex;
  padding: 6px 16px;
  line-height: 1.43;
  border-radius: 4px;
  letter-spacing: 0.01071em;
  background-color: rgb(255, 244, 229);
`

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
  data?: ProfileUserOverView_currentUser
}

const StudentDataDisplay = ({ data }: StudentDataDisplayProps) => {
  const { language } = useContext(LanguageContext)
  const t = getProfileTranslator(language)

  const { completions = [], research_consent } = data || {}
  const [tabOpen, setTabOpen] = useState(0)

  const handleTabChange = (_event: ChangeEvent<{}>, newValue: number) => {
    setTabOpen(newValue)
  }

  return (
    <>
      {(research_consent === null ||
        typeof research_consent === "undefined") && (
        <ConsentNotification>
          <Warning />
          {t("researchNotification")}
        </ConsentNotification>
      )}
      <Tabs
        value={tabOpen}
        onChange={handleTabChange}
        aria-label={t("tabAriaLabel")}
      >
        <Tab
          label={t("tabPoints")}
          id="user-profile-tab-0"
          aria-controls="user-profile-tab-0"
        />
        <Tab
          label={t("tabCompletions")}
          id="user-profile-tab-1"
          aria-controls="user-profile-tab-1"
        />
        <Tab
          label={t("tabSettings")}
          id="user-profile-tab2"
          aria-controls="user-profile-tab2"
        />
      </Tabs>
      <TabPanel index={0} value={tabOpen}>
        <ProfilePointsDisplay />
      </TabPanel>
      <TabPanel index={1} value={tabOpen}>
        <ProfileCompletionsDisplay
          completions={completions?.filter(notEmpty) ?? []}
        />
      </TabPanel>
      <TabPanel index={2} value={tabOpen}>
        <ProfileSettings data={data} />
      </TabPanel>
    </>
  )
}

export default StudentDataDisplay
