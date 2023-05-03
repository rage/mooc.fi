import { CircularProgress } from "@mui/material"
import { styled } from "@mui/material/styles"

const SpinnerContainer = styled("div")`
  display: flex;
  height: 600px;
  width: 100%;
  padding: 0 24px;
  margin-left: auto;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
`

const Spinner = () => (
  <SpinnerContainer>
    <CircularProgress color="primary" size={60} />
  </SpinnerContainer>
)

export default Spinner
