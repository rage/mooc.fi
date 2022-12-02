// import { ProfileUserOverView_currentUser_verified_users } from "/graphql/generated/ProfileUserOverView"
import React from "react"

import { Card, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { CardTitle } from "/components/Text/headers"

// FIXME/DELETE: we don't have the verified user thing implemented for now so these types aren't generated
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
` as typeof CardTitle

function VerifiedUser({ data }: VerifiedUserProps) {
  return (
    <VerifiedUserCard>
      <VerifiedUserCardTitle component="section">
        <Typography variant="h3">
          {data?.organization?.organization_translations[0].name}
        </Typography>
        <Typography variant="h3">{data?.personal_unique_code}</Typography>
      </VerifiedUserCardTitle>
    </VerifiedUserCard>
  )
}

export default VerifiedUser
