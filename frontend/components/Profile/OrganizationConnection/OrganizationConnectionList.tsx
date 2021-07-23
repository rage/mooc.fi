// import { Paper } from "@material-ui/core"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
// import styled from "@emotion/styled"
import OrganizationConnectionEntry from "./OrganizationConnectionEntry"
import OrganizationConnectionButtons from "./OrganizationConnectionButtons"
import React from "react"
import { Typography } from "@material-ui/core"
import { useTranslator } from "/util/useTranslator"
import ProfileTranslations from "/translations/profile"

interface ConnectionListProps {
  data?: ProfileUserOverView_currentUser_verified_users[]
  onDisconnect: (_: ProfileUserOverView_currentUser_verified_users) => void
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
  const t = useTranslator(ProfileTranslations)

  const isConnected = (organization: string) =>
    Boolean(
      data.find(
        (verified_user) => verified_user?.home_organization === organization,
      ),
    )

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
      <OrganizationConnectionButtons hyVisible={!isConnected("helsinki.fi")} />
    </>
  )
}

export default ConnectionList
