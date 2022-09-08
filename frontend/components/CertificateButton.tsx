import { useCallback, useContext, useState } from "react"

import styled from "@emotion/styled"
import {
  CircularProgress,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"

import AlertContext from "/contexts/AlertContext"
import { useCertificate } from "/hooks/useCertificate"
import CompletionsTranslations from "/translations/completions"
import { useTranslator } from "/util/useTranslator"

import { CourseCoreFieldsFragment } from "/graphql/generated"

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

interface CertificateProps {
  course: CourseCoreFieldsFragment
}

const CertificateButton = ({ course }: CertificateProps) => {
  const t = useTranslator(CompletionsTranslations)
  const { addAlert } = useContext(AlertContext)
  const [dialogOpen, setDialogOpen] = useState(false)

  const onCertificateCheckSuccess = useCallback(() => {
    addAlert({
      title: t("nameFormErrorTitle"),
      message: t("nameFormErrorCheckCertificate"),
      severity: "error",
    })
  }, [])
  const onReceiveGeneratedCertificateSuccess = useCallback(() => {
    setDialogOpen(false)
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
    onCertificateCheckSuccess,
    onReceiveGeneratedCertificateSuccess,
    onReceiveGeneratedCertificateError,
  })

  if (state.certificateId) {
    return (
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
    )
  }

  return (
    <>
      <StyledButton onClick={() => setDialogOpen(true)}>
        {t("createCertificate")}
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
