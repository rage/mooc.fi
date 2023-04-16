import { CardSubtitle, CardTitle } from "components/Text/headers"
import dynamic from "next/dynamic"
import Image from "next/image"

import DoneIcon from "@mui/icons-material/Done"
import { Avatar, Button, Paper, Skeleton } from "@mui/material"
import { styled } from "@mui/material/styles"

import { useTranslator } from "/hooks/useTranslator"
import ProfileTranslations from "/translations/profile"
import { formatDateTime, mapLangToLanguage } from "/util/dataFormatFunctions"
import { addDomain } from "/util/imageUtils"
import notEmpty from "/util/notEmpty"

import {
  CompletionDetailedFieldsFragment,
  UserOverviewCourseFieldsFragment,
} from "/graphql/generated"

const StyledButton = styled(Button)`
  //height: 50%;
  color: black;
`

const CourseAvatar = styled(Avatar)`
  margin: 10px;
  width: 60px;
  height: 60px;
  grid-area: avatar;
`

const CertificateButton = dynamic(() => import("../../CertificateButton"), {
  ssr: false,
  loading: () => <Skeleton />,
})

interface CompletionListItemProps {
  completion: CompletionDetailedFieldsFragment
  course: UserOverviewCourseFieldsFragment // actually also UserCourseSummaryCourseFieldsFragment, but they are kind of compatible
}

const ListItemContainer = styled(Paper)`
  background-color: white;
  margin-bottom: 1rem;
  width: 100%;
  align-items: center;
  padding: 0.5rem;
`

const Row = styled("section")`
  display: flex;
  grid-gap: 0.5rem;
  margin: 0.5rem;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
  @media (max-width: 860px) {
    flex-wrap: wrap;
  }
`

const Column = styled("div")`
  display: flex;
  flex-direction: column;
`
const CompletionColumn = styled(Column)``
const RegistrationColumn = styled(Column)`
  width: 40%;
`
const ButtonColumn = styled(Column)`
  margin-top: 1rem;
  margin-right: 1.5rem;
  gap: 0.5rem;
  @media (max-width: 860px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`

export const CompletionListItem = ({
  completion,
  course,
}: CompletionListItemProps) => {
  const isRegistered = (completion?.completions_registered ?? []).length > 0
  const t = useTranslator(ProfileTranslations)

  const hasCertificate = course?.has_certificate

  return (
    <ListItemContainer>
      <Row>
        <CompletionColumn>
          <Row>
            <Column>
              <CourseAvatar>
                {course?.photo ? (
                  <Image
                    src={addDomain(course.photo.uncompressed)}
                    alt={course.name}
                    fill
                  />
                ) : (
                  course.name.toUpperCase().charAt(0)
                )}
              </CourseAvatar>
            </Column>
            <Column>
              <CardSubtitle>
                <strong>{`${t("completedDate")}${formatDateTime(
                  completion.completion_date,
                )}`}</strong>
              </CardSubtitle>
              {completion.completion_language ? (
                <CardSubtitle>
                  {`${t("completionLanguage")} ${
                    mapLangToLanguage[completion?.completion_language ?? ""] ??
                    completion.completion_language
                  }`}
                </CardSubtitle>
              ) : null}
              {notEmpty(completion.tier) && (
                <CardSubtitle>
                  {`${t("completionTier")} ${t(
                    `completionTier-${completion.tier as 1 | 2 | 3}`,
                  )}`}
                </CardSubtitle>
              )}
              {notEmpty(completion?.grade) && (
                <CardSubtitle>
                  {t("grade")} <strong>{completion.grade}</strong>
                </CardSubtitle>
              )}
            </Column>
          </Row>
          <Row>
            <CardTitle
              component="h2"
              variant="h3"
              style={{ paddingRight: "0.5rem", gridArea: "title" }}
            >
              {course?.name}
            </CardTitle>
          </Row>
        </CompletionColumn>

        <RegistrationColumn>
          {isRegistered && completion.completions_registered
            ? completion.completions_registered?.map((r) => (
                <Row key={r.id}>
                  <Column>
                    <CardSubtitle>
                      <strong>
                        {t("registeredDate")}
                        {formatDateTime(r.created_at)}
                      </strong>
                    </CardSubtitle>
                    {r.organization ? (
                      <CardSubtitle>
                        {t("organization")}
                        {r.organization.slug}
                      </CardSubtitle>
                    ) : null}
                  </Column>
                  <div
                    style={{
                      margin: "auto auto auto 0",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <DoneIcon style={{ color: "green" }} />
                  </div>
                </Row>
              ))
            : null}
        </RegistrationColumn>
        <ButtonColumn>
          {!isRegistered && completion.eligible_for_ects ? (
            <StyledButton
              href={`/register-completion/${course?.slug}`}
              color="secondary"
            >
              {t("registerCompletion")}
            </StyledButton>
          ) : null}
          {hasCertificate && course ? (
            <CertificateButton course={course} completion={completion} />
          ) : null}
        </ButtonColumn>
      </Row>
    </ListItemContainer>
  )
}
