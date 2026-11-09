import { FRONTEND_URL } from "../../../../../config"
import { getTestContext } from "../../../../../tests"
import { seed } from "../../../../../tests/data"
import { EmailTemplater } from "../EmailTemplater"

const ctx = getTestContext()

const CONFIRMATION_ID = "61300000-0000-0000-0000-000000000001"
const USER_ID = "20000000000000000000000000000102"
const ORGANIZATION_ID = "10000000000000000000000000000103"

const render = async (txt_body: string) => {
  const [emailTemplate, user, organization] = await Promise.all([
    ctx.prisma.emailTemplate.findUniqueOrThrow({
      where: { id: "48383100000000000000000000000101" },
    }),
    ctx.prisma.user.findUniqueOrThrow({ where: { id: USER_ID } }),
    ctx.prisma.organization.findUniqueOrThrow({
      where: { id: ORGANIZATION_ID },
    }),
  ])

  return new EmailTemplater({
    emailTemplate: { ...emailTemplate, txt_body },
    user,
    organization,
    context: { prisma: ctx.prisma },
  }).resolve()
}

describe("organization email templates", () => {
  beforeEach(async () => {
    await seed(ctx.prisma)
    await ctx.prisma.userOrganizationJoinConfirmation.update({
      where: { id: CONFIRMATION_ID },
      data: {
        expired: false,
        activation_code: "012345",
        language: "en",
        redirect: "/courses?a=1&b=<x>#y",
      },
    })
  })

  it("renders the stored activation code", async () => {
    expect(await render("code: {{organization_activation_code}}")).toEqual(
      "code: 012345",
    )
  })

  it("renders an activation link with encoded parameters", async () => {
    const link = new URL(await render("{{organization_activation_link}}"))

    expect(link.origin + link.pathname).toEqual(
      `${FRONTEND_URL}/en/register/${CONFIRMATION_ID}/`,
    )
    expect(link.searchParams.get("code")).toEqual("012345")
    expect(link.searchParams.get("redirect")).toEqual("/courses?a=1&b=<x>#y")
    expect([...link.searchParams.keys()]).toEqual(["code", "redirect"])
  })

  it("refuses to render a confirmation without a stored code", async () => {
    await ctx.prisma.userOrganizationJoinConfirmation.update({
      where: { id: CONFIRMATION_ID },
      data: { activation_code: null },
    })

    await expect(render("{{organization_activation_code}}")).rejects.toThrow(
      "no activation code",
    )
  })
})
