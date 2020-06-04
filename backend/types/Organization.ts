// import { prismaObjectType } from "nexus-prisma"
import { objectType } from "@nexus/schema"

const Organization = objectType({
  name: "Organization",
  definition(t) {
    t.model.id()
    t.model.contact_information()
    t.model.created_at()
    t.model.disabled()
    t.model.email()
    t.model.hidden()
    t.model.logo_content_type()
    t.model.logo_file_name()
    t.model.logo_file_size()
    t.model.logo_updated_at()
    t.model.phone()
    t.model.pinned()
    t.model.slug()
    t.model.tmc_created_at()
    t.model.tmc_updated_at()
    t.model.updated_at()
    t.model.verified()
    t.model.verified_at()
    t.model.website()
    t.model.user()
    // t.model.completion_registered()
    t.model.course()
    // t.model.course_organization()
    // t.model.organization_translation()
    // t.model.user_organization()
    // t.model.verified_user()

    // t.prismaFields({ filter: ["secret_key"] })
  },
})
export default Organization
