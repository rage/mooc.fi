import { Prisma } from "@prisma/client"
import { UserInfo } from "../../domain/UserInfo"

export const normalUser = {
  upstream_id: 1,
  administrator: false,
  email: "e@mail.com",
  first_name: "first",
  last_name: "last",
  username: "user",
}

export const normalUserDetails: UserInfo = {
  id: 1,
  administrator: false,
  email: "e@mail.com",
  user_field: {
    first_name: "first",
    last_name: "last",
    course_announcements: false,
    html1: "",
    organizational_id: "",
  },
  username: "user",
  extra_fields: {},
}

export const adminUser = {
  upstream_id: 2,
  administrator: true,
  email: "e@mail.com",
  first_name: "first",
  last_name: "last",
  username: "admin",
}

export const adminUserDetails = {
  id: 2,
  administrator: true,
  email: "e@mail.com",
  user_field: {
    first_name: "first",
    last_name: "last",
    course_announcements: false,
    html1: "",
    organizational_id: "",
  },
  username: "admin",
  extra_fields: {},
}

export const organizations: Prisma.OrganizationCreateInput[] = [
  {
    id: "10000000000000000000000000000102",
    secret_key: "kissa",
    slug: "test",
  },
]

export const study_modules: Prisma.StudyModuleCreateInput[] = [
  {
    id: "00000000000000000000000000000102",
    name: "module1",
    slug: "module1",
    study_module_translations: {
      create: [
        {
          id: "00000000000000000000000000001101",
          description: "module1_en_US",
          language: "en_US",
          name: "module1_en_US",
        },
        {
          id: "00000000000000000000000000001102",
          description: "module1_fi_FI",
          language: "fi_FI",
          name: "module1_fi_FI",
        },
      ],
    },
  },
  {
    id: "00000000000000000000000000000101",
    name: "module2",
    slug: "module2",
    study_module_translations: {
      create: [
        {
          id: "00000000000000000000000000002101",
          description: "module2_fi_FI",
          language: "fi_FI",
          name: "module2_fi_FI",
        },
      ],
    },
  },
]

export const courses: Prisma.CourseCreateInput[] = [
  {
    id: "00000000000000000000000000000002",
    name: "course1",
    slug: "course1",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "e@mail.com",
    teacher_in_charge_name: "teacher1",
    course_translations: {
      create: [
        {
          id: "00000000000000000000000000000011",
          description: "course1_description_en_US",
          language: "en_US",
          name: "course1_en_US",
          link: "http://link.com",
        },
        {
          id: "00000000000000000000000000000012",
          description: "course1_description_fi_FI",
          language: "fi_FI",
          name: "course1_fi_FI",
          link: "http:/link.fi.com",
        },
      ],
    },
    study_modules: {
      connect: [
        { id: "00000000000000000000000000000101" },
        { id: "00000000000000000000000000000102" },
      ],
    },
    photo: {
      create: {
        id: "00000000000000000000000000001101",
        original: "original.gif",
        original_mimetype: "image/gif",
        compressed: "webp",
        compressed_mimetype: "image/webp",
        uncompressed: "jpeg",
        uncompressed_mimetype: "image/jpeg",
      },
    },
  },
  {
    id: "00000000000000000000000000000001",
    name: "course2",
    slug: "course2",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "e@mail.com",
    teacher_in_charge_name: "teacher2",
    course_translations: {
      create: [
        {
          id: "00000000000000000000000000000022",
          description: "course2_description_fi_FI",
          language: "fi_FI",
          name: "course2_fi_FI",
        },
      ],
    },
    study_modules: {
      connect: { id: "00000000000000000000000000000102" },
    },
  },
  {
    id: "00000000000000000000000000000666",
    name: "handler",
    slug: "handler",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "t@mail.com",
    teacher_in_charge_name: "foo",
    hidden: false,
  },
  {
    id: "00000000000000000000000000000667",
    name: "handled",
    slug: "handled",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "t@mail.com",
    teacher_in_charge_name: "foo",
    hidden: true,
    completions_handled_by: {
      connect: { id: "00000000000000000000000000000666" },
    },
  },
]

export const users: Prisma.UserCreateInput[] = [
  {
    id: "20000000000000000000000000000102",
    administrator: false,
    email: "e@mail.com",
    upstream_id: 1,
    username: "existing_user",
  },
  {
    id: "20000000000000000000000000000103",
    administrator: true,
    email: "f@mail.com",
    upstream_id: 2,
    username: "second_user_admin",
  },
  {
    id: "20000000000000000000000000000104",
    administrator: false,
    email: "g@mail.com",
    upstream_id: 3,
    username: "third_user",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const completions: Prisma.CompletionCreateInput[] = [
  {
    id: "30000000-0000-0000-0000-000000000102",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    email: "e@mail.com",
    user_upstream_id: 1,
    tier: 2,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "30000000-0000-0000-0000-000000000103",
    course: { connect: { id: "00000000000000000000000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    email: "e@mail.com",
    user_upstream_id: 1,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const userCourseSettings: Prisma.UserCourseSettingCreateInput[] = [
  {
    id: "40000000-0000-0000-0000-000000000102",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000103" } },
    language: "en",
    country: "en",
    marketing: false,
    research: true,
    other: {
      hasWings: true,
      isCat: false,
    },
  },
  {
    id: "40000000-0000-0000-0000-000000000999",
    course: { connect: { id: "00000000000000000000000000000001" } },
    user: { connect: { id: "20000000000000000000000000000103" } },
    language: "en",
    country: "en",
    marketing: false,
    research: true,
    other: {
      research: false,
      country: "fi",
      okField: true,
    },
  },
]

export const services: Prisma.ServiceCreateInput[] = [
  {
    id: "40000000-0000-0000-0000-000000000102",
    name: "service",
    url: "http://service.com",
    courses: {
      connect: { id: "00000000000000000000000000000001" },
    },
  },
]

export const abStudies: Prisma.AbStudyCreateInput[] = [
  {
    id: "99000000-0000-0000-0000-000000000001",
    group_count: 3,
    name: "test_study",
  },
  {
    id: "99000000-0000-0000-0000-000000000002",
    group_count: 2,
    name: "test_study2",
  },
]

export const abEnrollments: Prisma.AbEnrollmentCreateInput[] = [
  {
    user: { connect: { id: "20000000000000000000000000000103" } },
    ab_study: { connect: { id: "99000000-0000-0000-0000-000000000002" } },
    group: 2,
  },
]
