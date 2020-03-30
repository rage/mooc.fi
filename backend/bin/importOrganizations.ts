require("dotenv-safe").config({
  allowEmptyValues: process.env.NODE_ENV === "production",
})
import { prisma, User, Organization } from "../generated/prisma-client"
import TmcClient from "../services/tmc"
import { OrganizationInfo, UserInfo } from "../domain/UserInfo"
import { generateSecret } from "../resolvers/Mutation/organization"
const tmc = new TmcClient()

const fetchOrganizations = async () => {
  const orgInfos: OrganizationInfo[] = await tmc.getOrganizations()
  await Promise.all(orgInfos.map((p) => upsertOrganization(p)))
}

const upsertOrganization = async (org: OrganizationInfo) => {
  const user: User | null =
    org.creator_id != null ? await getUserFromTmc(org.creator_id) : null

  // FIXME: type
  const details: any = {
    slug: org.slug,
    verified_at: org.verified_at,
    verified: org.verified || false,
    disabled: org.disabled || false,
    tmc_created_at: org.created_at,
    tmc_updated_at: org.updated_at,
    hidden: org.hidden || false,
    creator: user != null ? { connect: { id: user.id } } : null,
    logo_file_name: org.logo_file_name,
    logo_content_type: org.logo_content_type,
    logo_file_size: Number(org.logo_file_size),
    logo_updated_at: org.logo_updated_at,
    phone: org.phone,
    contact_information: org.contact_information,
    email: org.email,
    website: org.website,
    pinned: org.pinned || false,
  }

  const organizationExists = await prisma.$exists.organization({
    slug: org.slug,
  })
  let organization: Organization
  if (organizationExists) {
    organization = await prisma.updateOrganization({
      where: {
        slug: org.slug,
      },
      data: details,
    })
  } else {
    organization = await prisma.createOrganization(
      await detailsWithSecret(details),
    )
  }
  const translationDetails = {
    language: "fi_FI", //placholder since there is no language information
    name: org.name,
    disabled_reason: org.disabled_reason,
    information: org.information,
    organization: { connect: { id: organization.id } },
  }
  const organizationTranslations = await prisma
    .organization({ id: organization.id })
    .organization_translations({
      where: { language: translationDetails.language },
    })
  const organizationTranslationId = organizationTranslations.length
    ? organizationTranslations[0].id
    : null
  if (organizationTranslationId != null) {
    await prisma.updateOrganizationTranslation({
      where: { id: organizationTranslationId },
      data: translationDetails,
    })
  } else {
    await prisma.createOrganizationTranslation(translationDetails)
  }
}

// FIXME: type
const detailsWithSecret = async (details: any) => {
  details.secret_key = await generateSecret()
  return details
}

const getUserFromTmc = async (user_id: Number): Promise<User> => {
  const details: UserInfo = await tmc.getUserDetailsById(user_id)
  const prismaDetails = {
    upstream_id: details.id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }
  return await prisma.upsertUser({
    where: { upstream_id: details.id },
    create: prismaDetails,
    update: prismaDetails,
  })
}

fetchOrganizations()
