import { CircularProgress, LinearProgress } from "@mui/material"
import { styled } from "@mui/material/styles"
import usePageLoadProgress from "/hooks/usePageLoadProgress"

const FixedLinearProgress = styled(LinearProgress)`
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  width: 100%;
  z-index: 10000;
`

const FixedCircularProgress = styled(CircularProgress)`
  position: fixed;
  top: 15px;
  right: 15px;
  z-index: 10000;
`

const PageLoadingIndicators = () => {
  const { loading, loadingTakingLong } = usePageLoadProgress()

  return (
    <>
      {loading && <FixedLinearProgress />}
      {loadingTakingLong && <FixedCircularProgress size={15} />}
    </>
  )
}

export default PageLoadingIndicators