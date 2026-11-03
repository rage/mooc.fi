import axios from "axios"
import { Request, Response } from "express"

import { COURSES_BASE_URL, COURSES_HANDOFF_SECRET } from "../../config"
import {
  createRateLimiter,
  refuseRateLimited,
} from "../../middlewares/rateLimit"
import { Controller } from "../types"
import { readBearerToken } from "../utils"

const MINT_PATH = "/api/v0/moocfi/credit-registration-handoffs"
const MINT_TIMEOUT_MS = 10_000

// Only forward a well-formed code, never free text from the other system.
const readRefusalType = (body: any): string | undefined =>
  typeof body?.type === "string" && /^[a-z_]{1,64}$/.test(body.type)
    ? body.type
    : undefined

const isCoursesUrl = (url: unknown) => {
  if (typeof url !== "string") {
    return false
  }
  try {
    return new URL(url).origin === new URL(COURSES_BASE_URL ?? "").origin
  } catch {
    return false
  }
}

/** Hands students off from mooc.fi to courses.mooc.fi's credit registration. */
export class CreditRegistrationHandoffController extends Controller {
  private hitPerUserLimit = createRateLimiter({ limit: 10, windowMs: 60_000 })

  /**
   * Sends the signed-in student to courses.mooc.fi's credit registration for a delegated course.
   *
   * Also called cross-origin by Elements of AI with a bearer from its own TMC application. Optional
   * body `{ ui_language }` picks courses.mooc.fi's UI language. Answers `{ redirect_url }`, which
   * is valid for seconds only, so the browser must navigate to it at once. Errors carry `{ type }`:
   * 401 for a session TMC rejects (`tmc_rejected` when courses.mooc.fi found it out), 404 if the
   * course is not delegated, 429 `rate_limited`, 502 with courses.mooc.fi's refusal type or
   * `unavailable`, 503 `not_configured`.
   */
  create = async (
    req: Request<{ slug: string }, any, { ui_language?: unknown }>,
    res: Response,
  ) => {
    const { logger } = this.ctx

    if (!COURSES_BASE_URL || !COURSES_HANDOFF_SECRET) {
      return res.status(503).json({
        type: "not_configured",
        message: "Credit registration handoff is not configured",
      })
    }

    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const retryAfterSeconds = this.hitPerUserLimit(getUserResult.value.user.id)
    if (retryAfterSeconds !== null) {
      return refuseRateLimited(res, retryAfterSeconds)
    }

    const handlerCourse =
      await this.ctx.prisma.course.findUniqueCompletionHandler({
        where: { slug: req.params.slug },
      })

    if (!handlerCourse?.credit_registration_delegated_at) {
      return res.status(404).json({ message: "Course not found" })
    }

    const tmcAccessToken = readBearerToken(req)

    try {
      const response = await axios.post<{ redirect_url?: unknown }>(
        new URL(MINT_PATH, COURSES_BASE_URL).href,
        {
          tmc_access_token: tmcAccessToken,
          moocfi_course_id: handlerCourse.id,
          delegated_at: handlerCourse.credit_registration_delegated_at,
          client_ip: req.ip,
          ui_language: req.body?.ui_language === "fi" ? "fi" : "en",
        },
        {
          headers: { Authorization: `Bearer ${COURSES_HANDOFF_SECRET}` },
          timeout: MINT_TIMEOUT_MS,
          maxRedirects: 0,
        },
      )
      const { redirect_url } = response.data

      // The browser navigates to it, so it must not lead anywhere but courses.mooc.fi.
      if (!isCoursesUrl(redirect_url)) {
        throw new Error(
          "courses.mooc.fi answered without a usable redirect_url",
        )
      }

      return res.status(200).json({ redirect_url })
    } catch (error) {
      const refusal = axios.isAxiosError(error) ? error.response : undefined
      const type = readRefusalType(refusal?.data)
      // An axios error carries the request, including the TMC token, so log only the status.
      logger.warn("Credit registration handoff failed", {
        status: refusal?.status,
        type,
      })
      if (refusal?.status === 429) {
        const retryAfter = refusal.headers["retry-after"]
        if (typeof retryAfter === "string") {
          res.set("Retry-After", retryAfter)
        }
        return res.status(429).json({ type: "rate_limited" })
      }
      return res.status(type === "tmc_rejected" ? 401 : 502).json({
        type: type ?? "unavailable",
        message: "Could not open courses.mooc.fi",
      })
    }
  }
}
