import { ApolloError, UserInputError } from "apollo-server-express"

import { Prisma } from "@prisma/client"
import {
  Organization,
  OrganizationRole,
  User,
  UserOrganization,
} from "@prisma/client"

import { Context } from "../../context"
import {
  emptyOrNullToUndefined,
  err,
  isDefined,
  isNullOrUndefined,
  ok,
  Result,
} from "../../util"
import { ConfigurationError, ConflictError } from "./errors"

export const buildUserSearch = (
  search?: string | null,
): Prisma.UserWhereInput => {
  if (isNullOrUndefined(search)) {
    return {}
  }
  return {
    OR: [
      {
        first_name: { contains: search, mode: "insensitive" },
      },
      {
        last_name: { contains: search, mode: "insensitive" },
      },
      {
        username: { contains: search, mode: "insensitive" },
      },
      {
        email: { contains: search, mode: "insensitive" },
      },
      {
        user_organizations: {
          some: {
            organizational_email: { contains: search, mode: "insensitive" },
          },
        },
      },
      {
        student_number: { contains: search },
      },
      {
        real_student_number: { contains: search },
      },
      {
        upstream_id: Number(search) ?? undefined,
      },
    ],
  }
}

interface ConvertPaginationInput {
  first?: number | null
  last?: number | null
  before?: string | null
  after?: string | null
  skip?: number | null
}

interface ConvertPaginationOptions {
  field?: string
}

interface ConvertPaginationOutput {
  skip?: number
  cursor?: { [key: string]: string }
  take?: number
}

export const convertPagination = (
  { first, last, before, after, skip }: ConvertPaginationInput,
  options?: ConvertPaginationOptions,
): ConvertPaginationOutput => {
  const skipValue = skip || 0
  const { field = "id" } = options || {}

  if (!first && !last) {
    throw new Error("first or last must be defined")
  }

  return {
    skip: isDefined(before) ? skipValue + 1 : skipValue,
    take: isDefined(last) ? -(last ?? 0) : isDefined(first) ? first : 0,
    cursor: isDefined(before)
      ? { [field]: before }
      : isDefined(after)
      ? { [field]: after }
      : undefined,
  }
}

export const getCourseOrAliasBySlug =
  (ctx: Context) => async (slug: string) => {
    let course = await ctx.prisma.course.findUnique({
      where: { slug },
    })

    if (!course) {
      course = await ctx.prisma.courseAlias
        .findUnique({
          where: {
            course_code: slug,
          },
        })
        .course()

      if (!course) {
        throw new UserInputError("course or course alias not found", {
          argumentName: "slug",
        })
      }
    }

    return course
  }

export const getCourseOrCompletionHandlerCourse =
  (ctx: Context) =>
  async ({ id, slug }: Prisma.CourseWhereUniqueInput) => {
    if (!id && !slug) {
      throw new UserInputError("must provide id and/or slug", {
        argumentName: ["id", "slug"],
      })
    }

    const course = await ctx.prisma.course.findUnique({
      where: {
        id,
        slug,
      },
      include: {
        completions_handled_by: true,
      },
    })

    return course?.completions_handled_by ?? course
  }

export const checkEmailValidity = (
  email?: string | null,
  requiredPattern?: string | null,
): Result<boolean, Error> => {
  if (!email) {
    return err(
      new UserInputError(
        "no email specified and no email found in user profile",
      ),
    )
  }

  if (requiredPattern) {
    if (!email.match(requiredPattern)) {
      return err(
        new UserInputError(
          "given email does not fulfill organization email requirements",
        ),
      )
    }
  }

  return ok(true)
}

interface JoinUserOrganizationOptions {
  ctx: Context
  user: User
  organization: Organization
  organizational_email?: string | null
  organizational_identifier?: string | null
  redirect?: string | null
  language?: string | null
}

export const joinUserOrganization = async ({
  ctx,
  user,
  organization,
  organizational_email,
  organizational_identifier,
}: JoinUserOrganizationOptions) => {
  const exists = await ctx.prisma.userOrganization.findFirst({
    where: {
      user_id: user.id,
      organization_id: organization.id,
    },
    select: {
      id: true,
    },
  })

  if (exists) {
    return err(
      new ConflictError("this user/organization relation already exists"),
    )
  }

  const { required_confirmation } = organization

  const currentDate = new Date()

  const userOrganization = await ctx.prisma.userOrganization.create({
    data: {
      user: { connect: { id: user.id } },
      organization: {
        connect: { id: organization.id },
      },
      role: OrganizationRole.Student,
      organizational_email: emptyOrNullToUndefined(organizational_email),
      organizational_identifier: emptyOrNullToUndefined(
        organizational_identifier,
      ),
      ...(!required_confirmation && {
        confirmed: true,
        confirmed_at: currentDate,
      }),
      // we assume that the consent is given in the frontend
      consented: true,
    },
  })

  return ok(userOrganization)
}

interface CancelEmailDeliveriesOptions {
  ctx: Context
  userOrganization: UserOrganization
  organization: Organization
  email?: string
  errorMessage?: string
}
export const cancelEmailDeliveries = async ({
  ctx,
  userOrganization,
  organization,
  email,
  errorMessage,
}: CancelEmailDeliveriesOptions) => {
  const { count } = await ctx.prisma.emailDelivery.updateMany({
    where: {
      user_id: userOrganization.user_id,
      email,
      email_template_id: organization.join_organization_email_template_id,
      organization_id: organization.id,
      sent: false,
      error: false,
    },
    data: {
      error: { set: true },
      error_message: errorMessage ?? `Email delivery canceled at ${new Date()}`,
    },
  })

  if (count) {
    ctx.logger.info(
      `Expired ${count} user organization join email deliver${
        count > 1 ? "ies" : "y"
      } still in the send queue; updated`,
    )
  }
}

interface CreateUserOrganizationJoinConfirmationOptions {
  ctx: Context
  user: User
  organization: Organization
  userOrganization: UserOrganization
  email: string
  redirect?: string | null
  language?: string | null
}

export const createUserOrganizationJoinConfirmation = async ({
  ctx,
  user,
  organization,
  userOrganization,
  email,
  redirect,
  language,
}: CreateUserOrganizationJoinConfirmationOptions) => {
  const { join_organization_email_template_id } = organization

  /*const isValid = checkEmailValidity(email, required_organization_email)

  if (isValid.isErr()) {
    return isValid
  }
  */

  if (!join_organization_email_template_id) {
    return err(
      new ConfigurationError(
        "no email template associated with this organization",
      ),
    )
  }

  const currentDate = new Date()

  try {
    const userOrganizationJoinConfirmation =
      await ctx.prisma.userOrganizationJoinConfirmation.create({
        data: {
          user_organization: { connect: { id: userOrganization.id } },
          email,
          email_delivery: {
            create: {
              user_id: user.id,
              email,
              email_template_id: join_organization_email_template_id,
              organization_id: organization.id,
              sent: false,
              error: false,
            },
          },
          redirect,
          language,
          expires_at: new Date(currentDate.getTime() + 4 * 60 * 60 * 1000), // 4 hours for now
        },
      })

    return ok(userOrganizationJoinConfirmation)
  } catch (e: unknown) {
    if (e instanceof Error) return err(e)

    return err(
      new ApolloError((e as string) ?? "Unknown error creating confirmation"),
    )
  }
}
