import { Paper, Button } from "@mui/material"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import styled from "@emotion/styled"
import VerifiedUser from "./VerifiedUser"
import LaunchIcon from "@mui/icons-material/Launch"
import Link from "next/link"
import { useLanguageContext } from "/contexts/LanguageContext"
// import axios from "axios"
// import { getAccessToken } from "/lib/authentication"

const isProduction = process.env.NODE_ENV === "production"

interface VerifiedUsersProps {
  data?: ProfileUserOverView_currentUser_verified_users[]
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
  const { language } = useLanguageContext()

  const HY_CONNECT_URL = isProduction
    ? `https://mooc.fi/connect/hy?language=${language}`
    : `http://localhost:5000/hy?language=${language}`
  const HAKA_CONNECT_URL = isProduction
    ? `https://mooc.fi/connect/haka?language=${language}`
    : `http://localhost:5000/haka?language=${language}`

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
        <Link href={HY_CONNECT_URL}>
          <Button color="primary" startIcon={<LaunchIcon />}>
            Connect to HY
          </Button>
        </Link>
      )}
      <Link href={HAKA_CONNECT_URL}>
        <Button color="secondary" startIcon={<LaunchIcon />}>
          Connect to another organization
        </Button>
      </Link>
    </Container>
  )
}

export default VerifiedUsers
