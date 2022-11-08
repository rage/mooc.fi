import styled from "@emotion/styled"
import { Card, CardContent } from "@mui/material"

export const ErrorMessageBackground = styled(Card)`
  background-color: #c25450;
  max-width: 75%;
  margin: 2rem auto 2rem auto;
  color: white;
`

export const ErrorMessageContentArea = styled(CardContent)`
  display: flex;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
`
