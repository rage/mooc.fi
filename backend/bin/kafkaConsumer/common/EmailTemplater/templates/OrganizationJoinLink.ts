import { calculateActivationCode } from "../../../../../util/calculate-activation-code"
import Template from "../types/Template"

export class OrganizationJoinLink extends Template {
  async resolve() {
    if (!this.organization) {
      throw new Error(
        "no organization - are you sure you're using the right template?",
      )
    }

    // TODO: if we want to have the possibility for an user to have organization memberships
    // in multiple roles, then this will not do
    const userOrganization =
      await this.context.prisma.userOrganization.findFirst({
        where: {
          user: { id: this.user.id },
          organization: { id: this.organization.id },
        },
        include: {
          user_organization_join_confirmations: {
            where: {
              expired: false,
            },
          },
        },
      })

    if (!userOrganization) {
      throw new Error("this user/organization relation does not exist")
    }

    const { user_organization_join_confirmations } = userOrganization

    if (
      !user_organization_join_confirmations ||
      !user_organization_join_confirmations.length
    ) {
      throw new Error("no user organization join confirmation found")
    }

    const activationCode = calculateActivationCode({
      user: this.user,
      organization: this.organization,
      userOrganizationJoinConfirmation: user_organization_join_confirmations[0],
    })

    return `https://mooc.fi/en/organization/${this.organization.slug}/activate/${user_organization_join_confirmations[0].id}?code=${activationCode}`
  }
}
