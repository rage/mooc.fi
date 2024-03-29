import { useCallback, useState } from "react"

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

  const onExportClick = useCallback(async () => {
    try {
      const { utils, writeFile } = await import("xlsx")
      setInfotext("Downloading data")
      const data = await downloadInChunks(slug, client, setInfotext)
      setInfotext("constructing csv")
      const objects = await flatten(data)
      const sheet = utils.json_to_sheet(objects)
      const workbook = {
        SheetNames: [],
        Sheets: {},
      }
      utils.book_append_sheet(workbook, sheet, "UserCourseProgress")
      await writeFile(workbook, slug + "-points.csv", {
        bookType: "csv",
        type: "string",
      })
      setInfotext("ready")
    } catch (e) {
      setInfotext(`Error: ${e}`)
    }
  }, [slug, client])

  return (
    <PointsExportButtonContainer>
      <StyledButton
        color="secondary"
        disabled={!(!infotext || infotext == "ready")}
        onClick={onExportClick}
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
  let finished = false
  let res: ExportUserCourseProgressesQuery["userCourseProgresses"] = []

  // kludge to not block the UI
  const download = async (
    skip = 0,
    innerRes: ExportUserCourseProgressesQuery["userCourseProgresses"] = [],
  ) => {
    const { data, error } = await client.query({
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
    if (error) {
      finished = true
      setMessage("Error downloading data")
      return Promise.reject()
    }
    if (downloaded.length === 0) {
      finished = true
      res = innerRes ?? []
      return Promise.resolve()
    }
    //after = downloaded[downloaded.length - 1]?.id
    // console.log("After:", after)
    skip += downloaded.length
    console.log("Skip:", skip)

    const nDownloaded = innerRes?.push(...downloaded)
    setMessage(`Downloaded progress for ${nDownloaded} users...`)
    requestAnimationFrame(() => download(skip, innerRes))
  }
  await (async () => {
    requestAnimationFrame(() => download())
    while (!finished) {
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  })()

  return res
}

export default PointsExportButton
