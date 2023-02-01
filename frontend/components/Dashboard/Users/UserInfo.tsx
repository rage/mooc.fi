import { useCallback, useState } from "react"

import ClipboardIcon from "@fortawesome/fontawesome-free/svgs/regular/clipboard.svg?icon"
import CheckIcon from "@fortawesome/fontawesome-free/svgs/solid/check.svg?icon"
import { IconButton, Skeleton, Tooltip, Typography } from "@mui/material"
import { css, styled } from "@mui/material/styles"

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

const iconStyle = css`
  fill: #666;
  height: 1rem;
  transition: all 1s ease-ease-in-out;
`

interface InfoRowProps {
  title: string
  content: string
}

const InfoRowContainer = styled("div")`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: baseline;
  width: 80%;
`

const InfoRowTitle = styled(Typography)`
  color: #666;
`

const InfoRowContent = styled(Typography)`
  margin-left: auto;
  font-weight: 600;
`

const isClipboardSupported =
  typeof window !== "undefined" && navigator?.clipboard

const StyledIconButton = styled(IconButton)`
  transition: all 1s ease-ease-in-out;
`

const InfoRow = ({ title, content }: InfoRowProps) => {
  const [isCopied, setIsCopied] = useState(false)

  const onCopyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    })
  }, [content])

  return (
    <InfoRowContainer>
      <InfoRowTitle variant="h4">{title}</InfoRowTitle>
      <InfoRowContent variant="h4">{content}</InfoRowContent>
      {isClipboardSupported && (
        <Tooltip title={isCopied ? "Copied!" : "Copy to clipboard"}>
          <StyledIconButton onClick={onCopyToClipboard}>
            {isCopied ? (
              <CheckIcon css={iconStyle} />
            ) : (
              <ClipboardIcon css={iconStyle} />
            )}
          </StyledIconButton>
        </Tooltip>
      )}
    </InfoRowContainer>
  )
}
interface UserInfoProps {
  data?: UserDetailedFieldsFragment | null
}

const fields: (keyof UserDetailedFieldsFragment)[] = [
  "upstream_id",
  "email",
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
      return <InfoRow title={title} content={content} />
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
