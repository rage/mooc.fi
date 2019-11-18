import { Prisma } from "../generated/prisma-client"
import * as faker from "faker"

const prisma = new Prisma({ endpoint: "http://localhost:4466/default/default" })

//Generate integer id which is not already taken
function generateUniqueUpstreamId({ ExistingIds }: { ExistingIds: number[] }) {
  //take the largest possible integer
  const LargestPossibleUpstreamId = 2147483647
  let UniqueIntId = 0
  //Go down from the largest possible integer
  //until value not already in use is found
  let i: number
  for (i = LargestPossibleUpstreamId; i > 0; i--) {
    if (ExistingIds.indexOf(i) === -1) {
      UniqueIntId = i
      return UniqueIntId
    }
  }

  return UniqueIntId
}

function generateRandomString() {
  const randomString =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  return randomString
}

const addUsers = async () => {
  //get existing users from database
  const UsersInDatabase = await prisma.users()
  //create a list of upstream ids already in use
  let UpstreamIdsInUse = UsersInDatabase.map(user => user.upstream_id)
  //Generate random data for 100 users
  //and add them to the database
  let i = 0
  while (i < 100) {
    const first_name = faker.name.firstName()
    const last_name = faker.name.lastName()

    const newUser = {
      upstream_id: generateUniqueUpstreamId({ ExistingIds: UpstreamIdsInUse }),
      first_name,
      last_name,
      username: faker.internet.userName(first_name, last_name),
      email: faker.internet.email(first_name, last_name),
      administrator: false,
      student_number: generateRandomString(),
      real_student_number: generateRandomString(),
    }
    //add new upstreamId to ids already in use
    UpstreamIdsInUse = UpstreamIdsInUse.concat(newUser.upstream_id)

    await prisma.createUser(newUser)
    i += 1
  }
}

const addServices = async () => {
  let i = 0
  while (i < 5) {
    const newService = {
      url: generateRandomString(),
      name: generateRandomString(),
    }
    await prisma.createService(newService)
    i += 1
  }
}

// FIXME: (?) not used anywhere
// @ts-ignore
const addUserCourseServiceProgressess = async ({
  courseId,
}: {
  courseId: string
}) => {
  const UsersInDb = await prisma.users({ first: 100 })
  const ServicesInDb = await prisma.services({ first: 5 })
  const AllServiceIds = ServicesInDb.map(s => s.id)
  return await Promise.all(
    UsersInDb.map(async user => {
      const ucsp = {
        user: {
          connect: {
            id: user.id,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
        service: {
          connect: {
            id: AllServiceIds[Math.floor(Math.random() * 5)],
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
          {
            group: "week3",
            max_points: 12,
            n_points: Math.floor(Math.random() * 12),
            progress: Math.random(),
          },
          {
            group: "week4",
            max_points: 20,
            n_points: Math.floor(Math.random() * 20),
            progress: Math.random(),
          },
          {
            group: "week5",
            max_points: 18,
            n_points: Math.floor(Math.random() * 18),
            progress: Math.random(),
          },
        ],
        user_course_progress: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
            course: {
              connect: {
                id: courseId,
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
              {
                group: "week3",
                max_points: 12,
                n_points: Math.floor(Math.random() * 12),
                progress: Math.random(),
              },
              {
                group: "week4",
                max_points: 20,
                n_points: Math.floor(Math.random() * 20),
                progress: Math.random(),
              },
              {
                group: "week5",
                max_points: 18,
                n_points: Math.floor(Math.random() * 18),
                progress: Math.random(),
              },
            ],
          },
        },
      }
      await prisma.createUserCourseServiceProgress(ucsp)
    }),
  )
}

const addUserCourseProgressess = async ({ courseId }: { courseId: string }) => {
  const UsersInDb = await prisma.users({ first: 100 })
  return await Promise.all(
    UsersInDb.map(async user => {
      const ucp = {
        user: {
          connect: {
            id: user.id,
          },
        },
        course: {
          connect: {
            id: courseId,
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
          {
            group: "week3",
            max_points: 12,
            n_points: Math.floor(Math.random() * 12),
            progress: Math.random(),
          },
          {
            group: "week4",
            max_points: 20,
            n_points: Math.floor(Math.random() * 20),
            progress: Math.random(),
          },
          {
            group: "week5",
            max_points: 18,
            n_points: Math.floor(Math.random() * 18),
            progress: Math.random(),
          },
        ],
      }
      return await prisma.createUserCourseProgress(ucp)
    }),
  )
}

const addUserCourseSettingses = async ({ courseId }: { courseId: string }) => {
  const UsersInDb = await prisma.users({ first: 100 })
  return await Promise.all(
    UsersInDb.map(async user => {
      const ucs = {
        user: {
          connect: {
            id: user.id,
          },
        },
        course: {
          connect: {
            id: courseId,
          },
        },
        language: "fi_FI",
        country: "Finland",
        research: true,
        marketing: false,
        course_variant: null,
        other: null,
      }
      return await prisma.createUserCourseSettings(ucs)
    }),
  )
}

const seedPointsData = async () => {
  const course = await prisma.course({ slug: "elements-of-ai" })
  await addUsers()
  await addServices()
  course && (await addUserCourseProgressess({ courseId: course.id }))
  course && (await addUserCourseSettingses({ courseId: course.id }))
}

seedPointsData()
