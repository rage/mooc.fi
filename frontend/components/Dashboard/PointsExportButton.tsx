import React, { useState } from "react"
import gql from "graphql-tag"
import { ApolloConsumer } from "@apollo/react-hooks"
import { Button } from "@material-ui/core"
import XLSX from "xlsx"
import styled from "styled-components"
import {
  ExportUserCourseProgesses,
  ExportUserCourseProgesses_UserCourseProgresses,
} from "../../static/types/generated/ExportUserCourseProgesses"

const PointsExportButtonContainer = styled.div`
  margin-bottom: 1rem;
`

export interface PointsExportButtonProps {
  slug: string
}
function PointsExportButton(props: PointsExportButtonProps) {
  const { slug } = props

  const [infotext, setInfotext] = useState("")

  return (
    <ApolloConsumer>
      {client => (
        <PointsExportButtonContainer>
          <Button
            disabled={!(infotext == "" || infotext == "ready")}
            onClick={async () => {
              setInfotext("Downloading data")
              const { data } = await client.query<ExportUserCourseProgesses>({
                query: GET_DATA,
                variables: { course_slug: slug },
              })
              setInfotext("constructing csv")
              let objects = await flatten(data.UserCourseProgresses)
              console.log(data)
              console.log(objects)
              const sheet = XLSX.utils.json_to_sheet(objects)
              console.log("sheet", sheet)
              const workbook: XLSX.WorkBook = {
                SheetNames: [],
                Sheets: {},
              }
              XLSX.utils.book_append_sheet(
                workbook,
                sheet,
                "UserCourseProgress",
              )
              await XLSX.writeFile(workbook, slug + "-points.csv"),
                { bookType: "csv", type: "string" }
              setInfotext("ready")
            }}
          >
            Export
          </Button>
          {infotext}
        </PointsExportButtonContainer>
      )}
    </ApolloConsumer>
  )
}

async function flatten(data: ExportUserCourseProgesses_UserCourseProgresses[]) {
  console.log("data in flatten", data)

  const newData = data.map(datum => {
    const {
      upstream_id,
      first_name,
      last_name,
      email,
      student_number,
      real_student_number,
    } = datum?.user
    const { course_variant, country, language } =
      datum?.UserCourseSettings ?? {}

    const newDatum: any = {
      user_id: upstream_id,
      first_name: first_name?.replace(/\s+/g, " ").trim() ?? "",
      last_name: last_name?.replace(/\s+/g, " ").trim() ?? "",
      email: email?.replace(/\s+/g, " ").trim() ?? "",
      student_number: student_number?.replace(/\s+/g, " ").trim() ?? "",
      confirmed_student_number:
        real_student_number?.replace(/\s+/g, " ").trim() ?? "",
      course_variant: course_variant?.replace(/\s+/g, " ").trim() ?? "",
      country: country?.replace(/\s+/g, " ").trim() ?? "",
      language: language?.replace(/\s+/g, " ").trim() ?? "",
      ...(datum?.progress?.reduce(
        (obj: any, progress: any) => ({
          ...obj,
          [progress.group]: progress.n_points,
        }),
        {},
      ) ?? {}),
    }
    /*     newDatum.user_id = datum.user.upstream_id
    newDatum.first_name =
      datum.user.first_name != null
        ? datum.user.first_name.replace(/\s+/g, " ").trim()
        : ""
    newDatum.last_name =
      datum.user.last_name != null
        ? datum.user.last_name.replace(/\s+/g, " ").trim()
        : ""
    newDatum.email =
      datum.user.email != null
        ? datum.user.email.replace(/\s+/g, " ").trim()
        : ""
    newDatum.student_number =
      datum.user.student_number != null
        ? datum.user.student_number.replace(/\s+/g, " ").trim()
        : ""
    newDatum.confirmed_student_number =
      datum.user.real_student_number != null
        ? datum.user.real_student_number.replace(/\s+/g, " ").trim()
        : ""

    newDatum.course_variant =
      datum.UserCourseSettings &&
      (datum.UserCourseSettings.course_variant != null
        ? datum.UserCourseSettings.course_variant.replace(/\s+/g, " ").trim()
        : "")
    newDatum.country =
      datum.UserCourseSettings &&
      (datum.UserCourseSettings.country != null
        ? datum.UserCourseSettings.country.replace(/\s+/g, " ").trim()
        : "")
    newDatum.language =
      datum.UserCourseSettings &&
      (datum.UserCourseSettings.language != null
        ? datum.UserCourseSettings.language.replace(/\s+/g, " ").trim()
        : "") */

    /*     datum.progress.forEach((progress: any) => {
      newDatum[progress.group] = progress.n_points
    })
 */
    return newDatum
  })
  return newData
}

export default PointsExportButton

const GET_DATA = gql`
  query ExportUserCourseProgesses($course_slug: String!) {
    UserCourseProgresses(course_slug: $course_slug) {
      id
      user {
        id
        email
        student_number
        real_student_number
        upstream_id
        first_name
        last_name
      }
      progress
      UserCourseSettings {
        course_variant
        country
        language
      }
    }
  }
`
