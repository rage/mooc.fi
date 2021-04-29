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
          instructions: "course1_instructions_en_US",
          language: "en_US",
          name: "course1_en_US",
          link: "http://link.com",
        },
        {
          id: "00000000000000000000000000000012",
          description: "course1_description_fi_FI",
          instructions: "course1_instructions_fi_FI",
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
    automatic_completions: true,
    points_needed: 3,
    exercise_completions_needed: 1,
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
          instructions: "course2_instructions_fi_FI",
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
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    completion_date: "1900-01-01T10:00:00.00+02:00",
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
    id: "30000000-0000-0000-0000-000000000105",
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
    id: "12400000000000000000000000000001",
    user: { connect: { id: "20000000000000000000000000000103" } },
    course: { connect: { id: "00000000000000000000000000000002" } },
    email: "what@ever.com",
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
  },
  {
    id: "50000000-0000-0000-0000-000000000004",
    name: "deleted exercise 4",
    course: { connect: { id: "00000000000000000000000000000002" } },
    service: { connect: { id: "40000000-0000-0000-0000-000000000102" } },
    custom_id: "customid4",
    timestamp: new Date("2021-01-01 10:00:00.00"),
    deleted: true,
  },
]

export const exerciseCompletions: Prisma.ExerciseCompletionCreateInput[] = [
  {
    id: "60000000-0000-0000-0000-000000000001",
    exercise: { connect: { id: "50000000-0000-0000-0000-000000000001" } },
    user: { connect: { id: "20000000000000000000000000000102" } },
    timestamp: "1900-01-01T10:00:00.00+02:00",
    completed: true,
    n_points: 6,
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

export const userCourseServiceProgresses: Prisma.UserCourseServiceProgressCreateInput[] = [
  {
    course: { connect: { id: "00000000000000000000000000000002" } },
    user: { connect: { id: "20000000000000000000000000000104" } },
    service: {
      connect: { id: "40000000-0000-0000-0000-000000000102" },
    },
    progress: [{ group: "week1", max_points: 3, n_points: 3 }],
  },
]
