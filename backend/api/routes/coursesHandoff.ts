import { createHmac, randomUUID } from "crypto"

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
import { isUuid } from "../../util"
import { Controller } from "../types"

const REDEEM_PATH = "/api/v0/moocfi/outbound-handoffs/redeem"
const REDEEM_TIMEOUT_MS = 10_000
const MAX_TOKEN_LENGTH = 4096
const CONTINUATION_AUDIENCE = "courses-handoff-continuation"
const CONTINUATION_LIFETIME_SECONDS = 120
/** Must match the cookie frontend/middleware.ts sets when the landing page was reached from courses. */
const SAME_SITE_ARRIVAL_COOKIE = "__Host-courses_handoff_same_site_arrival"

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
    !isUuid(moocfi_course_id) ||
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
    expiresIn: CONTINUATION_LIFETIME_SECONDS,
    jwtid: randomUUID(),
  })

// HttpOnly, __Host- and set only by www.mooc.fi, so no page can fake it.
const carriesSameSiteArrival = (req: Request) =>
  (req.headers.cookie ?? "")
    .split(";")
    .some((pair) => pair.trim() === `${SAME_SITE_ARRIVAL_COOKIE}=1`)

/** The first letter of the address and its domain, such as `m…@example.com`. */
const maskEmail = (email: string) => {
  const at = email.lastIndexOf("@")
  return at > 0 ? `${email[0]}…${email.slice(at)}` : "…"
}

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
  private lastSpentPurgeAt = 0

  /**
   * Redeems a courses.mooc.fi handoff token for the student whose browser brought it.
   *
   * Body `{ token }`, with the student's mooc.fi bearer when they are signed in. Answers 200 with
   * `{ result, destination_path }`, where `result` is `continue` (already signed in as the
   * student), `signed_in` (adds `access_token` and `expires_in` seconds or null, to be stored as
   * the session), `confirm` (signed out, but the landing page was not reached from
   * courses.mooc.fi) or `different_account`. The last two add `continuation`, for
   * {@link continue}, and `masked_email` (or null) of the account it signs in, for the student to
   * check first. Errors carry `{ type }`: 400 `invalid`, 410 `expired`, 404 `course_not_found`,
   * 403 `sign_in_required` (TMC will not sign this student in; adds `destination_path`, to return
   * to after a password sign-in), 429 `rate_limited`, 502 `unavailable`, 503 `not_configured`.
   * The token is spent once courses.mooc.fi has seen it, whatever the outcome.
   */
  redeem = async (req: Request, res: Response) => {
    const { logger } = this.ctx

    // One arrival vouches for one redeem only.
    const hasArrivedSameSite = carriesSameSiteArrival(req)
    if (hasArrivedSameSite) {
      res.clearCookie(SAME_SITE_ARRIVAL_COOKIE, { path: "/", secure: true })
    }

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
        return this.askToConfirm(
          res,
          "different_account",
          handoff,
          destinationPath,
        )
      }
      // A stale session is the same as none; anything else is our failure, not the student's.
      if (currentUser.error.status !== 401) {
        return res.status(502).json({ type: "unavailable" })
      }
    }

    // Login CSRF: anyone can mint a handoff for their own account and send someone else here.
    if (!hasArrivedSameSite) {
      return this.askToConfirm(res, "confirm", handoff, destinationPath)
    }

    return this.signIn(res, handoff.upstream_id, destinationPath)
  }

  /**
   * Signs in the student of a `confirm` or `different_account` redemption once they have
   * confirmed, in place of any account the browser was signed in with.
   *
   * Body `{ continuation }`, which works once, though a 502 leaves it unused for a retry. Answers
   * like {@link redeem} with `result: "signed_in"`; errors 400 `invalid`, 410 `expired` (used, or
   * after two minutes), 403, 404, 429, 502 and 503 as there.
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
    if (!handoff || !isUuid(claims.jti) || typeof claims.exp !== "number") {
      return res.status(400).json({ type: "invalid" })
    }

    const destinationPath = await this.resolveDestinationPath(handoff)
    if (!destinationPath) {
      return res.status(404).json({ type: "course_not_found" })
    }

    const { jti } = claims
    if (!(await this.spendContinuation(jti, claims.exp))) {
      return res.status(410).json({ type: "expired" })
    }

    return this.signIn(res, handoff.upstream_id, destinationPath, () =>
      this.ctx.prisma.spentCoursesHandoffContinuation.deleteMany({
        where: { jti },
      }),
    )
  }

  private askToConfirm = async (
    res: Response,
    result: "confirm" | "different_account",
    handoff: Handoff,
    destinationPath: string,
  ) => {
    const user = await this.ctx.prisma.user.findUnique({
      where: { upstream_id: handoff.upstream_id },
      select: { email: true },
    })

    return res
      .set("Cache-Control", "no-store")
      .status(200)
      .json({
        result,
        continuation: signContinuation(handoff),
        masked_email: user ? maskEmail(user.email) : null,
        destination_path: destinationPath,
      })
  }

  /** Whether this was the continuation's first use; the primary key makes it atomic. */
  private spendContinuation = async (jti: string, expiresAt: number) => {
    const { prisma } = this.ctx
    const { count } = await prisma.spentCoursesHandoffContinuation.createMany({
      data: [{ jti, expires_at: new Date(expiresAt * 1000) }],
      skipDuplicates: true,
    })
    const now = Date.now()
    if (now - this.lastSpentPurgeAt >= CONTINUATION_LIFETIME_SECONDS * 1000) {
      this.lastSpentPurgeAt = now
      await prisma.spentCoursesHandoffContinuation.deleteMany({
        where: { expires_at: { lt: new Date(now) } },
      })
    }
    return count === 1
  }

  /** `onUnavailable` runs before answering 502, which the student may retry. */
  private signIn = async (
    res: Response,
    upstreamId: number,
    destinationPath: string,
    onUnavailable?: () => Promise<unknown>,
  ) => {
    const { logger } = this.ctx

    let issued: UserAccessToken
    try {
      issued = await issueUserAccessToken(upstreamId)
    } catch (error) {
      if (error instanceof UserAccessTokenRefusedError) {
        // Warn: a misconfigured issuer gets the same refusal for every student.
        logger.warn("TMC refused to sign a handoff student in", {
          upstream_id: upstreamId,
          reason: error.message,
        })
        return res
          .status(403)
          .json({ type: "sign_in_required", destination_path: destinationPath })
      }
      logger.warn("Issuing a TMC access token for a handoff failed", {
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      })
      await onUnavailable?.()
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
    const handlerCourse =
      await this.ctx.prisma.course.findUniqueCompletionHandler({
        where: { id: moocfi_course_id },
      })

    return handlerCourse
      ? DESTINATION_PATHS[destination](handlerCourse.slug)
      : null
  }
}
