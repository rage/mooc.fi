import { Prisma } from "../generated/prisma-client"

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

function makeUserCourseProgressData() {
  let i = 0
  let UserCourseProgressess = []
  while (i < 100) {
    const newUserCourseProgressForJaneDoe = {
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
          n_points: Math.floor(Math.random() * 10),
          progress: Math.random(),
        },
        {
          group: "week2",
          max_points: 8,
          n_points: Math.floor(Math.random() * 8),
          progress: Math.random(),
        },
      ],
    }
    const newUserCourseProgressForJohnDoe = {
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
          n_points: Math.floor(Math.random() * 10),
          progress: Math.random(),
        },
        {
          groups: "week2",
          max_points: 8,
          n_points: Math.floor(Math.random() * 8),
          progress: Math.random(),
        },
      ],
    }
    UserCourseProgressess.push(newUserCourseProgressForJaneDoe)
    UserCourseProgressess.push(newUserCourseProgressForJohnDoe)
    i += 1
  }
  return UserCourseProgressess
}

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

const addUsers = async () => {
  return await Promise.all(
    Users.map(async user => {
      return await prisma.createUser(user)
    }),
  )
}

const addUserCourseProgressess = async () => {
  const UserCourseProgressess = makeUserCourseProgressData()
  return await Promise.all(
    UserCourseProgressess.map(async ucp => {
      return await prisma.createUserCourseProgress(ucp)
    }),
  )
}

const seedPointsData = async () => {
  addUsers()
  addUserCourseProgressess()
  return await Promise.all(
    UserCourseSettingsess.map(async ucs => {
      return await prisma.createUserCourseSettings(ucs)
    }),
  )
}

seedPointsData()
