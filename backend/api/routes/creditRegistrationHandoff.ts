import axios from "axios"
import { Request, Response } from "express"

import { COURSES_BASE_URL, COURSES_HANDOFF_SECRET } from "../../config"
import { Controller } from "../types"

const MINT_PATH = "/api/v0/moocfi/credit-registration-handoffs"
const MINT_TIMEOUT_MS = 10_000

export class CreditRegistrationHandoffController extends Controller {
  /**
   * Sends the signed-in student to courses.mooc.fi's credit registration for a delegated course.
   *
   * Answers `{ redirect_url }`, which is valid for seconds only, so the browser must navigate to it
   * at once. 404 if the course is not delegated, 502 if courses.mooc.fi refuses, 503 if the handoff
   * is not configured.
   */
  create = async (req: Request<{ slug: string }>, res: Response) => {
    const { logger } = this.ctx

    if (!COURSES_BASE_URL || !COURSES_HANDOFF_SECRET) {
      return res
        .status(503)
        .json({ message: "Credit registration handoff is not configured" })
    }

    const getUserResult = await this.getUser(req, res)

    if (getUserResult.isErr()) {
      return getUserResult.error
    }

    const course = await this.getCourseKnex({ slug: req.params.slug })
    const handlerCourse = course?.completions_handled_by_id
      ? await this.getCourseKnex({ id: course.completions_handled_by_id })
      : course

    if (!handlerCourse?.credit_registration_delegated_at) {
      return res.status(404).json({ message: "Course not found" })
    }

    const tmcAccessToken = (req.headers.authorization ?? "").replace(
      /^Bearer\s+/,
      "",
    )

    try {
      const response = await axios.post<{ redirect_url?: unknown }>(
        new URL(MINT_PATH, COURSES_BASE_URL).href,
        {
          tmc_access_token: tmcAccessToken,
          moocfi_course_id: handlerCourse.id,
          delegated_at: handlerCourse.credit_registration_delegated_at,
          client_ip: req.ip,
        },
        {
          headers: { Authorization: `Bearer ${COURSES_HANDOFF_SECRET}` },
          timeout: MINT_TIMEOUT_MS,
        },
      )
      const { redirect_url } = response.data

      if (typeof redirect_url !== "string") {
        throw new Error("courses.mooc.fi answered without a redirect_url")
      }

      return res.status(200).json({ redirect_url })
    } catch (error) {
      // An axios error carries the request, including the TMC token, so log only the status.
      logger.warn("Credit registration handoff failed", {
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      })
      return res.status(502).json({ message: "Could not open courses.mooc.fi" })
    }
  }
}
