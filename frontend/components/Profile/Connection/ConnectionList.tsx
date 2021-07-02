import { Paper } from "@material-ui/core"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import styled from "@emotion/styled"
import ConnectionEntry from "./ConnectionEntry"
import ConnectionButtons from "./ConnectionButtons"

interface ConnectionListProps {
  data?: ProfileUserOverView_currentUser_verified_users[]
  onDisconnect: (_: ProfileUserOverView_currentUser_verified_users) => void
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

function ConnectionList({ data = [], onDisconnect }: ConnectionListProps) {
  const isConnected = (organization: string) =>
    Boolean(
      data.find(
        (verified_user) => verified_user?.home_organization === organization,
      ),
    )

  return (
    <Container>
      {data.map((verified_user) => (
        <ConnectionEntry 
          key={verified_user.id} 
          data={verified_user} 
          onDisconnect={onDisconnect}
        />
      ))}
      <ConnectionButtons
        hyVisible={!isConnected("helsinki.fi")}
      />
    </Container>
  )
}

export default ConnectionList
