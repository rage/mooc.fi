import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react"

import { useConfirm } from "material-ui-confirm"
import { Path, useFormContext } from "react-hook-form"

import BuildIcon from "@mui/icons-material/Build"
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined"
import { LoadingButton } from "@mui/lab"
import { Checkbox, Container, Paper, Tooltip } from "@mui/material"
import { styled } from "@mui/material/styles"
import { useEventCallback } from "@mui/material/utils"

import { useEditorContext, useEditorMethods } from "./EditorContext"
import { FormValues } from "./types"
import useExitConfirmation from "/hooks/useExitConfirmation"
import { useTranslator } from "/hooks/useTranslator"
import CommonTranslations from "/translations/common"

const isProduction = process.env.NODE_ENV === "production"

const FormBackground = styled(Paper)`
  padding: 2em;
`

const StyledForm = styled("form")`
  background-color: white;
  padding: 2rem;
`

const StyledFormBackground = styled(FormBackground)`
  background-color: #8c64ac;
`

StyledFormBackground.defaultProps = {
  elevation: 1,
}

const ButtonContainer = styled("div")`
  display: flex;
  width: 100%;
  gap: 0.5rem;
  margin-top: 0.5rem;
`

const StyledLoadingButton = styled(LoadingButton)`
  height: 3rem;
  font-size: larger;
`

function EditorContainer<T extends FormValues = FormValues>(
  props: PropsWithChildren,
) {
  const { children } = props
  const t = useTranslator(CommonTranslations)
  const confirm = useConfirm()
  const [deleteVisible, setDeleteVisible] = useState(false)
  const { isClone } = useEditorContext()
  const { onSubmit, onError, onCancel, onDelete } = useEditorMethods<T>()
  const { handleSubmit, formState, watch, setValue } = useFormContext<T>()
  const id = watch("id" as Path<T>)

  const { isSubmitting, isSubmitted, isDirty, isValid } = formState

  useExitConfirmation({
    enabled: isDirty,
  })
  useEffect(() => {
    // for unsaved changes; let's not do this for just new courses
    if (isClone) {
      setValue("id" as Path<T>, id, { shouldDirty: true })
    }
  }, [])

  const onSaveClick = useEventCallback(() => handleSubmit(onSubmit, onError)())

  const onCancelClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      if (!isDirty) {
        return onCancel()
      }
      try {
        await confirm({
          title: t("confirmationUnsavedChanges"),
          description: t("confirmationLeaveWithoutSaving"),
          confirmationText: t("confirmationYes"),
          cancellationText: t("confirmationNo"),
        })
        return onCancel()
      } catch {}
    },
    [isDirty, onCancel, confirm, t],
  )

  const onDeleteClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()

      try {
        await confirm({
          title: t("confirmationAboutToDelete"),
          description: t("confirmationDelete"),
          confirmationText: t("confirmationYes"),
          cancellationText: t("confirmationNo"),
        })
        return onDelete(id)
      } catch {}
    },
    [id, onDelete, confirm, t],
  )

  const onDeleteVisibleClick = useEventCallback(() =>
    setDeleteVisible((value) => !value),
  )

  return (
    <Container maxWidth="md">
      <StyledFormBackground>
        <StyledForm
          onSubmit={handleSubmit(onSubmit, onError)}
          autoComplete="none"
        >
          {children}
        </StyledForm>
        <ButtonContainer>
          <StyledLoadingButton
            color="primary"
            size="large"
            variant="contained"
            disabled={!isDirty || isSubmitting}
            onClick={onSaveClick}
            loading={isSubmitting}
            fullWidth
          >
            {t("save")}
          </StyledLoadingButton>
          <StyledLoadingButton
            color="secondary"
            disabled={isSubmitting || (isSubmitted && isValid)}
            variant="contained"
            onClick={onCancelClick}
            fullWidth
          >
            {t("cancel")}
          </StyledLoadingButton>
          {!isProduction && id ? (
            <>
              {deleteVisible && (
                <StyledLoadingButton
                  variant="contained"
                  color="warning"
                  hidden={!deleteVisible}
                  disabled={!deleteVisible || isSubmitting || isSubmitted}
                  onClick={onDeleteClick}
                >
                  {t("delete")}
                </StyledLoadingButton>
              )}
              <Tooltip title={t("showDelete")}>
                <Checkbox
                  color="default"
                  icon={<BuildOutlinedIcon />}
                  checkedIcon={<BuildIcon />}
                  checked={deleteVisible}
                  onChange={onDeleteVisibleClick}
                />
              </Tooltip>
            </>
          ) : null}
        </ButtonContainer>
      </StyledFormBackground>
    </Container>
  )
}

export default EditorContainer
