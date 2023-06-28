import { Prisma } from "@prisma/client"

import { type ExtendedPrismaClient } from "../prisma"

export const DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID =
  "99999999-9998-9997-9996-999999999995"
export const createDefaultEmailTemplate: Prisma.EmailTemplateCreateInput = {
  id: DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID,
  title: "Confirm request to join organization {{organization_name}}",
  txt_body: `Hi {{user_full_name}}!

You have requested to join organization {{organization_name}}.

Please confirm your request by clicking the following link:

{{organization_activation_link}}

This link is valid until {{organization_activation_code_expiry_date}}.

If you did not request to join this organization, please ignore this email.`,
  template_type: "join_organization",
  name: "___default_join_organization",
}

export const createDefaultData = (prisma: ExtendedPrismaClient) => {
  return prisma.emailTemplate.upsert({
    where: {
      id: DEFAULT_JOIN_ORGANIZATION_EMAIL_TEMPLATE_ID,
    },
    create: createDefaultEmailTemplate,
    update: {},
  })
}
