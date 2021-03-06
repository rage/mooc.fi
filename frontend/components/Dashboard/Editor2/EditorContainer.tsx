import {
  Container,
  Grid,
  Paper,
  CircularProgress,
  Checkbox,
  Tooltip,
} from "@material-ui/core"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

import styled from "@emotion/styled"
import { PropsWithChildren, useState } from "react"
import { useConfirm } from "material-ui-confirm"
import { useFormContext } from "react-hook-form"
import { FormStatus } from "/components/Dashboard/Editor2/types"
import { useEditorContext } from "./EditorContext"

const isProduction = process.env.NODE_ENV === "production"

const FormBackground = styled(Paper)`
  padding: 2em;
`

const Status = styled.p<any>`
  color: ${(props: FormStatus) => (props.error ? "#FF0000" : "default")};
`

function EditorContainer<T extends Record<string, any>>({
  children,
}: PropsWithChildren<{}>) {
  const t = useTranslator(CommonTranslations)
  const confirm = useConfirm()
  const [deleteVisible, setDeleteVisible] = useState(false)
  const {
    status,
    onSubmit,
    onError,
    onCancel,
    onDelete,
  } = useEditorContext<T>()
  const { handleSubmit, formState, watch } = useFormContext()
  const id = watch("id")

  const { isSubmitting, isSubmitted, isDirty } = formState

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1} style={{ backgroundColor: "#8C64AC" }}>
        <form
          onSubmit={handleSubmit(onSubmit, onError)}
          style={{ backgroundColor: "white", padding: "2rem" }}
          autoComplete="none"
        >
          {children}
          <Grid container direction="row" spacing={2}>
            <Grid item xs={4}>
              <StyledButton
                color="primary"
                disabled={!isDirty || isSubmitting}
                onClick={() => handleSubmit<T>(onSubmit, onError)()}
                style={{ width: "100%" }}
              >
                {isSubmitting ? <CircularProgress size={20} /> : t("save")}
              </StyledButton>
            </Grid>
            <Grid item xs={4}>
              <StyledButton
                color="secondary"
                style={{ width: "100%" }}
                disabled={isSubmitting || isSubmitted}
                variant="contained"
                onClick={(e) => {
                  e.preventDefault()
                  return isDirty
                    ? confirm({
                        title: t("confirmationUnsavedChanges"),
                        description: t("confirmationLeaveWithoutSaving"),
                        confirmationText: t("confirmationYes"),
                        cancellationText: t("confirmationNo"),
                      })
                        .then(onCancel)
                        .catch(() => {})
                    : onCancel()
                }}
              >
                {t("cancel")}
              </StyledButton>
            </Grid>
          </Grid>
          <Grid item xs={2}>
            {!isProduction && id ? (
              <Tooltip title={t("showDelete")}>
                <Checkbox
                  checked={deleteVisible}
                  onChange={() => setDeleteVisible(!deleteVisible)}
                />
              </Tooltip>
            ) : null}
            {deleteVisible && id ? (
              <StyledButton
                variant="contained"
                color="secondary"
                disabled={isSubmitting || isSubmitted}
                onClick={(e) => {
                  e.preventDefault()

                  return confirm({
                    title: t("confirmationAboutToDelete"),
                    description: t("confirmationDelete"),
                    confirmationText: t("confirmationYes"),
                    cancellationText: t("confirmationNo"),
                  })
                    .then(() => onDelete(id))
                    .catch(() => {})
                }}
              >
                {t("delete")}
              </StyledButton>
            ) : null}
          </Grid>
          {status?.message ? (
            <Status error={status.error}>
              {status.error ? t("submittingError") : null}
              <b>{status.message}</b>
            </Status>
          ) : null}
        </form>
      </FormBackground>
    </Container>
  )
}

export default EditorContainer
