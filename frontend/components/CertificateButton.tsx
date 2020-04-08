import React, { useState } from "react"
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

interface CertificateProps {
  course: ProfileUserOverView_currentUser_completions_course
}

const CertificateButton = ({ course }: CertificateProps) => {
  const [open, setOpen] = useState(false)

  //Certificate availability for this user
  const certificateAvailable = true

  //Certificate has been previously downloaded
  const [hasGeneratedCertificate, setHasGeneratedCertificate] = useState(false)
  const [certificateId, setCertificateId] = useState("")

  const lng = React.useContext(LanguageContext)
  const t = getCompletionsTranslator(lng.language)

  //Names come from TMC in the end. Now mock here
  const firstName = "Henkka"
  const lastName = "Sukunimi"

  checkCertificateAvailability(course.slug)
    .then((res: any) => {
      if (res?.existing_certificate) {
        setHasGeneratedCertificate(true)
        setCertificateId(res.existing_certificate)
      }
    })
    .catch((e: any) => console.error("error?", e))

  return (
    <>
      {hasGeneratedCertificate ? (
        <StyledButton
          onClick={() =>
            window.open(
              `https://certificates.mooc.fi/validate/${certificateId}`,
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
                defaultValue={firstName}
                fullWidth
              />
              <StyledTextField
                autoFocus
                id="last-name"
                label={t("nameFormLastName")}
                defaultValue={lastName}
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
                onClick={() => {
                  console.log("changed name")
                }}
                color="primary"
                fullWidth
              >
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
