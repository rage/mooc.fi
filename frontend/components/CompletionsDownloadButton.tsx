import { useCallback, useId, useState } from "react"

import { DateTime } from "luxon"

import DownloadIcon from "@mui/icons-material/Download"
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"

import { useAlertContext } from "/contexts/AlertContext"
import { useTranslator } from "/hooks/useTranslator"
import { getAccessToken } from "/lib/authentication"
import CompletionsTranslations from "/translations/completions"

const StyledDialog = styled(Dialog)`
  & .MuiDialog-paper {
    min-width: 400px;
    padding: 2rem;
  }
`

const StyledDialogTitle = styled(DialogTitle)`
  padding-top: 0 !important;
`

const StyledDialogContent = styled(DialogContent)``

const StyledDialogActions = styled(DialogActions)`
  gap: 0.5rem;
`

const StyledDatePicker = styled(DatePicker)`
  margin-top: 0.5rem;
`

interface CompletionsDownloadButtonProps {
  courseId: string
}

const CompletionsDownloadButton = ({
  courseId,
}: CompletionsDownloadButtonProps) => {
  const t = useTranslator(CompletionsTranslations)
  const { addAlert } = useAlertContext()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<DateTime | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dialogTitleId = useId()

  const handleOpenDialog = useCallback(() => {
    setDialogOpen(true)
  }, [])

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false)
    setSelectedDate(null)
  }, [])

  const handleDownload = useCallback(async () => {
    setIsLoading(true)
    try {
      // First, request a single-use token
      const tokenParams = new URLSearchParams()
      if (selectedDate) {
        const isoDate = selectedDate.toISODate()
        if (!isoDate) {
          throw new Error("Failed to convert date to ISO format")
        }
        tokenParams.append("fromDate", isoDate)
      }

      const accessToken = getAccessToken(undefined)

      const tokenResponse = await fetch(
        `/api/completions/${courseId}/csv/token?${tokenParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      if (!tokenResponse.ok) {
        throw new Error("Failed to generate download token")
      }

      const { token } = await tokenResponse.json()

      // Use the token to download the CSV
      const link = document.createElement("a")
      link.href = `/api/completions/${courseId}/csv?token=${token}`
      link.click()

      addAlert({
        title: t("downloadCompletionsSuccess"),
        message: t("downloadCompletionsSuccessMessage"),
        severity: "success",
      })

      setDialogOpen(false)
      setSelectedDate(null)
    } catch (error) {
      addAlert({
        title: t("downloadCompletionsError"),
        message:
          error instanceof Error
            ? error.message
            : t("downloadCompletionsErrorMessage"),
        severity: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }, [selectedDate, courseId, t, addAlert])

  return (
    <>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleOpenDialog}
        disabled={isLoading}
      >
        {t("downloadCompletions")}
      </Button>

      <StyledDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby={dialogTitleId}
      >
        <StyledDialogTitle id={dialogTitleId}>
          {t("downloadCompletionsDialogTitle")}
        </StyledDialogTitle>
        <StyledDialogContent>
          <StyledDatePicker
            label={t("downloadCompletionsDateLabel")}
            value={selectedDate}
            onChange={(date) => setSelectedDate(date as DateTime | null)}
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={handleCloseDialog} disabled={isLoading}>
            {t("downloadCompletionsCancel")}
          </Button>
          <Button
            onClick={handleDownload}
            variant="contained"
            color="primary"
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress size={20} sx={{ marginRight: "0.5rem" }} />
            )}
            {t("downloadCompletionsDownload")}
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </>
  )
}

export default CompletionsDownloadButton
