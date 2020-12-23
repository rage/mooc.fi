import { Container, Grid, Paper, CircularProgress } from "@material-ui/core"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import CommonTranslations from "/translations/common"
import { useTranslator } from "/translations"

import styled from "styled-components"
import { PropsWithChildren } from "react"
import { useConfirm } from "material-ui-confirm"
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFormContext,
} from "react-hook-form"

const FormBackground = styled(Paper)`
  padding: 2em;
`

interface FormContainerProps {
  onSubmit: SubmitHandler<Record<string, any>>
  onError: SubmitErrorHandler<Record<string, any>>
  onCancel: () => void | Promise<void>
}

export default function FormContainer({
  onSubmit,
  onError,
  onCancel,
  children,
}: PropsWithChildren<FormContainerProps>) {
  const t = useTranslator(CommonTranslations)
  const confirm = useConfirm()

  const { handleSubmit, formState, setValue } = useFormContext()
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
      </FormBackground>
    </Container>
  )
}
