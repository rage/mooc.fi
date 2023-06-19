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

export const thirdUserDetails: UserInfo = {
  id: 3,
  administrator: false,
  email: "third@mail.com",
  user_field: {
    first_name: "first",
    last_name: "last",
    course_announcements: false,
    html1: "",
    organizational_id: "",
  },
  username: "third_user",
  extra_fields: {},
}

export const organizations: Prisma.OrganizationCreateInput[] = [
  {
    id: "10000000000000000000000000000102",
    secret_key: "kissa",
    slug: "test",
    name: "test organization",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
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
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
        },
        {
          id: "00000000000000000000000000001102",
          description: "module1_fi_FI",
          language: "fi_FI",
          name: "module1_fi_FI",
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
        },
      ],
    },
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
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
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
        },
      ],
    },
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
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
    tags: {
      connect: [{ id: "tag1" }, { id: "tag2" }],
    },
    course_translations: {
      create: [
        {
          id: "00000000000000000000000000000011",
          description: "course1_description_en_US",
          instructions: "course1_instructions_en_US",
          language: "en_US",
          name: "course1_en_US",
          link: "http://link.com",
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
        },
        {
          id: "00000000000000000000000000000012",
          description: "course1_description_fi_FI",
          instructions: "course1_instructions_fi_FI",
          language: "fi_FI",
          name: "course1_fi_FI",
          link: "http:/link.fi.com",
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
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
        created_at: "1900-01-01T10:00:00.00+02:00",
        updated_at: "1900-01-01T10:00:00.00+02:00",
      },
    },
    automatic_completions: true,
    points_needed: 3,
    exercise_completions_needed: 1,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "00000000000000000000000000000001",
    name: "course2",
    slug: "course2",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "e@mail.com",
    teacher_in_charge_name: "teacher2",
    tags: {
      connect: { id: "tag3" },
    },
    course_translations: {
      create: [
        {
          id: "00000000000000000000000000000022",
          description: "course2_description_fi_FI",
          instructions: "course2_instructions_fi_FI",
          language: "fi_FI",
          name: "course2_fi_FI",
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
        },
      ],
    },
    study_modules: {
      connect: { id: "00000000000000000000000000000102" },
    },
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "00000000-0000-0000-0000-000000000666",
    name: "handler",
    slug: "handler",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "t@mail.com",
    teacher_in_charge_name: "foo",
    hidden: false,
    automatic_completions: true,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "00000000-0000-0000-0000-000000000667",
    name: "handled",
    slug: "handled",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "t@mail.com",
    teacher_in_charge_name: "foo",
    hidden: true,
    language: "fi",
    points_needed: 0,
    completions_handled_by: {
      connect: { id: "00000000000000000000000000000666" },
    },
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "00000000-0000-0000-0000-000000000668",
    name: "inherits",
    slug: "inherits",
    start_date: "01/01/1900",
    end_date: "12/31/2100",
    teacher_in_charge_email: "t@mail.com",
    teacher_in_charge_name: "foo",
    hidden: true,
    inherit_settings_from: {
      connect: { id: "00000000000000000000000000000666" },
    },
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const users: Prisma.UserCreateInput[] = [
  {
    id: "20000000000000000000000000000102",
    administrator: false,
    email: "e@mail.com",
    upstream_id: 1,
    username: "existing_user",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "20000000000000000000000000000103",
    administrator: true,
    email: "f@mail.com",
    upstream_id: 2,
    username: "second_user_admin",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
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
  {
    id: "20000000000000000000000000000105",
    administrator: false,
    email: "e@mail.com",
    upstream_id: 4,
    username: "fourth_user",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "20000000000000000000000000000106",
    administrator: false,
    email: "e@mail.com",
    upstream_id: 5,
    username: "fifth_user",
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
    eligible_for_ects: true,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    completion_date: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "30000000-0000-0000-0000-000000000103",
    course: { connect: { id: "00000000000000000000000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    email: "e@mail.com",
    user_upstream_id: 1,
    created_at: "2000-01-01T10:00:00.00+02:00",
    updated_at: "2000-01-01T10:00:00.00+02:00",
    completion_date: "2000-01-01T10:00:00.00+02:00",
    completion_registration_attempt_date: "2022-01-01T10:00:00.00+02:00",
  },
  {
    // duplicate to above but newer, should not be returned
    id: "66600000-0000-0000-0000-000000000103",
    course: { connect: { id: "00000000000000000000000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    email: "e@mail.com",
    user_upstream_id: 1,
    created_at: "2000-02-01T10:00:00.00+02:00",
    updated_at: "2000-02-01T10:00:00.00+02:00",
    completion_date: "2000-01-01T10:00:00.00+02:00",
    completion_registration_attempt_date: "2022-01-01T10:00:00.00+02:00",
  },
  {
    id: "12400000-0000-0000-0000-000000000001",
    user: { connect: { id: "20000000000000000000000000000103" } },
    course: { connect: { id: "00000000000000000000000000000002" } },
    email: "what@ever.com",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    completion_date: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "30000000-0000-0000-0000-000000000104",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000105" } },
    email: "e@mail.com",
    user_upstream_id: 4,
    eligible_for_ects: true,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    completion_date: "1900-01-01T10:00:00.00+02:00",
  },
  {
    // duplicate to above but later created_at, should be ignored then
    id: "30000000-0000-0000-0000-000000000105",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000105" } },
    email: "e@mail.com",
    user_upstream_id: 4,
    eligible_for_ects: true,
    created_at: "1900-01-02T10:00:00.00+02:00",
    updated_at: "1900-01-02T10:00:00.00+02:00",
    completion_date: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "30000000-0000-0000-0000-000000000106",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000106" } },
    email: "e@mail.com",
    user_upstream_id: 5,
    eligible_for_ects: true,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    completion_date: "1900-01-01T10:00:00.00+02:00",
  },
  {
    // completion handled by handler
    id: "30000000-0000-0000-0000-000000000107",
    course: { connect: { id: "00000000000000000000000000000666" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    email: "e@mail.com",
    user_upstream_id: 1,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    completion_date: "1900-01-01T10:00:00.00+02:00",
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
    created_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    // duplicate of above, but with later created_at so should be ignored
    id: "40000000-0000-0000-0000-000000000998",
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
    created_at: "1900-01-02T10:00:00.00+02:00",
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
  {
    id: "40000000-0000-0000-0000-000000000103",
    course: { connect: { id: "00000000000000000000000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    language: "en",
    country: "en",
    marketing: false,
    research: true,
    other: {
      research: false,
      country: "fi",
    },
  },
  {
    id: "40000000-0000-0000-0000-000000000104",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    language: "en",
    country: "en",
    marketing: false,
    research: true,
    other: {
      research: false,
      country: "fi",
    },
  },
  {
    // "inherits" should return this
    id: "40000000-0000-0000-0000-000000000105",
    course: { connect: { id: "00000000-0000-0000-0000-000000000666" } },
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
]

export const services: Prisma.ServiceCreateInput[] = [
  {
    id: "40000000-0000-0000-0000-000000000102",
    name: "service",
    url: "http://service.com",
    courses: {
      connect: { id: "00000000000000000000000000000001" },
    },
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const abStudies: Prisma.AbStudyCreateInput[] = [
  {
    id: "99000000-0000-0000-0000-000000000001",
    group_count: 3,
    name: "test_study",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "99000000-0000-0000-0000-000000000002",
    group_count: 2,
    name: "test_study2",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const abEnrollments: Prisma.AbEnrollmentCreateInput[] = [
  {
    user: { connect: { id: "20000000000000000000000000000103" } },
    ab_study: { connect: { id: "99000000-0000-0000-0000-000000000002" } },
    group: 2,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    user: { connect: { id: "20000000000000000000000000000102" } },
    ab_study: { connect: { id: "99000000-0000-0000-0000-000000000002" } },
    group: 3,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const exercises: Prisma.ExerciseCreateInput[] = [
  {
    id: "50000000-0000-0000-0000-000000000001",
    name: "exercise 1",
    course: { connect: { id: "00000000000000000000000000000001" } },
    service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
    custom_id: "customid1",
    timestamp: new Date("2021-01-01 10:00:00.00"),
    max_points: 2,
    part: 1,
    section: 1,
    deleted: false,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "50000000-0000-0000-0000-000000000002",
    name: "exercise 2",
    course: { connect: { id: "00000000000000000000000000000001" } },
    service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
    custom_id: "customid2",
    timestamp: new Date("2021-03-01 10:00:00.00"),
    max_points: 3,
    part: 1,
    section: 2,
    deleted: false,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "50000000-0000-0000-0000-000000000003",
    name: "exercise 3",
    course: { connect: { id: "00000000000000000000000000000002" } },
    service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
    custom_id: "customid3",
    timestamp: new Date("2021-01-01 10:00:00.00"),
    deleted: false,
    max_points: 3,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "50000000-0000-0000-0000-000000000004",
    name: "deleted exercise 4",
    course: { connect: { id: "00000000000000000000000000000002" } },
    service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
    custom_id: "customid4",
    timestamp: new Date("2021-01-01 10:00:00.00"),
    deleted: true,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "50000000-0000-0000-0000-000000000005",
    name: "deleted exercise 5",
    course: { connect: { id: "00000000000000000000000000000001" } },
    service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
    custom_id: "customid5",
    timestamp: new Date("2021-01-01 10:00:00.00"),
    deleted: true,
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const exerciseCompletions: Prisma.ExerciseCompletionCreateInput[] = [
  {
    id: "60000000-0000-0000-0000-000000000001",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "2000-02-01T10:00:00.00+02:00",
    updated_at: "2000-02-02T10:00:00.00+02:00",
    completed: true,
    n_points: 6,
  },
  {
    // newest timestamp but older updated_at, should be ignored
    id: "90000000-0000-0000-0000-000000000001",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "2000-02-01T10:00:00.00+02:00",
    updated_at: "2000-02-01T10:00:00.00+02:00",
    completed: true,
    exercise_completion_required_actions: {
      create: [
        {
          value: "action 1",
        },
        {
          value: "action 2",
        },
      ],
    },
    n_points: 4,
  },
  {
    // older timestamp, should be ignored
    id: "90000000-0000-0000-0000-000000000002",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "2000-01-01T10:00:00.00+02:00",
    updated_at: "2000-01-01T10:00:00.00+02:00",
    completed: true,
    n_points: 2,
  },
  {
    id: "60000000-0000-0000-0000-000000000002",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000002" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "1900-01-01T10:00:00.00+02:00",
    completed: false,
    n_points: 0,
  },
  {
    id: "60000000-0000-0000-0000-000000000003",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000003" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "1900-01-01T10:00:00.00+02:00",
    completed: false,
    attempted: true,
    exercise_completion_required_actions: {
      create: {
        id: "66666666-0000-0000-0000-000000000003",
        value: "TOO_MANY_DUCKS",
      },
    },
    n_points: 4,
  },
  {
    // deleted, should not show up unless specified
    id: "60000000-0000-0000-0000-000000000004",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000004" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "2000-01-01T10:00:00.00+02:00",
    completed: false,
    attempted: true,
    exercise_completion_required_actions: {
      create: {
        id: "66666666-0000-0000-0000-000000000004",
        value: "existing",
      },
    },
    n_points: 1,
  },
  {
    // deleted, should not show up unless specified
    id: "90000000-0000-0000-0000-000000000004",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000005" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "2000-01-01T10:00:00.00+02:00",
    completed: false,
    attempted: true,
    n_points: 1,
  },
  {
    id: "60000000-0000-0000-0000-000000000005",
    user: { connect: { id: "20000000000000000000000000000104" } },
    exercise: {
      connect: { id: "50000000-0000-0000-0000-000000000003" },
    },
    completed: true,
    timestamp: new Date("2021-01-01 10:00:00.00"),
  },
]

export const userCourseProgresses: Prisma.UserCourseProgressCreateInput[] = [
  {
    id: "12300000000000000000000000000001",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    n_points: 0,
    progress: [{ group: "week1", max_points: 3, n_points: 0 }],
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00", // should be skipped (0 points)
  },
  {
    id: "12300000000000000000000000000002",
    course: { connect: { id: "00000000000000000000000000000002" } },
    n_points: 1,
    progress: [{ group: "week1", max_points: 3, n_points: 1 }],
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00", // should be skipped (user null)
  },
  {
    id: "12300000000000000000000000000003",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000103" } },
    n_points: 2,
    progress: [{ group: "week1", max_points: 3, n_points: 2 }],
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00", // has an existing completion
  },
  {
    id: "12300000000000000000000000000004",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000104" } },
    n_points: 3,
    progress: [{ group: "week1", max_points: 3, n_points: 3 }],
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00", // should lead to new completion
  },
  {
    id: "12300000000000000000000000000005",
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000104" } },
    n_points: 2,
    progress: [{ group: "week1", max_points: 3, n_points: 2 }],
    created_at: "1901-01-01T10:00:00.00+02:00",
    updated_at: "1901-01-01T10:00:00.00+02:00", // should be skipped as newer duplicate
  },
]

export const userCourseServiceProgresses: Prisma.UserCourseServiceProgressCreateInput[] =
  [
    {
      course: { connect: { id: "00000000000000000000000000000002" } },
      user: { connect: { id: "20000000000000000000000000000104" } },
      service: {
        connect: { id: "40000000-0000-0000-0000-000000000102" },
      },
      progress: [{ group: "week1", max_points: 3, n_points: 3 }],
      created_at: "1900-01-01T10:00:00.00+02:00",
      updated_at: "1900-01-01T10:00:00.00+02:00",
    },
  ]

export const emailTemplateThresholds: Prisma.EmailTemplateCreateInput[] = [
  {
    id: "00000000000000000000000000000012",
    template_type: "threshold",
    txt_body: "Awesome feature",
    created_at: "1901-01-01T10:00:00.00+02:00",
    updated_at: "1901-01-01T10:00:00.00+02:00",
    title: "Win",
    points_threshold: 2,
    name: "value",
    triggered_automatically_by_course: {
      connect: { id: "00000000000000000000000000000667" },
    },
    exercise_completions_threshold: 2,
  },
  {
    id: "00000000000000000000000000000013",
    template_type: "threshold",
    txt_body: "Another",
    created_at: "1901-01-01T10:00:00.00+02:00",
    updated_at: "1901-01-01T10:00:00.00+02:00",
    title: "Win",
    points_threshold: 60,
    name: "value",
    triggered_automatically_by_course: {
      connect: { id: "00000000000000000000000000000667" },
    },
    exercise_completions_threshold: 100,
  },
]

export const completionsRegistered: Prisma.CompletionRegisteredCreateInput[] = [
  {
    id: "66000000-0000-0000-0000-000000000102",
    completion: { connect: { id: "30000000-0000-0000-0000-000000000106" } },
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000106" } },
    real_student_number: "4",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const courseAliases: Prisma.CourseAliasCreateInput[] = [
  {
    id: "67000000-0000-0000-0000-000000000001",
    course: { connect: { id: "00000000000000000000000000000002" } },
    course_code: "alias",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "67000000-0000-0000-0000-000000000002",
    course: { connect: { id: "00000000000000000000000000000001" } },
    course_code: "alias2",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    id: "67000000-0000-0000-0000-000000000003",
    course: { connect: { id: "00000000000000000000000000000666" } },
    course_code: "alias3",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const openUniversityRegistrationLink: Prisma.OpenUniversityRegistrationLinkCreateInput[] =
  [
    {
      id: "e3eea9b5-1ff1-47f8-94f4-269c7a092d93",
      course_code: "alias",
      language: "en_US",
      course: { connect: { id: "00000000000000000000000000000002" } },
      link: "avoin-link",
      tiers: [
        {
          tier: 2,
          name: "intermediate tier",
          course_id: "00000000000000000000000000000001",
          adjacent: [],
        },
        {
          tier: 3,
          name: "advanced tier",
          course_id: "00000000000000000000000000000666",
          adjacent: [
            {
              tier: 2,
              name: "intermediate tier",
              course_id: "00000000000000000000000000000001",
            },
          ],
        },
      ],
      created_at: "1900-01-01T10:00:00.00+02:00",
      updated_at: "1900-01-01T10:00:00.00+02:00",
    },
    {
      id: "e3eea9b5-1ff1-47f8-94f4-269c7a092d92",
      course_code: "alias2",
      language: "en_US",
      course: { connect: { id: "00000000000000000000000000000001" } },
      link: "avoin-link-alias2",
      tiers: Prisma.JsonNull,
      created_at: "1900-01-01T10:00:00.00+02:00",
      updated_at: "1900-01-01T10:00:00.00+02:00",
    },
    {
      id: "e3eea9b5-1ff1-47f8-94f4-269c7a092d91",
      course_code: "alias3",
      language: "en_US",
      course: { connect: { id: "00000000000000000000000000000666" } },
      link: "avoin-link-alias3",
      tiers: Prisma.JsonNull,
      created_at: "1900-01-01T10:00:00.00+02:00",
      updated_at: "1900-01-01T10:00:00.00+02:00",
    },
  ]

export const storedData: Prisma.StoredDataCreateInput[] = [
  {
    // user1, course2
    user: { connect: { id: "20000000000000000000000000000102" } },
    course: { connect: { id: "00000000000000000000000000000001" } },
    data: "user1_foo",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
  {
    // user3, course1
    user: { connect: { id: "20000000000000000000000000000104" } },
    course: { connect: { id: "00000000000000000000000000000002" } },
    data: "user3_foo",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const courseOwnerships: Prisma.CourseOwnershipCreateInput[] = [
  {
    id: "61200000-0000-0000-0000-000000000001",
    user: { connect: { id: "20000000000000000000000000000102" } },
    course: { connect: { id: "00000000000000000000000000000001" } },
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
  },
]

export const tagTypes: Prisma.TagTypeCreateInput[] = [
  {
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    name: "type1",
  },
  {
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    name: "type2",
  },
  {
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    name: "language",
  },
]

export const tags: Prisma.TagCreateInput[] = [
  {
    id: "tag1",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    tag_types: { connect: { name: "type1" } },
    tag_translations: {
      create: [
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "en_US",
          name: "tag1 in english",
          description: "tag1 description",
        },
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "fi_FI",
          name: "tag1 suomeksi",
          description: "tag1 kuvaus",
        },
      ],
    },
  },
  {
    id: "tag2",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    tag_types: { connect: [{ name: "type1" }, { name: "type2" }] },
    tag_translations: {
      create: [
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "en_US",
          name: "tag2 in english",
          description: "tag2 description",
        },
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "fi_FI",
          name: "tag2 suomeksi",
          description: "tag2 kuvaus ja jotain muuta",
        },
      ],
    },
  },
  {
    id: "tag3",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    tag_types: { connect: [{ name: "type2" }] },
    hidden: true,
    tag_translations: {
      create: [
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "fi_FI",
          name: "piilotettu tag3",
          description: "piilotettu tag3 kuvaus ja täts it",
        },
      ],
    },
  },
  {
    id: "fi",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    tag_types: { connect: [{ name: "language" }] },
    tag_translations: {
      create: [
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "en_US",
          name: "Finnish",
        },
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "fi_FI",
          name: "suomi",
        },
      ],
    },
  },
  {
    id: "en",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    tag_types: { connect: [{ name: "language" }] },
    tag_translations: {
      create: [
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "en_US",
          name: "English",
        },
        {
          created_at: "1900-01-01T10:00:00.00+02:00",
          updated_at: "1900-01-01T10:00:00.00+02:00",
          language: "fi_FI",
          name: "englanti",
        },
      ],
    },
  },
]
