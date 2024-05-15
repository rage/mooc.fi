import { createRef, useEffect, useMemo, useState } from "react"

import { useMutation, useQuery } from "@apollo/client"
import Send from "@mui/icons-material/Send"
import { Link } from "@mui/material"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import { styled } from "@mui/material/styles"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"

import ErrorMessage from "/components/ErrorMessage"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import { updateUserDetails } from "/lib/account"
import withSignedIn from "/lib/with-signed-in"
import HomeTranslations from "/translations/home"
import RegistrationTranslations from "/translations/register"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  AddUserOrganizationDocument,
  CurrentUserUserOrganizationsDocument,
  DeleteUserOrganizationDocument,
  OrganizationDocument,
  RequestNewUserOrganizationJoinConfirmationDocument,
} from "/graphql/generated"

const Container = styled("div")`
  display: grid;
  justify-items: center;
`

const FieldWrapper = styled("div")`
  display: flex;
  margin-bottom: 1rem;
`

const StyledFormControl = styled(FormControl)`
  flex: 1;
`

const StyledButton = styled(Button)`
  margin-left: 1rem !important;
  max-width: 5rem;
  max-height: 3rem;
  svg {
    margin-left: 5px;
  }
`

const Error = styled("div")`
  color: red;
  font-weight: bold;
`

const TextBox = styled("div")`
  max-width: 710px;
  margin: 1rem;
`

const StyledForm = styled("form")`
  display: grid;
  grid-template-columns: 80% 20%;
`

// @ts-ignore: not used for now
const mockOrganization = {
  name: "Helsingin yliopisto",
  hidden: false,
  email: "test@university.xyz",
}

// eslint-disable-next-line complexity
const RegisterToOrganization = () => {
  const { currentUser, admin } = useLoginStateContext()
  const slug = useQueryParameter("slug")
  const t = useTranslator(HomeTranslations, RegistrationTranslations)
  const [confirmationStatus, setConfirmationStatus] = useState("notSent") // notSent, sent, expired, incorrectFormat or confirmed
  const [email, setEmail] = useState("")
  const [consented, setConsented] = useState(false)
  const [organizationalIdentifier, setOrganizationalIdentifier] = useState(
    currentUser?.student_number,
  )
  const formRef = createRef<HTMLFormElement>()
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : ""

  const {
    data: organizationData,
    loading: organizationLoading,
    error: organizationError,
  } = useQuery(OrganizationDocument, { variables: { slug } })
  const {
    data: userOrganizationsData,
    loading: userOrganizationsLoading,
    error: userOrganizationsError,
  } = useQuery(CurrentUserUserOrganizationsDocument)

  const [addUserOrganization] = useMutation(AddUserOrganizationDocument, {
    refetchQueries: [
      {
        query: CurrentUserUserOrganizationsDocument,
      },
    ],
  })

  // const [updateUserOrganization] = useMutation(UpdateUserOrganizationMutation)
  const [deleteUserOrganization] = useMutation(DeleteUserOrganizationDocument, {
    refetchQueries: [
      {
        query: CurrentUserUserOrganizationsDocument,
      },
    ],
  })

  const [requestNewUserOrganizationJoinConfirmation] = useMutation(
    RequestNewUserOrganizationJoinConfirmationDocument,
    {
      refetchQueries: [
        {
          query: CurrentUserUserOrganizationsDocument,
        },
      ],
    },
  )

  useBreadcrumbs([
    {
      translation: "register",
      href: `${baseUrl}/register/${slug}`,
    },
  ])

  const memberships = useMemo(() => {
    if (!userOrganizationsData) {
      return []
    }
    const mSlugs =
      userOrganizationsData.currentUser?.user_organizations
        ?.map((uo) => uo?.organization?.slug)
        .filter(isDefinedAndNotEmpty) ?? []
    return mSlugs
  }, [userOrganizationsData])

  const currentUserOrganizationMembership = useMemo(() => {
    return userOrganizationsData?.currentUser?.user_organizations.find(
      (uo) => uo?.organization?.slug === slug,
    )
  }, [slug, userOrganizationsData])

  useEffect(() => {
    if (!currentUserOrganizationMembership) {
      return
    }

    const isMember = Boolean(currentUserOrganizationMembership?.confirmed)
    const isSentButNotJoined = Boolean(currentUserOrganizationMembership?.id)
    const isExpired =
      new Date().getTime() >
      new Date(currentUserOrganizationMembership?.created_at).getTime() +
      3 * 1000 * 60 * 60 * 24

    if (isMember) {
      setConfirmationStatus("confirmed")
    } else if (isSentButNotJoined && isExpired) {
      setConfirmationStatus("expired")
    } else if (isSentButNotJoined) {
      setConfirmationStatus("sent")
    } else {
      setConfirmationStatus("notSent")
    }
  }, [currentUserOrganizationMembership])

  const handleSubmit = () => {
    const potentialEmail = (
      document.getElementById("email") as HTMLInputElement
    ).value
    const organizationRegex = /^.*..*@.*..*$/
    const orgId = (
      document.getElementById("organizational-identifier") as HTMLInputElement
    ).value

    if (!RegExp(organizationRegex).exec(potentialEmail)) {
      setConfirmationStatus("incorrectFormat")
    } else {
      setEmail(potentialEmail)
      setOrganizationalIdentifier(orgId)
      setConfirmationStatus("sent")
      if (memberships.includes(slug)) {
        resendConfirmationEmail(potentialEmail)
      } else {
        verifyJoiningOrganization(potentialEmail)
      }
    }
  }

  const handleSubmitWithoutEmail = () => {
    const orgId = (
      document.getElementById("organizational-identifier") as HTMLInputElement
    ).value
    setOrganizationalIdentifier(orgId)
    verifyJoiningOrganizationWithoutEmail()
  }

  const verifyJoiningOrganization = async (email: string) => {
    const fieldName = "joined_organizations"
    const fieldValue = [...memberships, slug]
    await updateUserDetails(fieldName, fieldValue)

    await addUserOrganization({
      variables: {
        organization_id: organizationData!.organization!.id,
        organizational_email: email, // TODO: this is given only if we don't want to use the email stored in the account
      },
    })
  }

  const verifyJoiningOrganizationWithoutEmail = async () => {
    const fieldName = "joined_organizations"
    const fieldValue = [...memberships, slug]
    await updateUserDetails(fieldName, fieldValue)

    await addUserOrganization({
      variables: {
        organization_id: organizationData!.organization!.id,
      },
    })
  }

  const resendConfirmationEmail = async (email: string) => {
    const userOrganizationId =
      userOrganizationsData!.currentUser!.user_organizations!.filter(
        (uo) => uo.organization_id == organizationData!.organization!.id,
      )[0].id
    await requestNewUserOrganizationJoinConfirmation({
      variables: {
        id: userOrganizationId,
        organizational_email: email,
      },
    })
  }

  const handleCheckboxChange = () => {
    setConsented(!consented)
  }

  const leaveOrganization = async () => {
    if (!currentUserOrganizationMembership?.id) {
      return
    }

    await deleteUserOrganization({
      variables: {
        id: currentUserOrganizationMembership.id,
      },
    })
    const fieldValue = memberships.filter((s) => s !== slug)
    const fieldName = "joined_organizations"
    await updateUserDetails(fieldName, fieldValue)
  }

  /* const { loading, error, data } = useQuery(
    OrganizationByIdQuery,
    { variables: { id: Number(id) } },
  ) */

  if (organizationLoading || userOrganizationsLoading) {
    return <Container>{t("loading")}...</Container>
  }

  if (organizationError || userOrganizationsError) {
    return (
      <Container>
        <ErrorMessage />
      </Container>
    )
  }

  if (
    !organizationData?.organization?.id ||
    (!admin && organizationData.organization.hidden)
  ) {
    return <Container>{t("organizationDoesntExist")}</Container>
  }

  return confirmationStatus === "confirmed" ? (
    <Container>
      <h1>
        {t("memberTitle")} {organizationData.organization?.name}
      </h1>

      <TextBox>
        {t("updateEmailInformation1")}{" "}
        {currentUserOrganizationMembership?.organizational_email}
      </TextBox>
      <TextBox>{t("updateEmailInformation2")}</TextBox>

      <StyledForm
        ref={formRef}
        action=""
        method=""
        name="mc-embedded-subscribe-form"
        target="_blank"
        noValidate
      >
        <FieldWrapper>
          <StyledFormControl>
            <Tooltip title="">
              <TextField
                id="email"
                label="email"
                name="EMAIL"
                inputProps={{ "aria-label": "email" }}
              />
            </Tooltip>
          </StyledFormControl>
        </FieldWrapper>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => {
            if (formRef?.current) {
              handleSubmit()
            }
          }}
        >
          {t("update")}
          <Send />
        </StyledButton>
      </StyledForm>

      <h2>{t("leaveTitle")}</h2>

      <TextBox>{t("leaveInformation")}</TextBox>

      <Button
        color="secondary"
        disabled={confirmationStatus === "confirmed"}
        onClick={async () => {
          await leaveOrganization()
        }}
      >
        {t("leaveButton")}
      </Button>
    </Container>
  ) : (
    <Container>
      <h1>
        {t("title2")} {organizationData.organization?.name}
      </h1>

      <TextBox>
        {t("joiningInformation1")}
        {organizationData.organization.email == null ? (
          "."
        ) : (
          <>
            :{" "}
            <Link href={"mailto:" + organizationData.organization.email}>
              {organizationData.organization.email}
            </Link>
          </>
        )}
      </TextBox>

      <TextBox>
        {t("joiningInformation2")}{" "}
        <Link href={`${baseUrl}/profile/completions`}>
          {t("joiningInformation3")}
        </Link>{" "}
        {t("joiningInformation4")}
      </TextBox>

      <TextBox>
        {t("joiningInformation5")} {organizationData.organization?.name}{" "}
        {t("joiningInformation6")}
      </TextBox>

      {confirmationStatus != "sent" &&
        organizationData.organization.required_confirmation && (
          <div>
            <FormControlLabel
              label={`${t("joiningCheckbox")} ${organizationData.organization
                ?.name}`}
              control={
                <Checkbox
                  id="consent-checkbox"
                  name="consent-checkbox"
                  checked={consented}
                  onChange={handleCheckboxChange}
                  inputProps={{ "aria-label": "consent checkbox" }}
                />
              }
            />
            <TextBox>{t("joiningOrgIdHint")}</TextBox>
            <Tooltip title={!consented ? t("hoverHint") : ""}>
              <TextField
                id="organizational-identifier"
                label="organizational identifier"
                name="ORGANIZATIONAL-IDENTIFIER"
                inputProps={{ "aria-label": "organizational-identifier" }}
                disabled={!consented}
                defaultValue={organizationalIdentifier}
              />
            </Tooltip>
            <TextBox>
              {t("joiningEmailHint1")}{" "}
              {organizationData.organization.email != null
                ? `${t("joiningEmailHint2")}@${organizationData.organization.email.split("@")[1]
                }${t("joiningEmailHint3")}`
                : ""}
            </TextBox>
            <StyledForm
              ref={formRef}
              //action="https://mooc.us8.list-manage.com/subscribe/post?u=db82662e446284fd41bd8370e&amp;id=46d3d4ede3"
              action=""
              //method="post"
              method=""
              name="mc-embedded-subscribe-form"
              target="_blank"
              noValidate
            >
              <FieldWrapper>
                <StyledFormControl>
                  <Tooltip title={!consented ? t("hoverHint") : ""}>
                    <TextField
                      id="email"
                      label="email"
                      name="EMAIL"
                      inputProps={{ "aria-label": "email" }}
                      disabled={!consented}
                    />
                  </Tooltip>
                </StyledFormControl>
              </FieldWrapper>
              <StyledButton
                variant="contained"
                disabled={!consented}
                color="primary"
                onClick={() => {
                  if (formRef?.current) {
                    //formRef.current.submit()
                    handleSubmit()
                  }
                }}
              >
                {t("emailButton")}
                <Send />
              </StyledButton>
            </StyledForm>
          </div>
        )}

      {confirmationStatus != "sent" &&
        !organizationData.organization.required_confirmation && (
          <div>
            <FormControlLabel
              label={`${t("joiningCheckbox")} ${organizationData.organization
                ?.name}`}
              control={
                <Checkbox
                  id="consent-checkbox"
                  name="consent-checkbox"
                  checked={consented}
                  onChange={handleCheckboxChange}
                  inputProps={{ "aria-label": "consent checkbox" }}
                />
              }
            />
            <TextBox>{t("joiningOrgIdHint")}</TextBox>
            <Tooltip title={!consented ? t("hoverHint") : ""}>
              <TextField
                id="organizational-identifier"
                label="organizational identifier"
                name="ORGANIZATIONAL-IDENTIFIER"
                inputProps={{ "aria-label": "organizational-identifier" }}
                disabled={!consented}
                defaultValue={organizationalIdentifier}
              />
            </Tooltip>
            <StyledButton
              variant="contained"
              disabled={!consented}
              color="primary"
              onClick={() => {
                handleSubmitWithoutEmail()
              }}
            >
              {t("emailButton")}
            </StyledButton>
          </div>
        )}

      {confirmationStatus == "sent" && (
        <div>
          {t("registrationReceived")} {email}.
        </div>
      )}

      {confirmationStatus == "expired" && (
        <div>
          {t("confirmationEmailExpired1")} {email}{" "}
          {t("confirmationEmailExpired2")}
        </div>
      )}

      {confirmationStatus == "incorrectFormat" && (
        <Error>{t("incorrectFormat")}</Error>
      )}
    </Container>
  )
}

export default withSignedIn(RegisterToOrganization)

/*
- if organization requires an organization email to join, should show that accordingly and react if user does not have one
- should have a state for when the confirmation email has been sent but join is not activated
- should have a state for when the confirmation email has been sent and has expired -- option to resend
- should have a possibility to unjoin organization (with a confirm modal?)
- consent checkbox for sharing information
*/
