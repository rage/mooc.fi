import { Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import { CardBody, CardWrapper } from "../Common/Card"

import { CurrentUserQuery } from "/graphql/generated"

const Title = styled(Typography)`
  display: flex;
  justify-content: center;
` as typeof Typography

const UserInfoWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 85%;
  margin: auto;
  max-width: 900px;
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
` as typeof Typography

const InfoRowContent = styled(Typography)`
  font-weight: 600;
  overflow: hidden;
  overflow-wrap: break-word;
` as typeof Typography

const ProfileCardWrapper = styled(CardWrapper)`
  min-height: unset;
`
interface ProfilePageHeaderProps {
  user?: CurrentUserQuery["currentUser"]
}

interface InfoRowProps {
  title: string
  content: string
}

function InfoRow({ title, content }: InfoRowProps) {
  return (
    <InfoRowContainer>
      <InfoRowTitle variant="subtitle1" component="h5">
        {title}
      </InfoRowTitle>
      <InfoRowContent variant="subtitle1" component="h5">
        {content}
      </InfoRowContent>
    </InfoRowContainer>
  )
}

function ProfilePageHeader({ user }: ProfilePageHeaderProps) {
  return (
    <header>
      <Title variant="h2" component="h1">
        {user?.full_name}
      </Title>
      <UserInfoWrapper>
        <ProfileCardWrapper>
          <CardBody>
            <InfoRow title="Email" content={user?.email ?? "-"} />
            <InfoRow
              title="Student number"
              content={user?.student_number ?? "-"}
            />
          </CardBody>
        </ProfileCardWrapper>
      </UserInfoWrapper>
    </header>
  )
}

export default ProfilePageHeader
