import { Skeleton, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

import InfoRow, { InfoRowContainer } from "./InfoRow"
import Container from "/components/Container"
import { useTranslator } from "/hooks/useTranslator"
import { Translator } from "/translations"
import UsersTranslations from "/translations/users"
import { isDefinedAndNotEmpty } from "/util/guards"

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

const getAvailableFields = (
  t: Translator<typeof UsersTranslations.en>,
): Partial<
  Record<keyof UserDetailedFieldsFragment, string | FieldWithGetter>
> => ({
  upstream_id: t("upstream_id"),
  email: t("email"),
  real_student_number: t("real_student_number"),
  student_number: t("student_number"),
  id: t("id"),
  username: t("username"),
  research_consent: {
    title: t("researchConsent"),
    getValue: (data) => (data ? t("yes") : t("no")),
  },
})

const renderAvailableFields = (
  data: UserDetailedFieldsFragment,
  t: Translator<typeof UsersTranslations.en>,
) => {
  const availableFields = getAvailableFields(t)
  return fields
    .filter(
      (field) => field in availableFields && isDefinedAndNotEmpty(data[field]),
    )
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
    .filter(isDefinedAndNotEmpty)
}

function UserInfo({ data }: UserInfoProps) {
  const t = useTranslator(UsersTranslations)

  if (!data?.full_name) {
    return <UserInfoSkeleton />
  }

  return (
    <UserInfoContainer>
      <Title variant="h1">{data.full_name}</Title>
      {renderAvailableFields(data, t)}
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
