import { useContext, useEffect, useState, useReducer } from "react"
import Button from "@material-ui/core/Button"
import styled from "@emotion/styled"
import DialogTitle from "@material-ui/core/DialogTitle"
import Dialog from "@material-ui/core/Dialog"
import DialogContent from "@material-ui/core/DialogContent"
import {
  TextField,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@material-ui/core"
import CompletionsTranslations from "/translations/completions"
import { ProfileUserOverView_currentUser_completions_course } from "/static/types/generated/ProfileUserOverView"
import { checkCertificate, createCertificate } from "/lib/certificates"
import { updateAccount } from "/lib/account"
import { useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { UserDetailQuery } from "/lib/with-apollo-client/fetch-user-details"
import { UserOverViewQuery } from "/pages/[lng]/profile"
import { UserOverViewQuery as CompletionsUserOverViewQuery } from "/graphql/queries/currentUser"
import LoginStateContext from "/contexts/LoginStateContext"
import AlertContext from "/contexts/AlertContext"
import { UserOverView_currentUser } from "/static/types/generated/UserOverView"
import { useTranslator } from "/util/useTranslator"

const StyledButton = styled(Button)`
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
  | "RESET"
  | "CHECK_CERTIFICATE"
  | "RECEIVE_CERTIFICATE_ID"
  | "GENERATE_CERTIFICATE"
  | "RECEIVE_GENERATED_CERTIFICATE"
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
    case "RESET":
      return initialState
    case "CHECK_CERTIFICATE":
      return {
        ...state,
        status: "CHECKING",
      }
    case "RECEIVE_CERTIFICATE_ID":
      return {
        ...state,
        status: "IDLE",
        certificateId: action?.payload,
        error: undefined,
      }
    case "GENERATE_CERTIFICATE":
      return {
        ...state,
        status: "GENERATING",
        certificateId: undefined,
        error: undefined,
      }
    case "RECEIVE_GENERATED_CERTIFICATE":
      return {
        ...state,
        status: "IDLE",
        certificateId: action?.payload?.id,
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
  const t = useTranslator(CompletionsTranslations)
  const { currentUser, updateUser } = useContext(LoginStateContext)
  const { addAlert } = useContext(AlertContext)

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

  useEffect(() => {
    dispatch({ type: "CHECK_CERTIFICATE" })
    checkCertificate(course.slug)
      .then((res: any) => {
        dispatch({
          type: "RECEIVE_CERTIFICATE_ID",
          payload: res?.existing_certificate,
        })
      })
      .catch((e: any) => {
        dispatch({ type: "ERROR", payload: e })
        console.error("error?", e)
        addAlert({
          title: t("nameFormErrorTitle"),
          message: t("nameFormErrorCheckCertificate"),
          severity: "error",
        })
        dispatch({ type: "RESET" })
      })
  }, [])

  // TODO: when admin is looking at a user, it's checking against the admin's name -- fix

  const nameChanged = () =>
    (currentUser?.first_name ?? "") !== firstName ||
    (currentUser?.last_name ?? "") !== lastName

  const isNameEmpty = () => firstName == "" && lastName == ""

  const onSubmit = async () => {
    if (isNameEmpty()) {
      return
    }

    try {
      if (nameChanged()) {
        dispatch({ type: "UPDATE_NAME" })
        const res = await updateAccount(firstName, lastName)
        await updateUserName({
          variables: {
            first_name: firstName,
            last_name: lastName,
          },
        })
        updateUser({
          ...(currentUser || { email: "", id: "" }),
          first_name: firstName,
          last_name: lastName,
        } as UserOverView_currentUser)
        dispatch({ type: "UPDATED_NAME", payload: res })
      }

      dispatch({ type: "GENERATE_CERTIFICATE" })
      const res = await createCertificate(course.slug)
      dispatch({ type: "RECEIVE_GENERATED_CERTIFICATE", payload: res })
      setOpen(false)
    } catch (e) {
      dispatch({ type: "ERROR", payload: e })
      setOpen(false)
      console.error("error?", e)
      addAlert({
        title: t("nameFormErrorTitle"),
        message: t("nameFormErrorSubmit"),
        severity: "error",
      })
      dispatch({ type: "RESET" })
    }
  }

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
        >
          {t("showCertificate")}
        </StyledButton>
      ) : (
        <>
          <StyledButton onClick={() => setOpen(true)}>
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
              <Button
                onClick={onSubmit}
                disabled={state.status !== "IDLE" || isNameEmpty()}
                color="primary"
                fullWidth
              >
                {["IDLE", "ERROR"].indexOf(state.status) < 0 ? (
                  <CircularProgress size={24} color="secondary" />
                ) : (
                  t("nameFormChangeAndSubmit")
                )}
              </Button>
            </DialogActions>
          </StyledDialog>
        </>
      )}
    </>
  )
}

export default CertificateButton
