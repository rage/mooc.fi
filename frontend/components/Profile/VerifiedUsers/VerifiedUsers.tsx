import { Paper, Button } from "@material-ui/core"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import styled from "@emotion/styled"
import VerifiedUser from "./VerifiedUser"
import LaunchIcon from "@material-ui/icons/Launch"
import Link from "next/link"
import { useLanguageContext } from "/contexts/LanguageContext"
// import axios from "axios"
// import { getAccessToken } from "/lib/authentication"

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
        <Link
          href={`https://mooc.fi/connect/hy-post-login?language=${language}`}
        >
          <Button color="primary" startIcon={<LaunchIcon />}>
            Connect to HY
          </Button>
        </Link>
      )}
      <Button color="secondary" startIcon={<LaunchIcon />}>
        Connect to another organization
      </Button>
    </Container>
  )
}

export default VerifiedUsers
