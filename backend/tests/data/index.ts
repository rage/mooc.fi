import { Prisma } from "@prisma/client"
import { UserInfo } from "../../domain/UserInfo"

export const normalUser = {
  upstream_id: 1,
  administrator: false,
  email: "e@mail.com",
  first_name: "first",
  last_name: "last",
  username: "user",
  password: "password",
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
  password: "password",
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
  password: "password",
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
    password:
      "$argon2id$v=19$m=15360,t=4,p=1$2k16ld7ESKJcycYEZziWlg$i/63pfRWuLO2q/7CMYnvdtd3STM4DpUGzoGP3zcqUeTo09wRa7uzpkW45XHJCp3zc2VYMteARJA34sUxrYThlw",
  },
  {
    id: "20000000000000000000000000000103",
    administrator: true,
    email: "f@mail.com",
    upstream_id: 2,
    username: "second_user_admin",
    password:
      "$argon2id$v=19$m=15360,t=4,p=1$2k16ld7ESKJcycYEZziWlg$i/63pfRWuLO2q/7CMYnvdtd3STM4DpUGzoGP3zcqUeTo09wRa7uzpkW45XHJCp3zc2VYMteARJA34sUxrYThlw",
  },
  {
    id: "20000000000000000000000000000104",
    administrator: false,
    email: "g@mail.com",
    upstream_id: 3,
    username: "third_user",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
    password:
      "$argon2id$v=19$m=15360,t=4,p=1$2k16ld7ESKJcycYEZziWlg$i/63pfRWuLO2q/7CMYnvdtd3STM4DpUGzoGP3zcqUeTo09wRa7uzpkW45XHJCp3zc2VYMteARJA34sUxrYThlw",
  },
  {
    id: "20000000000000000000000000000105",
    administrator: false,
    email: "e@mail.com",
    upstream_id: 4,
    username: "fourth_user",
  },
  {
    id: "20000000000000000000000000000106",
    administrator: false,
    email: "e@mail.com",
    upstream_id: 5,
    username: "fifth_user",
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
  {
    id: "12400000-0000-0000-0000-000000000001",
    user: { connect: { id: "20000000000000000000000000000103" } },
    course: { connect: { id: "00000000000000000000000000000002" } },
    email: "what@ever.com",
    created_at: "1900-01-01T10:00:00.00+02:00",
    updated_at: "1900-01-01T10:00:00.00+02:00",
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
    completion: { connect: { id: "30000000-0000-0000-0000-000000000105" } },
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
  },
  {
    id: "67000000-0000-0000-0000-000000000002",
    course: { connect: { id: "00000000000000000000000000000001" } },
    course_code: "alias2",
  },
  {
    id: "67000000-0000-0000-0000-000000000003",
    course: { connect: { id: "00000000000000000000000000000666" } },
    course_code: "alias3",
  },
]

export const openUniversityRegistrationLink: Prisma.OpenUniversityRegistrationLinkCreateInput[] = [
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
  },
  {
    id: "e3eea9b5-1ff1-47f8-94f4-269c7a092d92",
    course_code: "alias2",
    language: "en_US",
    course: { connect: { id: "00000000000000000000000000000001" } },
    link: "avoin-link",
    tiers: null,
  },
  {
    id: "e3eea9b5-1ff1-47f8-94f4-269c7a092d91",
    course_code: "alias3",
    language: "en_US",
    course: { connect: { id: "00000000000000000000000000000666" } },
    link: "avoin-link",
    tiers: null,
  },
]
export const authorizationCode: Prisma.AuthorizationCodeCreateInput[] = [
  {
    id: "00000000000000000000000000004102",
    client_id: "native",
    redirect_uri: "*",
    user_id: "20000000000000000000000000000102",
    code: "code",
    trusted: true,
  },
  {
    id: "00000000000000000000000000003103",
    client_id: "native",
    redirect_uri: "*",
    user_id: null,
    code: "code2",
    trusted: true,
  },
]

export const client: Prisma.ClientCreateInput[] = [
  {
    id: "00000000000000000000000000050102",
    name: "native",
    client_id: "native",
    client_secret: "native",
    redirect_uri: "*",
    scopes: "*",
    is_trusted: true,
  },
]

export const accessToken: Prisma.AccessTokenCreateInput[] = [
  {
    id: "00000000000000000000000000600102",
    client_id: "native",
    user_id: "20000000000000000000000000000102",
    access_token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMwNzIsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMzg0MzczYjEtZGY0Ny00MDQ1LWE1YmUtZjQ4NzE4YjYzN2M4IiwiYWRtaW4iOmZhbHNlLCJub25jZSI6IjRmZjA3NGMzNjgxZjZmMDlkNjdjNDdkZDk0OGI1YmM2Iiwiand0aWQiOiJhYjAyOTllZDE4M2ZmM2E1ZmE4NTFiYzQ5YTc0OWIxMzczZGQ1MWNjYTFkMThjM2UwZTgwNDk1MTI0YzRiYzMyMTc5MDg2MGZiMThlYzUxNmZiMjkyNjg0YWNjMGUzNmNmNzIyY2U1NzExMzYxZjhlOGNmYmU0MzU2ZGZlMzQ5OSIsImlhdCI6MTYxOTAwNzA3MiwiYXVkIjoibmF0aXZlIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo0MDAwL2F1dGgvdG9rZW4iLCJzdWIiOiJaVUJ0WVdsc0xtTnZiUT09In0.h8DTbBzFMGL0_tU1_krt4O8BqlEgWzhfreXGTsOLHKRS53apzrjIcMbjsvnxHAbfns8EGxRzdd36x-yCbMCnvKS5y6jP1sWcsfsUPUco8A9GtTO0zwWa8kse7j-MrEoaixfpz9LWak27OAW48XONU8wSAzDabhJdvNEqH2ydT8y3lm1a53gApttC-V6dee7PAnDZPOWFSbIXqlI5-9UffQ7iSebu549Vm0692K0HWbSBU2pewJqZTXfWPCJ6xl4MTlE1FEBqLkG6Mpzu4bRcBvS8niqE7JVsZxDd_3jQNHoHfb7ipAbgCMbvbAhD3B5q13Ak2KAumqdTUKvaOwj5ng",
    valid: true,
  },
  {
    id: "20000000000000000000000000000103",
    client_id: "native",
    user_id: "20000000000000000000000000000103",
    access_token:
      "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NTA1NDMzMTAsIm1heEFnZSI6MzE1MzYwMDAwMDAsImlkIjoiMjAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMTAzIiwiYWRtaW4iOnRydWUsIm5vbmNlIjoiNWMwOGQwZjRhMzYxMTdkZmJlZGIzZWI3NzA1ZTUzZTIiLCJqd3RpZCI6Ijk5NzUzYWJlZTEyZGZkYTM5YWY1OGQyODRkZDQ0MzAxYjMxNGYzMmZhN2Y1OGE0OGFlMGYxZmEwNzUzMDBkZDMxM2E0OTM0MjkyZjVjMDAzNTY0Y2YyMjY3NjRhMDllY2M1ZjRlODhiZTc0YzhkNzcwZmU1NmM1NTA4YzNkYjlmIiwiaWF0IjoxNjE5MDA3MzEwLCJhdWQiOiJuYXRpdmUiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjQwMDAvYXV0aC90b2tlbiIsInN1YiI6IlprQnRZV2xzTG1OdmJRPT0ifQ.qvPIfJxToS3k_Vu6ixIVarW3DCPmddGTSedYKc5yUt6yn7i_q99ps38A5w1LgKq_2_G8gBw6WzV7ulOpstx0L3stBxpoHv073WVrCo2v-mw7EMbUJHKCiggPUOLtcYF4B4rK64x0vo1NnlcBIBATYmq2gr_jEXX4gBx-6JEmzsMCOCzT4ZYft0rRkn3930giGtGpcP5C4acl12USrc6QNVGcbN0U1J9wWvo45Qe2QVdV-xG96PR2KiOfVsrZ-5YVMJjwiD6heEbghdyo00yifIPDSTRr0Zpjmwr1a7bUFSen93h-iEHiFVZ1_GfM9a_HqvXdtY0-8_eAJi8f9WVrjw",
    valid: true,
  },
]
