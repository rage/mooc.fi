import { COURSES_BASE_URL } from "/lib/coursesBaseUrl"

/** The user's participant page on tmc.mooc.fi. `upstreamId` is the TMC user id. */
export const tmcParticipantUrl = (upstreamId: number) =>
  `https://tmc.mooc.fi/participants/${upstreamId}`

/** The courses.mooc.fi user search, run for the user with this TMC user id. */
export const coursesUserSearchUrl = (upstreamId: number) =>
  `${COURSES_BASE_URL}/manage/search-users?search=${upstreamId}`
