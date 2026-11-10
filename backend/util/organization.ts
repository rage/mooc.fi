import { Organization } from "../generated/prisma"
import { ExtendedPrismaClient } from "../prisma"

/**
 * Finds the organization that a request authenticating with `secret` acts as.
 * Returns null for an unknown secret or a disabled organization.
 */
export const findActiveOrganizationBySecret = async (
  prisma: ExtendedPrismaClient,
  secret: string,
): Promise<Organization | null> => {
  const organization = await prisma.organization.findUnique({
    where: { secret_key: secret },
  })

  return organization?.disabled ? null : organization
}
