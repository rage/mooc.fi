import React, { useState } from "react"

import CollapseButton from "/components/Buttons/CollapseButton"
import HYLogo from "/components/HYLogo"
import { DisconnectFunction } from "/components/Profile/OrganizationConnection/useDisconnect"
import { CardTitle } from "/components/Text/headers"
import { CurrentUserUserOverView_currentUser_verified_users } from "/static/types/generated/CurrentUserUserOverView"
import ProfileTranslations from "/translations/profile"
import parseSchacPersonalUniqueCode from "/util/parseSchacUniqueCode"
import { useTranslator } from "/util/useTranslator"
import { DateTime } from "luxon"
import { useConfirm } from "material-ui-confirm"

import styled from "@emotion/styled"
import { faUnlink } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  Button,
  Card,
  CardContent,
  Collapse,
  Typography,
} from "@material-ui/core"

interface ConnectionEntryProps {
  data: CurrentUserUserOverView_currentUser_verified_users
  onDisconnect: DisconnectFunction
}

const ConnectionEntryCard = styled(Card)`
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  width: 100%;
`

const ConnectionEntryCardTitle = styled(CardTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
        {data?.home_organization === "helsinki.fi" ? (
          <HYLogo style={{ width: "50%", maxWidth: "50px" }} />
        ) : (
          <img
            src="/static/images/Haka_nega_rgb_sm.png"
            width="54"
            height="27"
            alt="[Haka]"
          />
        )}
        <Typography
          variant="h3"
          style={{ width: "100%", paddingLeft: "0.5rem" }}
        >
          {data?.home_organization}
        </Typography>
        <CollapseButton
          open={isOpen}
          onClick={() => setIsOpen((value) => !value)}
        />
      </ConnectionEntryCardTitle>
      <Collapse in={isOpen} style={{ marginBottom: "0rem", padding: 0 }}>
        <ConnectionEntryCardContent>
          <Typography variant="body1">
            Liitetty {DateTime.fromISO(data.created_at).toLocaleString()}
          </Typography>
          {/*<TableContainer style={{ marginBottom: "0.5rem" }}>
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
                </TableContainer>*/}
          <ConnectionButtonContainer>
            <Button
              onClick={() => {
                confirm({
                  title: t("disconnectWarningTitle"),
                  description: (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: t("disconnectWarningDescription", {
                          organization: data?.home_organization,
                        }),
                      }}
                    />
                  ),
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
