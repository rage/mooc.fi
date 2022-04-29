// TODO/FIXME: don't have these types generated as we're not querying them, fix when applicable
// import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import Link from "next/link"
import { useRouter } from "next/router"

import styled from "@emotion/styled"
import LaunchIcon from "@mui/icons-material/Launch"
import { Button, Paper } from "@mui/material"

import VerifiedUser from "./VerifiedUser"

// import axios from "axios"
// import { getAccessToken } from "/lib/authentication"

const isProduction = process.env.NODE_ENV === "production"

interface VerifiedUsersProps {
  data?: any[] // ProfileUserOverView_currentUser_verified_users[]
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

function VerifiedUsers({ data = [] }: VerifiedUsersProps) {
  const { locale } = useRouter()

  const HY_CONNECT_URL = isProduction
    ? `https://mooc.fi/connect/hy?language=${locale}`
    : `http://localhost:5000/hy?language=${locale}`
  const HAKA_CONNECT_URL = isProduction
    ? `https://mooc.fi/connect/haka?language=${locale}`
    : `http://localhost:5000/haka?language=${locale}`

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
        <Link href={HY_CONNECT_URL} passHref>
          <Button color="primary" startIcon={<LaunchIcon />}>
            Connect to HY
          </Button>
        </Link>
      )}
      <Link href={HAKA_CONNECT_URL} passHref>
        <Button color="secondary" startIcon={<LaunchIcon />}>
          Connect to another organization
        </Button>
      </Link>
    </Container>
  )
}

export default VerifiedUsers
