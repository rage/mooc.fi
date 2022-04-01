import styled from "@emotion/styled"
import Typography from "@mui/material/Typography"

export const CardWrapper = styled.div`
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 3px 3px 4px rgba(88, 89, 91, 0.25);
  border-left: 1px solid rgba(88, 89, 91, 0.25);
  min-height: 300px;
  display: flex;
  flex-direction: column;
`

export const BackgroundImage = styled.img`
  opacity: 0.4;
  position: absolute;
  left: 70%;
  top: 0.5rem;
  width: 25%;
  height: auto;
  clip: rect(0, auto, calc(52px - 1rem), auto);
  z-index: 0;
`

export const CardBody = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  height: 100%;
`

export const CardDescription = styled.p`
  height: 100%;
`

export const CardActionArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const CardTitle = styled((props: any) => (
  <Typography variant="h6" {...props} />
))`
  z-index: 1;
`
