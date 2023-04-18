import { Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import InfoRow, { InfoRowContainer } from "./InfoRow"
import Container from "/components/Container"
import notEmpty from "/util/notEmpty"

import { UserDetailedFieldsFragment } from "/graphql/generated"

const UserInfoContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const Title = styled(Typography)`
  text-align: center;
  word-break: break-word;
`

interface UserInfoProps {
  data?: UserDetailedFieldsFragment | null
}

const fields: (keyof UserDetailedFieldsFragment)[] = [
  "upstream_id",
  "email",
  "username",
  "real_student_number",
  "student_number",
  "id",
  "research_consent",
]

type FieldWithGetter = {
  title: string
  getValue: (
    data: {
      [Key in keyof UserDetailedFieldsFragment]: UserDetailedFieldsFragment[Key]
    }[keyof UserDetailedFieldsFragment],
  ) => string
}

const isFieldWithGetter = (field: any): field is FieldWithGetter =>
  typeof field === "object" && "getValue" in field

const availableFields: Partial<
  Record<keyof UserDetailedFieldsFragment, string | FieldWithGetter>
> = {
  upstream_id: "TMC id",
  email: "Email",
  real_student_number: "Real student number",
  student_number: "Student number",
  id: "MOOC.fi internal id",
  username: "Username",
  research_consent: {
    title: "Research consent",
    getValue: (data) => (data ? "Yes" : "No"),
  },
}

const renderAvailableFields = (data: UserDetailedFieldsFragment) => {
  return fields
    .filter((field) => field in availableFields && notEmpty(data[field]))
    .map((field) => {
      const availableField = availableFields[field]
      const title = isFieldWithGetter(availableField)
        ? availableField.title
        : availableField
      const content = isFieldWithGetter(availableField)
        ? availableField.getValue(data[field])
        : data[field]

      if (!content || !title) {
        return null
      }
      return <InfoRow key={title} title={title} data={content} copyable />
    })
    .filter(notEmpty)
}

function UserInfo({ data }: UserInfoProps) {
  if (!data?.full_name) {
    return <UserInfoSkeleton />
  }

  return (
    <UserInfoContainer>
      <Title variant="h1">{data.full_name}</Title>
      {renderAvailableFields(data)}
    </UserInfoContainer>
  )
}

const UserInfoSkeleton = () => (
  <UserInfoContainer>
    <Title variant="h1">
      <Skeleton width={300} />
    </Title>
    <InfoRowContainer>
      <Skeleton width="100%" />
    </InfoRowContainer>
    <InfoRowContainer>
      <Skeleton width="100%" />
    </InfoRowContainer>
    <InfoRowContainer>
      <Skeleton width="100%" />
    </InfoRowContainer>
    <InfoRowContainer>
      <Skeleton width="100%" />
    </InfoRowContainer>
  </UserInfoContainer>
)

export default UserInfo
