import { createHmac } from "crypto"

import axios from "axios"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"

import {
  COURSES_BASE_URL,
  COURSES_HANDOFF_SECRET,
  JWT_SECRET,
} from "../../config"
import {
  issueUserAccessToken,
  isUserAccessTokenIssuingConfigured,
  UserAccessToken,
  UserAccessTokenRefusedError,
} from "../../services/tmc"
import { Controller } from "../types"

const REDEEM_PATH = "/api/v0/moocfi/outbound-handoffs/redeem"
const REDEEM_TIMEOUT_MS = 10_000
const MAX_TOKEN_LENGTH = 4096
const CONTINUATION_AUDIENCE = "courses-handoff-continuation"
const CONTINUATION_LIFETIME = "10m"
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Where courses.mooc.fi may send a student, as paths without the locale prefix. */
const DESTINATION_PATHS = {
  certificate: (handlerSlug: string) =>
    `/register-completion/${encodeURIComponent(handlerSlug)}/certificate/`,
}

type Destination = keyof typeof DESTINATION_PATHS

const isDestination = (value: unknown): value is Destination =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(DESTINATION_PATHS, value)

interface Handoff {
  upstream_id: number
  moocfi_course_id: string
  destination: Destination
}

const parseHandoff = (value: any): Handoff | null => {
  const { upstream_id, moocfi_course_id, destination } = value ?? {}
  if (
    !Number.isSafeInteger(upstream_id) ||
    typeof moocfi_course_id !== "string" ||
    !UUID_REGEX.test(moocfi_course_id) ||
    !isDestination(destination)
  ) {
    return null
  }
  return { upstream_id, moocfi_course_id, destination }
}

// A key of its own, so a continuation can never pass as another token signed with JWT_SECRET.
const continuationKey = () =>
  createHmac("sha256", JWT_SECRET ?? "")
    .update(CONTINUATION_AUDIENCE)
    .digest()

const signContinuation = ({
  upstream_id,
  moocfi_course_id,
  destination,
}: Handoff) =>
  jwt.sign({ moocfi_course_id, destination }, continuationKey(), {
    algorithm: "HS256",
    audience: CONTINUATION_AUDIENCE,
    subject: String(upstream_id),
    expiresIn: CONTINUATION_LIFETIME,
  })

const isConfigured = () =>
  Boolean(
    COURSES_BASE_URL &&
      COURSES_HANDOFF_SECRET &&
      JWT_SECRET &&
      isUserAccessTokenIssuingConfigured(),
  )

const readToken = (value: unknown) =>
  typeof value === "string" && value !== "" && value.length <= MAX_TOKEN_LENGTH
    ? value
    : null

export class CoursesHandoffController extends Controller {
  /**
   * Redeems a courses.mooc.fi handoff token for the student whose browser brought it.
   *
   * Body `{ token }`, with the student's mooc.fi bearer when they are signed in. Answers 200 with
   * `{ result, destination_path }`, where `result` is `continue` (already signed in as the
   * student), `signed_in` (adds `access_token` and `expires_in` seconds or null, to be stored as
   * the session) or `different_account` (adds `continuation`, for {@link continue}). Errors carry
   * `{ type }`: 400 `invalid`, 410 `expired`, 404 `course_not_found`, 403 `sign_in_required`
   * (TMC will not sign this student in; adds `destination_path`, to return to after a password
   * sign-in), 502 `unavailable`, 503 `not_configured`.
   * The token is spent once courses.mooc.fi has seen it, whatever the outcome.
   */
  redeem = async (req: Request, res: Response) => {
    const { logger } = this.ctx

    if (!isConfigured()) {
      return res.status(503).json({ type: "not_configured" })
    }

    const token = readToken(req.body?.token)
    if (!token) {
      return res.status(400).json({ type: "invalid" })
    }

    let handoff: Handoff | null
    try {
      const response = await axios.post(
        new URL(REDEEM_PATH, COURSES_BASE_URL).href,
        { token },
        {
          headers: { Authorization: `Bearer ${COURSES_HANDOFF_SECRET}` },
          timeout: REDEEM_TIMEOUT_MS,
        },
      )
      handoff = parseHandoff(response.data)
    } catch (error) {
      const status = axios.isAxiosError(error)
        ? error.response?.status
        : undefined
      if (status === 410) {
        return res.status(410).json({ type: "expired" })
      }
      if (status === 400) {
        return res.status(400).json({ type: "invalid" })
      }
      // Log the status only: the error carries the request, token and secret included.
      logger.warn("Redeeming a courses.mooc.fi handoff failed", { status })
      return res.status(502).json({ type: "unavailable" })
    }

    if (!handoff) {
      logger.warn("courses.mooc.fi redeemed a handoff with an unexpected body")
      return res.status(502).json({ type: "unavailable" })
    }

    const destinationPath = await this.resolveDestinationPath(handoff)
    if (!destinationPath) {
      return res.status(404).json({ type: "course_not_found" })
    }

    if (req.headers.authorization) {
      const currentUser = await this.findUser(req)

      if (currentUser.isOk()) {
        if (currentUser.value.user.upstream_id === handoff.upstream_id) {
          return res
            .status(200)
            .json({ result: "continue", destination_path: destinationPath })
        }
        return res
          .set("Cache-Control", "no-store")
          .status(200)
          .json({
            result: "different_account",
            continuation: signContinuation(handoff),
            destination_path: destinationPath,
          })
      }
      // A stale session is the same as none; anything else is our failure, not the student's.
      if (currentUser.error.status !== 401) {
        return res.status(502).json({ type: "unavailable" })
      }
    }

    return this.signIn(res, handoff.upstream_id, destinationPath)
  }

  /**
   * Signs in the student of a `different_account` redemption, in place of the account the browser
   * was signed in with.
   *
   * Body `{ continuation }`. Answers like {@link redeem} with `result: "signed_in"`; errors 400
   * `invalid`, 410 `expired` (after 10 minutes), 403, 404, 502 and 503 as there.
   */
  continue = async (req: Request, res: Response) => {
    if (!isConfigured()) {
      return res.status(503).json({ type: "not_configured" })
    }

    const continuation = readToken(req.body?.continuation)
    if (!continuation) {
      return res.status(400).json({ type: "invalid" })
    }

    let claims: jwt.JwtPayload
    try {
      claims = jwt.verify(continuation, continuationKey(), {
        algorithms: ["HS256"],
        audience: CONTINUATION_AUDIENCE,
      }) as jwt.JwtPayload
    } catch (error) {
      return res
        .status(error instanceof jwt.TokenExpiredError ? 410 : 400)
        .json({
          type: error instanceof jwt.TokenExpiredError ? "expired" : "invalid",
        })
    }

    const handoff = parseHandoff({
      ...claims,
      upstream_id: /^\d+$/.test(claims.sub ?? "") ? Number(claims.sub) : null,
    })
    if (!handoff) {
      return res.status(400).json({ type: "invalid" })
    }

    const destinationPath = await this.resolveDestinationPath(handoff)
    if (!destinationPath) {
      return res.status(404).json({ type: "course_not_found" })
    }

    return this.signIn(res, handoff.upstream_id, destinationPath)
  }

  private signIn = async (
    res: Response,
    upstreamId: number,
    destinationPath: string,
  ) => {
    const { logger } = this.ctx

    let issued: UserAccessToken
    try {
      issued = await issueUserAccessToken(upstreamId)
    } catch (error) {
      if (error instanceof UserAccessTokenRefusedError) {
        logger.info("TMC refused to sign a handoff student in", {
          upstream_id: upstreamId,
        })
        return res
          .status(403)
          .json({ type: "sign_in_required", destination_path: destinationPath })
      }
      logger.warn("Issuing a TMC access token for a handoff failed", {
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      })
      return res.status(502).json({ type: "unavailable" })
    }

    logger.info("Signed a student in from a courses.mooc.fi handoff", {
      upstream_id: upstreamId,
    })
    return res.set("Cache-Control", "no-store").status(200).json({
      result: "signed_in",
      access_token: issued.access_token,
      expires_in: issued.expires_in,
      destination_path: destinationPath,
    })
  }

  private resolveDestinationPath = async ({
    moocfi_course_id,
    destination,
  }: Handoff) => {
    const course = await this.getCourseKnex({ id: moocfi_course_id })
    const handlerCourse = course?.completions_handled_by_id
      ? await this.getCourseKnex({ id: course.completions_handled_by_id })
      : course

    return handlerCourse
      ? DESTINATION_PATHS[destination](handlerCourse.slug)
      : null
  }
}
