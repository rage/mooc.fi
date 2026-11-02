import { NextFunction, Request, Response } from "express"

interface Window {
  startedAt: number
  count: number
}

/**
 * Caps requests per client IP to `limit` in each fixed window of `windowMs`; over it, answers 429
 * `{ type: "rate_limited" }` with Retry-After.
 *
 * Counts in this process only, so every replica allows `limit` on its own. One limiter shared by
 * several routes counts them together.
 */
export const limitRequestsPerIp = ({
  limit,
  windowMs,
}: {
  limit: number
  windowMs: number
}) => {
  const windows = new Map<string, Window>()
  let lastSweepAt = Date.now()

  const forgetEndedWindows = (now: number) => {
    for (const [ip, window] of windows) {
      if (now - window.startedAt >= windowMs) {
        windows.delete(ip)
      }
    }
    lastSweepAt = now
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now()
    const ip = req.ip ?? ""
    let window = windows.get(ip)

    if (!window || now - window.startedAt >= windowMs) {
      if (now - lastSweepAt >= windowMs) {
        forgetEndedWindows(now)
      }
      window = { startedAt: now, count: 0 }
      windows.set(ip, window)
    }

    window.count += 1
    if (window.count > limit) {
      const retryAfterSeconds = Math.ceil(
        (window.startedAt + windowMs - now) / 1000,
      )
      res.set("Retry-After", String(retryAfterSeconds))
      res.status(429).json({ type: "rate_limited" })
      return
    }
    next()
  }
}
