import React, { PropsWithChildren, useCallback, useState } from "react"

import { useConfirm } from "material-ui-confirm"
import { Path, useFormContext } from "react-hook-form"

import {
  Checkbox,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Tooltip,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useEditorContext } from "./EditorContext"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { FormStatus, FormValues } from "/components/Dashboard/Editor2/types"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/util/useTranslator"

const isProduction = process.env.NODE_ENV === "production"

const FormBackground = styled(Paper)`
  padding: 2em;
`

const Status = styled("p", { shouldForwardProp: (prop) => prop !== "error" })<{
  error: FormStatus["error"]
}>`
  color: ${(props) => (props.error ? "#FF0000" : "default")};
`

function EditorContainer<T extends FormValues = FormValues>({
  children,
}: PropsWithChildren) {
  const t = useTranslator(CommonTranslations)
  const confirm = useConfirm()
  const [deleteVisible, setDeleteVisible] = useState(false)
  const { status, onSubmit, onError, onCancel, onDelete } =
    useEditorContext<T>()
  const { handleSubmit, formState, watch } = useFormContext<T>()
  const id = watch("id" as Path<T>)

  const { isSubmitting, isSubmitted, isDirty } = formState

  const onSaveClick = useCallback(
    () => handleSubmit(onSubmit, onError)(),
    [handleSubmit, onSubmit, onError],
  )

  const onCancelClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      return isDirty
        ? confirm({
            title: t("confirmationUnsavedChanges"),
            description: t("confirmationLeaveWithoutSaving"),
            confirmationText: t("confirmationYes"),
            cancellationText: t("confirmationNo"),
          })
            .then(onCancel)
            .catch(() => {
              // ignore
            })
        : onCancel()
    },
    [isDirty, onCancel, confirm, t],
  )

  const onDeleteClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      return confirm({
        title: t("confirmationAboutToDelete"),
        description: t("confirmationDelete"),
        confirmationText: t("confirmationYes"),
        cancellationText: t("confirmationNo"),
      })
        .then(() => onDelete(id))
        .catch(() => {
          // ignore
        })
    },
    [id, onDelete, confirm, t],
  )

  const onDeleteVisibleClick = useCallback(
    () => setDeleteVisible((value) => !value),
    [setDeleteVisible],
  )

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
                onClick={onSaveClick}
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
                onClick={onCancelClick}
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
                  onChange={onDeleteVisibleClick}
                />
              </Tooltip>
            ) : null}
            {deleteVisible && id ? (
              <StyledButton
                variant="contained"
                color="secondary"
                disabled={isSubmitting || isSubmitted}
                onClick={onDeleteClick}
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
