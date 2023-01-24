import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { CardBody, CardDescription, CardWrapper } from "../Common/Card"

import { CurrentUserQuery } from "/graphql/generated"

const Title = styled(Typography)`
  display: flex;
  justify-content: center;
`

const UserInfoWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: min(2rem, 20%);
`

const InfoRowContainer = styled("div")(
  ({ theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: baseline;
  justify-content: space-between;
  width: 100%;
  overflow-wrap: break-word;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  ${theme.breakpoints.down("xs")} {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
`,
)

const InfoRowTitle = styled(Typography)`
  color: #666;
`

const InfoRowContent = styled(Typography)`
  font-weight: 600;
  overflow: hidden;
  overflow-wrap: break-word;
`

const ProfileCardWrapper = styled(CardWrapper)`
  min-height: unset;
`
interface ProfilePageHeaderProps {
  user: CurrentUserQuery["currentUser"]
}

interface InfoRowProps {
  title: string
  content: string
}

function InfoRow({ title, content }: InfoRowProps) {
  return (
    <InfoRowContainer>
      <InfoRowTitle variant="h4">{title}</InfoRowTitle>
      <InfoRowContent variant="h4">{content}</InfoRowContent>
    </InfoRowContainer>
  )
}

function ProfilePageHeader({ user }: ProfilePageHeaderProps) {
  return (
    <header>
      <Title variant="h1">{user?.full_name}</Title>
      <UserInfoWrapper>
        <ProfileCardWrapper>
          <CardBody>
            <CardDescription>
              <InfoRow title="Email" content={user?.email ?? "-"} />
              <InfoRow
                title="Student number"
                content={user?.student_number ?? "-"}
              />
            </CardDescription>
          </CardBody>
        </ProfileCardWrapper>
      </UserInfoWrapper>
    </header>
  )
}

export default ProfilePageHeader
