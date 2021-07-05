import {
  Card,
  Button,
  Typography,
  CardContent,
  TableCell,
  TableRow,
  Table,
  TableBody,
  TableContainer,
  Collapse,
} from "@material-ui/core"
import styled from "@emotion/styled"
import { ProfileUserOverView_currentUser_verified_users } from "/static/types/generated/ProfileUserOverView"
import React, { useState } from "react"
import { CardTitle } from "/components/Text/headers"
import { useConfirm } from "material-ui-confirm"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUnlink } from "@fortawesome/free-solid-svg-icons"
import CollapseButton from "/components/Buttons/CollapseButton"
import parseSchacPersonalUniqueCode from "/util/parseSchacUniqueCode"
import { useTranslator } from "/util/useTranslator"
import ProfileTranslations from "/translations/profile"

interface ConnectionEntryProps {
  data: ProfileUserOverView_currentUser_verified_users
  onDisconnect: (_: ProfileUserOverView_currentUser_verified_users) => void
}

const ConnectionEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
`

const ConnectionEntryCardTitle = styled(CardTitle)`
  display: flex;
  justify-content: space-between;
`

const ConnectionEntryCardContent = styled(CardContent)`
  :last-child {
    padding-bottom: 0.5rem;
  }
`

const ConnectionButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 0;
  padding: 0;
`

function ConnectionEntry({ data, onDisconnect }: ConnectionEntryProps) {
  const t = useTranslator(ProfileTranslations)
  const confirm = useConfirm()
  const [isOpen, setIsOpen] = useState(false)
  const codes = parseSchacPersonalUniqueCode(data?.personal_unique_code)

  console.log(codes)

  return (
    <ConnectionEntryCard>
      <ConnectionEntryCardTitle variant="section">
        <Typography variant="h3">{data?.home_organization}</Typography>
        <CollapseButton
          open={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        />
      </ConnectionEntryCardTitle>
      <Collapse in={isOpen} style={{ marginBottom: "0rem", padding: 0 }}>
        <ConnectionEntryCardContent>
          <TableContainer style={{ marginBottom: "0.5rem" }}>
            <Table>
              <TableBody>
                {codes.map((code, index) => (
                  <TableRow key={code.identifier ?? `code-${index}`}>
                    <TableCell>{code.organizationOrCountry}</TableCell>
                    <TableCell>{code.type}</TableCell>
                    <TableCell>{code.identifier}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <ConnectionButtonContainer>
            <Button
              onClick={() => {
                confirm({
                  title: t("disconnectWarningTitle"),
                  description: t("disconnectWarningDescription", { organization: data?.home_organization}),
                  confirmationText: t("disconnectWarningConfirmationText"),
                  cancellationText: t("disconnectWarningCancellationText"),
                }).then(() => onDisconnect(data))
              }}
              startIcon={<FontAwesomeIcon icon={faUnlink} />}
              color="secondary"
            >
              Disconnect
            </Button>
          </ConnectionButtonContainer>
        </ConnectionEntryCardContent>
      </Collapse>
    </ConnectionEntryCard>
  )
}

export default ConnectionEntry
