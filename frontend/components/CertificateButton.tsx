import { useCallback, useState } from "react"

import { LinkProps } from "next/link"

import WarningIcon from "@mui/icons-material/Warning"
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useAlertContext } from "/contexts/AlertContext"
import { useLoginStateContext } from "/contexts/LoginStateContext"
import { useCertificate } from "/hooks/useCertificate"
import { useTranslator } from "/hooks/useTranslator"
import CompletionsTranslations from "/translations/completions"

import {
  CompletionDetailedFieldsFragment,
  CourseCoreFieldsFragment,
} from "/graphql/generated"

const CERTIFICATES_URL = "https://certificates.mooc.fi"

const StyledButton = styled(Button)`
  background-color: #005361;
  text-align: center;
  max-width: 20vw;
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

const CertificateButton = ({
  course,
  completion,
  ...buttonProps
}: CertificateProps & ButtonProps & LinkProps) => {
  const t = useTranslator(CompletionsTranslations)
  const { currentUser } = useLoginStateContext()
  const { addAlert } = useAlertContext()
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

  const onShowCertificate = useCallback(
    () =>
      window.open(
        `${CERTIFICATES_URL}/validate/${state.certificateId}`,
        "_blank",
      ),
    [state.certificateId],
  )

  const onDialogOpen = useCallback(() => setDialogOpen(true), [])
  const onDialogClose = useCallback(() => setDialogOpen(false), [])
  const onFirstNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value),
    [],
  )
  const onLastNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value),
    [],
  )

  if (state.certificateId) {
    return (
      <StyledButton onClick={onShowCertificate} {...buttonProps}>
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
        onClick={onDialogOpen}
        {...buttonProps}
      >
        {state.status !== "IDLE" ? (
          <CircularProgress size={24} color="secondary" />
        ) : (
          t("createCertificate")
        )}
      </StyledButton>
      <StyledDialog
        open={dialogOpen}
        disableEnforceFocus
        onClose={onDialogClose}
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
            onChange={onFirstNameChange}
            defaultValue={firstName}
            fullWidth
          />
          <StyledTextField
            id="last-name"
            label={t("nameFormLastName")}
            defaultValue={lastName}
            value={lastName}
            onChange={onLastNameChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onDialogClose}
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
