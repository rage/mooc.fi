import { Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import Container from "/components/Container"

import { UserDetailedFieldsFragment } from "/graphql/generated"

const UserInfoContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Title = styled(Typography)``

const Subtitle = styled(Typography)``

// @ts-ignore: not used for now
const UserInfoContent = styled("div")`
  display: flex;
  max-width: 80vw;
`

interface UserInfoProps {
  data?: UserDetailedFieldsFragment | null
}

export default function UserInfo({ data }: UserInfoProps) {
  if (!data) {
    return <UserInfoSkeleton />
  }

  return (
    <UserInfoContainer>
      <Title variant="h1">{data.full_name}</Title>
      <Subtitle variant="subtitle1">{data.email}</Subtitle>
      {/*<UserInfoContent>{JSON.stringify(data, null, 2)}</UserInfoContent>*/}
    </UserInfoContainer>
  )
}

const UserInfoSkeleton = () => (
  <UserInfoContainer>
    <Title variant="h1">
      <Skeleton width={300} />
    </Title>
    <Subtitle variant="subtitle1">
      <Skeleton width={100} height={40} />
    </Subtitle>
    {/*<UserInfoContent><Skeleton width={200} /></UserInfoContent>*/}
  </UserInfoContainer>
)
