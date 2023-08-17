import { Organization } from "@prisma/client"

import { FRONTEND_URL } from "../../../../../config"
import { EmailTemplaterError } from "../../../../../lib/errors"
import { calculateActivationCode, PromiseReturnType } from "../../../../../util"
import Template from "../types/Template"
import { TemplateParams } from "../types/TemplateParams"

abstract class OrganizationTemplate extends Template {
  override organization: Organization

  constructor(params: TemplateParams) {
    super(params)

    if (!params.organization) {
      throw new EmailTemplaterError(
        "no organization - are you sure you're using the right template?",
      )
    }
    this.organization = params.organization
  }

  async getUserOrganizationJoinConfirmation() {
    // TODO: if we want to have the possibility for an user to have organization memberships
    // in multiple roles, then this will not do
    const userOrganizationJoinConfirmation =
      await this.context.prisma.userOrganizationJoinConfirmation.findFirst({
        where: {
          user_organization: {
            user: { id: this.user.id },
            organization: { id: this.organization.id },
          },
          expired: false,
        },
        include: {
          user_organization: {
            include: {
              user: true,
              organization: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      })

    if (!userOrganizationJoinConfirmation) {
      throw new Error("no user organization join confirmation found")
    }

    if (!userOrganizationJoinConfirmation.user_organization) {
      throw new Error("this user/organization relation does not exist")
    }

    return userOrganizationJoinConfirmation
  }

  async getActivationCode(
    userOrganizationJoinConfirmation?: PromiseReturnType<
      typeof this.getUserOrganizationJoinConfirmation
    >,
  ) {
    const activationCodeResult = await calculateActivationCode({
      prisma: this.context.prisma,
      userOrganizationJoinConfirmation:
        userOrganizationJoinConfirmation ??
        (await this.getUserOrganizationJoinConfirmation()),
    })

    if (activationCodeResult.isErr()) {
      throw activationCodeResult.error
    }

    return activationCodeResult.value
  }
}
export class OrganizationActivationLink extends OrganizationTemplate {
  async resolve() {
    const userOrganizationJoinConfirmation =
      await this.getUserOrganizationJoinConfirmation()
    const activationCode = await this.getActivationCode(
      userOrganizationJoinConfirmation,
    )

    const { language, redirect } = userOrganizationJoinConfirmation
    const baseUrl = `${FRONTEND_URL}${
      language && language !== "fi" ? `/${language}` : ""
    }`

    // TODO: change url to whatever it will be
    return `${baseUrl}/register/${
      userOrganizationJoinConfirmation.id
    }/?code=${activationCode}${redirect ? `&redirect=${redirect}` : ""}`
  }
}

export class OrganizationActivationCode extends OrganizationTemplate {
  async resolve() {
    return this.getActivationCode()
  }
}

export class OrganizationName extends OrganizationTemplate {
  async resolve() {
    return this.organization.name ?? ""
  }
}

export class OrganizationActivationCodeExpiryDate extends OrganizationTemplate {
  async resolve() {
    const userOrganizationJoinConfirmation =
      await this.getUserOrganizationJoinConfirmation()

    return (
      userOrganizationJoinConfirmation.expires_at?.toLocaleString("en") ?? ""
    )
  }
}
