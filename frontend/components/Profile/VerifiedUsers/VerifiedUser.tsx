import { Card, Button, Typography } from "@material-ui/core"
import styled from "@emotion/styled"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import React from "react"
import { CardTitle } from "/components/Text/headers"
import { useConfirm } from "material-ui-confirm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faUnlink
} from "@fortawesome/free-solid-svg-icons"
interface VerifiedUserProps {
  data: ProfileUserOverView_currentUser_verified_users
  onDisconnect: (_: ProfileUserOverView_currentUser_verified_users) => void
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

function VerifiedUser({ data, onDisconnect }: VerifiedUserProps) {
  const confirm = useConfirm()

  return (
    <VerifiedUserCard>
      <VerifiedUserCardTitle variant="section">
        <Typography variant="h3">{data?.home_organization}</Typography>
        <Typography variant="h3">{data?.personal_unique_code}</Typography>
        <Button
          onClick={() => {
            confirm({
              title: "About to disconnect your account",
              description: `Are you sure you want to disconnect your account from ${data?.home_organization}?`,
              confirmationText: "Yes",
              cancellationText: "No"
            })
              .then(() => onDisconnect(data))
          }}
          startIcon={<FontAwesomeIcon icon={faUnlink} />}
          color="secondary"
        >
          Disconnect
        </Button>
      </VerifiedUserCardTitle>
    </VerifiedUserCard>
  )
}

export default VerifiedUser
