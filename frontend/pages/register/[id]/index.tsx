import { createRef, useContext, useEffect, useState } from "react"

import { useMutation, useQuery } from "@apollo/client"
import styled from "@emotion/styled"
import Send from "@mui/icons-material/Send"
import { Link } from "@mui/material"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import TextField from "@mui/material/TextField"
import Tooltip from "@mui/material/Tooltip"

import LoginStateContext from "/contexts/LoginStateContext"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import { updateUserDetails } from "/lib/account"
import withSignedIn from "/lib/with-signed-in"
import HomeTranslations from "/translations/home"
import RegistrationTranslations from "/translations/register"
import notEmpty from "/util/notEmpty"
import { useQueryParameter } from "/util/useQueryParameter"
import { useTranslator } from "/util/useTranslator"

import {
  AddUserOrganizationDocument,
  CurrentUserUserOrganizationsDocument,
  DeleteUserOrganizationDocument,
} from "/graphql/generated"

const Container = styled.div`
  display: grid;
  justify-items: center;
`

const FieldWrapper = styled.div`
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

const Error = styled.div`
  color: red;
  font-weight: bold;
`

const TextBox = styled.div`
  max-width: 710px;
  margin: 1rem;
`

const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 80% 20%;
`

const mockOrganization = {
  name: "Helsingin yliopisto",
  hidden: false,
  supportEmail: "test@university.xyz",
}

const RegisterToOrganization = () => {
  const { currentUser } = useContext(LoginStateContext)
  const id = useQueryParameter("id")
  const t = useTranslator(HomeTranslations, RegistrationTranslations)
  const [confirmationStatus, setConfirmationStatus] = useState("notSent") // notSent, sent, expired or incorrectFormat
  const [email, setEmail] = useState("")
  const [consented, setConsented] = useState(false)
  const [organizationalIdentifier, setOrganizationalIdentifier] = useState(
    currentUser?.student_number,
  )
  const [memberships, setMemberships] = useState<Array<string>>([])
  const [organizations] = useState<Record<string, any>>({}) // what's this?
  const formRef = createRef<HTMLFormElement>()
  const { data: userOrganizationsData } = useQuery(
    CurrentUserUserOrganizationsDocument,
  )

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

  useBreadcrumbs([
    {
      translation: "register",
      href: "/register/" + id,
    },
  ])

  useEffect(() => {
    const fetchConfirmationSentInformation = async () => {
      // TODO: fetch whether confirmation has been sent and how long ago
    }
    fetchConfirmationSentInformation()
  }, [])

  useEffect(() => {
    if (
      !userOrganizationsData ||
      (userOrganizationsData && Object.keys(organizations).length)
    ) {
      return
    }

    const mIds =
      userOrganizationsData?.currentUser?.user_organizations
        ?.map((uo) => uo?.organization?.id)
        .filter(notEmpty) ?? []

    setMemberships(mIds)
  }, [userOrganizationsData])

  const handleSubmit = () => {
    const potentialEmail = (
      document.getElementById("email") as HTMLInputElement
    ).value
    const organizationRegex = new RegExp("^.*..*@.*..*$")
    const orgId = (
      document.getElementById("organizational-identifier") as HTMLInputElement
    ).value

    if (!potentialEmail.match(organizationRegex)) {
      setConfirmationStatus("incorrectFormat")
    } else {
      setEmail(potentialEmail)
      setOrganizationalIdentifier(orgId)
      setConfirmationStatus("sent")
      verifyJoiningOrganization()
      // TODO: tallenna että user on consentannut ja että hän on reggannut, niin tiedetään milloin expiree
    }
  }

  const verifyJoiningOrganization = async () => {
    const fieldName = "joined_organizations"
    const fieldValue = [...memberships, id]
    await updateUserDetails(fieldName, fieldValue)
    setMemberships(fieldValue)
    await addUserOrganization({
      variables: {
        organization_id: id,
        email: email,
      },
    })
  }

  const handleCheckboxChange = () => {
    setConsented(!consented)
  }

  const leaveOrganization = async () => {
    await deleteUserOrganization({
      variables: {
        id: id,
      },
    })
    setMemberships(memberships.filter((i) => i !== id))
    const fieldName = "joined_organizations"
    await updateUserDetails(fieldName, memberships)
  }

  /* const { loading, error, data } = useQuery(
    OrganizationByIdQuery,
    { variables: { id: Number(id) } },
  ) */

  /* if (error) {
    return (
      <Container>
        <ErrorMessage />
      </Container>
    )
  } else if (loading) {
    return (
      <Container>
        loading...
      </Container>
    ) */

  const member = memberships.includes(id)

  return member ? (
    <Container>
      <h1>
        {t("leaveTitle")} {mockOrganization.name}?
      </h1>

      <TextBox>{t("leaveInformation")}</TextBox>

      <Button
        color="secondary"
        disabled={member}
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
        {t("title2")} {mockOrganization.name}
      </h1>

      <TextBox>
        {t("joiningInformation1")}
        {mockOrganization.supportEmail == null ? (
          "."
        ) : (
          <>
            :{" "}
            <Link href={"mailto:" + mockOrganization.supportEmail}>
              {mockOrganization.supportEmail}
            </Link>
          </>
        )}
      </TextBox>

      <TextBox>
        {t("joiningInformation2")}{" "}
        <Link href="/profile/completions">{t("joiningInformation3")}</Link>{" "}
        {t("joiningInformation4")}
      </TextBox>

      <TextBox>
        {t("joiningInformation5")} {mockOrganization.name}{" "}
        {t("joiningInformation6")}
      </TextBox>

      {confirmationStatus != "sent" && (
        <div>
          <FormControlLabel
            label={`${t("joiningCheckbox")} ${mockOrganization.name}`}
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
            {mockOrganization.supportEmail != null
              ? `${t("joiningEmailHint2")}@${
                  mockOrganization.supportEmail.split("@")[1]
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

      {confirmationStatus == "sent" && (
        <div>
          {t("registrationReceived")} {email}.
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
