import dynamic from "next/dynamic"

import { Alert, Slide, SlideProps } from "@mui/material"
import { styled } from "@mui/material/styles"

import {
  useSnackbarContext,
  useSnackbarMethods,
} from "/contexts/SnackbarContext"

const DynamicSnackbar = dynamic(() => import("@mui/material/Snackbar"), {
  loading: () => null,
})

const StyledSnackbar = styled(DynamicSnackbar, {
  shouldForwardProp: (prop) => prop !== "indexFromBottom",
})<{ indexFromBottom?: number }>(
  ({ theme, indexFromBottom = 1 }) => `
  transform: translateY(-${indexFromBottom * 50}px) !important;
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;

  @media (max-width: 1050px) {
    transform: translateY(-${
      Number(theme.mixins.toolbar.minHeight ?? 0) + indexFromBottom * 50
    }px) !important;
  }
`,
)

const TransitionComponent = (props: SlideProps) => (
  <Slide {...props} direction="left" />
)

export default function Snackbars() {
  const snackbars = useSnackbarContext()
  const { handleClose, handleExited } = useSnackbarMethods()

  return (
    <div id="snackbars">
      {snackbars.map((snackbar, index) => (
        <StyledSnackbar
          key={snackbar.key}
          open={snackbar.open}
          onClose={handleClose(snackbar)}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          TransitionComponent={TransitionComponent}
          TransitionProps={{
            onExited: handleExited(snackbar),
          }}
          indexFromBottom={index}
        >
          <Alert
            onClose={handleClose(snackbar)}
            severity={snackbar.severity ?? "info"}
          >
            {snackbar.message}
          </Alert>
        </StyledSnackbar>
      ))}
    </div>
  )
}
