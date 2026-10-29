import { OperationDefinitionNode, parse } from "graphql"

import { mutatesPublicApiData } from "../publicCache"

const operation = (source: string) =>
  parse(source).definitions[0] as OperationDefinitionNode

describe("mutatesPublicApiData", () => {
  it("matches mutations of data the public API serves", () => {
    expect(
      mutatesPublicApiData(operation("mutation { updateCourse { id } }")),
    ).toBe(true)
  })

  it("resolves aliases to the field name", () => {
    expect(
      mutatesPublicApiData(
        operation("mutation { renamed: updateStudyModule { id } }"),
      ),
    ).toBe(true)
  })

  it("ignores other mutations and queries", () => {
    expect(
      mutatesPublicApiData(
        operation("mutation { updateResearchConsent(value: true) { id } }"),
      ),
    ).toBe(false)
    expect(mutatesPublicApiData(operation("query { updateCourse }"))).toBe(
      false,
    )
  })
})
