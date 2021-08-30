// import { Paper } from "@material-ui/core"
// import styled from "@emotion/styled"
import OrganizationConnectionEntry from "./OrganizationConnectionEntry"
import React from "react"
import { Typography } from "@material-ui/core"
import { useTranslator } from "/util/useTranslator"
import ProfileTranslations from "/translations/profile"
import { CurrentUserUserOverView_currentUser_verified_users } from "/static/types/generated/CurrentUserUserOverView"
import { isProduction } from "/config"
import OrganizationButtons from "/components/OrganizationButtons"
import { useLanguageContext } from "/contexts/LanguageContext"
import { DisconnectFunction } from "/components/Profile/OrganizationConnection/useDisconnect"

interface ConnectionListProps {
  data?: CurrentUserUserOverView_currentUser_verified_users[]
  onDisconnect: DisconnectFunction
}

/*const Container = styled(Paper)`
  margin-bottom: 0.5rem;
  display: flex;
  padding: 0.5rem;
  flex-direction: column;

  * + * {
    margin-bottom: 0.5rem;
  }
`*/

function ConnectionList({ data = [], onDisconnect }: ConnectionListProps) {
  const { language } = useLanguageContext()

  const t = useTranslator(ProfileTranslations)

  const isConnected = (organization: string) =>
    Boolean(
      data.find(
        (verified_user) => verified_user?.home_organization === organization,
      ),
    )

  const HY_CONNECT_URL = isProduction
    ? `/connect/hy?language=${language}`
    : `http://localhost:5000/connect/hy?language=${language}`
  const HAKA_CONNECT_URL = isProduction
    ? `/connect/haka?language=${language}`
    : `http://localhost:5000/connect/haka?language=${language}`

  return (
    <>
      <section>
        <h1>{t("connectTitle")}</h1>
        <p>{t("connectText")}</p>
      </section>
      <section>
        <Typography variant="h4">{t("connectExisting")}</Typography>
        {data.map((verified_user) => (
          <OrganizationConnectionEntry
            key={verified_user.id}
            data={verified_user}
            onDisconnect={onDisconnect}
          />
        ))}
      </section>
      <OrganizationButtons
        hyVisible={!isConnected("helsinki.fi")}
        hyURL={HY_CONNECT_URL}
        hakaURL={HAKA_CONNECT_URL}
      />
    </>
  )
}

export default ConnectionList
