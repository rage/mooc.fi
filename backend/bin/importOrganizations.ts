import { omit } from "lodash"

import { Prisma } from "@prisma/client"

import { OrganizationInfo, UserInfo } from "../domain/UserInfo"
import { TMCError } from "../lib/errors"
import sentryLogger from "../lib/logger"
import prisma from "../prisma"
import { generateSecret } from "../schema/Organization"
import TmcClient from "../services/tmc"

const tmc = new TmcClient()

const logger = sentryLogger({ service: "import-organizations" })

const fetchOrganizations = async () => {
  logger.info("Fetching organizations...")
  const orgInfos: OrganizationInfo[] = await tmc.getOrganizations()
  logger.info(`Received ${orgInfos.length} organizations.`)
  for (const org of orgInfos) {
    logger.info(`Upserting organization ${org.slug}`)
    await upsertOrganization(org)
  }
  await prisma.$disconnect()
}

const parseLogoSize = (organization: OrganizationInfo) => {
  const { logo_file_size } = organization
  if (!logo_file_size) {
    return undefined
  }

  const parsed = parseInt(logo_file_size)

  if (isNaN(parsed)) {
    logger.warn(
      "Failed to parsed logo_file_size - organization data: " +
        JSON.stringify(organization, null, 2),
    )
    return undefined
  }

  return parsed
}

const upsertOrganization = async (org: OrganizationInfo) => {
  const user =
    org.creator_id != null ? await getUserFromTmc(org.creator_id) : null

  const details: Prisma.OrganizationUpdateInput = {
    ...(omit(org, ["id", "creator_id", "whitelisted_ips", "logo_path"]) as Omit<
      OrganizationInfo,
      "id" | "creator_id" | "whitelisted_ips" | "logo_path"
    >),
    name: org.name,
    disabled_reason: org.disabled_reason,
    information: org.information,
    verified: org.verified ?? false,
    disabled: org.disabled ?? false,
    hidden: org.hidden ?? false,
    creator: user !== null ? { connect: { id: user.id } } : undefined,
    logo_file_size: parseLogoSize(org),
    pinned: org.pinned ?? false,
  }

  await prisma.organization.upsert({
    where: {
      slug: org.slug,
    },
    create: {
      ...(details as Prisma.OrganizationCreateInput),
      secret_key: await generateSecret(),
    },
    update: details,
  })
}

const getUserFromTmc = async (user_id: number) => {
  let details: UserInfo | undefined

  try {
    details = await tmc.getUserDetailsById(user_id)
  } catch (e) {
    logger.error(new TMCError(`couldn't find user`, { user_id }, e))
    throw e
  }

  const prismaDetails = {
    upstream_id: details.id,
    administrator: details.administrator,
    email: details.email.trim(),
    first_name: details.user_field.first_name.trim(),
    last_name: details.user_field.last_name.trim(),
    username: details.username,
  }

  return prisma.user.upsert({
    where: { upstream_id: details.id },
    create: prismaDetails,
    update: prismaDetails,
  })
}

fetchOrganizations()
  .then(() => {
    logger.info("Done")
    process.exit(0)
  })
  .catch((e) => {
    logger.error(e)
    process.exit(1)
  })
