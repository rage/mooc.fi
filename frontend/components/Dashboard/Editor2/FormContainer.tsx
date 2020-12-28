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

import styled from "styled-components"
import { PropsWithChildren, useState } from "react"
import { useConfirm } from "material-ui-confirm"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
} from "react-hook-form"

const isProduction = process.env.NODE_ENV === "production"

const FormBackground = styled(Paper)`
  padding: 2em;
`

interface FormContainerProps {
  onSubmit: SubmitHandler<Record<string, any>>
  onError: SubmitErrorHandler<Record<string, any>>
  onDelete: Function
  onCancel: () => void | Promise<void>
}

export default function FormContainer({
  onSubmit,
  onError,
  onCancel,
  onDelete,
  children,
}: PropsWithChildren<FormContainerProps>) {
  const t = useTranslator(CommonTranslations)
  const confirm = useConfirm()
  const [deleteVisible, setDeleteVisible] = useState(false)

  const { handleSubmit, formState, watch } = useFormContext()
  const id = watch("id")

  const { isSubmitting, isSubmitted, isDirty } = formState

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1} style={{ backgroundColor: "#8C64AC" }}>
        {children}
        <Grid container direction="row" spacing={2}>
          <Grid item xs={4}>
            <StyledButton
              color="primary"
              disabled={!isDirty || isSubmitting || isSubmitted}
              onClick={() => handleSubmit(onSubmit, onError)()}
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
              onClick={() =>
                isDirty
                  ? confirm({
                      title: t("confirmationUnsavedChanges"),
                      description: t("confirmationLeaveWithoutSaving"),
                      confirmationText: t("confirmationYes"),
                      cancellationText: t("confirmationNo"),
                    })
                      .then(onCancel)
                      .catch(() => {})
                  : onCancel()
              }
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
              onClick={() =>
                confirm({
                  title: t("confirmationAboutToDelete"),
                  description: t("confirmationDelete"),
                  confirmationText: t("confirmationYes"),
                  cancellationText: t("confirmationNo"),
                }).then(() => onDelete(id))
              }
            >
              {t("delete")}
            </StyledButton>
          ) : null}
        </Grid>
      </FormBackground>
    </Container>
  )
}
