import React from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core"

const ConfirmationDialog = ({
  title,
  content,
  acceptText = "OK",
  rejectText = "Cancel",
  onAccept,
  onReject,
  show,
}: {
  title: string
  content: string
  acceptText?: string
  rejectText?: string
  onAccept: (event: React.MouseEvent) => void
  onReject: (event: React.MouseEvent) => void
  show: boolean
}) => {
  return (
    <div>
      <Dialog open={show}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={onReject} color="primary" autoFocus>
            {rejectText}
          </Button>
          <Button onClick={onAccept} color="primary">
            {acceptText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ConfirmationDialog
