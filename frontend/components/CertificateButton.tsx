import React, { useContext, useEffect, useState, useReducer } from "react"
import Button from "@material-ui/core/Button"
import styled from "styled-components"
import DialogTitle from "@material-ui/core/DialogTitle"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import { TextField, DialogActions, DialogContentText } from "@material-ui/core"
import LanguageContext from "/contexes/LanguageContext"
import getCompletionsTranslator from "/translations/completions"
import { ProfileUserOverView_currentUser_completions_course } from "/static/types/generated/ProfileUserOverView"
import { checkCertificateAvailability } from "/lib/certificates"
import { updateAccount } from "/lib/account"
import UserDetailContext from "/contexes/UserDetailContext"
import { useMutation } from "@apollo/react-hooks"
import { gql } from "apollo-boost"
import { UserDetailQuery } from "/lib/with-apollo-client/fetch-user-details"
import { UserOverViewQuery } from "/pages/[lng]/profile"
import { CompletionsUserOverViewQuery } from "/pages/[lng]/profile/completions"

const StyledButton = styled(Button)`
  height: 50%;
  margin: auto;
  background-color: #005361;
`

const StyledDialog = styled(Dialog)`
  padding: 1rem;
`
const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`

const updateUserNameMutation = gql`
  mutation updateUserName($first_name: String, $last_name: String) {
    updateUserName(first_name: $first_name, last_name: $last_name) {
      id
      first_name
      last_name
    }
  }
`

interface CertificateProps {
  course: ProfileUserOverView_currentUser_completions_course
}

type Status =
  | "IDLE"
  | "CHECKING"
  | "AVAILABLE"
  | "NOT_AVAILABLE"
  | "GENERATING"
  | "UPDATING_NAME"
  | "ERROR"
type ActionType =
  | "CHECK_CERTIFICATE"
  | "RECEIVE_CERTIFICATE_ID"
  | "GENERATE_CERTIFICATE"
  | "UPDATE_NAME"
  | "UPDATED_NAME"
  | "ERROR"

type Action = {
  type: ActionType
  payload?: any
}

interface CertificateState {
  status: Status
  certificateId?: string
  error?: string
}

const initialState: CertificateState = {
  status: "IDLE",
}

const reducer = (state: CertificateState, action: Action): CertificateState => {
  switch (action.type) {
    case "CHECK_CERTIFICATE":
      return {
        ...state,
        status: "CHECKING",
      }
    case "RECEIVE_CERTIFICATE_ID":
      return {
        ...state,
        status: action.payload ? "AVAILABLE" : "NOT_AVAILABLE",
        certificateId: action.payload,
        error: undefined,
      }
    case "GENERATE_CERTIFICATE":
      return {
        ...state,
        status: "GENERATING",
        certificateId: undefined,
        error: undefined,
      }
    case "UPDATE_NAME":
      return {
        ...state,
        status: "UPDATING_NAME",
        error: undefined,
      }
    case "UPDATED_NAME":
      return {
        ...state,
        status: "IDLE",
        error: undefined,
      }
    case "ERROR":
      return {
        ...state,
        status: "ERROR",
        error: action.payload,
      }
  }

  return state
}

const CertificateButton = ({ course }: CertificateProps) => {
  const lng = useContext(LanguageContext)
  const t = getCompletionsTranslator(lng.language)
  const { currentUser } = useContext(UserDetailContext)

  const [state, dispatch] = useReducer(reducer, initialState)
  const [firstName, setFirstName] = useState(currentUser?.first_name ?? "")
  const [lastName, setLastName] = useState(currentUser?.last_name ?? "")

  const [updateUserName] = useMutation(updateUserNameMutation, {
    refetchQueries: [
      { query: UserDetailQuery },
      { query: UserOverViewQuery },
      { query: CompletionsUserOverViewQuery },
    ],
  })

  const [open, setOpen] = useState(false)

  //Certificate availability for this user
  const certificateAvailable = true

  //Certificate has been previously downloaded
  // @ts-ignore: sdf
  const [hasGeneratedCertificate, setHasGeneratedCertificate] = useState(false)

  //Names come from TMC in the end. Now mock here
  useEffect(() => {
    dispatch({ type: "CHECK_CERTIFICATE" })
    checkCertificateAvailability(course.slug)
      // @ts-ignore: äasdf
      .then((res: any) => {
        dispatch({
          type: "RECEIVE_CERTIFICATE_ID",
          payload: null /*res?.existing_certificate*/,
        })
      })
      .catch((e: any) => {
        dispatch({ type: "ERROR", payload: e })
        console.error("error?", e)
      })
  }, [])

  const nameChanged = () =>
    (currentUser?.first_name ?? "") !== firstName ||
    (currentUser?.last_name ?? "") !== lastName

  const onSubmit = async () => {
    if (nameChanged()) {
      dispatch({ type: "UPDATE_NAME" })
      try {
        const res = await updateAccount(firstName, lastName)
        await updateUserName({
          variables: {
            first_name: firstName,
            last_name: lastName,
          },
        })
        console.log(res)
        dispatch({ type: "UPDATED_NAME", payload: res })
      } catch (e) {
        dispatch({ type: "ERROR", payload: e })
      }
    }
  }

  console.log(state, firstName, lastName, nameChanged())

  return (
    <>
      {state.certificateId ? (
        <StyledButton
          onClick={() =>
            window.open(
              `https://certificates.mooc.fi/validate/${state.certificateId}`,
              "_blank",
            )
          }
          disabled={!certificateAvailable}
        >
          {t("showCertificate")}
        </StyledButton>
      ) : (
        <>
          <StyledButton
            onClick={() => setOpen(true)}
            disabled={!certificateAvailable}
          >
            {t("createCertificate")}
          </StyledButton>
          <StyledDialog
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="dialog-title"
          >
            <DialogTitle id="dialog-title">{t("nameFormTitle")}</DialogTitle>
            <DialogContent>
              <DialogContentText style={{ marginBottom: "1.5rem" }}>
                {t("nameFormIntro")}
              </DialogContentText>
              <StyledTextField
                autoFocus
                id="first-name"
                label={t("nameFormFirstName")}
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                defaultValue={firstName}
                fullWidth
              />
              <StyledTextField
                autoFocus
                id="last-name"
                label={t("nameFormLastName")}
                defaultValue={lastName}
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                color="inherit"
                fullWidth
              >
                {t("nameFormCancel")}
              </Button>
              <Button onClick={onSubmit} color="primary" fullWidth>
                {t("nameFormChangeAndSubmit")}
              </Button>
            </DialogActions>
          </StyledDialog>
        </>
      )}
    </>
  )
}

export default CertificateButton
