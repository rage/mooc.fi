import type { ExtendedPrismaClient } from "../../prisma"

/** The seeded user behind `FAKE_NORMAL_USER_AUTHORIZATION_HEADERS`. */
export const NORMAL_USER_ID = "20000000000000000000000000000102"

/** Makes the normal test user an owner of the course. */
export const grantOwnership = (
  prisma: ExtendedPrismaClient,
  courseId: string,
) =>
  prisma.courseOwnership.create({
    data: {
      user: { connect: { id: NORMAL_USER_ID } },
      course: { connect: { id: courseId } },
    },
  })
