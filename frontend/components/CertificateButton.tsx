import { useCallback, useContext, useState } from "react"

import styled from "@emotion/styled"
import WarningIcon from "@mui/icons-material/Warning"
import {
  CircularProgress,
  DialogActions,
  DialogContentText,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

import AlertContext from "/contexts/AlertContext"
import LoginStateContext from "/contexts/LoginStateContext"
import { useCertificate } from "/hooks/useCertificate"
import CompletionsTranslations from "/translations/completions"
import { useTranslator } from "/util/useTranslator"

import {
  CompletionDetailedFieldsFragment,
  CourseCoreFieldsFragment,
} from "/graphql/generated"

const CERTIFICATES_URL = "https://certificates.mooc.fi"

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
const NoCertificateGeneratedNote = styled(Paper)`
  background-color: #f05361;
  color: #ffffff;
  padding: 0.5rem;
  margin: auto;
  gap: 0.5rem;
  align-items: center;
  display: flex;
  flex-direction: row;
`
interface CertificateProps {
  course: CourseCoreFieldsFragment
  completion: CompletionDetailedFieldsFragment
}

const CertificateButton = ({ course, completion }: CertificateProps) => {
  const t = useTranslator(CompletionsTranslations)
  const { currentUser } = useContext(LoginStateContext)
  const { addAlert } = useContext(AlertContext)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isOtherUser = currentUser?.id !== completion.user_id

  const onReceiveGeneratedCertificateSuccess = useCallback(() => {
    setDialogOpen(false)
    addAlert({
      title: t("certificateGeneratedTitle"),
      message: t("certificateGeneratedMessage"),
      severity: "success",
    })
  }, [])
  const onReceiveGeneratedCertificateError = useCallback(() => {
    setDialogOpen(false)
    addAlert({
      title: t("nameFormErrorTitle"),
      message: t("nameFormErrorSubmit"),
      severity: "error",
    })
  }, [])

  const {
    state,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    onSubmit,
    isNameEmpty,
  } = useCertificate({
    course,
    completion,
    onReceiveGeneratedCertificateSuccess,
    onReceiveGeneratedCertificateError,
  })

  if (state.certificateId) {
    return (
      <StyledButton
        onClick={() =>
          window.open(
            `${CERTIFICATES_URL}/validate/${state.certificateId}`,
            "_blank",
          )
        }
      >
        {t("showCertificate")}
      </StyledButton>
    )
  }

  // TODO: when admin is able to generate certificate for user, remove the following
  if (
    completion?.certificate_availability?.completed_course &&
    !completion?.certificate_availability?.existing_certificate &&
    isOtherUser
  ) {
    return (
      <>
        <NoCertificateGeneratedNote>
          <WarningIcon />
          <Typography variant="h4">
            {t("eligibleForCertificateButNotGenerated")}
          </Typography>
        </NoCertificateGeneratedNote>
      </>
    )
  }
  return (
    <>
      <StyledButton
        disabled={state.status !== "IDLE"}
        onClick={() => setDialogOpen(true)}
      >
        {state.status !== "IDLE" ? (
          <CircularProgress size={24} color="secondary" />
        ) : (
          t("createCertificate")
        )}
      </StyledButton>
      <StyledDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="dialog-title"
      >
        <DialogTitle id="dialog-title">{t("nameFormTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: "1.5rem" }}>
            {t("nameFormIntro")}
          </DialogContentText>
          <StyledTextField
            id="first-name"
            label={t("nameFormFirstName")}
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            defaultValue={firstName}
            fullWidth
          />
          <StyledTextField
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
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            color="inherit"
            fullWidth
          >
            {t("nameFormCancel")}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={state.status !== "IDLE" || isNameEmpty}
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
  )
}

export default CertificateButton
