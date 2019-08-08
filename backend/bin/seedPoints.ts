import {
  Prisma,
  UserCreateInput,
  UserCourseProgressCreateInput,
  UserCourseSettingsCreateInput,
} from "../generated/prisma-client"

//seed users, already added to the database previously
const Users = [
  {
    upstream_id: 1,
    first_name: "Jane",
    last_name: "Doe",
    username: "jDoe",
    email: "jane.doe@fakedata.com",
    administrator: false,
    student_number: "12345",
    real_student_number: "112233445",
  },
  {
    upstream_id: 2,
    first_name: "John",
    last_name: "Doe",
    username: "JohnD",
    email: "john.doe@fakedata.com",
    administrator: false,
    student_number: "98765",
    real_student_number: "5566778899",
  },
]

interface UserCourseProgressInterface {
  user: any
  course: any
  progress: any
}
const UserCourseProgressess: UserCourseProgressInterface[] = [
  {
    user: {
      connect: {
        id: "494245b6-3a90-4d6e-82d9-b05fd0330ff8",
      },
    },

    course: {
      connect: {
        id: "622a3ba6-2333-4054-908c-268246c07da0",
      },
    },
    progress: [
      {
        group: "week1",
        max_points: 10,
        n_points: 5,
        progress: 0.5,
      },
      {
        group: "week2",
        max_points: 8,
        n_points: 8,
        progress: 1,
      },
    ],
  },
  {
    user: {
      connect: {
        id: "c9386661-1350-41cc-9cc3-3896b386e0e1",
      },
    },
    course: {
      connect: {
        id: "622a3ba6-2333-4054-908c-268246c07da0",
      },
    },
    progress: [
      {
        group: "week1",
        max_points: 10,
        n_points: 2,
        progress: 0.2,
      },
      {
        groups: "week2",
        max_points: 8,
        n_points: 4,
        progress: 0.5,
      },
    ],
  },
]

const UserCourseSettingsess = [
  {
    user: {
      connect: {
        id: "c9386661-1350-41cc-9cc3-3896b386e0e1",
      },
    },
    course: {
      connect: {
        id: "622a3ba6-2333-4054-908c-268246c07da0",
      },
    },
    language: "fi_FI",
    country: "Finland",
    research: true,
    marketing: false,
    course_variant: null,
    other: null,
  },
  {
    user: {
      connect: {
        id: "c9386661-1350-41cc-9cc3-3896b386e0e1",
      },
    },
    course: {
      connect: {
        id: "622a3ba6-2333-4054-908c-268246c07da0",
      },
    },
    language: "fi_FI",
    country: "Finland",
    research: true,
    marketing: false,
    course_variant: null,
    other: null,
  },
]

const prisma = new Prisma({ endpoint: "http://localhost:4466/default/default" })

const _users = Users.map(async user => {})
const seedPointsData = async () => {
  return await Promise.all(
    UserCourseSettingsess.map(async ucs => {
      return await prisma.createUserCourseSettings(ucs)
    }),
  )
}

seedPointsData()
