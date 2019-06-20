import { prismaObjectType } from "nexus-prisma"

const Organization = prismaObjectType({
  name: "Organization",
  definition(t) {
    t.prismaFields([
      "id",
      "created_at",
      "updated_at",
      "slug",
      "verified_at",
      "verified",
      "disabled",
      "hidden",
      "creator",
      "tmc_created_at",
      "tmc_updated_at",
      "logo_file_name",
      "logo_content_type",
      "logo_file_size",
      "logo_updated_at",
      "phone",
      "contact_information",
      "email",
      "website",
      "pinned",
      "completions_registered",
      "organization_translations",
    ])
  },
})
export default Organization
