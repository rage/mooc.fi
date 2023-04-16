import { Dispatch, useCallback, useEffect, useState } from "react"

import {
  FormikContextType,
  FormikErrors,
  FormikTouched,
  useFormikContext,
} from "formik"
import { useConfirm } from "material-ui-confirm"

import {
  CircularProgress,
  Container,
  Grid,
  Checkbox as MUICheckbox,
  Paper,
  Tooltip,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import { useLegacyAnchorContext } from "./LegacyAnchorContext"
import { FormValues } from "./types"
import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"
import { getFirstErrorAnchor } from "/hooks/useEnumeratingAnchors"
import { useTranslator } from "/hooks/useTranslator"
import withEnumeratingAnchors from "/lib/with-enumerating-anchors"
import CommonTranslations from "/translations/common"
import flattenKeys from "/util/flattenKeys"

// TODO: show delete to course owner
const isProduction = process.env.NODE_ENV === "production"

const FormBackground = styled(Paper)(
  ({ theme }) => `
  padding: 2em;
  ${theme.breakpoints.down("md")} {
    padding: 0;
  }
`,
)

const Status = styled("p", { shouldForwardProp: (prop) => prop !== "error" })<
  FormikContextType<unknown>["status"]
>`
  color: ${(props) => (props.error ? "#FF0000" : "default")};
`

interface FormWrapperProps<T extends FormValues> {
  onCancel: () => void
  onDelete: (values: T) => void
  // renderForm: (props: any) => ReactNode
  tab?: number
  setTab?: Dispatch<React.SetStateAction<number>>
}

const FormWrapper = <T extends FormValues>(
  props: React.PropsWithChildren<FormWrapperProps<T>>,
) => {
  const {
    submitForm,
    errors,
    dirty,
    isSubmitting,
    values,
    status,
    setTouched,
  } = useFormikContext<T>()
  const { onCancel, onDelete, setTab = (_) => void 0, children } = props
  const t = useTranslator(CommonTranslations)
  const { anchors } = useLegacyAnchorContext()
  const confirm = useConfirm()

  const [deleteVisible, setDeleteVisible] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const errorsToTouched = useCallback(
    (errs: FormikErrors<T>): FormikTouched<T> =>
      Object.assign(
        {},
        ...Object.keys(flattenKeys(errs)).map((k) => ({ [k]: true })),
      ),
    [],
  )

  const onSubmit = useCallback(() => {
    if (Object.keys(errors).length) {
      setTouched(errorsToTouched(errors))

      const { anchor, anchorLink } = getFirstErrorAnchor(anchors, errors)

      setTab(anchor?.tab ?? 0)

      setImmediate(() => {
        // TODO: add a simple pulsating animation to the field for a while
        const element = document.getElementById(anchorLink)
        element?.scrollIntoView()
      })
    } else {
      setSubmitted(true)
      submitForm()
    }
  }, [errors])

  useEffect(() => {
    if (status?.message && status?.error) {
      setSubmitted(false)
    }
  }, [status])

  const onCancelClick = useCallback(() => {
    if (dirty) {
      return confirm({
        title: t("confirmationUnsavedChanges"),
        description: t("confirmationLeaveWithoutSaving"),
        confirmationText: t("confirmationYes"),
        cancellationText: t("confirmationNo"),
      })
        .then(onCancel)
        .catch(() => {
          // ignore
        })
    }
    return onCancel()
  }, [dirty])

  const onDeleteClick = useCallback(
    () =>
      confirm({
        title: t("confirmationAboutToDelete"),
        description: t("confirmationDelete"),
        confirmationText: t("confirmationYes"),
        cancellationText: t("confirmationNo"),
      }).then(() => onDelete(values)),
    [values],
  )

  const onToggleDeleteVisible = useCallback(
    () => setDeleteVisible((value) => !value),
    [],
  )

  return (
    <Container maxWidth="md">
      <FormBackground elevation={1} style={{ backgroundColor: "#8C64AC" }}>
        {children}
        <br />
        <Grid container direction="row" spacing={2}>
          <Grid item xs={4}>
            <StyledButton
              color="primary"
              disabled={!dirty || isSubmitting || submitted}
              onClick={onSubmit}
              style={{ width: "100%" }}
            >
              {isSubmitting ? <CircularProgress size={20} /> : t("save")}
            </StyledButton>
          </Grid>
          <Grid item xs={4}>
            <StyledButton
              color="secondary"
              style={{ width: "100%" }}
              disabled={isSubmitting || submitted}
              variant="contained"
              onClick={onCancelClick}
            >
              {t("cancel")}
            </StyledButton>
          </Grid>
          <Grid item xs={2}>
            {!isProduction && values.id ? (
              <Tooltip title={t("showDelete")}>
                <MUICheckbox
                  checked={deleteVisible}
                  onChange={onToggleDeleteVisible}
                />
              </Tooltip>
            ) : null}
            {deleteVisible && values.id ? (
              <StyledButton
                variant="contained"
                color="secondary"
                disabled={isSubmitting || submitted}
                onClick={onDeleteClick}
              >
                {t("delete")}
              </StyledButton>
            ) : null}
          </Grid>
        </Grid>
        {status?.message ? (
          <Status error={status.error}>
            {status.error ? t("submittingError") : null}
            <b>{status.message}</b>
          </Status>
        ) : null}
      </FormBackground>
    </Container>
  )
}

// need to pass type through
// @ts-ignore: not used for now?
const WrappedFormWrapper: <T extends FormValues>(
  props: React.PropsWithChildren<FormWrapperProps<T>>,
) => JSX.Element = withEnumeratingAnchors(FormWrapper)

export default withEnumeratingAnchors(FormWrapper) // as typeof FormWrapper
