// TODO/FIXME: don't have these types generated as we're not querying them, fix when applicable
// import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import React from "react"

import { CardTitle } from "/components/Text/headers"

import styled from "@emotion/styled"
import { Card, Typography } from "@mui/material"

interface VerifiedUserProps {
  data: any // ProfileUserOverView_currentUser_verified_users
}

const VerifiedUserCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
`

const VerifiedUserCardTitle = styled(CardTitle)`
  display: flex;
  justify-content: space-between;
`

function VerifiedUser({ data }: VerifiedUserProps) {
  return (
    <VerifiedUserCard>
      <VerifiedUserCardTitle variant="section">
        <Typography variant="h3">
          {data?.organization?.organization_translations[0].name}
        </Typography>
        <Typography variant="h3">{data?.personal_unique_code}</Typography>
      </VerifiedUserCardTitle>
    </VerifiedUserCard>
  )
}

export default VerifiedUser
