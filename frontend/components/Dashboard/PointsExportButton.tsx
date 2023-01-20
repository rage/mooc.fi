import { useState } from "react"

import { utils, writeFile, type WorkBook } from "xlsx"

import { ApolloClient, useApolloClient } from "@apollo/client"
import { styled } from "@mui/material/styles"

import { ButtonWithPaddingAndMargin as StyledButton } from "/components/Buttons/ButtonWithPaddingAndMargin"

import {
  ExportUserCourseProgressesDocument,
  ExportUserCourseProgressesQuery,
} from "/graphql/generated"

const PointsExportButtonContainer = styled("div")`
  margin-bottom: 1rem;
`

export interface PointsExportButtonProps {
  slug: string
}

function PointsExportButton(props: PointsExportButtonProps) {
  const { slug } = props
  const client = useApolloClient()

  const [infotext, setInfotext] = useState("")

  return (
    <PointsExportButtonContainer>
      <StyledButton
        color="secondary"
        disabled={!(infotext == "" || infotext == "ready")}
        onClick={async () => {
          try {
            setInfotext("Downloading data")
            const data = await downloadInChunks(slug, client, setInfotext)
            setInfotext("constructing csv")
            const objects = await flatten(data)
            console.log(data)
            console.log(objects)
            const sheet = utils.json_to_sheet(objects)
            console.log("sheet", sheet)
            const workbook: WorkBook = {
              SheetNames: [],
              Sheets: {},
            }
            utils.book_append_sheet(workbook, sheet, "UserCourseProgress")
            await writeFile(workbook, slug + "-points.csv"),
              { bookType: "csv", type: "string" }
            setInfotext("ready")
          } catch (e) {
            setInfotext(`Error: ${e}`)
          }
        }}
      >
        Export
      </StyledButton>
      {infotext}
    </PointsExportButtonContainer>
  )
}

async function flatten(
  data: ExportUserCourseProgressesQuery["userCourseProgresses"],
) {
  console.log("data in flatten", data)

  if (!data) {
    return []
  }

  const newData = data.map((datum) => {
    const {
      upstream_id,
      first_name,
      last_name,
      email,
      student_number,
      real_student_number,
    } = datum?.user ?? {}
    const { course_variant, country, language } =
      datum?.user_course_settings ?? {}
    const groups: Record<string, number> = {}

    for (const progress of datum?.progress ?? []) {
      groups[progress.group] = progress.n_points
    }

    const newDatum = {
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
      ...groups,
    }
    return newDatum
  })
  return newData
}

async function downloadInChunks(
  courseSlug: string,
  client: ApolloClient<object>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
): Promise<ExportUserCourseProgressesQuery["userCourseProgresses"]> {
  const res: ExportUserCourseProgressesQuery["userCourseProgresses"] = []
  // let after: string | undefined = undefined
  let skip = 0

  while (1 === 1) {
    const { data } = await client.query({
      query: ExportUserCourseProgressesDocument,
      variables: {
        course_slug: courseSlug,
        skip,
        take: 100,
        /*after: after, 
        first: 100*/
      },
    })
    const downloaded = data?.userCourseProgresses ?? []
    if (downloaded.length === 0) {
      break
    }
    //after = downloaded[downloaded.length - 1]?.id
    // console.log("After:", after)
    skip += downloaded.length
    console.log("Skip:", skip)

    const nDownLoaded = res.push(...downloaded)
    setMessage(`Downloaded progress for ${nDownLoaded} users...`)
  }
  return res
}

export default PointsExportButton
