// import { ProfileUserOverView_currentUser_verified_users } from "/graphql/generated/ProfileUserOverView"
import { useRouter } from "next/router"

import LaunchIcon from "@mui/icons-material/Launch"
import { Button, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

import VerifiedUser from "./VerifiedUser"

import { VerifiedUserFieldsFragment } from "/graphql/generated"

// import axios from "axios"
// import { getAccessToken } from "/lib/authentication"

const isProduction = process.env.NODE_ENV === "production"

// FIXME/DELETE: we don't have the verified user thing implemented for now so these types aren't generated
interface VerifiedUsersProps {
  data?: Array<VerifiedUserFieldsFragment> // ProfileUserOverView_currentUser_verified_users[]
}

const Container = styled(Paper)`
  margin-bottom: 0.5rem;
  display: flex;
  padding: 0.5rem;
  flex-direction: column;

  * + * {
    margin-bottom: 0.5rem;
  }
`

function VerifiedUsers({ data }: VerifiedUsersProps) {
  const { locale } = useRouter()

  const HY_CONNECT_URL = isProduction
    ? `https://mooc.fi/connect/hy?language=${locale}`
    : `http://localhost:5000/hy?language=${locale}`
  const HAKA_CONNECT_URL = isProduction
    ? `https://mooc.fi/connect/haka?language=${locale}`
    : `http://localhost:5000/haka?language=${locale}`

  if (!data) {
    return null
  }

  const isConnected = (slug: string) =>
    Boolean(
      data.find((verified_user) => verified_user?.organization?.slug === slug),
    )

  return (
    <Container>
      {data.map((verified_user) => (
        <>
          <VerifiedUser key={verified_user.id} data={verified_user} />
          {/*
        <VerifiedUser
          key={`${verified_user.id}-2`}
          data={verified_user}
        />
        <VerifiedUser
          key={`${verified_user.id}-3`}
          data={verified_user}
        />*/}
        </>
      ))}
      {!isConnected("hy") && (
        <Button
          href={HY_CONNECT_URL}
          color="primary"
          startIcon={<LaunchIcon />}
        >
          Connect to HY
        </Button>
      )}
      <Button
        href={HAKA_CONNECT_URL}
        color="secondary"
        startIcon={<LaunchIcon />}
      >
        Connect to another organization
      </Button>
    </Container>
  )
}

export default VerifiedUsers
