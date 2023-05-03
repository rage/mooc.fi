import { CardSubtitle, CardTitle } from "components/Text/headers"
import dynamic from "next/dynamic"
import Image from "next/image"

import DoneIcon from "@mui/icons-material/Done"
import { Avatar, Button, Paper, PaperProps, Skeleton } from "@mui/material"
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
  color: black;
  text-align: center;
  max-width: 20vw;
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
  display: flex;
  flex-direction: column;
` as typeof Paper

const Row = styled("div")`
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

const ListItemTitle = styled(CardTitle)`
  padding-right: 0.5rem;
` as typeof CardTitle

const CompletionColumn = styled(Column)``

const ButtonColumn = styled(Column)`
  gap: 0.5rem;
  margin-left: 1rem;
  margin-top: auto;
  margin-bottom: auto;
  width: fit-content;
  justify-items: center;
  @media (max-width: 860px) {
    flex: 1;
    flex-direction: row;
    justify-content: flex-end;
  }
`

export const CompletionListItem = ({
  completion,
  course,
  ...paperProps
}: CompletionListItemProps & PaperProps) => {
  const isRegistered = (completion?.completions_registered ?? []).length > 0
  const t = useTranslator(ProfileTranslations)

  const hasCertificate = course?.has_certificate

  return (
    <ListItemContainer {...paperProps}>
      <Row>
        <ListItemTitle component="h2" variant="h3">
          {course?.name}
        </ListItemTitle>
      </Row>
      <Row>
        <Column>
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
                    <strong>{`${t("completedDate")} ${formatDateTime(
                      completion.completion_date,
                    )}`}</strong>
                  </CardSubtitle>
                  {completion.completion_language ? (
                    <CardSubtitle>
                      {`${t("completionLanguage")} ${
                        mapLangToLanguage[
                          completion?.completion_language ?? ""
                        ] ?? completion.completion_language
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
                  {isRegistered && completion.completions_registered
                    ? completion.completions_registered?.map((r) => (
                        <Column id={r.id} key={r.id}>
                          <CardSubtitle display="flex" alignItems="flex-end">
                            <strong>
                              {t("registeredDate")}{" "}
                              {formatDateTime(r.created_at)}
                            </strong>
                            <DoneIcon color="success" />
                          </CardSubtitle>
                          {r.organization ? (
                            <CardSubtitle>
                              {r.organization.name ??
                                `${t("organization")} ${r.organization.slug}`}
                            </CardSubtitle>
                          ) : null}
                        </Column>
                      ))
                    : null}
                </Column>
              </Row>
            </CompletionColumn>
          </Row>
        </Column>
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
            <CertificateButton
              course={course}
              completion={completion}
              sx={{ width: "100%" }}
            />
          ) : null}
        </ButtonColumn>
      </Row>
    </ListItemContainer>
  )
}
