// import { Paper } from "@material-ui/core"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
// import styled from "@emotion/styled"
import ConnectionEntry from "./ConnectionEntry"
import ConnectionButtons from "./ConnectionButtons"
import React from "react"
import { Typography } from "@material-ui/core"

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
  const isConnected = (organization: string) =>
    Boolean(
      data.find(
        (verified_user) => verified_user?.home_organization === organization,
      ),
    )

  return (
    <>
      <section>
        <h1>
          Connecting your MOOC.fi profile to learning institution accounts
        </h1>

        <p>
          On this page, you can connect your MOOC.fi account to any institution
          accounts you might have, or disconnect your accounts.
        </p>
      </section>
      <section>
        <Typography variant="h4">Existing connections</Typography>
        {data.map((verified_user) => (
          <ConnectionEntry
            key={verified_user.id}
            data={verified_user}
            onDisconnect={onDisconnect}
          />
        ))}
      </section>
      <ConnectionButtons hyVisible={!isConnected("helsinki.fi")} />
    </>
  )
}

export default ConnectionList
