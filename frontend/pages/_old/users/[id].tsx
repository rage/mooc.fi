import { NextSeo } from "next-seo"
import NextLink from "next/link"
import { useRouter } from "next/router"

import { useQuery } from "@apollo/client"
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { styled } from "@mui/material/styles"

import Container from "/components/Container"
import UserInfo from "/components/Dashboard/Users/UserInfo"
import ModifiableErrorMessage from "/components/ModifiableErrorMessage"
import { useBreadcrumbs } from "/hooks/useBreadcrumbs"
import useIsOld from "/hooks/useIsOld"
import { useQueryParameter } from "/hooks/useQueryParameter"
import { useTranslator } from "/hooks/useTranslator"
import withAdmin from "/lib/with-admin"
import UsersTranslations from "/translations/users"
import { isDefinedAndNotEmpty } from "/util/guards"

import {
  UserOverviewDocument,
  UserProfileUserCourseSettingsDocument,
  UserProfileUserCourseSettingsQueryNodeFieldsFragment,
} from "/graphql/generated"

const PAGE_SIZE = 50

const Links = styled("div")`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 1rem 0;
`

const SectionTitle = styled(Typography)`
  margin: 2rem 0 1rem;
` as typeof Typography

const formatSettings = (
  setting: UserProfileUserCourseSettingsQueryNodeFieldsFragment,
  yes: string,
) =>
  [
    setting.country,
    setting.course_variant,
    setting.research != null && `research: ${setting.research ? yes : "-"}`,
    setting.marketing != null && `marketing: ${setting.marketing ? yes : "-"}`,
    setting.other && JSON.stringify(setting.other),
  ]
    .filter(Boolean)
    .join(", ")

const UserPage = () => {
  const isOld = useIsOld()
  const baseUrl = isOld ? "/_old" : "/admin"
  const { locale } = useRouter()
  const id = useQueryParameter("id")
  const t = useTranslator(UsersTranslations)

  const settingsQuery = useQuery(UserProfileUserCourseSettingsDocument, {
    variables: { upstream_id: Number(id) },
  })
  const userQuery = useQuery(UserOverviewDocument, {
    variables: { upstream_id: Number(id) },
  })
  const user = userQuery.data?.user

  useBreadcrumbs([
    {
      translation: "users",
    },
    {
      label: id,
      href: `${baseUrl}/users/${id}`,
    },
  ])

  const error = settingsQuery.error ?? userQuery.error
  if (error) {
    return (
      <ModifiableErrorMessage
        errorMessage={JSON.stringify(error, undefined, 2)}
      />
    )
  }

  if (settingsQuery.loading || userQuery.loading || !settingsQuery.data) {
    return (
      <Container style={{ display: "flex", height: "600px" }}>
        <Grid item container justifyContent="center" alignItems="center">
          <CircularProgress color="primary" size={60} />
        </Grid>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container>
        <Typography align="center">{t("userNotFound")}</Typography>
      </Container>
    )
  }

  const settings = (settingsQuery.data.userCourseSettings?.edges ?? [])
    .map((edge) => edge?.node)
    .filter(isDefinedAndNotEmpty)
  const formatDate = (date: string) => new Date(date).toLocaleString(locale)
  const yes = locale === "fi" ? "kyllä" : "yes"

  return (
    <>
      <NextSeo title={user.full_name ?? id} />
      <UserInfo data={user} />
      <Container>
        <Links>
          <Button
            variant="outlined"
            component={NextLink}
            href={`${baseUrl}/users/${id}/summary`}
          >
            {t("summary")}
          </Button>
          <Button
            variant="outlined"
            component={NextLink}
            href={`${baseUrl}/users/${id}/completions`}
          >
            {t("completions")}
          </Button>
        </Links>
        <SectionTitle variant="h2">{t("courseSettings")}</SectionTitle>
        {settings.length === 0 ? (
          <Typography>{t("noCourseSettings")}</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>{t("courseSettingsCourse")}</TableCell>
                  <TableCell>{t("courseSettingsLanguage")}</TableCell>
                  <TableCell>{t("courseSettingsSettings")}</TableCell>
                  <TableCell>{t("courseSettingsCreated")}</TableCell>
                  <TableCell>{t("courseSettingsUpdated")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {settings.map((setting) => (
                  <TableRow key={setting.id}>
                    <TableCell>
                      {setting.course ? (
                        <NextLink
                          href={`${baseUrl}/users/${id}/summary/${setting.course.slug}`}
                        >
                          {setting.course.name}
                        </NextLink>
                      ) : (
                        setting.course_id
                      )}
                    </TableCell>
                    <TableCell>{setting.language}</TableCell>
                    <TableCell>{formatSettings(setting, yes)}</TableCell>
                    <TableCell>{formatDate(setting.created_at)}</TableCell>
                    <TableCell>{formatDate(setting.updated_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {settingsQuery.data.userCourseSettings?.pageInfo.hasNextPage && (
          <Typography variant="body2" style={{ marginTop: "0.5rem" }}>
            {t("courseSettingsTruncated", { count: PAGE_SIZE })}
          </Typography>
        )}
      </Container>
    </>
  )
}

export default withAdmin(UserPage)
