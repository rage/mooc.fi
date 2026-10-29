import { newRelicPlugin } from "../newrelic"

jest.mock("newrelic", () => ({
  setTransactionName: jest.fn(),
  noticeError: jest.fn(),
}))

const mockNewrelic = jest.requireMock("newrelic")

const createMiddleware = (parentTypeName: string) =>
  newRelicPlugin().config.onCreateFieldResolver!({
    parentTypeConfig: { name: parentTypeName },
    fieldConfig: { name: "field" },
  } as any)!

describe("newRelicPlugin", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("names the transaction after the root field", async () => {
    const next = jest.fn().mockResolvedValue("value")

    await expect(
      createMiddleware("Query")(undefined, {}, {}, {} as any, next),
    ).resolves.toBe("value")
    expect(mockNewrelic.setTransactionName).toHaveBeenCalledWith(
      "graphql/Query.field",
    )
  })

  it("doesn't rename the transaction for nested fields", () => {
    createMiddleware("Course")({}, {}, {}, {} as any, () => "value")

    expect(mockNewrelic.setTransactionName).not.toHaveBeenCalled()
  })

  it.each([
    [
      "rejects",
      () => {
        return Promise.reject(new Error("boom"))
      },
    ],
    [
      "throws",
      () => {
        throw new Error("boom")
      },
    ],
  ])("resolves once and rethrows when the resolver %s", async (_, fail) => {
    const next = jest.fn(fail)

    await expect(
      (async () =>
        createMiddleware("Query")(undefined, {}, {}, {} as any, next))(),
    ).rejects.toThrow("boom")
    expect(next).toHaveBeenCalledTimes(1)
    expect(mockNewrelic.noticeError).toHaveBeenCalledTimes(1)
  })
})
