import { parseTimestamp } from ".."
import { fail } from "../../../../tests"

interface TestCase {
  input: string
  output?: string
  throws?: boolean
}

interface TestCategory {
  name: string
  cases: Array<TestCase>
}

describe("parseTimestamp", () => {
  const tests: Array<[string, Array<TestCategory>]> = [
    [
      "success",
      [
        {
          name: "ISO",
          cases: [
            {
              input: "2016-05-25T09:08:34.123",
              output: "2016-05-25T09:08:34.123",
            },
            {
              input: "2016-05-25T09:08:34.123+06:00",
              output: "2016-05-25T03:08:34.123Z",
            },
          ],
        },
        {
          name: "SQL",
          cases: [
            {
              input: "2017-05-15",
              output: "2017-05-15T00:00:00.000Z",
            },
            {
              input: "2017-05-15 09:12:34",
              output: "2017-05-15T09:12:34.000Z",
            },
            {
              input: "2017-05-15 09:12:34.342",
              output: "2017-05-15T09:12:34.342Z",
            },
            {
              input: "2017-05-15 09:12:34.342+06:00",
              output: "2017-05-15T03:12:34.342Z",
            },
            {
              input: "2017-05-15 09:12:34.342 America/Los_Angeles",
              output: "2017-05-15T16:12:34.342Z",
            },
            {
              input: "09:12:34.342",
              output: `${new Date().toISOString().split("T")[0]}T09:12:34.342Z`,
            },
          ],
        },
        {
          name: "RFC2822",
          cases: [
            {
              input: "25 Nov 2016 13:23:12 GMT",
              output: "2016-11-25T13:23:12.000Z",
            },
            {
              input: "Fri, 25 Nov 2016 13:23:12 +0600",
              output: "2016-11-25T07:23:12.000Z",
            },
            {
              input: "25 Nov 2016 13:23 Z",
              output: "2016-11-25T13:23:00.000Z",
            },
          ],
        },
        {
          name: "HTTP",
          cases: [
            {
              input: "Sun, 06 Nov 1994 08:49:37 GMT",
              output: "1994-11-06T08:49:37.000Z",
            },
            {
              input: "Sunday, 06-Nov-94 08:49:37 GMT",
              output: "1994-11-06T08:49:37.000Z",
            },
            {
              input: "Sun Nov  6 08:49:37 1994",
              output: "1994-11-06T08:49:37.000",
            },
          ],
        },
      ],
    ],
    [
      "failure",
      [
        {
          name: "invalid or missing input",
          cases: [
            {
              input: "kissa",
              throws: true,
            },
            {
              input: "",
              throws: true,
            },
          ],
        },
      ],
    ],
  ]

  // TODO: more failing tests
  describe.each(tests)("%s", (_, testTypes) => {
    describe.each(testTypes)("$name", ({ cases }) => {
      it.each(cases)("$input", ({ input, output, throws }) => {
        if (throws) {
          expect(() => {
            parseTimestamp(input)
          }).toThrowError()
        } else {
          try {
            const res = parseTimestamp(input)
            if (output) {
              expect(res?.toJSDate().toISOString()).toMatch(output)
            }
          } catch {
            fail()
          }
        }
      })
    })
  })
})
